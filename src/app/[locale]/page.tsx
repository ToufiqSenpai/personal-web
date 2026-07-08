import type { Metadata } from 'next'
import { CTA } from '@/components/home/CTA'
import { FeaturedArticles } from '@/components/home/FeaturedArticles'
import { FeaturedProjects } from '@/components/home/FeaturedProjects'
import { Hero } from '@/components/home/Hero'
import { HomeAbout } from '@/components/home/HomeAbout'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getProfile, getFeaturedProjects, getFeaturedArticles } from '@/data/queries'
import { clientEnv } from '@/configs/client-env'

interface HomePageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params
  const typedLocale = locale as 'en' | 'id' | 'ja'
  const [profile, t] = await Promise.all([getProfile(typedLocale), getTranslations({ locale, namespace: 'pages.Home' })])

  const description = profile.intro || t('cta.description')
  const url = clientEnv.NEXT_PUBLIC_SITE_URL

  return {
    title: profile.name,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: profile.name,
      description,
      url,
      type: 'website',
      locale,
    },
    twitter: {
      card: 'summary',
      title: profile.name,
      description,
    },
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const typedLocale = locale as 'en' | 'id' | 'ja'
  const [profile, projects, articles] = await Promise.all([
    getProfile(typedLocale),
    getFeaturedProjects(typedLocale),
    getFeaturedArticles(typedLocale),
  ])

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
