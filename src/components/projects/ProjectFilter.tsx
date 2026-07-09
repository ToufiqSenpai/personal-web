'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition } from 'react'

interface ProjectFilterProps {
  tags: string[]
  allLabel?: string
}

export function ProjectFilter({ tags, allLabel = 'All' }: ProjectFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentTag = searchParams.get('tech') || ''
  const [isPending, startTransition] = useTransition()

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (!tag) {
      params.delete('tech')
    } else {
      params.set('tech', tag)
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <div className={`flex flex-wrap gap-6 mb-16 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <button
        onClick={() => handleTagClick('')}
        className={`text-sm font-medium transition-all hover:text-ink relative ${
          !currentTag
            ? 'text-ink after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-ink'
            : 'text-muted'
        }`}
      >
        {allLabel}
      </button>

      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => handleTagClick(tag)}
          className={`text-sm font-medium transition-all hover:text-ink relative ${
            currentTag === tag
              ? 'text-ink after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-ink'
              : 'text-muted'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  )
}
