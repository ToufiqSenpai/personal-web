import { CTA } from '@/components/home/CTA'
import { FeaturedArticles } from '@/components/home/FeaturedArticles'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { HomeAbout } from '@/components/home/HomeAbout'
import { setRequestLocale } from 'next-intl/server'
import { getProfile, getFeaturedProjects } from '@/data/queries'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const typedLocale = locale as 'en' | 'id' | 'ja'
  const [profile, projects] = await Promise.all([getProfile(typedLocale), getFeaturedProjects(typedLocale)])

  return (
    <>
      <Hero profile={profile} />
      <HomeAbout profile={profile} />
      <FeaturedProjects projects={projects} />
      <FeaturedArticles />
      <CTA />
    </>
  )
}
