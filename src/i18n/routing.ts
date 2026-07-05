import { defineRouting } from 'next-intl/routing'
import { DEFAULT_LANGUAGE, LANGUAGES } from './language'

export const routing = defineRouting({
  locales: LANGUAGES.map((language) => language.code),
  defaultLocale: DEFAULT_LANGUAGE.code,
  localePrefix: 'never',
})
