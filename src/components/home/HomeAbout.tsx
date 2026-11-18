'use client'

import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import { Reveal } from '@/components/ui/Reveal'
import { shared } from '@/components/ui/styles'
import type { Media, Profile } from '@/payload-types'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  section: {
    backgroundColor: 'color-mix(in srgb, var(--color-canvas) 10%, transparent)',
  },
  grid: {
    display: 'grid',
    alignItems: 'center',
    gap: '3rem',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 768px)': 'repeat(12, minmax(0, 1fr))' },
  },
  avatarColumn: {
    display: 'flex',
    justifyContent: 'center',
    gridColumn: { default: 'auto', '@media (min-width: 768px)': 'span 5' },
  },
  avatarFrame: {
    position: 'relative',
    width: { default: '18rem', '@media (min-width: 640px)': '20rem', '@media (min-width: 768px)': '24rem' },
    height: { default: '18rem', '@media (min-width: 640px)': '20rem', '@media (min-width: 768px)': '24rem' },
    overflow: 'hidden',
    borderRadius: '1rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'grayscale(1)',
    transitionProperty: 'filter',
    transitionDuration: '700ms',
    ':hover': {
      filter: 'grayscale(0)',
    },
  },
  avatarFallback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontFamily: 'var(--font-mono)',
    fontSize: '2.25rem',
    fontWeight: 700,
    color: 'var(--color-accent)',
  },
  textColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gridColumn: { default: 'auto', '@media (min-width: 768px)': 'span 7' },
  },
  title: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '1.5rem',
    fontSize: { default: '1.5rem', '@media (min-width: 640px)': '1.875rem' },
    fontWeight: 700,
    lineHeight: 1.25,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
  },
  bio: {
    maxWidth: '36rem',
    marginTop: 0,
    marginBottom: '2rem',
    fontSize: { default: '0.875rem', '@media (min-width: 640px)': '1rem' },
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
  cta: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--color-accent)',
    textDecorationLine: 'none',
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: 'color-mix(in srgb, var(--color-accent) 80%, transparent)',
    },
  },
})

function Avatar({ profile }: { profile: Profile }) {
  const avatar = profile.avatar as Media

  if (avatar.url) {
    return <img src={avatar.url} alt={avatar.alt} {...stylex.props(styles.avatarImage)} />
  }

  return (
    <div {...stylex.props(styles.avatarFallback)}>
      {profile.name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()}
    </div>
  )
}

export function HomeAbout({ profile }: { profile: Profile }) {
  return (
    <section {...stylex.props(shared.section, shared.bordered, styles.section)}>
      <div {...stylex.props(shared.container)}>
        <div {...stylex.props(styles.grid)}>
          <div {...stylex.props(styles.avatarColumn)}>
            <Reveal>
              <div tabIndex={0} {...stylex.props(styles.avatarFrame)}>
                <Avatar profile={profile} />
              </div>
            </Reveal>
          </div>

          <div {...stylex.props(styles.textColumn)}>
            <Reveal delay={100}>
              <p {...stylex.props(shared.eyebrow)}>{'// WHOAMI'}</p>
            </Reveal>

            <Reveal delay={200}>
              <h2 {...stylex.props(styles.title)}>{m.pages_home_about_title()}</h2>
            </Reveal>

            <Reveal delay={300}>
              <p {...stylex.props(styles.bio)}>{profile.bio}</p>
            </Reveal>

            <Reveal delay={400}>
              <Link to="/about" {...stylex.props(styles.cta)}>
                <span>{m.pages_home_about_cta()}</span>
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
