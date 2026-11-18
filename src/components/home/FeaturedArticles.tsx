import * as stylex from '@stylexjs/stylex'
import { Reveal } from '@/components/ui/Reveal'
import { shared } from '@/components/ui/styles'
import type { Article, Media } from '@/payload-types'
import { m } from '@/paraglide/messages'
import { localizeHref } from '@/paraglide/runtime'

const styles = stylex.create({
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  card: {
    display: 'flex',
    flexDirection: { default: 'column', '@media (min-width: 768px)': 'row' },
    width: '100%',
    overflow: 'hidden',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'var(--color-surface)',
    textDecorationLine: 'none',
    transitionProperty: 'transform, border-color, box-shadow',
    transitionDuration: '300ms',
    ':hover': {
      transform: 'translateY(-0.25rem)',
      borderColor: 'var(--color-accent)',
      boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--color-accent) 5%, transparent)',
    },
  },
  cardReversed: {
    flexDirection: { default: 'column', '@media (min-width: 768px)': 'row-reverse' },
  },
  visual: {
    position: 'relative',
    minHeight: '220px',
    overflow: 'hidden',
    backgroundColor: 'color-mix(in srgb, var(--color-canvas) 30%, transparent)',
    '@media (min-width: 768px)': {
      width: '50%',
    },
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transitionProperty: 'transform',
    transitionDuration: '500ms',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '1.5rem',
    '@media (min-width: 768px)': {
      width: '50%',
    },
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  category: {
    display: 'inline-block',
    paddingInline: '0.5rem',
    paddingBlock: '0.125rem',
    borderRadius: '0.25rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'color-mix(in srgb, var(--color-accent) 15%, transparent)',
    backgroundColor: 'var(--color-accent-soft)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.625rem',
    fontWeight: 500,
    letterSpacing: '0.025em',
    textTransform: 'uppercase',
    color: 'var(--color-accent)',
  },
  date: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
  },
  articleTitle: {
    marginTop: 0,
    marginRight: 0,
    marginLeft: 0,
    marginBottom: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 700,
    color: 'var(--color-ink)',
  },
  excerpt: {
    marginTop: 0,
    marginBottom: '1rem',
    fontSize: '0.875rem',
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
  readMore: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.375rem',
    marginTop: '1rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--color-accent)',
  },
})

function formatDate(value?: string | null) {
  if (!value) return ''
  return new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function categoryTitle(article: Article) {
  const first = article.categories?.[0]
  return first && typeof first === 'object' ? first.title : ''
}

export function FeaturedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null

  return (
    <section {...stylex.props(shared.section)}>
      <div {...stylex.props(shared.container)}>
        <Reveal>
          <p {...stylex.props(shared.eyebrow)}>{m.pages_home_featured_articles_eyebrow()}</p>
          <h2 {...stylex.props(shared.sectionTitle)}>{m.pages_home_featured_articles_title()}</h2>
        </Reveal>

        <div {...stylex.props(styles.list)}>
          {articles.slice(0, 3).map((article, index) => {
            const image = article.mainImage as Media
            const category = categoryTitle(article)

            return (
              <Reveal key={article.slug} delay={(index + 1) * 100}>
                <a
                  href={localizeHref(`/articles/${article.slug}`)}
                  {...stylex.props(styles.card, index % 2 === 1 && styles.cardReversed)}
                >
                  <div {...stylex.props(styles.visual)}>
                    {image.url && <img src={image.url} alt={image.alt} {...stylex.props(styles.image)} />}
                  </div>

                  <div {...stylex.props(styles.body)}>
                    <div>
                      <div {...stylex.props(styles.meta)}>
                        {category && <span {...stylex.props(styles.category)}>{category}</span>}
                        <time {...stylex.props(styles.date)}>{formatDate(article.publishedAt)}</time>
                      </div>
                      <h3 {...stylex.props(styles.articleTitle)}>{article.title}</h3>
                      {article.excerpt && <p {...stylex.props(styles.excerpt)}>{article.excerpt}</p>}
                    </div>

                    <span {...stylex.props(styles.readMore)}>
                      {m.pages_home_featured_articles_read_more()}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
