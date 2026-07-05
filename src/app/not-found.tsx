import { redirect } from 'next/navigation'

export default function RootNotFound() {
  // Redirect non-localized root mismatches back to localized homepage
  redirect('/')
}
