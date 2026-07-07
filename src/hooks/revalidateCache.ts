import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

export const revalidateProfileCache: GlobalAfterChangeHook = ({ doc }) => {
  revalidateTag('profile', 'max')
  return doc
}

export const revalidateProjectsCache: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag('projects', 'max')
  return doc
}

export const revalidateProjectsDeleteCache: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateTag('projects', 'max')
  return doc
}

export const revalidateFeedsCache: CollectionAfterChangeHook = ({ doc }) => {
  revalidateTag('feeds', 'max')
  return doc
}

export const revalidateFeedsDeleteCache: CollectionAfterDeleteHook = ({ doc }) => {
  revalidateTag('feeds', 'max')
  return doc
}
