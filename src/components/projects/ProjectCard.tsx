import Image from 'next/image'
import type { Project, ProjectsMedia } from '@/payload-types'

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const thumbnail = project.thumbnail as ProjectsMedia | null
  const techStacks = (project as any).techStacks || []

  return (
    <div 
      tabIndex={0} 
      className="group relative flex flex-col rounded-xl border border-border bg-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-accent focus:outline-none focus:-translate-y-1 focus:border-accent focus:ring-2 focus:ring-accent/25"
    >
      <div className="relative aspect-video w-full overflow-hidden border-b border-border bg-muted/10">
        {thumbnail?.url ? (
          <Image
            src={thumbnail.url}
            alt={thumbnail.alt || project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105 group-focus:scale-105 group-focus-within:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted font-mono text-sm">
            No image
          </div>
        )}
        
        {/* Overlay on hover */}
        {(project as any).projectType === 'public' && (project.demoUrl || (project as any).repositoryUrl) && (
          <div className="absolute inset-0 bg-ink/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus:opacity-100 group-focus-within:opacity-100 flex items-center justify-center gap-4 backdrop-blur-sm">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-surface text-ink px-4 py-2 font-medium text-sm hover:scale-105 focus:scale-105 transition-transform flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                Demo
              </a>
            )}
            {(project as any).repositoryUrl && (
              <a
                href={(project as any).repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-surface text-ink px-4 py-2 font-medium text-sm hover:scale-105 focus:scale-105 transition-transform flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                Code
              </a>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-mono text-lg font-bold mb-2 text-ink group-hover:text-accent group-focus:text-accent group-focus-within:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-muted text-sm flex-1 mb-4 line-clamp-3">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {techStacks.map((item: any, idx: number) => (
            <span
              key={idx}
              className="inline-flex items-center rounded-md bg-accent-soft px-2 py-1 text-xs font-mono font-medium text-accent"
            >
              {item.tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
