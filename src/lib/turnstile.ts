import { env } from '@/configs/env'

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export async function verifyTurnstileToken(
  token: string,
  ip?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        ...(ip ? { remoteip: ip } : {}),
      }),
      signal: AbortSignal.timeout(5000),
    })

    const data: TurnstileVerifyResponse = await response.json()

    if (!data.success) {
      return {
        success: false,
        error: data['error-codes']?.join(', ') || 'Captcha verification failed',
      }
    }

    return { success: true }
  } catch (error) {
    // Fail-open: if Cloudflare API is down, allow submission but log warning
    console.warn('[Turnstile] Verification request failed, allowing submission (fail-open):', error)
    return { success: true }
  }
}
