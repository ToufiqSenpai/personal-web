import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import React, { Suspense } from 'react'

import './styles.css'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import { getProfile } from '@/data/queries'
import { routing } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

import { setRequestLocale } from 'next-intl/server'

export default async function RootLayout(props: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
  const { children, params } = props
  const { locale } = await params
  setRequestLocale(locale)
  const messages = await getMessages()

  const profile = await getProfile(locale as 'en' | 'id' | 'ja')

  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
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
