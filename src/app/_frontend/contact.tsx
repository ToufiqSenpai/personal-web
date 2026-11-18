import * as stylex from '@stylexjs/stylex'
import { createFileRoute } from '@tanstack/react-router'
import { ContactForm } from '@/components/contact/ContactForm'
import { ContactHeader } from '@/components/contact/ContactHeader'
import { ContactInfo } from '@/components/contact/ContactInfo'
import { buildHead } from '@/lib/seo'
import { m } from '@/paraglide/messages'

const styles = stylex.create({
  section: {
    paddingInline: '1.5rem',
    paddingBottom: '5rem',
  },
  grid: {
    display: 'grid',
    gap: '2rem',
    marginInline: 'auto',
    maxWidth: '72rem',
    gridTemplateColumns: {
      default: '1fr',
      '@media (min-width: 1024px)': '2fr 1fr',
    },
  },
})

export const Route = createFileRoute('/_frontend/contact')({
  head: () =>
    buildHead({
      title: m.pages_contact_meta_title(),
      description: m.pages_contact_meta_description(),
      path: '/contact',
    }),
  component: ContactPage,
})

function ContactPage() {
  const { profile } = Route.useRouteContext()

  return (
    <>
      <ContactHeader />
      <section {...stylex.props(styles.section)}>
        <div {...stylex.props(styles.grid)}>
          <ContactForm />
          <ContactInfo profile={profile} />
        </div>
      </section>
    </>
  )
}
