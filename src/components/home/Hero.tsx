'use client'

import * as stylex from '@stylexjs/stylex'
import { Link } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import type { Profile } from '@/payload-types'
import { m } from '@/paraglide/messages'

const terminalSequence = [
  { type: 'input', text: 'claude profile --verbose' },
  { type: 'output', text: 'Initializing profile compilation...' },
  { type: 'output', text: 'Status: 100% operational' },
  { type: 'output', text: 'Focus: Full-Stack Engineering & AI Systems' },
] as const

type TerminalLine = { readonly id: number; readonly text: string }

const styles = stylex.create({
  section: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '72rem',
    minHeight: 'calc(100vh - 4rem)',
    marginInline: 'auto',
    paddingInline: '1.5rem',
    paddingBlock: { default: '3rem', '@media (min-width: 768px)': '6rem' },
  },
  grid: {
    display: 'grid',
    width: '100%',
    alignItems: 'center',
    gap: '3rem',
    gridTemplateColumns: { default: '1fr', '@media (min-width: 768px)': 'repeat(12, minmax(0, 1fr))' },
  },
  left: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gridColumn: { default: 'auto', '@media (min-width: 768px)': 'span 7' },
    animationName: 'fade-in-up',
    animationDuration: '0.6s',
    animationFillMode: 'both',
    animationTimingFunction: 'ease-out',
  },
  title: {
    margin: 0,
    fontSize: { default: '2.25rem', '@media (min-width: 640px)': '3rem', '@media (min-width: 768px)': '3.75rem' },
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-0.025em',
    color: 'var(--color-ink)',
  },
  name: {
    color: 'var(--color-accent)',
  },
  role: {
    display: 'flex',
    alignItems: 'center',
    minHeight: '28px',
    marginTop: '1rem',
    fontFamily: 'var(--font-mono)',
    fontSize: { default: '1rem', '@media (min-width: 640px)': '1.125rem' },
    fontWeight: 600,
    color: 'var(--color-accent)',
  },
  cursor: {
    display: 'inline-block',
    width: '2px',
    height: '15px',
    marginLeft: '0.25rem',
    backgroundColor: 'var(--color-accent)',
    animationName: 'pulse',
    animationDuration: '2s',
    animationIterationCount: 'infinite',
  },
  intro: {
    maxWidth: '32rem',
    marginTop: '1.5rem',
    marginBottom: 0,
    fontSize: { default: '0.875rem', '@media (min-width: 640px)': '1rem' },
    lineHeight: 1.625,
    color: 'var(--color-muted)',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
  },
  primary: {
    paddingInline: '1.5rem',
    paddingBlock: '0.625rem',
    borderRadius: '0.5rem',
    backgroundColor: 'var(--color-accent)',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecorationLine: 'none',
    transitionProperty: 'box-shadow, background-color',
    transitionDuration: '200ms',
    ':hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-accent) 90%, transparent)',
      boxShadow: '0 10px 15px -3px color-mix(in srgb, var(--color-accent) 20%, transparent)',
    },
  },
  secondary: {
    paddingInline: '1.5rem',
    paddingBlock: '0.625rem',
    borderRadius: '0.5rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'color-mix(in srgb, var(--color-surface) 30%, transparent)',
    color: 'var(--color-ink)',
    fontSize: '0.875rem',
    fontWeight: 500,
    textDecorationLine: 'none',
    transitionProperty: 'color, border-color',
    transitionDuration: '150ms',
    ':hover': {
      borderColor: 'var(--color-accent)',
      color: 'var(--color-accent)',
    },
  },
  terminalWrap: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    gridColumn: { default: 'auto', '@media (min-width: 768px)': 'span 5' },
    animationName: 'fade-in-up',
    animationDuration: '0.6s',
    animationFillMode: 'both',
    animationTimingFunction: 'ease-out',
  },
  terminal: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    width: '100%',
    maxWidth: '28rem',
    padding: '1rem',
    borderRadius: '0.75rem',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    backgroundColor: 'color-mix(in srgb, var(--color-surface) 40%, transparent)',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    color: 'var(--color-muted)',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },
  terminalBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomStyle: 'solid',
    borderBottomColor: 'color-mix(in srgb, var(--color-border) 50%, transparent)',
    paddingBottom: '0.75rem',
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  dot: {
    display: 'inline-block',
    width: '0.75rem',
    height: '0.75rem',
    borderRadius: '9999px',
  },
  dotRed: {
    backgroundColor: '#FF5F56',
  },
  dotYellow: {
    backgroundColor: '#FFBD2E',
  },
  dotGreen: {
    backgroundColor: '#27C93F',
  },
  terminalName: {
    fontSize: '0.625rem',
    letterSpacing: '-0.025em',
    color: 'color-mix(in srgb, var(--color-muted) 60%, transparent)',
    userSelect: 'none',
  },
  spacer: {
    width: '3rem',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.375rem',
    minHeight: '220px',
    paddingTop: '0.5rem',
    fontSize: '0.6875rem',
    lineHeight: 1.625,
  },
  lineInput: {
    color: 'var(--color-ink)',
  },
  prompt: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.125rem',
    color: 'var(--color-ink)',
  },
})

