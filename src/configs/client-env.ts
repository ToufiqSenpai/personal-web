import { z } from 'zod'

const clientEnvSchema = z.object({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const clientEnv = clientEnvSchema.parse({
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NODE_ENV: process.env.NODE_ENV,
})
