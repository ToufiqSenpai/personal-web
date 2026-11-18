import * as stylex from '@stylexjs/stylex'
import type { Media, Project } from '@/payload-types'

const styles = stylex.create({
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    transitionProperty: 'transform, border-color, box-shadow',
    transitionDuration: '300ms',
    ':hover': {
      transform: 'translateY(-0.25rem)',
      borderColor: 'var(--color-accent)',
    },
    ':focus-visible': {
      transform: 'translateY(-0.25rem)',
      borderColor: 'var(--color-accent)',
      outlineWidth: 2,
      outlineStyle: 'solid',
      outlineColor: 'color-mix(in srgb, var(--color-accent) 25%, transparent)',
    },
  },
  media: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'var(--color-border)',
    backgroundColor: 'color-mix(in srgb, var(--color-muted) 10%, transparent)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transitionProperty: 'transform',
    transitionDuration: '500ms',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  noImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    backgroundColor: 'color-mix(in srgb, var(--color-ink) 70%, transparent)',
    opacity: 0,
    transitionProperty: 'opacity',
    transitionDuration: '300ms',
    ':hover': {
      opacity: 1,
    },
  },
  overlayLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    paddingInline: '1rem',
    paddingBlock: '0.5rem',
    borderRadius: '9999px',
    backgroundColor: 'var(--color-surface)',
    color: 'var(--color-ink)',
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecorationLine: 'none',
  },
  body: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    padding: '1.25rem',
  },
  title: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--color-ink)',
  },
  description: {
    flex: 1,
    marginTop: 0,
    marginBottom: '1rem',
    maxHeight: '4.5rem',
    overflow: 'hidden',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: 'auto',
  },
  tag: {
    display: 'inline-flex',
    alignItems: 'center',
    paddingInline: '0.5rem',
    paddingBlock: '0.25rem',
    borderRadius: '0.375rem',
    backgroundColor: 'var(--color-accent-soft)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 500,
    color: 'var(--color-accent)',
  },
})

function DemoIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function CodeIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export function ProjectCard({ project }: { project: Project }) {
  const thumbnail = project.thumbnail as Media

  return (
    <div tabIndex={0} {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.media)}>
        {thumbnail.url ? (
          <img src={thumbnail.url} alt={thumbnail.alt} loading="lazy" {...stylex.props(styles.image)} />
        ) : (
          <div {...stylex.props(styles.noImage)}>No image</div>
        )}

        {project.projectType === 'public' && (project.demoUrl ?? project.repositoryUrl) && (
          <div {...stylex.props(styles.overlay)}>
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" {...stylex.props(styles.overlayLink)}>
                <DemoIcon />
                Demo
              </a>
            )}
            {project.repositoryUrl && (
              <a
                href={project.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                {...stylex.props(styles.overlayLink)}
              >
                <CodeIcon />
                Code
              </a>
            )}
          </div>
        )}
      </div>

      <div {...stylex.props(styles.body)}>
        <h3 {...stylex.props(styles.title)}>{project.title}</h3>
        <p {...stylex.props(styles.description)}>{project.description}</p>

        <div {...stylex.props(styles.tags)}>
          {project.techStacks.map((item) => (
            <span key={item.tag} {...stylex.props(styles.tag)}>
              {item.tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
