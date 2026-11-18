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

// Only prevents a flash of the wrong scheme: apply the stored override to the
// meta before first paint. CSS maps the meta back to `color-scheme`, so no
// classes or inline styles are written here and the page works without JS.
const themeScript = `
try {
  var stored = localStorage.getItem('color-scheme')
  if (stored === 'light' || stored === 'dark') {
    document.querySelector('meta[name="color-scheme"]').content = stored
  }
} catch (error) {}
`

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" suppressHydrationWarning />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body>
        {children}
        {/* StyleX dev HMR: TanStack Start's custom document bypasses Vite's
            `transformIndexHtml`, so the plugin's runtime is injected here instead. */}
        {import.meta.env.DEV && <script type="module" src="/@id/virtual:stylex:runtime" />}
        <Scripts />
      </body>
    </html>
  )
}
