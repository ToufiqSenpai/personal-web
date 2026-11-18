import { clientEnv } from '@/configs/client-env'
import { getLocale } from '@/paraglide/runtime'

export const siteUrl = clientEnv.VITE_SITE_URL.replace(/\/$/, '')

interface HeadInput {
  title: string
  description: string
  path: string
  siteName?: string
}

export function buildHead({ title, description, path, siteName }: HeadInput) {
  const url = `${siteUrl}/${getLocale()}${path === '/' ? '' : path}`
  const fullTitle = siteName ? `${title} | ${siteName}` : title

  return {
    meta: [
      { title: fullTitle },
      { name: 'description', content: description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: siteName ?? title },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: url },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
    ],
    links: [
      { rel: 'canonical', href: url },
      { rel: 'alternate', hrefLang: 'en', href: `${siteUrl}/en${path === '/' ? '' : path}` },
      { rel: 'alternate', hrefLang: 'id', href: `${siteUrl}/id${path === '/' ? '' : path}` },
      { rel: 'alternate', hrefLang: 'ja', href: `${siteUrl}/ja${path === '/' ? '' : path}` },
      { rel: 'alternate', hrefLang: 'x-default', href: `${siteUrl}/en${path === '/' ? '' : path}` },
    ],
  }
}
