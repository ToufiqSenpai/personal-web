import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, GlobalAfterChangeHook } from 'payload'

export const revalidateProfileCache: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag('profile', 'max')
  return doc
}

export const revalidateProjectsCache: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag('projects', 'max')
  return doc
}

export const revalidateFeedsCache: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag('feeds', 'max')
  return doc
}