export function Hero({ profile }: { readonly profile: Profile }) {
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [lineIndex, setLineIndex] = useState(0)

  useEffect(() => {
    const item = terminalSequence.at(lineIndex)
    if (!item) return

    if (item.type === 'output') {
      const timeout = setTimeout(() => {
        setTerminalLines((prev) => [...prev, { id: lineIndex, text: item.text }])
        setLineIndex((prev) => prev + 1)
      }, 400)
      return () => clearTimeout(timeout)
    }

    let charIndex = 0
    const interval = setInterval(() => {
      if (charIndex < item.text.length) {
        setCurrentLine((prev) => prev + item.text[charIndex])
        charIndex++
        return
      }
      clearInterval(interval)
      setTerminalLines((prev) => [...prev, { id: lineIndex, text: `~$ ${item.text}` }])
      setCurrentLine('')
      setLineIndex((prev) => prev + 1)
    }, 60)
    return () => clearInterval(interval)
  }, [lineIndex])

  const roles = useMemo(() => {
    if (profile.roles.length > 0) return profile.roles.map((role) => role.role)
    // Keeps the typing effect alive before any role exists in the CMS.
    return ['Backend Engineer', 'AI Engineer', 'Full-Stack Developer']
  }, [profile.roles])
  const [roleIndex, setRoleIndex] = useState(0)
  const [typedRole, setTypedRole] = useState('')
  const [isDeletingRole, setIsDeletingRole] = useState(false)

  useEffect(() => {
    const currentWord = roles[roleIndex] ?? ''
    let timer: ReturnType<typeof setTimeout>

    if (isDeletingRole) {
      timer = setTimeout(() => setTypedRole((prev) => prev.slice(0, -1)), 45)
    } else {
      timer = setTimeout(() => setTypedRole(currentWord.slice(0, typedRole.length + 1)), 85)
    }

    if (!isDeletingRole && typedRole === currentWord) {
      timer = setTimeout(() => setIsDeletingRole(true), 1500)
    } else if (isDeletingRole && typedRole === '') {
      timer = setTimeout(() => {
        setIsDeletingRole(false)
        setRoleIndex((prev) => (prev + 1) % roles.length)
      }, 0)
    }

    return () => clearTimeout(timer)
  }, [typedRole, isDeletingRole, roleIndex, roles])

  const isTyping = terminalSequence[lineIndex]?.type === 'input'

  return (
    <section {...stylex.props(styles.section)}>
      <div {...stylex.props(styles.grid)}>
        <div {...stylex.props(styles.left)}>
          <h1 {...stylex.props(styles.title)}>{m.pages_home_hero_greeting({ name: profile.name })}</h1>

          <p {...stylex.props(styles.role)}>
            <span>{typedRole}</span>
            <span {...stylex.props(styles.cursor)} />
          </p>

          <p {...stylex.props(styles.intro)}>{profile.intro}</p>

          <div {...stylex.props(styles.actions)}>
            <Link to="/projects" {...stylex.props(styles.primary)}>
              {m.pages_home_hero_view_projects()}
            </Link>
            <Link to="/contact" {...stylex.props(styles.secondary)}>
              {m.pages_home_hero_get_in_touch()}
            </Link>
          </div>
        </div>

        <div {...stylex.props(styles.terminalWrap)}>
          <div {...stylex.props(styles.terminal)}>
            <div {...stylex.props(styles.terminalBar)}>
              <div {...stylex.props(styles.dots)}>
                <span {...stylex.props(styles.dot, styles.dotRed)} />
                <span {...stylex.props(styles.dot, styles.dotYellow)} />
                <span {...stylex.props(styles.dot, styles.dotGreen)} />
              </div>
              <span {...stylex.props(styles.terminalName)}>profile.sh</span>
              <div {...stylex.props(styles.spacer)} />
            </div>

            <div {...stylex.props(styles.lines)}>
              {terminalLines.map((line) => (
                <div key={line.id} {...stylex.props(line.text.startsWith('~$') && styles.lineInput)}>
                  {line.text}
                </div>
              ))}

              {isTyping && (
                <div {...stylex.props(styles.lineInput)}>
                  ~$ {currentLine}
                  <span {...stylex.props(styles.cursor)} />
                </div>
              )}

              {lineIndex >= terminalSequence.length && (
                <div {...stylex.props(styles.prompt)}>
                  <span>~$</span>
                  <span {...stylex.props(styles.cursor)} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
