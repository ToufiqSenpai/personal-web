import * as stylex from '@stylexjs/stylex'
import type { Media, Profile } from '@/payload-types'

const styles = stylex.create({
  section: {
    paddingInline: '1.5rem',
    paddingTop: '5rem',
    paddingBottom: '3rem',
  },
  container: {
    maxWidth: '56rem',
    marginInline: 'auto',
    animationName: 'fade-in-up',
    animationDuration: '0.6s',
    animationFillMode: 'both',
    animationTimingFunction: 'ease-out',
  },
  head: {
    display: 'flex',
    flexDirection: { default: 'column', '@media (min-width: 640px)': 'row' },
    alignItems: { default: 'flex-start', '@media (min-width: 640px)': 'center' },
    gap: '2rem',
  },
  avatar: {
    position: 'relative',
    flexShrink: 0,
    width: '6rem',
    height: '6rem',
    overflow: 'hidden',
    borderRadius: '9999px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-accent)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarFallback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontFamily: 'var(--font-mono)',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  name: {
    margin: 0,
    fontSize: { default: '1.875rem', '@media (min-width: 640px)': '2.25rem' },
    fontWeight: 700,
    color: 'var(--color-ink)',
  },
  roles: {
    marginTop: '0.25rem',
    marginBottom: 0,
    fontSize: '1.125rem',
    color: 'var(--color-muted)',
  },
  facts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem',
    marginTop: '1rem',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
  },
  fact: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.375rem',
  },
  icon: {
    width: '1rem',
    height: '1rem',
  },
  bio: {
    maxWidth: '42rem',
    marginTop: '2rem',
    marginBottom: 0,
    fontSize: '1rem',
    color: 'var(--color-muted)',
  },
})

function PinIcon() {
  return (
    <svg {...stylex.props(styles.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function LanguageIcon() {
  return (
    <svg {...stylex.props(styles.icon)} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
      />
    </svg>
  )
}

export function AboutHero({ profile }: { profile: Profile }) {
  const initials = profile.name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const languages = profile.languages.map((item) => item.language).join(' • ')
  const roles = profile.roles.map((item) => item.role).join(' • ')
  const avatar = profile.avatar as Media

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.head)}>
          <div {...stylex.props(styles.avatar)}>
            {avatar.url ? (
              <img src={avatar.url} alt={avatar.alt} {...stylex.props(styles.avatarImage)} />
            ) : (
              <div {...stylex.props(styles.avatarFallback)}>{initials}</div>
            )}
          </div>

          <div>
            <h1 {...stylex.props(styles.name)}>{profile.name}</h1>
            <p {...stylex.props(styles.roles)}>{roles}</p>

            <div {...stylex.props(styles.facts)}>
              <div {...stylex.props(styles.fact)}>
                <PinIcon />
                {profile.location}
              </div>
              {languages && (
                <div {...stylex.props(styles.fact)}>
                  <LanguageIcon />
                  {languages}
                </div>
              )}
            </div>
          </div>
        </div>

        <p {...stylex.props(styles.bio)}>{profile.bio}</p>
      </div>
    </section>
  )
}
