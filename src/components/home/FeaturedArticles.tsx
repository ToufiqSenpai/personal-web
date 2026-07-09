import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import type { Article, ArticleCategory } from '@/payload-types'

function ArticleVisual({ article, index }: { article: Article; index: number }) {
  const isReversed = index % 2 === 1
  const borderClasses = isReversed
    ? 'border-b md:border-b-0 md:border-l border-border'
    : 'border-b md:border-b-0 md:border-r border-border'

  const image = {
    url: typeof article.mainImage === 'string' ? article.mainImage : (article.mainImage?.url ?? undefined),
    alt: typeof article.mainImage === 'object' ? article.mainImage?.alt : article.title,
  }

  return (
    <div className={`relative md:w-1/2 min-h-[220px] overflow-hidden ${borderClasses} bg-canvas/30`}>
      <img
        src={image.url}
        alt={image.alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  )
}

export interface FeaturedArticlesProps {
  articles: Article[]
}

export function FeaturedArticles({ articles }: FeaturedArticlesProps) {
  const t = useTranslations('pages.Home.featuredArticles')

  if (!articles || articles.length === 0) return null

  const getCategoryTitle = (article: Article) => {
    if (!article.categories || article.categories.length === 0) return ''
    const firstCategory = article.categories[0]
    if (typeof firstCategory === 'object') {
      return (firstCategory as ArticleCategory).title
    }
    return ''
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return ''
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return ''
    }
  }

  return (
    <section className="px-6 py-20 bg-canvas">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{t('eyebrow')}</p>
          <h2 className="mb-12 text-2xl font-bold text-ink sm:text-3xl">{t('title')}</h2>
        </Reveal>

        <div className="flex flex-col gap-10">
          {articles.slice(0, 3).map((article, index) => {
            const isReversed = index % 2 === 1
            const categoryTitle = getCategoryTitle(article)

            return (
              <Reveal key={article.slug} delay={(index + 1) * 100}>
                <Link
                  href={`/articles/${article.slug}`}
                  className={`group flex w-full overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/5 ${
                    isReversed ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'
                  }`}
                >
                  <ArticleVisual article={article} index={index} />

                  {/* Meta details */}
                  <div className="p-6 md:w-1/2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        {categoryTitle && (
                          <span className="inline-block px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-accent bg-accent-soft rounded border border-accent/15 uppercase">
                            {categoryTitle}
                          </span>
                        )}
                        <time className="font-mono text-xs text-muted">{formatDate(article.publishedAt)}</time>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-ink transition-colors group-hover:text-accent">
                        {article.title}
                      </h3>
                      {article.excerpt && <p className="mb-4 text-sm text-muted leading-relaxed">{article.excerpt}</p>}
                    </div>

                    {/* Read indicator */}
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:text-accent/80 transition-colors mt-4">
                      <span>{t('readMore')}</span>
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
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
