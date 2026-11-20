import { env } from '@/configs/env'

interface TurnstileVerifyResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
}

export interface TurnstileVerificationResult {
  success: boolean
  error?: string
  code?: 'CAPTCHA_UNAVAILABLE'
}

function unavailable(error: string): TurnstileVerificationResult {
  return { success: false, error, code: 'CAPTCHA_UNAVAILABLE' }
}

export async function verifyTurnstileToken(token: string, ip?: string): Promise<TurnstileVerificationResult> {
  let response: Response
  try {
    response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
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
  } catch (error) {
    // Network failure or the 5s timeout. Fail closed: an unavailable captcha
    // check must never let an unauthenticated submission through.
    return unavailable(`Turnstile verification request failed: ${String(error)}`)
  }

  if (!response.ok) {
    return unavailable(`Turnstile siteverify returned HTTP ${response.status}`)
  }

  let data: TurnstileVerifyResponse
  try {
    data = await response.json()
  } catch (error) {
    // Error pages are often HTML; response.json() throws on those.
    return unavailable(`Turnstile siteverify returned a non-JSON response: ${String(error)}`)
  }

  if (!data.success) {
    return {
      success: false,
      error: data['error-codes']?.join(', ') || 'Captcha verification failed',
    }
  }

  return { success: true }
}
