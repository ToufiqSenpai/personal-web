import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import { Reveal } from '@/components/ui/Reveal'
import { shared } from '@/components/ui/styles'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  section: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'color-mix(in srgb, var(--color-canvas) 30%, transparent)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'color-mix(in srgb, var(--color-border) 50%, transparent)',
    paddingBlock: '6rem',
  },
  wrapper: {
    maxWidth: '72rem',
    marginInline: 'auto',
    paddingInline: '1.5rem',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '48rem',
    marginInline: 'auto',
    padding: { default: '2rem', '@media (min-width: 640px)': '3rem', '@media (min-width: 768px)': '4rem' },
    borderRadius: '1.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--color-border) 80%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--color-surface) 75%, transparent)',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '36rem',
    textAlign: 'center',
  },
  eyebrow: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.75rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
  },
  title: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '1rem',
    fontSize: { default: '1.875rem', '@media (min-width: 640px)': '2.25rem' },
    fontWeight: 800,
    lineHeight: 1.25,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
  },
  description: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '2rem',
    fontSize: { default: '0.875rem', '@media (min-width: 640px)': '1rem' },
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
})

export function CTA() {
  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.wrapper)}>
        <div {...stylex.props(styles.card)}>
          <div {...stylex.props(styles.content)}>
            <Reveal>
              <p {...stylex.props(styles.eyebrow)}>{m.pages_home_cta_eyebrow()}</p>
            </Reveal>

            <Reveal delay={100}>
              <h2 {...stylex.props(styles.title)}>{m.pages_home_cta_title()}</h2>
            </Reveal>

            <Reveal delay={200}>
              <p {...stylex.props(styles.description)}>{m.pages_home_cta_description()}</p>
            </Reveal>

            <Reveal delay={300}>
              <Link to="/contact" {...stylex.props(shared.primaryButton)}>
                {m.pages_home_cta_button()}
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
