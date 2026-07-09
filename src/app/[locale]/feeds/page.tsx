import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { FeedList } from '@/components/feeds/FeedList'
import { Reveal } from '@/components/ui/Reveal'
import { clientEnv } from '@/configs/client-env'
import { getLatestFeeds } from '@/data/queries'
import { getProfile } from '@/data/queries'

interface FeedsPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: FeedsPageProps): Promise<Metadata> {
  const { locale } = await params
  const typedLocale = locale as 'en' | 'id' | 'ja'
  const [profile, t] = await Promise.all([
    getProfile(typedLocale),
    getTranslations({ locale, namespace: 'pages.Feeds' }),
  ])

  const title = t('meta.title')
  const description = t('meta.description')
  const url = `${clientEnv.NEXT_PUBLIC_SITE_URL}/feeds`

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

export default async function FeedsPage({ params }: FeedsPageProps) {
  const { locale } = await params
  setRequestLocale(locale)
  const { docs: initialFeeds, hasNextPage, nextPage } = await getLatestFeeds()

  const t = await getTranslations('pages.Feeds')

  return (
    <>
      <section className="px-6 pt-20 pb-8">
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <p className="mb-4 font-mono text-xs font-semibold tracking-wider text-accent uppercase">
              $ tail -f feeds.log
            </p>
            <h1 className="font-mono text-4xl font-bold tracking-tight text-ink sm:text-5xl">{t('title')}</h1>
            <p className="mt-4 text-muted">{t('subtitle')}</p>
          </Reveal>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-2xl">
          <FeedList initialFeeds={initialFeeds} initialHasNextPage={hasNextPage} initialNextPage={nextPage} />
        </div>
      </section>
    </>
  )
}
