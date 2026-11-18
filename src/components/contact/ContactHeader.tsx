import * as stylex from '@stylexjs/stylex'
import { shared } from '@/components/ui/styles'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  section: {
    paddingInline: '1.5rem',
    paddingTop: '5rem',
    paddingBottom: '2rem',
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: { default: '2.25rem', '@media (min-width: 640px)': '3rem' },
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
  },
  subtitle: {
    maxWidth: '32rem',
    marginTop: '1rem',
    marginBottom: 0,
    color: 'var(--color-muted)',
  },
})

export function ContactHeader() {
  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(shared.container)}>
        <h1 {...stylex.props(styles.title)}>{m.pages_contact_title()}</h1>
        <p {...stylex.props(styles.subtitle)}>{m.pages_contact_subtitle()}</p>
      </div>
    </section>
  )
}
