import { z } from 'zod'

const envSchema = z.object({
  PAYLOAD_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_REGION: z.string().default('auto'),
  S3_ENDPOINT: z.url(),
  S3_CDN_URL: z.string().url().optional(),
  GITHUB_PAT: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  CONTACT_EMAIL_TO: z.string().email().optional(),
  CONTACT_EMAIL_FROM: z.string().email().optional(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

export const env = envSchema.parse(process.env)
