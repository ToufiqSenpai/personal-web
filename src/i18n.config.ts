import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, Locale, LOCALES } from './constants/language'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !LOCALES.includes(locale as Locale)) {
    locale = DEFAULT_LOCALE
  }

  return {
    locale,
    messages: (await import(`./i18n/${locale}.json`)).default,
  }
})
