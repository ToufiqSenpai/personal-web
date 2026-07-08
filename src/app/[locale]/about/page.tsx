import type { Metadata } from 'next'
import { AboutHero } from '@/components/about/AboutHero'
import { Timeline } from '@/components/about/Timeline'
import { BentoHobbies } from '@/components/about/BentoHobbies'
import { CTA } from '@/components/home/CTA'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getProfile } from '@/data/queries'
import { clientEnv } from '@/configs/client-env'

interface AboutPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params
  const typedLocale = locale as 'en' | 'id' | 'ja'
  const [profile, t] = await Promise.all([
    getProfile(typedLocale),
    getTranslations({ locale, namespace: 'pages.About' }),
  ])

  const title = t('meta.title')
  const description = t('meta.description')
  const url = `${clientEnv.NEXT_PUBLIC_SITE_URL}/about`

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

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const profile = await getProfile(locale as 'en' | 'id' | 'ja')

  return (
    <>
      <AboutHero profile={profile} />
      <Timeline profile={profile} />
      <BentoHobbies profile={profile} />
      <CTA />
    </>
  )
}
