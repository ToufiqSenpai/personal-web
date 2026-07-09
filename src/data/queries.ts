import { cacheLife, cacheTag } from 'next/cache'
import { cache } from 'react'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { Locale } from '../constants/language'

// React.cache() — deduplicates within a single request
// So layout.tsx + page.tsx calling getProfile() only hits DB once
const getPayloadClient = cache(async () => {
  return getPayload({ config: configPromise })
})

export async function getProfile(locale: Locale) {
  'use cache'
  cacheLife({ stale: 3600, revalidate: 43200, expire: 604800 }) // 1h stale, 12h revalidate, 7d expire
  cacheTag('profile')

  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'profile',
    locale,
  })
}

export async function getFeaturedProjects(locale: Locale) {
  'use cache'
  cacheLife('hours')
  cacheTag('projects')

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    limit: 3,
    sort: '-createdAt',
    locale: locale,
    depth: 1,
  })
  return docs
}

export async function getAllProjects(locale: Locale) {
  'use cache'
  cacheLife('hours')
  cacheTag('projects')

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    locale: locale,
    sort: '-createdAt',
    depth: 1,
  })
  return docs
}

export async function getLatestFeeds() {
  'use cache'
  cacheLife('minutes')
  cacheTag('feeds')

  const payload = await getPayloadClient()
  return payload.find({
    collection: 'feeds',
    sort: '-createdAt',
    limit: 5,
  })
}

export async function getFeaturedArticles(locale: Locale) {
  'use cache'
  cacheLife('hours')
  cacheTag('articles')

  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    limit: 3,
    sort: '-publishedAt',
    where: {
      status: {
        equals: 'published',
      },
    },
    locale: locale,
    depth: 1,
  })
  return docs
}
