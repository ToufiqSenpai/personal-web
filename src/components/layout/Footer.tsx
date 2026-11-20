'use client'

import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import type { Media, Profile } from '@/payload-types'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  footer: {
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
    backgroundColor: 'color-mix(in srgb, var(--color-canvas) 30%, transparent)',
  },
  inner: {
    maxWidth: '72rem',
    marginInline: 'auto',
    paddingInline: '1.5rem',
    paddingBlock: { default: '3rem', '@media (min-width: 768px)': '4rem' },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 640px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 768px)': 'repeat(3, minmax(0, 1fr))',
    },
    gap: '2.5rem',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  logo: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    fontWeight: 600,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
    textDecorationLine: 'none',
  },
  logoCursor: {
    color: 'var(--color-accent)',
    animationName: 'pulse',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
  },
  intro: {
    margin: 0,
    maxWidth: '15rem',
    fontSize: '0.75rem',
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
  heading: {
    display: 'block',
    marginBottom: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.625rem',
    margin: 0,
    padding: 0,
    listStyle: 'none',
  },
  link: {
    display: 'inline-block',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    textDecorationLine: 'none',
    transitionProperty: 'color, transform',
    transitionDuration: '200ms',
    ':hover': {
      color: 'var(--color-ink)',
      transform: 'translateX(0.25rem)',
    },
  },
  social: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
    textDecorationLine: 'none',
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: 'var(--color-ink)',
    },
  },
  socialIcon: {
    flexShrink: 0,
  },
  socialName: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
  },
  bottom: {
    display: 'flex',
    flexDirection: { default: 'column', '@media (min-width: 768px)': 'row' },
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginTop: '3rem',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--color-border)',
    paddingTop: '1.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
  },
  builtWith: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
    margin: 0,
  },
  builtWithLink: {
    color: 'var(--color-ink)',
    textDecorationLine: 'none',
  },
})

const links = [
  { to: '/', label: m.layout_navbar_home },
  { to: '/about', label: m.layout_navbar_about },
  { to: '/projects', label: m.layout_navbar_projects },
  { to: '/feeds', label: m.layout_navbar_feeds },
  { to: '/contact', label: m.layout_navbar_contact },
] as const

const year = new Date().getFullYear()

export function Footer({ profile }: { readonly profile: Profile }) {
  return (
    <footer {...stylex.props(styles.footer)}>
      <div {...stylex.props(styles.inner)}>
        <div {...stylex.props(styles.grid)}>
          <div {...stylex.props(styles.column)}>
            <Link to="/" {...stylex.props(styles.logo)}>
              {profile.name}
              <span {...stylex.props(styles.logoCursor)}>_</span>
            </Link>
            <p {...stylex.props(styles.intro)}>{profile.intro}</p>
          </div>

          <div>
            <span {...stylex.props(styles.heading)}>
              {'// '}
              {m.layout_footer_nav()}
            </span>
            <ul {...stylex.props(styles.list)}>
              {links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} {...stylex.props(styles.link)}>
                    {link.label()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span {...stylex.props(styles.heading)}>
              {'// '}
              {m.layout_footer_connect()}
            </span>
            <ul {...stylex.props(styles.list)}>
              {profile.socials?.map((social) => {
                const icon = social.icon as Media

                return (
                  <li key={social.id ?? social.name}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.social)}>
                      {icon.url && (
                        <img
                          src={icon.url}
                          alt={icon.alt}
                          width={16}
                          height={16}
                          {...stylex.props(styles.socialIcon)}
                        />
                      )}
                      <span {...stylex.props(styles.socialName)}>{social.name}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        <div {...stylex.props(styles.bottom)}>
          <p>
            © {year} {profile.name}. All rights reserved.
          </p>
          <p {...stylex.props(styles.builtWith)}>
            <span>{m.layout_footer_built_with()}</span>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.builtWithLink)}
            >
              TanStack Start
            </a>
            <span>&</span>
            <a
              href="https://payloadcms.com"
              target="_blank"
              rel="noopener noreferrer"
              {...stylex.props(styles.builtWithLink)}
            >
              Payload CMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
