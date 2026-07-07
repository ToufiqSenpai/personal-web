'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'

export interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('pages.Error')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.error('Unhandled dynamic exception:', error)
    }
  }, [error])

  return (
    <div className="relative min-h-[75vh] flex items-center justify-center px-6 overflow-hidden bg-canvas">
      {/* Decorative Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[300px] w-[300px] rounded-full bg-accent/8 blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.05] pointer-events-none" />

      <div className="mx-auto max-w-xl w-full text-center relative z-10">
        <Reveal>
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10 font-mono text-xl font-bold text-red-500 shadow-md">
            🚨
          </div>
        </Reveal>

        <Reveal delay={100}>
          <h1 className="mb-4 font-mono text-sm uppercase tracking-widest text-red-500 font-bold">
            {t('title')}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <p className="mb-6 text-sm sm:text-base text-muted leading-relaxed">
            {t('subtitle')}
          </p>
        </Reveal>

        {/* Diagnostic console */}
        <Reveal delay={250}>
          <div className="mb-8 w-full rounded-xl border border-border/60 bg-canvas/60 p-4 font-mono text-[10px] text-left text-muted/80 overflow-auto max-h-[140px] shadow-inner select-all">
            <div className="text-red-500 font-semibold mb-1">
              {process.env.NODE_ENV === 'development' ? "FATAL EXCEPTION [SYSTEM_FAULT]:" : "ERROR_LOG:"}
            </div>
            <div>
              {process.env.NODE_ENV === 'development'
                ? (error.message || 'Unknown runtime error occurred.')
                : t('genericError')}
            </div>
            {error.digest && <div className="mt-1 text-[8px] text-muted/50">digest: {error.digest}</div>}
          </div>
        </Reveal>

        <Reveal delay={300}>
          <button
            onClick={() => reset()}
            className="group inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-accent/10 hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 transition-transform duration-300 group-hover:rotate-180"
            >
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
            </svg>
            <span>{t('cta')}</span>
          </button>
        </Reveal>
      </div>
    </div>
  )
}
