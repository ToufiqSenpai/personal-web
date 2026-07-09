'use client'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LANGUAGES, LOCALE_COOKIE_KEY } from '@/constants/language'

export interface NavbarProps {
  name: string
}

export function Navbar({ name }: NavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('layout.Navbar')
  const [isOpen, setIsOpen] = useState(false)
  const [isLangOpen, setIsLangOpen] = useState(false)
  const [, startTransition] = useTransition()

  const langLabel = LANGUAGES.find((language) => language.code == locale)?.name || locale

  const navLinks = [
    { href: '/about', label: t('about') },
    { href: '/projects', label: t('projects') },
    { href: '/articles', label: t('articles') },
    { href: '/feeds', label: t('feeds') },
    { href: '/contact', label: t('contact') },
  ]

  function handleLocaleChange(code: string) {
    startTransition(() => {
      document.cookie = `${LOCALE_COOKIE_KEY}=${code};path=/;max-age=315360000;samesite=lax`
      router.refresh()
    })
  }

  // Handle click outside to close language dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-lang-dropdown]')) {
        setIsLangOpen(false)
      }
    }
    if (isLangOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isLangOpen])

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `Check out ${name}'s portfolio!`,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        alert(t('copied'))
      } catch (err) {
        console.error('Failed to copy', err)
      }
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-canvas/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center px-6">
        {/* Left: Logo */}
        <div className="flex-1">
          <Link
            href="/"
            className="group font-mono text-sm font-semibold tracking-tight text-ink transition-colors hover:text-accent"
          >
            {name}
            <span className="text-accent opacity-0 transition-opacity group-hover:opacity-100 animate-pulse">_</span>
          </Link>
        </div>

        {/* Center: Nav links */}
        <div className="hidden flex-none items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-accent ${
                pathname === link.href ? 'font-medium text-accent' : 'text-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right: Controls */}
        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="hidden items-center gap-5 md:flex">
            {/* Language Dropdown */}
            <div className="relative" data-lang-dropdown>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 font-mono text-xs font-medium text-muted transition-colors hover:text-accent"
                aria-label={t('selectLanguage')}
              >
                <span className="text-ink">{LANGUAGES.find((language) => language.code == locale)?.name}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                className={`absolute right-0 mt-6 flex w-44 origin-top-right flex-col overflow-hidden rounded-xl border border-border bg-canvas/95 py-2 shadow-lg backdrop-blur-md transition-all duration-200 z-50 ${
                  isLangOpen
                    ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none invisible -translate-y-2 scale-95 opacity-0'
                }`}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      handleLocaleChange(l.code)
                      setIsLangOpen(false)
                    }}
                    className={`px-4 py-2 text-left text-sm transition-colors hover:bg-muted/10 ${
                      locale === l.code ? 'font-medium text-accent' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="text-muted transition-colors hover:text-accent"
              aria-label={t('sharePage')}
              title={t('share')}
            >
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
              >
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
            </button>

            <ThemeToggle />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-ink md:hidden"
            aria-label={t('toggleMenu')}
          >
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
            >
              {isOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="flex flex-col gap-4 border-t border-border bg-canvas/95 px-6 py-4 backdrop-blur-md md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-sm ${pathname === link.href ? 'font-medium text-accent' : 'text-muted'}`}
            >
              {link.label}
            </Link>
          ))}

          <div className="mt-2 flex items-center justify-between border-t border-border pt-4">
            <div className="flex items-center gap-4">
              <ThemeToggle />

              <button
                onClick={handleShare}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:text-ink"
                aria-label={t('sharePage')}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" x2="12" y1="2" y2="15" />
                </svg>
              </button>
            </div>

            <div className="relative" data-lang-dropdown>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex h-9 items-center justify-center gap-2 rounded-lg border border-border px-3 font-mono text-xs font-medium text-muted transition-colors hover:text-ink"
              >
                <span className="text-ink">{langLabel}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              <div
                className={`absolute bottom-full right-0 mb-2 flex w-44 origin-bottom-right flex-col overflow-hidden rounded-xl border border-border bg-canvas/95 py-2 shadow-lg backdrop-blur-md transition-all duration-200 z-50 ${
                  isLangOpen
                    ? 'pointer-events-auto visible translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none invisible translate-y-2 scale-95 opacity-0'
                }`}
              >
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      handleLocaleChange(l.code)
                      setIsLangOpen(false)
                    }}
                    className={`px-4 py-2 text-left text-sm transition-colors hover:bg-muted/10 ${
                      locale === l.code ? 'font-medium text-accent' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
