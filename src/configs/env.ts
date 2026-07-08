import { z } from 'zod'

const envSchema = z.object({
  PAYLOAD_SECRET: z.string().min(1),
  DATABASE_URL: z.string().min(1),
  S3_BUCKET: z.string().min(1),
  S3_ACCESS_KEY_ID: z.string().min(1),
  S3_SECRET_ACCESS_KEY: z.string().min(1),
  S3_REGION: z.string().default('auto'),
  S3_ENDPOINT: z.url(),
  S3_CDN_URL: z.url(),
  GITHUB_PAT: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  CONTACT_EMAIL_TO: z.email(),
  CONTACT_EMAIL_FROM: z.email(),
  TURNSTILE_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url(),
})

export const env = envSchema.parse(process.env)
