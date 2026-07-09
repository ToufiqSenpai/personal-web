import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactHeader } from '@/components/contact/ContactHeader'
import { ContactInfo } from '@/components/contact/ContactInfo'
import { clientEnv } from '@/configs/client-env'
import { getProfile } from '@/data/queries'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params
  const typedLocale = locale as 'en' | 'id' | 'ja'
  const [profile, t] = await Promise.all([
    getProfile(typedLocale),
    getTranslations({ locale, namespace: 'pages.Contact' }),
  ])

  const title = t('meta.title')
  const description = t('meta.description')
  const url = `${clientEnv.NEXT_PUBLIC_SITE_URL}/contact`

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

export default async function ContactPage({ params }: ContactPageProps) {
  const resolvedParams = await params
  const locale = resolvedParams.locale
  setRequestLocale(locale)
  return (
    <>
      <ContactHeader />
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[2fr_1fr]">
          <ContactForm />
          <ContactInfo locale={locale} />
        </div>
      </section>
    </>
  )
}
