import { createFileRoute } from '@tanstack/react-router'
import { Cta } from '@/components/home/Cta'
import { FeaturedArticles } from '@/components/home/FeaturedArticles'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { HomeAbout } from '@/components/home/HomeAbout'
import { getFeaturedArticlesFn, getFeaturedProjectsFn, getProfileFn } from '@/data/queries'
import { buildHead } from '@/lib/seo'
import type { Profile } from '@/payload-types'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/_frontend/')({
  loader: async () => {
    const [profile, projects, articles] = await Promise.all([
      getProfileFn(),
      getFeaturedProjectsFn(),
      getFeaturedArticlesFn(),
    ])

    return { profile, projects, articles }
  },
  head: ({ loaderData }) => {
    // `profile` is nullable at runtime on a fresh database even though the generated
    // type marks it as present, so head must not assume authored content.
    const profile = loaderData?.profile as Partial<Profile> | null | undefined

    return buildHead({
      title: profile?.name ?? m.layout_navbar_home(),
      description: profile?.intro ?? m.pages_home_cta_description(),
      path: '/',
      siteName: profile?.name,
    })
  },
  component: HomePage,
})

function HomePage() {
  const { profile, projects, articles } = Route.useLoaderData()

  return (
    <>
      <Hero profile={profile} />
      <HomeAbout profile={profile} />
      <FeaturedProjects projects={projects} />
      <FeaturedArticles articles={articles} />
      <Cta />
    </>
  )
}
