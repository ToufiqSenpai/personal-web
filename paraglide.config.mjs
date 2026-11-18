// Shared by vite.config.ts (dev/build) and scripts/paraglide.mjs (type generation).
// Only real frontend routes are localized, so /admin and /api stay untouched.
const localizedRoutes = ['/', '/about', '/contact', '/feeds', '/projects']
const locales = ['en', 'id', 'ja']

/** @type {import('@inlang/paraglide-js').CompilerOptions} */
export const paraglideOptions = {
  project: './project.inlang',
  outdir: './src/paraglide',
  outputStructure: 'message-modules',
  emitTsDeclarations: true,
  strategy: ['url', 'cookie', 'preferredLanguage', 'baseLocale'],
  urlPatterns: localizedRoutes.map((route) => ({
    pattern: route,
    localized: locales.map((locale) => [locale, `/${locale}${route === '/' ? '' : route}`]),
  })),
}
