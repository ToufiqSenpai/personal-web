import { Suspense, type ReactNode } from 'react'

// Payload's auto-generated admin page accesses uncached data; this Suspense
// boundary satisfies the cacheComponents requirement without editing generated files.
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <Suspense>{children}</Suspense>
}
