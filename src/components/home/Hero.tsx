'use client'

import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import type { Profile } from '@/payload-types'

export interface HeroProps {
  profile: Profile
}

export function Hero({ profile }: HeroProps) {
  const t = useTranslations('pages.Home.hero')
  const [terminalLines, setTerminalLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [lineIndex, setLineIndex] = useState(0)

  const terminalSequence = [
    { type: 'input', text: 'claude profile --verbose' },
    { type: 'output', text: 'Initializing profile compilation...' },
    { type: 'output', text: 'Status: 100% operational' },
    { type: 'output', text: 'Focus: Full-Stack Engineering & AI Systems' },
  ]

  // Typing effect for the mockup terminal
  useEffect(() => {
    if (lineIndex >= terminalSequence.length) return

    const item = terminalSequence[lineIndex]
    if (item.type === 'input') {
      let charIndex = 0
      const interval = setInterval(() => {
        if (charIndex < item.text.length) {
          const nextChar = item.text[charIndex]
          setCurrentLine((prev) => prev + nextChar)
          charIndex++
        } else {
          clearInterval(interval)
          setTerminalLines((prev) => [...prev, `~$ ${item.text}`])
          setCurrentLine('')
          setLineIndex((prev) => prev + 1)
        }
      }, 60)
      return () => clearInterval(interval)
    } else {
      const timeout = setTimeout(() => {
        setTerminalLines((prev) => [...prev, item.text])
        setLineIndex((prev) => prev + 1)
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [lineIndex])

  // Role typing effect
  const rolesList = useMemo(() => {
    return (
      profile.roles?.map((r) => r.role) || [
        'Backend Engineer',
        'AI Engineer',
        'Full-Stack Developer',
        'AI Solutions Architect',
      ]
    )
  }, [profile.roles])

  const [roleIdx, setRoleIdx] = useState(0)
  const [typedRole, setTypedRole] = useState('')
  const [isDeletingRole, setIsDeletingRole] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    const currentWord = rolesList[roleIdx]

    if (isDeletingRole) {
      timer = setTimeout(() => {
        setTypedRole((prev) => prev.slice(0, -1))
      }, 45)
    } else {
      timer = setTimeout(() => {
        setTypedRole((prev) => currentWord.slice(0, prev.length + 1))
      }, 85)
    }

    if (!isDeletingRole && typedRole === currentWord) {
      timer = setTimeout(() => setIsDeletingRole(true), 1500)
    } else if (isDeletingRole && typedRole === '') {
      setIsDeletingRole(false)
      setRoleIdx((prev) => (prev + 1) % rolesList.length)
    }

    return () => clearTimeout(timer)
  }, [typedRole, isDeletingRole, roleIdx, rolesList])

  return (
    <section className="relative mx-auto max-w-6xl px-6 py-12 md:py-24 min-h-[calc(100vh-4rem)] flex items-center">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-12 w-full items-center">
        {/* Left Column: Heading, Subtitle, CTA */}
        <div className="md:col-span-7 flex flex-col items-start text-left animate-fade-in-up">
          <h1 className="font-sans text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl leading-[1.1]">
            {t.rich('greeting', {
              name: profile.name,
              nameTag: (chunks) => (
                <span className="bg-gradient-to-r from-accent to-violet-400 bg-clip-text text-transparent">
                  {chunks}
                </span>
              ),
            })}
          </h1>

          <p className="mt-4 font-mono text-base font-semibold text-accent sm:text-lg min-h-[28px] flex items-center">
            <span>{typedRole}</span>
            <span className="inline-block w-[2px] h-[15px] bg-accent ml-1 animate-pulse"></span>
          </p>

          <p className="mt-6 text-sm sm:text-base text-muted leading-relaxed max-w-lg">
            {profile.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/projects"
              className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent/90 hover:shadow-lg hover:shadow-accent/20"
            >
              {t('viewProjects')}
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-border bg-surface/30 backdrop-blur-sm px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {t('getInTouch')}
            </Link>
          </div>
        </div>

        {/* Right Column: Terminal Window Mockup */}
        <div className="md:col-span-5 w-full flex justify-center animate-fade-in-up">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface/40 backdrop-blur-md shadow-2xl p-4 font-mono text-xs text-muted flex flex-col gap-3">
            {/* macOS window buttons */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#FF5F56] inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-[#FFBD2E] inline-block"></span>
                <span className="h-3 w-3 rounded-full bg-[#27C93F] inline-block"></span>
              </div>
              <span className="text-[10px] text-muted/60 font-mono tracking-tight select-none">profile.sh</span>
              <div className="w-12"></div> {/* Spacer for symmetry */}
            </div>

            {/* Terminal lines */}
            <div className="flex-1 min-h-[220px] font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 pt-2">
              {terminalLines.map((line, idx) => (
                <div key={idx} className={line.startsWith('~$') ? 'text-ink' : 'text-muted'}>
                  {line}
                </div>
              ))}

              {/* Active line with typing cursor */}
              {lineIndex < terminalSequence.length && terminalSequence[lineIndex].type === 'input' && (
                <div className="text-ink">
                  ~$ {currentLine}
                  <span className="inline-block w-[6px] h-3 bg-accent ml-0.5 animate-pulse"></span>
                </div>
              )}

              {/* Ending prompt cursor */}
              {lineIndex >= terminalSequence.length && (
                <div className="text-ink flex items-center gap-0.5">
                  <span>~$</span>
                  <span className="inline-block w-[6px] h-3 bg-accent animate-pulse"></span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
