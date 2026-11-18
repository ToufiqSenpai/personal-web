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
    // StyleX has no group-hover, so the card publishes its interaction state as
    // inherited custom properties that the media / caption layers consume.
    '--tilt': '0deg',
    '--scale': '1',
    '--desc-height': '0px',
    '--desc-opacity': '0',
    '--title-y': '0px',
    '--overlay-bottom': '0.85',
    ':hover': {
      '--scale': '1.06',
      '--desc-height': '5rem',
      '--desc-opacity': '1',
      '--title-y': '-0.25rem',
      '--overlay-bottom': '0.9',
    },
    ':focus': {
      '--scale': '1.06',
      '--desc-height': '5rem',
      '--desc-opacity': '1',
      '--title-y': '-0.25rem',
      '--overlay-bottom': '0.9',
    },
    ':focus-visible': {
      outlineWidth: '2px',
      outlineStyle: 'solid',
      outlineColor: 'color-mix(in srgb, var(--color-accent) 25%, transparent)',
      outlineOffset: '2px',
    },
  },
  hero: {
    minHeight: '220px',
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
  tilt1: {
    ':hover': { '--tilt': '-1.5deg' },
    ':focus': { '--tilt': '-1.5deg' },
  },
  tilt2: {
    ':hover': { '--tilt': '1.5deg' },
    ':focus': { '--tilt': '1.5deg' },
  },
  tilt3: {
    ':hover': { '--tilt': '-1deg' },
    ':focus': { '--tilt': '-1deg' },
  },
  tilt4: {
    ':hover': { '--tilt': '1deg' },
    ':focus': { '--tilt': '1deg' },
  },
  tilt5: {
    ':hover': { '--tilt': '-2deg' },
    ':focus': { '--tilt': '-2deg' },
  },
  tilt6: {
    ':hover': { '--tilt': '2deg' },
    ':focus': { '--tilt': '2deg' },
  },
  media: {
    position: 'absolute',
    inset: 0,
    transform: 'rotate(var(--tilt)) scale(var(--scale))',
    transitionProperty: 'transform',
    transitionDuration: '500ms',
    transitionTimingFunction: 'ease-out',
    '@media (prefers-reduced-motion: reduce)': {
      transform: 'none',
      transitionProperty: 'none',
    },
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  fallback: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    backgroundImage:
      'linear-gradient(to bottom right, color-mix(in srgb, var(--color-accent) 30%, transparent), var(--color-surface), var(--color-surface))',
    fontFamily: 'var(--font-mono)',
    fontSize: '2.25rem',
    fontWeight: 700,
    color: 'color-mix(in srgb, var(--color-accent) 60%, transparent)',
  },
  overlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(to top, rgb(0 0 0 / var(--overlay-bottom)), rgb(0 0 0 / 0.25), transparent)',
  },
  caption: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    padding: '1.5rem',
  },
  title: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.25rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: '#ffffff',
    transform: 'translateY(var(--title-y))',
    transitionProperty: 'transform',
    transitionDuration: '300ms',
  },
  description: {
    margin: 0,
    maxHeight: 'var(--desc-height)',
    overflow: 'hidden',
    opacity: 'var(--desc-opacity)',
    transitionProperty: 'max-height, opacity',
    transitionDuration: '300ms',
    fontSize: '0.875rem',
    color: 'rgb(255 255 255 / 0.8)',
  },
})

const layouts = [styles.hero, null, null, styles.wide, styles.tall, null] as const
const tilts = [styles.tilt1, styles.tilt2, styles.tilt3, styles.tilt4, styles.tilt5, styles.tilt6] as const

export function BentoHobbies({ profile }: { profile: Profile }) {
  const hobbies = profile.hobbies

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.container)}>
        <Reveal>
          <p {...stylex.props(shared.eyebrow)}>{m.pages_about_hobbies_eyebrow()}</p>
          <h2 {...stylex.props(shared.sectionTitle)}>{m.pages_about_hobbies_title()}</h2>
        </Reveal>

        <div {...stylex.props(styles.grid)}>
          {hobbies.map((hobby, index) => {
            const image = hobby.image as Media
            const layout = layouts[index === 0 ? 0 : 1 + ((index - 1) % (layouts.length - 1))]

            return (
              <Reveal
                key={hobby.id ?? index}
                delay={index * 90}
                tabIndex={0}
                className={stylex.props(styles.card, layout, tilts[index % tilts.length]).className}
              >
                <div {...stylex.props(styles.media)}>
                  {image.url ? (
                    <img src={image.url} alt={image.alt || hobby.title} loading="lazy" {...stylex.props(styles.image)} />
                  ) : (
                    <div {...stylex.props(styles.fallback)}>{hobby.title.charAt(0)}</div>
                  )}
                  <div {...stylex.props(styles.overlay)} />
                </div>

                <div {...stylex.props(styles.caption)}>
                  <h3 {...stylex.props(styles.title)}>{hobby.title}</h3>
                  {hobby.description && <p {...stylex.props(styles.description)}>{hobby.description}</p>}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
