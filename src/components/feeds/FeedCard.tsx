import { useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import type { Feed } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'

function EmbedBlock({ html }: { html: string }) {
  const [sanitizedHtml, setSanitizedHtml] = useState('')

  useEffect(() => {
    let active = true
    import('isomorphic-dompurify').then((mod) => {
      if (!active) return
      const DOMPurify = mod.default
      setSanitizedHtml(
        DOMPurify.sanitize(html || '', {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
        }),
      )
    })
    return () => {
      active = false
    }
  }, [html])

  return <div className="my-4 overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
}

export function FeedCard({ feed }: { feed: Feed }) {
  const locale = useLocale()
  const date = new Date(feed.createdAt)
  const formattedDate = new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date)

  return (
    <div className="group relative">
      {/* Timeline Node */}
      <div className="hidden sm:block absolute -left-7.75 mt-1.5 h-3 w-3 rounded-full border-2 border-canvas bg-muted transition-colors group-hover:bg-accent" />

      <article className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent/50">
        <header className="mb-3 flex flex-wrap items-center justify-between gap-4">
          {feed.title && <h2 className="text-lg font-semibold text-ink w-full sm:w-auto">{feed.title}</h2>}
          <time className="font-mono text-xs text-muted ml-auto" dateTime={feed.createdAt}>
            {formattedDate}
          </time>
        </header>

        {feed.media && typeof feed.media === 'object' && feed.media.url && (
          <div className="mb-4 overflow-hidden rounded-xl border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={feed.media.url} alt={feed.media.alt || ''} className="w-full object-cover" loading="lazy" />
          </div>
        )}
        <div className="prose prose-sm dark:prose-invert max-w-none text-muted">
          <RichText
            data={feed.body}
            converters={({ defaultConverters }) => ({
              ...defaultConverters,
              blocks: {
                ...defaultConverters?.blocks,
                embed: ({
                  node,
                }: {
                  node: {
                    fields: {
                      html: string
                    }
                  }
                }) => <EmbedBlock html={node?.fields?.html || ''} />,
              },
            })}
          />
        </div>
      </article>
    </div>
  )
}
