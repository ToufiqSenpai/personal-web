export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ja', name: '日本語' },
] as const

export type Locale = (typeof LANGUAGES)[number]['code']

export const DEFAULT_LOCALE: Locale = 'en'

export const DEFAULT_LANGUAGE = LANGUAGES.find((language) => language.code === DEFAULT_LOCALE)!

export const LOCALES = LANGUAGES.map((language) => language.code)

export const LOCALE_COOKIE_KEY = 'NEXT_LOCALE'
