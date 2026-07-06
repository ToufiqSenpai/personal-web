import { Reveal } from '@/components/ui/Reveal'
import type { Profile } from '@/payload-types'
import { useTranslations } from 'next-intl'

export interface TimelineProps {
  profile: Profile
}

export function Timeline({ profile }: TimelineProps) {
  const t = useTranslations('pages.About')
  const timelineItems = profile.timelines || []

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
            {t('timeline.eyebrow')}
          </p>
          <h2 className="mb-12 text-2xl font-bold text-ink">{t('timeline.title')}</h2>
        </Reveal>

        <div className="relative">
          {/* Timeline Line */}
          {timelineItems.length > 0 && (
            <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-border md:left-1/2 md:-translate-x-1/2" />
          )}

          <div className="flex flex-col gap-8">
            {timelineItems.map((item, index) => {
              const isEven = index % 2 === 0
              return (
                <Reveal key={index} delay={index * 100} className="relative flex w-full">
                  {/* Dot */}
                  <div className="absolute left-[11px] top-6 h-3 w-3 rounded-full bg-accent ring-4 ring-canvas md:left-1/2 md:-ml-1.5" />

                  {/* Content Card */}
                  <div
                    className={`ml-12 w-full md:ml-0 md:w-1/2 ${
                      isEven ? 'md:pr-12 md:mr-auto md:text-right' : 'md:pl-12 md:ml-auto md:text-left'
                    }`}
                  >
                    <div className={`rounded-xl border border-border bg-surface p-6 shadow-sm transition-colors hover:border-accent/50 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <span className="mb-2 block font-mono text-xs text-accent">
                        {item.yearStart} — {item.present ? t('present') : item.yearEnd}
                      </span>
                      <h3 className="text-lg font-bold text-ink">{item.title}</h3>
                      <p className="mb-3 text-sm font-medium text-muted">{item.institution}</p>
                      <p className="text-sm leading-relaxed text-muted">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
