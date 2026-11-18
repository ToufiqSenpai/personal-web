import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/_frontend/$')({
  loader: () => {
    throw notFound()
  },
})
