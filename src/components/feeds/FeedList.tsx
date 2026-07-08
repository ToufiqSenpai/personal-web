'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { FeedCard } from './FeedCard'
import type { Feed } from '../../payload-types'

type Props = {
  initialFeeds: Feed[]
  initialHasNextPage: boolean
  initialNextPage: number | null | undefined
}

export function FeedList({ initialFeeds, initialHasNextPage, initialNextPage }: Props) {
  const t = useTranslations('pages.Feeds')
  const [feeds, setFeeds] = useState(initialFeeds)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)

  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingRef.current || !nextPage) return
    isLoadingRef.current = true
    setIsLoading(true)
    try {
      const res = await fetch(`/api/feeds?limit=5&sort=-createdAt&page=${nextPage}`)
      const data = await res.json()

      if (data.docs) {
        setFeeds((prev) => [...prev, ...data.docs])
        setHasNextPage(data.hasNextPage)
        setNextPage(data.nextPage)
      }
    } catch (error) {
      console.error('Failed to load more feeds', error)
    } finally {
      isLoadingRef.current = false
      setIsLoading(false)
    }
  }, [hasNextPage, nextPage])

  useEffect(() => {
    if (isLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: '100px' },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMore, isLoading])

  return (
    <div className="relative border-l-0 sm:border-l border-border pl-0 sm:pl-6 ml-0 sm:ml-3 space-y-8 py-4">
      {feeds.map((feed) => (
        <FeedCard key={feed.id} feed={feed} />
      ))}

      {hasNextPage && (
        <div ref={observerTarget} className="h-20 flex items-center justify-center">
          <div className="h-4 w-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      )}

      {!hasNextPage && feeds.length > 0 && (
        <div className="pt-8 pb-4 font-mono text-xs text-muted">
          <span className="text-accent">EOF</span>
        </div>
      )}

      {feeds.length === 0 && <div className="py-8 font-mono text-xs text-muted">$ echo &quot;{t('noFeeds')}&quot;</div>}
    </div>
  )
}
