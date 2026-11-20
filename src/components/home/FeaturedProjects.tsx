import * as stylex from '@stylexjs/stylex'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import { shared } from '@/components/ui/styles'
import type { Project } from '@/payload-types'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  section: {
    backgroundColor: 'color-mix(in srgb, var(--color-canvas) 20%, transparent)',
  },
  grid: {
    display: 'grid',
    gap: '2rem',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 768px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1024px)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  empty: {
    paddingBlock: '3rem',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'var(--color-border)',
    backgroundColor: 'color-mix(in srgb, var(--color-surface) 50%, transparent)',
    textAlign: 'center',
  },
  emptyText: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: '0.875rem',
    color: 'var(--color-muted)',
  },
})

export function FeaturedProjects({ projects }: { readonly projects: Project[] }) {
  return (
    <section {...stylex.props(shared.section, shared.bordered, styles.section)}>
      <div {...stylex.props(shared.container)}>
        <Reveal>
          <p {...stylex.props(shared.eyebrow)}>{m.pages_home_featured_projects_eyebrow()}</p>
          <h2 {...stylex.props(shared.sectionTitle)}>{m.pages_home_featured_projects_title()}</h2>
        </Reveal>

        {projects.length > 0 ? (
          <div {...stylex.props(styles.grid)}>
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 100}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div {...stylex.props(styles.empty)}>
              <p {...stylex.props(styles.emptyText)}>{m.pages_home_featured_projects_no_projects()}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
