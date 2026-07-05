export const LANGUAGES = [
  { code: 'id', name: 'Bahasa Indonesia' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
] as const

export const DEFAULT_LANGUAGE = LANGUAGES.find((language) => language.code == 'en')!
