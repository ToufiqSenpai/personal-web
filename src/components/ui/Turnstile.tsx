'use client'

import { useCallback, useEffect, useRef } from 'react'
import { clientEnv } from '@/configs/client-env'
import { getLocale } from '@/paraglide/runtime'

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

export function Turnstile({ onVerify, onError, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const callbacksRef = useRef({ onVerify, onError, onExpire })

  useEffect(() => {
    callbacksRef.current = { onVerify, onError, onExpire }
  }, [onVerify, onError, onExpire])

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current || widgetIdRef.current !== null) return

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: clientEnv.VITE_TURNSTILE_SITE_KEY,
      callback: (token) => callbacksRef.current.onVerify(token),
      'error-callback': () => callbacksRef.current.onError?.(),
      'expired-callback': () => callbacksRef.current.onExpire?.(),
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
      language: getLocale(),
    })
  }, [])

  useEffect(() => {
    if (window.turnstile) {
      renderWidget()
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (!script) {
        script = document.createElement('script')
        script.src = SCRIPT_SRC
        script.async = true
        document.head.append(script)
      }
      script.addEventListener('load', renderWidget)
      return () => {
        script.removeEventListener('load', renderWidget)
      }
    }

    return () => {
      if (widgetIdRef.current !== null) {
        window.turnstile?.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [renderWidget])

  return <div ref={containerRef} style={{ marginTop: '0.25rem' }} />
}
