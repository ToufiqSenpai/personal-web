import * as stylex from '@stylexjs/stylex'
import { Reveal } from '@/components/ui/Reveal'
import { shared } from '@/components/ui/styles'
import type { Profile } from '@/payload-types'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  section: {
    paddingInline: '1.5rem',
    paddingBlock: '3rem',
  },
  container: {
    maxWidth: '56rem',
    marginInline: 'auto',
  },
  track: {
    position: 'relative',
  },
  line: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '15px',
    width: '2px',
    backgroundColor: 'var(--color-border)',
    '@media (min-width: 768px)': {
      left: '50%',
      transform: 'translateX(-50%)',
    },
  },
  items: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  },
  item: {
    position: 'relative',
    display: 'flex',
    width: '100%',
  },
  dot: {
    position: 'absolute',
    top: '1.5rem',
    left: '11px',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--color-accent)',
    boxShadow: '0 0 0 4px var(--color-canvas)',
    '@media (min-width: 768px)': {
      left: '50%',
      marginLeft: '-0.375rem',
    },
  },
  content: {
    width: '100%',
    marginLeft: '3rem',
    '@media (min-width: 768px)': {
      width: '50%',
      marginLeft: 0,
    },
  },
  contentEven: {
    '@media (min-width: 768px)': {
      marginRight: 'auto',
      paddingRight: '3rem',
      textAlign: 'right',
    },
  },
  contentOdd: {
    '@media (min-width: 768px)': {
      marginLeft: 'auto',
      paddingLeft: '3rem',
      textAlign: 'left',
    },
  },
  card: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    transitionProperty: 'border-color',
    transitionDuration: '150ms',
    ':hover': {
      borderColor: 'color-mix(in srgb, var(--color-accent) 50%, transparent)',
    },
  },
  years: {
    display: 'block',
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-accent)',
  },
  title: {
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--color-ink)',
  },
  institution: {
    marginTop: 0,
    marginBottom: '0.75rem',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--color-muted)',
  },
  description: {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
})

export function Timeline({ profile }: { readonly profile: Profile }) {
  const items = profile.timelines

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.container)}>
        <Reveal>
          <p {...stylex.props(shared.eyebrow)}>{m.pages_about_timeline_eyebrow()}</p>
          <h2 {...stylex.props(shared.sectionTitle)}>{m.pages_about_timeline_title()}</h2>
        </Reveal>

        <div {...stylex.props(styles.track)}>
          {items.length > 0 && <div {...stylex.props(styles.line)} />}

          <div {...stylex.props(styles.items)}>
            {items.map((item, index) => (
              <Reveal key={item.id ?? index} delay={index * 100}>
                <div {...stylex.props(styles.item)}>
                  <div {...stylex.props(styles.dot)} />
                  <div {...stylex.props(styles.content, index % 2 === 0 ? styles.contentEven : styles.contentOdd)}>
                    <div {...stylex.props(styles.card)}>
                      <span {...stylex.props(styles.years)}>
                        {item.yearStart} — {item.present ? m.pages_about_present() : item.yearEnd}
                      </span>
                      <h3 {...stylex.props(styles.title)}>{item.title}</h3>
                      <p {...stylex.props(styles.institution)}>{item.institution}</p>
                      <p {...stylex.props(styles.description)}>{item.description}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
