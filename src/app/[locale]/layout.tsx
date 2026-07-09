import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import React, { Suspense } from 'react'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { clientEnv } from '@/configs/client-env'
import { LOCALES } from '@/constants/language'
import type { Locale } from '@/constants/language'
import { getProfile } from '@/data/queries'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import './styles.css'

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Pick<RootLayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const profile = await getProfile(locale)
  const t = await getTranslations({ locale, namespace: 'pages.Home' })
  const siteName = profile.name || 'My Name'

  return {
    metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: profile.intro || t('cta.description'),
    openGraph: {
      type: 'website',
      siteName,
      title: siteName,
      description: profile.intro || t('cta.description'),
      url: clientEnv.NEXT_PUBLIC_SITE_URL,
    },
  }
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  setRequestLocale(locale)

  const profile = await getProfile(locale)

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
            <Navbar name={profile.name} />
            <main>{children}</main>
            <Suspense>
              <Footer profile={profile} />
            </Suspense>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
