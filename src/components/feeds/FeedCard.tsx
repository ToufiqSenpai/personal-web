import * as stylex from '@stylexjs/stylex'
import { RichText, type JSXConvertersFunction } from '@payloadcms/richtext-lexical/react'
import { useEffect, useState } from 'react'
import type { Feed } from '@/payload-types'
import { getLocale } from '@/paraglide/runtime'

const styles = stylex.create({
  wrapper: {
    position: 'relative',
  },
  node: {
    display: 'none',
    '@media (min-width: 640px)': {
      display: 'block',
      position: 'absolute',
      top: '0.375rem',
      left: '-2.25rem',
      width: '0.75rem',
      height: '0.75rem',
      borderRadius: '9999px',
      borderWidth: 2,
      borderStyle: 'solid',
      borderColor: 'var(--color-canvas)',
      backgroundColor: 'var(--color-muted)',
    },
  },
  article: {
    padding: '1.5rem',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    transitionProperty: 'border-color',
    transitionDuration: '150ms',
    ':hover': {
      borderColor: 'color-mix(in srgb, var(--color-accent) 50%, transparent)',
    },
  },
  header: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    marginBottom: '0.75rem',
  },
  title: {
    width: { default: '100%', '@media (min-width: 640px)': 'auto' },
    margin: 0,
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--color-ink)',
  },
  time: {
    marginLeft: 'auto',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
  },
  media: {
    marginBottom: '1rem',
    overflow: 'hidden',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
  },
  image: {
    width: '100%',
    objectFit: 'cover',
  },
  embed: {
    marginBlock: '1rem',
    overflow: 'hidden',
    borderRadius: '0.75rem',
  },
})

// The block converter is typed loosely because Payload's serialized block nodes are not generic.
const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  blocks: {
    ...defaultConverters.blocks,
    embed: ({ node }) => <EmbedBlock html={(node as unknown as { fields: { html: string } }).fields.html} />,
  },
})

function EmbedBlock({ html }: { html: string }) {
  const [sanitized, setSanitized] = useState('')

  useEffect(() => {
    let active = true
    void import('isomorphic-dompurify').then((module) => {
      if (!active) return
      setSanitized(
        module.default.sanitize(html, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
        }),
      )
    })

    return () => {
      active = false
    }
  }, [html])

  return <div {...stylex.props(styles.embed)} dangerouslySetInnerHTML={{ __html: sanitized }} />
}

export function FeedCard({ feed }: { feed: Feed }) {
  const formattedDate = new Intl.DateTimeFormat(getLocale(), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(new Date(feed.createdAt))

  return (
    <div {...stylex.props(styles.wrapper)}>
      <div {...stylex.props(styles.node)} />

      <article {...stylex.props(styles.article)}>
        <header {...stylex.props(styles.header)}>
          {feed.title && <h2 {...stylex.props(styles.title)}>{feed.title}</h2>}
          <time dateTime={feed.createdAt} {...stylex.props(styles.time)}>
            {formattedDate}
          </time>
        </header>

        {typeof feed.media === 'object' && feed.media?.url && (
          <div {...stylex.props(styles.media)}>
            <img src={feed.media.url} alt={feed.media.alt} loading="lazy" {...stylex.props(styles.image)} />
          </div>
        )}

        <div className="prose">
          <RichText data={feed.body} converters={converters} />
        </div>
      </article>
    </div>
  )
}
