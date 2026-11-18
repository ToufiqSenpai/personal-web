import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'
import { paraglideMiddleware } from './paraglide/server.js'

const fetch = createStartHandler({ handler: defaultStreamHandler })

export default {
  fetch(request: Request) {
    // Keeps the request locale available while rendering, TanStack Router still
    // receives the original URL so its rewrite config stays the only URL mapper.
    return paraglideMiddleware(request, () => fetch(request))
  },
}
