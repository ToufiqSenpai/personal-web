import createMiddleware from 'next-intl/middleware'
import { defineRouting } from 'next-intl/routing'
import { DEFAULT_LOCALE, LOCALES } from './constants/language'

export default createMiddleware(
  defineRouting({
    locales: LOCALES,
    defaultLocale: DEFAULT_LOCALE,
    localePrefix: 'never',
  }),
)

export const config = {
  matcher: ['/((?!admin|api|_next|_vercel|.*\\..*).*)'],
}
