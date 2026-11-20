'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export function Reveal({
  children,
  delay = 0,
  className = '',
  ...props
}: {
  readonly children: ReactNode
  readonly delay?: number
  readonly className?: string
  readonly [key: string]: unknown
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const visibilityClass = isVisible ? ' is-visible' : ''
  const extraClass = className ? ` ${className}` : ''

  return (
    <div
      ref={ref}
      className={`reveal${visibilityClass}${extraClass}`}
      {...props}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
