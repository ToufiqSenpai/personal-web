import * as stylex from '@stylexjs/stylex'
import { Reveal } from '@/components/ui/Reveal'
import { shared } from '@/components/ui/styles'
import type { Media, Profile } from '@/payload-types'
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
  grid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 768px)': 'repeat(3, minmax(0, 1fr))' },
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: '1rem',
    minHeight: '200px',
    backgroundColor: 'var(--color-surface)',
  },
  hero: {
    '@media (min-width: 768px)': {
      gridColumn: 'span 2',
      gridRow: 'span 2',
      minHeight: '420px',
    },
  },
  wide: {
    '@media (min-width: 768px)': {
      gridColumn: 'span 2',
    },
  },
  tall: {
    '@media (min-width: 768px)': {
      gridRow: 'span 2',
      minHeight: '420px',
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transitionProperty: 'transform',
    transitionDuration: '500ms',
    ':hover': {
      transform: 'scale(1.06)',
    },
  },
  fallback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'var(--color-accent-soft)',
    fontFamily: 'var(--font-mono)',
    fontSize: '2.25rem',
    fontWeight: 700,
    color: 'var(--color-accent)',
  },
  caption: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    padding: '1.5rem',
    backgroundImage: 'linear-gradient(to top, rgb(0 0 0 / 0.85), rgb(0 0 0 / 0.2), transparent)',
  },
  title: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.25rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#ffffff',
  },
  description: {
    margin: 0,
    fontSize: '0.875rem',
    color: 'rgb(255 255 255 / 0.8)',
  },
})

const layouts = [styles.hero, null, null, styles.wide, styles.tall, null] as const

export function BentoHobbies({ profile }: { profile: Profile }) {
  const hobbies = profile.hobbies

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.container)}>
        <Reveal>
          <p {...stylex.props(shared.eyebrow)}>{m.pages_about_hobbies_eyebrow()}</p>
          <h2 {...stylex.props(shared.sectionTitle)}>{m.pages_about_hobbies_title()}</h2>
        </Reveal>

        <Reveal>
          <div {...stylex.props(styles.grid)}>
            {hobbies.map((hobby, index) => {
              const image = hobby.image as Media
              const layout = layouts[index === 0 ? 0 : 1 + ((index - 1) % (layouts.length - 1))]

              return (
                <div key={hobby.id ?? index} tabIndex={0} {...stylex.props(styles.card, layout)}>
                  {image.url ? (
                    <img src={image.url} alt={image.alt} loading="lazy" {...stylex.props(styles.image)} />
                  ) : (
                    <div {...stylex.props(styles.fallback)}>{hobby.title.charAt(0)}</div>
                  )}

                  <div {...stylex.props(styles.caption)}>
                    <h3 {...stylex.props(styles.title)}>{hobby.title}</h3>
                    {hobby.description && <p {...stylex.props(styles.description)}>{hobby.description}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
