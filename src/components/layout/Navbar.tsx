'use client'

import * as stylex from '@stylexjs/stylex'
import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { LANGUAGES } from '@/constants/language'
import { m } from '@/paraglide/messages'
import { deLocalizeHref, getLocale, setLocale } from '@/paraglide/runtime'

const styles = stylex.create({
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border)',
    backgroundColor: 'color-mix(in srgb, var(--color-canvas) 80%, transparent)',
    backdropFilter: 'blur(12px)',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    height: '4rem',
    maxWidth: '72rem',
    marginInline: 'auto',
    paddingInline: '1.5rem',
  },
  logoWrap: {
    flex: 1,
  },
  logo: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
    textDecorationLine: 'none',
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: 'var(--color-accent)',
    },
  },
  logoCursor: {
    color: 'var(--color-accent)',
    animationName: 'pulse',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
  },
  links: {
    display: 'none',
    flex: 'none',
    alignItems: 'center',
    gap: '2rem',
    '@media (min-width: 768px)': {
      display: 'flex',
    },
  },
  link: {
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    textDecorationLine: 'none',
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: 'var(--color-accent)',
    },
  },
  linkActive: {
    fontWeight: 500,
    color: 'var(--color-accent)',
  },
  controls: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: '1rem',
  },
  desktopControls: {
    display: 'none',
    alignItems: 'center',
    gap: '1.25rem',
    '@media (min-width: 768px)': {
      display: 'flex',
    },
  },
  iconButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    color: 'var(--color-muted)',
    cursor: 'pointer',
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: 'var(--color-accent)',
    },
  },
  langWrapper: {
    position: 'relative',
  },
  langSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--color-muted)',
    cursor: 'pointer',
    listStyleType: 'none',
    ':hover': {
      color: 'var(--color-accent)',
    },
  },
  langCurrent: {
    color: 'var(--color-ink)',
  },
  langMenu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.75rem',
    display: 'flex',
    width: '11rem',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-canvas)',
    paddingBlock: '0.5rem',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    zIndex: 50,
  },
  langOption: {
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    borderWidth: 0,
    backgroundColor: 'transparent',
    textAlign: 'left',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-muted) 10%, transparent)',
      color: 'var(--color-ink)',
    },
  },
  langOptionActive: {
    fontWeight: 500,
    color: 'var(--color-accent)',
  },
  mobileToggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'transparent',
    color: 'var(--color-muted)',
    cursor: 'pointer',
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
    paddingInline: '1.5rem',
    paddingBlock: '1rem',
    '@media (min-width: 768px)': {
      display: 'none',
    },
  },
  mobileLink: {
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    textDecorationLine: 'none',
  },
  mobileFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.5rem',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
    paddingTop: '1rem',
  },
  mobileActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
})

const navLinks = [
  { to: '/about', label: m.layout_navbar_about },
  { to: '/projects', label: m.layout_navbar_projects },
  { to: '/feeds', label: m.layout_navbar_feeds },
  { to: '/contact', label: m.layout_navbar_contact },
] as const

function ShareIcon() {
  return (
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
  )
}

function LanguageMenu() {
  const locale = getLocale()

  return (
    <details {...stylex.props(styles.langWrapper)}>
      <summary aria-label={m.layout_navbar_select_language()} {...stylex.props(styles.langSummary)}>
        <span {...stylex.props(styles.langCurrent)}>{LANGUAGES.find((item) => item.code === locale)?.name}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </summary>
      <div {...stylex.props(styles.langMenu)}>
        {LANGUAGES.map((item) => (
          <button
            key={item.code}
            type="button"
            onClick={() => void setLocale(item.code)}
            {...stylex.props(styles.langOption, item.code === locale && styles.langOptionActive)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </details>
  )
}

async function share(name: string) {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title: name, text: `Check out ${name}'s portfolio!`, url: window.location.href })
    } catch {
      // The user dismissed the share sheet.
    }
    return
  }

  await navigator.clipboard.writeText(window.location.href)
  alert(m.layout_navbar_copied())
}

export function Navbar({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = deLocalizeHref(useLocation().pathname)

  return (
    <header {...stylex.props(styles.header)}>
      <nav {...stylex.props(styles.nav)}>
        <div {...stylex.props(styles.logoWrap)}>
          <Link to="/" {...stylex.props(styles.logo)}>
            {name}
            <span {...stylex.props(styles.logoCursor)}>_</span>
          </Link>
        </div>

        <div {...stylex.props(styles.links)}>
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} {...stylex.props(styles.link, pathname === link.to && styles.linkActive)}>
              {link.label()}
            </Link>
          ))}
        </div>

        <div {...stylex.props(styles.controls)}>
          <div {...stylex.props(styles.desktopControls)}>
            <LanguageMenu />
            <button
              type="button"
              onClick={() => void share(name)}
              aria-label={m.layout_navbar_share_page()}
              title={m.layout_navbar_share()}
              {...stylex.props(styles.iconButton)}
            >
              <ShareIcon />
            </button>
            <ThemeToggle />
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={m.layout_navbar_toggle_menu()}
            {...stylex.props(styles.mobileToggle)}
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

      {isOpen && (
        <div {...stylex.props(styles.mobileMenu)}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              {...stylex.props(styles.mobileLink, pathname === link.to && styles.linkActive)}
            >
              {link.label()}
            </Link>
          ))}

          <div {...stylex.props(styles.mobileFooter)}>
            <div {...stylex.props(styles.mobileActions)}>
              <ThemeToggle />
              <button
                type="button"
                onClick={() => void share(name)}
                aria-label={m.layout_navbar_share_page()}
                {...stylex.props(styles.mobileToggle)}
              >
                <ShareIcon />
              </button>
            </div>
            <LanguageMenu />
          </div>
        </div>
      )}
    </header>
  )
}
