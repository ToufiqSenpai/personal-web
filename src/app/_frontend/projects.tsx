import * as stylex from '@stylexjs/stylex'
import { createFileRoute } from '@tanstack/react-router'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getAllProjectsFn } from '@/data/queries'
import { buildHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'
import type { Project } from '@/payload-types'

const styles = stylex.create({
  main: {
    minHeight: '100vh',
    paddingBlock: '6rem',
  },
  container: {
    maxWidth: '72rem',
    marginInline: 'auto',
    paddingInline: '1.5rem',
  },
  header: {
    marginBottom: '4rem',
  },
  title: {
    fontFamily: 'var(--font-mono)',
    fontSize: { default: '2.25rem', '@media (min-width: 640px)': '3rem' },
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
    margin: 0,
  },
  subtitle: {
    marginTop: '1rem',
    maxWidth: '32rem',
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
  grid: {
    display: 'grid',
    gap: '1.5rem',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 768px)': 'repeat(2, minmax(0, 1fr))',
      '@media (min-width: 1024px)': 'repeat(3, minmax(0, 1fr))',
    },
  },
  empty: {
    paddingBlock: '5rem',
    textAlign: 'center',
    fontFamily: 'var(--font-mono)',
    color: 'var(--color-muted)',
  },
})

export const Route = createFileRoute('/_frontend/projects')({
  loader: (): Promise<Project[]> => getAllProjectsFn(),
  head: () =>
    buildHead({
      title: m.pages_projects_title(),
      description: m.pages_projects_subtitle(),
      path: '/projects',
    }),
  component: ProjectsPage,
})

function ProjectsPage() {
  const projects = Route.useLoaderData()

  return (
    <main {...stylex.props(styles.main)}>
      <div {...stylex.props(styles.container)}>
        <header {...stylex.props(styles.header)}>
          <h1 {...stylex.props(styles.title)}>{m.pages_projects_title()}</h1>
          <p {...stylex.props(styles.subtitle)}>{m.pages_projects_subtitle()}</p>
        </header>

        {projects.length > 0 ? (
          <div {...stylex.props(styles.grid)}>
            {projects.map((project: Project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div {...stylex.props(styles.empty)}>{m.pages_projects_no_projects()}</div>
        )}
      </div>
    </main>
  )
}
