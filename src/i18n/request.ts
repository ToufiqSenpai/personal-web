import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

import { headers } from 'next/headers'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    const acceptLanguage = (await headers()).get('accept-language')
    let matchedLocale: string | undefined

    if (acceptLanguage) {
      const preferredLocales = acceptLanguage
        .split(',')
        .map((lang) => {
          const [code] = lang.trim().split(';')
          return code.split('-')[0].toLowerCase()
        })
      matchedLocale = preferredLocales.find((code) =>
        routing.locales.includes(code as typeof routing.locales[number])
      )
    }

    locale = matchedLocale || routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`./languages/${locale}.json`)).default,
  }
})
