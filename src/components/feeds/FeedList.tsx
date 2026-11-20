'use client'

import * as stylex from '@stylexjs/stylex'
import { useCallback, useEffect, useRef, useState } from 'react'
import { FeedCard } from '@/components/feeds/FeedCard'
import { getMoreFeedsFn } from '@/data/queries'
import type { Feed } from '@/payload-types'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  list: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    marginLeft: { default: 0, '@media (min-width: 640px)': '0.75rem' },
    paddingBlock: '1rem',
    paddingLeft: { default: 0, '@media (min-width: 640px)': '1.5rem' },
    borderLeftWidth: { default: 0, '@media (min-width: 640px)': 1 },
    borderLeftStyle: 'solid',
    borderLeftColor: 'var(--color-border)',
  },
  sentinel: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '5rem',
  },
  spinner: {
    width: '1rem',
    height: '1rem',
    borderRadius: '9999px',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'var(--color-accent)',
    borderTopColor: 'transparent',
    animationName: 'spin',
    animationDuration: '1s',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
  },
  eof: {
    paddingTop: '2rem',
    paddingBottom: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
  },
  eofMark: {
    color: 'var(--color-accent)',
  },
  empty: {
    paddingBlock: '2rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
  },
})

interface FeedListProps {
  readonly initialFeeds: Feed[]
  readonly initialHasNextPage: boolean
  readonly initialNextPage: number
}

export function FeedList({ initialFeeds, initialHasNextPage, initialNextPage }: FeedListProps) {
  const [feeds, setFeeds] = useState(initialFeeds)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [nextPage, setNextPage] = useState(initialNextPage)
  const [isLoading, setIsLoading] = useState(false)
  const isLoadingRef = useRef(false)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingRef.current) return
    isLoadingRef.current = true
    setIsLoading(true)

    try {
      const result = await getMoreFeedsFn({ data: nextPage })
      setFeeds((prev) => [...prev, ...result.docs])
      setHasNextPage(result.hasNextPage)
      setNextPage(result.nextPage ?? nextPage)
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
        if (entries[0]?.isIntersecting) void loadMore()
      },
      { threshold: 0.1, rootMargin: '100px' },
    )

    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [loadMore, isLoading])

  return (
    <div {...stylex.props(styles.list)}>
      {feeds.map((feed) => (
        <FeedCard key={feed.id} feed={feed} />
      ))}

      {hasNextPage && (
        <div ref={observerTarget} {...stylex.props(styles.sentinel)}>
          <div {...stylex.props(styles.spinner)} />
        </div>
      )}

      {!hasNextPage && feeds.length > 0 && (
        <div {...stylex.props(styles.eof)}>
          <span {...stylex.props(styles.eofMark)}>EOF</span>
        </div>
      )}

      {feeds.length === 0 && <div {...stylex.props(styles.empty)}>$ echo &quot;{m.pages_feeds_no_feeds()}&quot;</div>}
    </div>
  )
}
