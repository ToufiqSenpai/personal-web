import { createCsrfMiddleware, createStart } from '@tanstack/react-start'

// No `serializationAdapters`: Payload documents are plain JSON and Seroval handles them
// natively. Defining this file opts out of Start's automatic CSRF middleware, so install
// it explicitly for server functions.
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware],
}))
