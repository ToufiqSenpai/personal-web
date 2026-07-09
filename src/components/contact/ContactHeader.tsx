import { useTranslations } from 'next-intl'

export function ContactHeader() {
  const t = useTranslations('pages.Contact')

  return (
    <section className="px-6 pt-20 pb-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-mono text-4xl font-bold tracking-tight text-ink sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 max-w-lg text-muted">{t('subtitle')}</p>
      </div>
    </section>
  )
}
