import { AboutHero } from '@/components/about/AboutHero'
import { Timeline } from '@/components/about/Timeline'
import { BentoHobbies } from '@/components/about/BentoHobbies'
import { CTA } from '@/components/home/CTA'
import { setRequestLocale } from 'next-intl/server'
import { getProfile } from '@/data/queries'

interface AboutPageProps {
  params: Promise<{ locale: string }>
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
