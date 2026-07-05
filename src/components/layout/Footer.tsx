'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import type { Profile, ProfileIcon } from '@/payload-types'

export interface FooterProps {
  profile: Profile
}

export function Footer({ profile }: FooterProps) {
  const tNav = useTranslations('layout.Navbar')
  const tFooter = useTranslations('layout.Footer')
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-canvas/30">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          
          {/* Col 1: Bio & System Status Monitor */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="group font-mono text-sm font-semibold tracking-tight text-ink transition-colors hover:text-accent"
            >
              {profile.name}
              <span className="text-accent animate-pulse">_</span>
            </Link>
            <p className="text-xs text-muted leading-relaxed max-w-[240px]">
              {tFooter('tagline')}
            </p>

          </div>

          {/* Col 2: Quick Links */}
          <div>
            <span className="block font-mono text-xs font-semibold tracking-wider text-accent uppercase mb-4">
              // {tFooter('nav')}
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted hover:text-ink transition-all hover:translate-x-1 inline-block duration-200"
                >
                  {tNav('home')}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-muted hover:text-ink transition-all hover:translate-x-1 inline-block duration-200"
                >
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-muted hover:text-ink transition-all hover:translate-x-1 inline-block duration-200"
                >
                  {tNav('projects')}
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-sm text-muted hover:text-ink transition-all hover:translate-x-1 inline-block duration-200"
                >
                  {tNav('articles')}
                </Link>
              </li>
              <li>
                <Link
                  href="/feeds"
                  className="text-sm text-muted hover:text-ink transition-all hover:translate-x-1 inline-block duration-200"
                >
                  {tNav('feeds')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted hover:text-ink transition-all hover:translate-x-1 inline-block duration-200"
                >
                  {tNav('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Connect */}
          <div>
            <span className="block font-mono text-xs font-semibold tracking-wider text-accent uppercase mb-4">
              // {tFooter('connect')}
            </span>
            <ul className="space-y-3">
              {profile.socials && profile.socials.length > 0 ? (
                profile.socials.map((social) => {
                  const icon = social.icon as ProfileIcon
                  return (
                    <li key={social.id || social.name}>
                      <a
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-sm text-muted hover:text-ink transition-colors"
                      >
                        {icon?.url && (
                          <Image
                            src={icon.url}
                            alt={icon.alt || social.name}
                            width={16}
                            height={16}
                            className="flex-shrink-0"
                          />
                        )}
                        <span className="font-mono text-xs">{social.name}</span>
                      </a>
                    </li>
                  )
                })
              ) : (
                <p className="text-xs text-muted font-mono">No links configured</p>
              )}
            </ul>
          </div>

          {/* Col 4: System Specs */}
          <div>
            <span className="block font-mono text-xs font-semibold tracking-wider text-accent uppercase mb-4">
              // {tFooter('specs')}
            </span>
            <div className="space-y-3 font-mono text-xs text-muted">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted/65 uppercase tracking-wide">Environment</span>
                <span className="text-ink">production</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted/65 uppercase tracking-wide">Stack</span>
                <span className="text-ink">Next.js 16 + Payload CMS 3</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-muted/65 uppercase tracking-wide">Database</span>
                <span className="text-ink">MongoDB Atlas</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright info */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted">
          <p>© {year} {profile.name}. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span>{tFooter('builtWith')}</span>
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent transition-colors"
            >
              Next.js
            </a>
            <span>&</span>
            <a
              href="https://payloadcms.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink hover:text-accent transition-colors"
            >
              Payload CMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
