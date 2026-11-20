'use client'

import { useEffect } from 'react'
import * as stylex from '@stylexjs/stylex'

const STORAGE_KEY = 'color-scheme'
type Scheme = 'light' | 'dark' | 'light dark'

const styles = stylex.create({
  button: {
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
    color: 'var(--color-ink)',
    cursor: 'pointer',
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
    ':hover': {
      backgroundColor: 'var(--color-surface)',
    },
  },
})

function storedScheme(): 'light' | 'dark' | null {
  const value = localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}

function applyScheme(scheme: Scheme) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]')
  if (meta) meta.content = scheme
}

function toggle() {
  const systemScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  const current = storedScheme() ?? systemScheme
  const target = current === 'dark' ? 'light' : 'dark'

  // Reverting to the current system preference means the user is undoing the
  // override, so remove it instead of pinning the scheme against future OS changes.
  if (target === systemScheme) localStorage.removeItem(STORAGE_KEY)
  else localStorage.setItem(STORAGE_KEY, target)

  applyScheme(target === systemScheme ? 'light dark' : target)
}

// Both the icon and its action label are CSS-only branches (see global.css), so
// they stay correct without JS and when the OS preference changes.
export function ThemeToggle() {
  useEffect(() => {
    function sync(event: StorageEvent) {
      // A null key means storage was cleared, so every key may have changed.
      if (event.key !== null && event.key !== STORAGE_KEY) return
      applyScheme(storedScheme() ?? 'light dark')
    }

    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  return (
    <button type="button" onClick={toggle} {...stylex.props(styles.button)}>
      <span className="theme-light-option">
        <svg
          aria-hidden="true"
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
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <span className="sr-only">Switch to dark theme</span>
      </span>
      <span className="theme-dark-option">
        <svg
          aria-hidden="true"
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
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
        <span className="sr-only">Switch to light theme</span>
      </span>
    </button>
  )
}
