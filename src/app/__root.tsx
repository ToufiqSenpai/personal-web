import { withPayloadRoot } from '@payloadcms/tanstack-start/client'
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { getLocale } from '@/paraglide/runtime'
import { ErrorPage } from '@/components/ui/ErrorPage'
import { NotFoundPage } from '@/components/ui/NotFoundPage'

export const Route = createRootRoute({
  shellComponent: withPayloadRoot(RootDocument),
  errorComponent: ErrorPage,
  notFoundComponent: NotFoundPage,
})

// Runs before first paint so the stored theme never flashes.
const themeScript = `
try {
  var stored = localStorage.getItem('theme')
  var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
} catch (error) {}
`

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
