import * as stylex from '@stylexjs/stylex'
import type { Media, Profile } from '@/payload-types'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    padding: '1.25rem',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
  },
  label: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
  },
  labelSpaced: {
    marginBottom: '0.75rem',
  },
  email: {
    fontSize: '0.875rem',
    color: 'var(--color-ink)',
    textDecorationLine: 'none',
    transitionProperty: 'color',
    transitionDuration: '150ms',
    ':hover': {
      color: 'var(--color-accent)',
    },
  },
  socials: {
    display: 'flex',
    gap: '0.75rem',
  },
  social: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    color: 'var(--color-muted)',
    transitionProperty: 'color, border-color',
    transitionDuration: '150ms',
    ':hover': {
      borderColor: 'var(--color-accent)',
      color: 'var(--color-accent)',
    },
  },
})

export function ContactInfo({ profile }: { readonly profile: Profile }) {
  return (
    <div {...stylex.props(styles.list)}>
      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.label)}>{m.pages_contact_email_label()}</p>
        <a href={`mailto:${profile.email}`} {...stylex.props(styles.email)}>
          {profile.email}
        </a>
      </div>

      <div {...stylex.props(styles.card)}>
        <p {...stylex.props(styles.label, styles.labelSpaced)}>{m.pages_contact_socials_label()}</p>
        <div {...stylex.props(styles.socials)}>
          {profile.socials?.map((social) => {
            const icon = social.icon as Media

            return (
              <a
                key={social.id ?? social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                {...stylex.props(styles.social)}
              >
                {icon.url && <img src={icon.url} alt={social.name} width={18} height={18} />}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
