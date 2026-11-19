import { sql } from '@payloadcms/db-postgres'
import type { Payload, PayloadRequest } from 'payload'

const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RETENTION_MS = 24 * 60 * 60 * 1000

type RequestWithIp = PayloadRequest & { ip?: string }

function normalizeIp(value: string): string {
  const ip = value.trim()
  return ip.startsWith('::ffff:') ? ip.slice(7) : ip
}

/**
 * Resolve a client IP from sources a visitor cannot forge.
 *
 * Order matters: Cloudflare overwrites CF-Connecting-IP and strips a client-supplied
 * value; srvx sets `ip` from the socket's remoteAddress, which no header can
 * influence. Only as a last resort do we read X-Forwarded-For, and then only its
 * rightmost entry — the one a trusted reverse proxy appended. The leftmost entry
 * is attacker-controlled and must never be used as the rate-limit key.
 */
export function resolveClientIp(req: RequestWithIp): string {
  const cloudflareIp = req.headers.get('cf-connecting-ip')
  if (cloudflareIp) return normalizeIp(cloudflareIp)

  const socketIp = req.ip
  if (socketIp) return normalizeIp(socketIp)

  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const trusted = forwardedFor.split(',').map(normalizeIp).filter(Boolean).at(-1)
    if (trusted) return trusted
  }

  // Requests with no identifiable client share one bucket — fail closed rather
  // than handing every anonymous request its own unlimited bucket.
  return 'unknown'
}

/**
 * Atomically records one attempt for (ip, fixed window) and reports whether the
 * caller is still under the limit. Throws when storage is unavailable so the
 * caller can reject the request instead of letting spam through unchecked.
 */
export async function consumeRateLimit(payload: Payload, ip: string): Promise<boolean> {
  const windowStart = new Date(Math.floor(Date.now() / RATE_LIMIT_WINDOW_MS) * RATE_LIMIT_WINDOW_MS)

  const result = await payload.db.drizzle.execute(sql`
    INSERT INTO "contact_rate_limits" ("ip", "window_start", "count")
    VALUES (${ip}, ${windowStart}, 1)
    ON CONFLICT ("ip", "window_start")
    DO UPDATE SET "count" = "contact_rate_limits"."count" + 1
    RETURNING "count"
  `)

  const count = Number(result.rows[0]?.count)
  if (!Number.isFinite(count)) {
    throw new Error('Rate limit upsert returned no count')
  }

  // One row per (ip, window) already bounds growth, but stale windows still need
  // pruning so an attacker rotating IPs cannot make the table grow forever.
  await payload.db.drizzle.execute(sql`
    DELETE FROM "contact_rate_limits"
    WHERE "window_start" < ${new Date(Date.now() - RETENTION_MS)}
  `)

  return count <= RATE_LIMIT_MAX
}
