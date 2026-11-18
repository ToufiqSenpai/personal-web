import { getLocale } from '@/paraglide/runtime'
import configPromise from '@payload-config'
import { createServerFn } from '@tanstack/react-start'
import { getPayload, type PaginatedDocs } from 'payload'
import type { Article, Feed, Profile, Project } from '@/payload-types'

const getPayloadClient = async () => getPayload({ config: configPromise })

// Public pages read through the Local API on the server, so `overrideAccess: true` is
// explicit — Payload 4 enforces access control on Local API calls by default.

// Payload documents carry `_transforms` maps that the strict output check rejects,
// but they are plain JSON at runtime.
const query = createServerFn({ method: 'GET', strict: { output: false } })

export const getProfileFn = query.handler(async (): Promise<Profile> => {
  const payload = await getPayloadClient()

  return payload.findGlobal({ slug: 'profile', locale: getLocale(), overrideAccess: true })
})

export const getFeaturedProjectsFn = query.handler(async (): Promise<Project[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    limit: 3,
    sort: '-createdAt',
    locale: getLocale(),
    depth: 1,
    overrideAccess: true,
  })

  return docs
})

export const getAllProjectsFn = query.handler(async (): Promise<Project[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'projects',
    sort: '-createdAt',
    locale: getLocale(),
    depth: 1,
    overrideAccess: true,
  })

  return docs
})

export const getLatestFeedsFn = query.handler(async (): Promise<PaginatedDocs<Feed>> => {
  const payload = await getPayloadClient()

  return payload.find({
    collection: 'feeds',
    sort: '-createdAt',
    limit: 5,
    depth: 1,
    overrideAccess: true,
  })
})

export const getMoreFeedsFn = createServerFn({ method: 'GET', strict: { output: false } })
  .validator((page: number) => page)
  .handler(async ({ data: page }): Promise<PaginatedDocs<Feed>> => {
    const payload = await getPayloadClient()

    return payload.find({
      collection: 'feeds',
      sort: '-createdAt',
      limit: 5,
      page,
      depth: 1,
      overrideAccess: true,
    })
  })

export const getFeaturedArticlesFn = query.handler(async (): Promise<Article[]> => {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    limit: 3,
    sort: '-publishedAt',
    where: { status: { equals: 'published' } },
    locale: getLocale(),
    depth: 1,
    overrideAccess: true,
  })

  return docs
})
