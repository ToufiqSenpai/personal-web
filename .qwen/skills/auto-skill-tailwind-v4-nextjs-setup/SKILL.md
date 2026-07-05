---
name: tailwind-v4-nextjs-setup
description: How to set up Tailwind CSS v4 with CSS-first config, class-based dark mode via next-themes, and Geist fonts in a Next.js App Router project
source: auto-skill
extracted_at: '2026-07-03T07:39:10.867Z'
---

# Tailwind CSS v4 + Next.js Setup

Tailwind v4 abandons `tailwind.config.js` in favor of CSS-first configuration. The setup differs substantially from v3. This pattern was verified working with Next.js 16 (App Router, Turbopack) and a successful production build.

## Packages

```bash
npm install -D tailwindcss @tailwindcss/postcss geist
npm install next-themes
```

- `@tailwindcss/postcss` replaces the old `tailwindcss` PostCSS plugin
- `geist` provides `GeistSans` and `GeistMono` font wrappers (Next.js font objects)

## 1. PostCSS config (`postcss.config.mjs`)

```js
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
export default config
```

No `tailwind.config.js` or `tailwind.config.ts` needed — v4 reads config from CSS.

## 2. CSS entry file (e.g. `src/app/(frontend)/styles.css`)

```css
@import 'tailwindcss';

/* Class-based dark mode — replaces v3's `darkMode: 'class'` */
@custom-variant dark (&:where(.dark, .dark *));

/* Design tokens — replaces tailwind.config.js theme.extend */
@theme {
  --font-sans: 'Geist Sans', system-ui, sans-serif;
  --font-mono: 'Geist Mono', monospace;

  --color-canvas: #fafafa;
  --color-surface: #ffffff;
  --color-ink: #18181b;
  --color-muted: #71717a;
  --color-accent: #7c3aed;
  --color-accent-soft: #ede9fe;
  --color-border: #e4e4e7;
}

/* Dark mode token overrides — swap values under .dark class */
.dark {
  --color-canvas: #09090b;
  --color-surface: #18181b;
  --color-ink: #fafafa;
  --color-muted: #a1a1aa;
  --color-accent: #8b5cf6;
  --color-accent-soft: #1e1b30;
  --color-border: #27272a;
}
```

Key points:
- `@import 'tailwindcss'` replaces the v3 `@tailwind base; @tailwind components; @tailwind utilities;` directives
- `@theme {}` defines design tokens as CSS custom properties — Tailwind auto-generates utilities like `bg-canvas`, `text-ink`, `border-border` from `--color-*` names
- Dark mode works by re-declaring the same CSS variables under `.dark {}` — no separate dark: variant needed for theme tokens, since utilities reference the variables
- `@custom-variant dark` enables `dark:` variant for cases where you do need conditional styling

## 3. Layout with Geist fonts + next-themes (`layout.tsx`)

```tsx
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from '@/components/ui/ThemeProvider'
import './styles.css'

export const metadata = {
  title: 'Site Title',
  description: 'Site description',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- `suppressHydrationWarning` on `<html>` is required — next-themes modifies the class attribute before React hydrates
- `GeistSans.variable` / `GeistMono.variable` set CSS variables like `--font-geist-sans` that `@theme` maps to `--font-sans`

## 4. ThemeProvider wrapper (`src/components/ui/ThemeProvider.tsx`)

```tsx
'use client'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

Must be a `'use client'` component — next-themes uses React context.

## 5. Theme toggle (`src/components/ui/ThemeToggle.tsx`)

```tsx
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-9 w-9" />  // avoid hydration mismatch
  // ...render sun/moon button
}
```

The `mounted` guard is essential — `useTheme()` returns undefined on server render, causing hydration mismatches without it.

## Gotchas

- **No `tailwind.config.js`**: v4 is CSS-first. Don't create one unless you need `content` paths (v4 auto-detects).
- **Route group isolation**: If using Next.js route groups like `(frontend)` and `(payload)`, the CSS import in the frontend layout keeps Tailwind scoped to frontend only — Payload admin stays unstyled by Tailwind.
- **`@custom-variant` syntax**: Must be `(&:where(.dark, .dark *))` — the `:where()` keeps specificity at 0 so it doesn't override your utilities.
- **Token naming**: `--color-canvas` generates `bg-canvas`, `text-canvas`, `border-canvas`, etc. The `--color-` prefix is required for Tailwind to recognize it as a color utility.
