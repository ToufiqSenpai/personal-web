import type { Metadata } from 'next'
import { getAllProjects, getProfile } from '@/data/queries'
import { ProjectCard } from '@/components/projects/ProjectCard'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { clientEnv } from '@/configs/client-env'

interface ProjectsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const locale = resolvedParams.locale as 'en' | 'id' | 'ja'
  const [t, profile] = await Promise.all([getTranslations({ locale, namespace: 'pages.Projects' }), getProfile(locale)])

  const title = t('title', { defaultMessage: 'Projects' })
  const description = t('subtitle')
  const url = `${clientEnv.NEXT_PUBLIC_SITE_URL}/projects`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${profile.name}`,
      description,
      url,
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary',
      title: `${title} | ${profile.name}`,
      description,
    },
  }
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  setRequestLocale(locale)

  const t = await getTranslations('pages.Projects')

  const projects = await getAllProjects(locale as 'en' | 'id' | 'ja')

  return (
    <main className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-16 animate-fade-in-up">
          <h1 className="font-mono text-4xl font-bold tracking-tight text-ink sm:text-5xl">
            {t('title', { defaultMessage: 'Projects' })}
          </h1>
          <p className="mt-4 max-w-lg text-muted leading-relaxed">{t('subtitle')}</p>
        </header>

        <div className="mt-12">
          {projects.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up"
              style={{ animationDelay: '100ms' }}
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              <p className="text-muted font-mono">{t('noProjects')}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
