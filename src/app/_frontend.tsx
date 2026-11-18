import { Outlet, createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getProfileFn } from '@/data/queries'
import type { Profile } from '@/payload-types'
// StyleX rules are compiled per module and appended to this CSS asset by the plugin;
// importing it as a side effect makes TanStack Start manage (and link) the asset.
import './styles/stylex.css'
import globalCss from './styles/global.css?url'

// Vite dev serves a bare `?url` CSS import as a JS module, which a `<link
// rel="stylesheet">` cannot use. `?direct` makes dev serve real CSS; the production
// build already emits a hashed stylesheet asset.
const globalCssHref = import.meta.env.DEV ? `${globalCss}?direct` : globalCss

export const Route = createFileRoute('/_frontend')({
  beforeLoad: async () => ({ profile: await getProfileFn() }),
  // Frontend-only stylesheet: the admin panel must keep Payload's own CSS tokens.
  head: () => ({
    links: [
      // Vite dev has no build-time StyleX asset to link, so use the plugin's endpoint.
      ...(import.meta.env.DEV ? [{ rel: 'stylesheet', href: '/virtual:stylex.css' }] : []),
      { rel: 'stylesheet', href: globalCssHref },
    ],
  }),
  component: FrontendLayout,
})

function FrontendLayout() {
  const { profile } = Route.useRouteContext()

  // A freshly installed database returns an empty Profile document, but the generated
  // type marks every field as present. Every page below assumes authored content
  // (avatar, roles, …), so render a setup note instead of a 500.
  const configuredName = (profile as Partial<Profile> | null)?.name

  if (!configuredName) {
    return (
      <div
        style={{
          display: 'grid',
          gap: '0.75rem',
          margin: '4rem auto',
          maxWidth: '32rem',
          padding: '1.5rem',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Profile not set up yet</h1>
        <p style={{ margin: 0 }}>
          Sign in to <a href="/admin">/admin</a> and fill in the Profile global to start using the site.
        </p>
      </div>
    )
  }

  return (
    <>
      <Navbar name={configuredName} />
      <main>
        <Outlet />
      </main>
      <Footer profile={profile} />
    </>
  )
}
