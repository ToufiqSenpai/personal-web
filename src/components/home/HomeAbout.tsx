'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Reveal } from '@/components/ui/Reveal'
import type { Profile, ProfileAvatar } from '@/payload-types'

export interface HomeAboutProps {
  profile: Profile
}

export function HomeAbout({ profile }: HomeAboutProps) {
  const t = useTranslations('pages.Home.about')

  const avatar = profile.avatar as ProfileAvatar
  const avatarUrl = avatar?.url
  const avatarAlt = avatar?.alt || profile.name

  return (
    <section className="px-6 py-20 border-b border-border/50 bg-canvas/10">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 items-center">
          
          {/* Left Column: Avatar image */}
          <div className="md:col-span-5 flex justify-center">
            <Reveal>
              <div className="relative h-72 w-72 sm:h-80 sm:w-80 md:h-96 md:w-96 overflow-hidden rounded-2xl border border-border shadow-lg bg-surface/50">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={avatarAlt}
                    fill
                    sizes="(max-w-768px) 288px, 384px"
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-out"
                    priority
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5 font-mono text-4xl font-bold text-accent">
                    {profile.name
                      .split(' ')
                      .map((word) => word[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Bio text & CTA */}
          <div className="md:col-span-7 flex flex-col items-start text-left">
            <Reveal delay={100}>
              <p className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
                // WHOAMI
              </p>
            </Reveal>
            
            <Reveal delay={200}>
              <h2 className="mb-6 text-2xl font-bold text-ink sm:text-3xl tracking-tight leading-tight">
                {t('title')}
              </h2>
            </Reveal>
            
            <Reveal delay={300}>
              <p className="mb-8 text-sm sm:text-base text-muted leading-relaxed max-w-xl">
                {profile.bio}
              </p>
            </Reveal>
            
            <Reveal delay={400}>
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
              >
                <span>{t('cta')}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  )
}
