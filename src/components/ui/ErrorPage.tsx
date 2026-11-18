'use client'

import * as stylex from '@stylexjs/stylex'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Reveal } from '@/components/ui/Reveal'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  main: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '75vh',
    paddingInline: '1.5rem',
    backgroundColor: 'var(--color-canvas)',
  },
  glow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '300px',
    height: '300px',
    borderRadius: '9999px',
    backgroundColor: 'var(--color-accent)',
    opacity: 0.08,
    filter: 'blur(100px)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: '36rem',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '4rem',
    height: '4rem',
    marginBottom: '1.5rem',
    borderRadius: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in oklab, #ef4444 25%, transparent)',
    backgroundColor: 'color-mix(in oklab, #ef4444 10%, transparent)',
    fontFamily: 'var(--font-mono)',
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#ef4444',
  },
  title: {
    marginBlock: '0 1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#ef4444',
  },
  subtitle: {
    marginBlock: '0 2rem',
    fontSize: '0.875rem',
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
  button: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    paddingInline: '1.5rem',
    paddingBlock: '0.625rem',
    borderRadius: '0.5rem',
    borderWidth: 0,
    backgroundColor: 'var(--color-accent)',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
})

export function ErrorPage({ error, reset }: ErrorComponentProps) {
  return (
    <div {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.glow)} />
      <div {...stylex.props(styles.inner)}>
        <Reveal>
          <div {...stylex.props(styles.badge)}>🚨</div>
        </Reveal>
        <Reveal delay={100}>
          <h1 {...stylex.props(styles.title)}>{m.pages_error_title()}</h1>
        </Reveal>
        <Reveal delay={200}>
          <p {...stylex.props(styles.subtitle)}>
            {m.pages_error_subtitle()} {error instanceof Error ? error.message : String(error)}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <button type="button" onClick={reset} {...stylex.props(styles.button)}>
            {m.pages_error_cta()}
          </button>
        </Reveal>
      </div>
    </div>
  )
}
