import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'

export function CTA() {
  const t = useTranslations('pages.Home.cta')

  return (
    <section className="relative px-6 py-24 overflow-hidden bg-canvas/30 border-t border-border/50">
      {/* Decorative Grid Backdrop */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.07] pointer-events-none" />

      {/* Decorative Glowing Radial Blobs */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-accent/8 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-3xl rounded-3xl border border-border/80 bg-surface/75 backdrop-blur-md p-8 sm:p-12 md:p-16 shadow-2xl relative overflow-hidden flex flex-col items-center">
        {/* Mesh gradient light highlight */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/5 blur-[80px]" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-wider text-accent font-semibold">{t('eyebrow')}</p>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mb-4 text-3xl font-extrabold text-ink sm:text-4xl tracking-tight leading-tight">
              {t('title')}
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mb-8 text-sm sm:text-base text-muted leading-relaxed">{t('description')}</p>
          </Reveal>

          <Reveal delay={300}>
            <Link
              href="/contact"
              className="group relative inline-flex items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-white shadow-md shadow-accent/10 hover:bg-accent/90 transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              <span>{t('button')}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
