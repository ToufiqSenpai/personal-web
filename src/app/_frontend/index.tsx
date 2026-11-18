import { createFileRoute } from '@tanstack/react-router'
import { CTA } from '@/components/home/CTA'
import { FeaturedArticles } from '@/components/home/FeaturedArticles'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { HomeAbout } from '@/components/home/HomeAbout'
import { getFeaturedArticlesFn, getFeaturedProjectsFn, getProfileFn } from '@/data/queries'
import { buildHead } from '@/lib/seo'
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
  head: ({ loaderData }) =>
    buildHead({
      title: loaderData?.profile.name ?? m.layout_navbar_home(),
      description: loaderData?.profile.intro ?? m.pages_home_cta_description(),
      path: '/',
      siteName: loaderData?.profile.name,
    }),
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
      <CTA />
    </>
  )
}
