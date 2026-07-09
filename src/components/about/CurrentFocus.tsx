import { Reveal } from '@/components/ui/Reveal'

interface CurrentFocusItem {
  title: string
  description: string
}

interface CurrentFocusProps {
  items?: CurrentFocusItem[]
}

export function CurrentFocus({ items = [] }: CurrentFocusProps) {
  if (!items.length) return null

  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">What I&apos;m Into Now</p>
          <h2 className="mb-8 text-2xl font-bold text-ink">Current focus</h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 100}>
              <div className="rounded-xl border border-border bg-surface p-6">
                <h3 className="mb-2 font-semibold text-ink">{item.title}</h3>
                <p className="text-sm text-muted">{item.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
