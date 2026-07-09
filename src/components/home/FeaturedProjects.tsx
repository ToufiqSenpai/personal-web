import { useTranslations } from 'next-intl'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { Reveal } from '@/components/ui/Reveal'
import type { Project } from '@/payload-types'

export interface FeaturedProjectsProps {
  projects: Project[]
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const t = useTranslations('pages.Home.featuredProjects')

  return (
    <section className="px-6 py-20 border-b border-border/50 bg-canvas/20">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{t('eyebrow')}</p>
          <h2 className="mb-12 text-2xl font-bold text-ink sm:text-3xl">{t('title')}</h2>
        </Reveal>

        {projects && projects.length > 0 ? (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 100}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="py-12 text-center border border-dashed border-border rounded-xl bg-surface/50">
              <p className="text-muted font-mono text-sm">{t('noProjects')}</p>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
