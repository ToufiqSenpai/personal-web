import { createFileRoute } from '@tanstack/react-router'
import { AboutHero } from '@/components/about/AboutHero'
import { BentoHobbies } from '@/components/about/BentoHobbies'
import { Timeline } from '@/components/about/Timeline'
import { CTA } from '@/components/home/CTA'
import { getProfileFn } from '@/data/queries'
import { buildHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'

export const Route = createFileRoute('/_frontend/about')({
  loader: () => getProfileFn(),
  head: ({ loaderData }) =>
    buildHead({
      title: m.pages_about_meta_title(),
      description: m.pages_about_meta_description(),
      path: '/about',
      siteName: loaderData?.name,
    }),
  component: AboutPage,
})

function AboutPage() {
  const profile = Route.useLoaderData()

  return (
    <>
      <AboutHero profile={profile} />
      <Timeline profile={profile} />
      <BentoHobbies profile={profile} />
      <CTA />
    </>
  )
}
