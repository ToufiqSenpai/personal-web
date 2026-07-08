'use client'

import { useCallback, useEffect, useRef } from 'react'
import Script from 'next/script'
import { useTheme } from 'next-themes'
import { useLocale } from 'next-intl'
import { clientEnv } from '@/configs/client-env'

interface TurnstileProps {
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
}

export function Turnstile({ onVerify, onError, onExpire }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const { resolvedTheme } = useTheme()
  const locale = useLocale()

  const callbacksRef = useRef({ onVerify, onError, onExpire })

  useEffect(() => {
    callbacksRef.current = { onVerify, onError, onExpire }
  }, [onVerify, onError, onExpire])

  const renderWidget = useCallback(() => {
    if (!window.turnstile || !containerRef.current) return
    if (widgetIdRef.current !== null) return

    const theme: 'light' | 'dark' = resolvedTheme === 'dark' ? 'dark' : 'light'

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
      callback: (token: string) => callbacksRef.current.onVerify(token),
      'error-callback': () => callbacksRef.current.onError?.(),
      'expired-callback': () => callbacksRef.current.onExpire?.(),
      theme,
      language: locale,
    })
  }, [resolvedTheme, locale])

  useEffect(() => {
    if (window.turnstile && containerRef.current) {
      renderWidget()
    }

    return () => {
      if (widgetIdRef.current !== null) {
        window.turnstile?.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [renderWidget])

  const onScriptLoad = useCallback(() => {
    renderWidget()
  }, [renderWidget])

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
        onLoad={onScriptLoad}
      />
      <div ref={containerRef} className="mt-1" />
    </>
  )
}
