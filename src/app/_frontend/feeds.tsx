import * as stylex from '@stylexjs/stylex'
import { createFileRoute } from '@tanstack/react-router'
import { FeedList } from '@/components/feeds/FeedList'
import { Reveal } from '@/components/ui/Reveal'
import { getLatestFeedsFn } from '@/data/queries'
import { buildHead } from '@/lib/seo'
import type { Feed } from '@/payload-types'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  header: {
    paddingInline: '1.5rem',
    paddingTop: '5rem',
    paddingBottom: '2rem',
  },
  headerInner: {
    marginInline: 'auto',
    maxWidth: '42rem',
  },
  eyebrow: {
    marginBottom: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
  },
  title: {
    margin: 0,
    fontFamily: 'var(--font-mono)',
    fontSize: { default: '2.25rem', '@media (min-width: 640px)': '3rem' },
    fontWeight: 700,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
  },
  subtitle: {
    marginTop: '1rem',
    color: 'var(--color-muted)',
  },
  list: {
    paddingInline: '1.5rem',
    paddingBottom: '5rem',
  },
  listInner: {
    marginInline: 'auto',
    maxWidth: '42rem',
  },
})

export const Route = createFileRoute('/_frontend/feeds')({
  loader: () => getLatestFeedsFn(),
  head: () =>
    buildHead({
      title: m.pages_feeds_meta_title(),
      description: m.pages_feeds_meta_description(),
      path: '/feeds',
    }),
  component: FeedsPage,
})

function FeedsPage() {
  const { docs, hasNextPage, nextPage } = Route.useLoaderData() as {
    docs: Feed[]
    hasNextPage: boolean
    nextPage?: number | null
  }

  return (
    <>
      <section {...stylex.props(styles.header)}>
        <div {...stylex.props(styles.headerInner)}>
          <Reveal>
            <p {...stylex.props(styles.eyebrow)}>$ tail -f feeds.log</p>
            <h1 {...stylex.props(styles.title)}>{m.pages_feeds_title()}</h1>
            <p {...stylex.props(styles.subtitle)}>{m.pages_feeds_subtitle()}</p>
          </Reveal>
        </div>
      </section>

      <section {...stylex.props(styles.list)}>
        <div {...stylex.props(styles.listInner)}>
          <FeedList initialFeeds={docs} initialHasNextPage={hasNextPage} initialNextPage={nextPage ?? 2} />
        </div>
      </section>
    </>
  )
}
