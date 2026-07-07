import Link from 'next/link'
import { Reveal } from '@/components/ui/Reveal'
import { useTranslations } from 'next-intl'

export interface Article {
  slug: string
  category: string
  publishedAt: string
  title: string
  excerpt: string
}

export interface FeaturedArticlesProps {
  articles?: Article[]
}

export function FeaturedArticles({ articles = [] }: FeaturedArticlesProps) {
  const t = useTranslations('pages.Home.featuredArticles')

  if (!articles || articles.length === 0) return null

  return (
    <section className="px-6 py-20 bg-canvas">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
            {t('eyebrow')}
          </p>
          <h2 className="mb-12 text-2xl font-bold text-ink sm:text-3xl">
            {t('title')}
          </h2>
        </Reveal>

        <div className="flex flex-col gap-10">
          
          {/* Article 1: LLM Lessons (Horizontal: Left Mockup, Right Details) */}
          {articles[0] && (
            <Reveal key={articles[0].slug} delay={100}>
              <Link
                href={`/articles/${articles[0].slug}`}
                className="group flex flex-col md:flex-row w-full overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/5"
              >
                {/* Visual Mockup - Chat UI */}
                <div className="relative md:w-1/2 min-h-[220px] bg-canvas/60 border-b md:border-b-0 md:border-r border-border p-4 flex flex-col justify-between gap-3 font-mono text-[10px] select-none">
                  {/* macOS dots */}
                  <div className="flex items-center gap-1.5 border-b border-border/60 pb-2">
                    <span className="h-2 w-2 rounded-full bg-[#FF5F56]"></span>
                    <span className="h-2 w-2 rounded-full bg-[#FFBD2E]"></span>
                    <span className="h-2 w-2 rounded-full bg-[#27C93F]"></span>
                    <span className="ml-2 text-[9px] text-muted/65">llm_cost_efficiency.py</span>
                  </div>

                  {/* Chat bubbles mockup */}
                  <div className="flex-1 flex flex-col gap-3 justify-center">
                    <div className="self-end max-w-[80%] rounded-lg bg-accent/10 border border-accent/20 px-2.5 py-1.5 text-ink text-[9px]">
                      <span className="text-[8px] text-accent/80 block mb-0.5 font-bold">USER</span>
                      How to scale LLM apps efficiently?
                    </div>
                    <div className="self-start max-w-[85%] rounded-lg bg-surface border border-border px-2.5 py-1.5 text-muted text-[9px]">
                      <span className="text-[8px] text-emerald-500 block mb-0.5 font-bold">ASSISTANT</span>
                      1. Implement semantic prompt caching.<br />
                      2. Route simple tasks to smaller models.
                    </div>
                  </div>

                  <div className="text-[8px] text-muted/50 text-right font-mono">
                    tokens saved: <span className="text-emerald-500 font-bold">42.8%</span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-accent bg-accent-soft rounded border border-accent/15 uppercase">
                        {articles[0].category}
                      </span>
                      <time className="font-mono text-xs text-muted">
                        {new Date(articles[0].publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-ink transition-colors group-hover:text-accent">
                      {articles[0].title}
                    </h3>
                    <p className="mb-4 text-sm text-muted leading-relaxed">
                      {articles[0].excerpt}
                    </p>
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
          )}

          {/* Article 2: React Server Components (Horizontal: Left Details, Right Mockup) */}
          {articles[1] && (
            <Reveal key={articles[1].slug} delay={200}>
              <Link
                href={`/articles/${articles[1].slug}`}
                className="group flex flex-col md:flex-row-reverse w-full overflow-hidden rounded-xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-accent/5"
              >
                {/* Visual Mockup - RSC Node Tree */}
                <div className="relative md:w-1/2 min-h-[220px] bg-canvas/60 border-b md:border-b-0 md:border-l border-border p-4 flex flex-col gap-3 font-mono text-[10px] select-none justify-center overflow-hidden">
                  <div className="absolute top-4 left-4 text-[8px] text-muted/65 uppercase tracking-wider font-mono">
                    React 19 Rendering
                  </div>

                  <div className="space-y-4">
                    {/* Server Component Node */}
                    <div className="relative w-2/3 mx-auto border border-accent/20 bg-accent/5 p-2 rounded-lg text-center shadow-sm">
                      <span className="text-accent font-semibold block text-[9px]">Server Component (SSR)</span>
                      <span className="text-[7px] text-muted/80">Fetches database directly</span>
                    </div>

                    {/* Arrow indicator */}
                    <div className="flex justify-center text-accent/50 animate-pulse text-[12px]">↓</div>

                    {/* Client Component Node */}
                    <div className="relative w-2/3 mx-auto border border-border bg-surface/80 p-2 rounded-lg text-center shadow-sm">
                      <span className="text-ink font-semibold block text-[9px]">Client Component (Hydration)</span>
                      <span className="text-[7px] text-muted/80">Interactive user elements</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/25 rounded px-2 py-0.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[7px] text-emerald-500 uppercase tracking-widest font-bold font-mono">HTML Streamed</span>
                  </div>
                </div>

                {/* Meta details */}
                <div className="p-6 md:w-1/2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-block px-2 py-0.5 font-mono text-[10px] font-medium tracking-wide text-accent bg-accent-soft rounded border border-accent/15 uppercase">
                        {articles[1].category}
                      </span>
                      <time className="font-mono text-xs text-muted">
                        {new Date(articles[1].publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-ink transition-colors group-hover:text-accent">
                      {articles[1].title}
                    </h3>
                    <p className="mb-4 text-sm text-muted leading-relaxed">
                      {articles[1].excerpt}
                    </p>
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
          )}

        </div>
      </div>
    </section>
  )
}
