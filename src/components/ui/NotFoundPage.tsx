'use client'

import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import { Reveal } from '@/components/ui/Reveal'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  main: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    paddingInline: '1.5rem',
    backgroundColor: 'var(--color-canvas)',
  },
  inner: {
    position: 'relative',
    width: '100%',
    maxWidth: '28rem',
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
    fontSize: '1.25rem',
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
  link: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    paddingInline: '1.5rem',
    paddingBlock: '0.625rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--color-accent)',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 600,
    textDecorationLine: 'none',
  },
})

export function NotFoundPage() {
  return (
    <div {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.inner)}>
        <Reveal>
          <div {...stylex.props(styles.badge)}>⚠️</div>
        </Reveal>
        <Reveal delay={100}>
          <h1 {...stylex.props(styles.title)}>{m.pages_not_found_title()}</h1>
        </Reveal>
        <Reveal delay={200}>
          <p {...stylex.props(styles.subtitle)}>{m.pages_not_found_subtitle()}</p>
        </Reveal>
        <Reveal delay={300}>
          <Link to="/" {...stylex.props(styles.link)}>
            {m.pages_not_found_cta()}
          </Link>
        </Reveal>
      </div>
    </div>
  )
}
