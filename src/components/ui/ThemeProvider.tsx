'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ComponentProps } from 'react'
import { clientEnv } from '@/configs/client-env'

// Filter out the React 19 script tag warning which is a false positive for next-themes
if (typeof window !== 'undefined' && clientEnv.NODE_ENV === 'development') {
  const origError = console.error
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('Encountered a script tag')) {
      return
    }
    origError.apply(console, args)
  }
}

export function ThemeProvider({ children, ...props }: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
