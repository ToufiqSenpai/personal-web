export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'ja', name: '日本語' },
] as const

export type Locale = (typeof LANGUAGES)[number]['code']

export const DEFAULT_LOCALE: Locale = 'en'
