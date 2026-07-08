import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import type { Metadata } from 'next'
import React, { Suspense } from 'react'

import './styles.css'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { getProfile } from '@/data/queries'
import { routing } from '@/i18n/routing'
import { clientEnv } from '@/configs/client-env'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Pick<RootLayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params
  const typedLocale = locale as 'en' | 'id' | 'ja'
  const profile = await getProfile(typedLocale)
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
  const messages = await getMessages()

  const profile = await getProfile(locale as 'en' | 'id' | 'ja')

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
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
