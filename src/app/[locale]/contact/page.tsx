import { ContactHeader } from '@/components/contact/ContactHeader'
import { setRequestLocale } from 'next-intl/server'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactInfo } from '@/components/contact/ContactInfo'

interface ContactPageProps {
  params: Promise<{ locale: string }>
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
