import { z } from 'zod'

const clientEnvSchema = z.object({
  VITE_SITE_URL: z.url(),
  VITE_TURNSTILE_SITE_KEY: z.string().min(1),
})

export const clientEnv = clientEnvSchema.parse({
  VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  VITE_TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY,
})
