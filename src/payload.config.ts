import path from 'path'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Profile, ProfileAvatar, ProfileIcons, HobbiesMedia } from './collections/Profile'
import { Feeds, FeedsMedia } from './collections/Feeds'
import { Projects, ProjectsMedia } from './collections/Projects'
import { ContactMessages } from './collections/ContactMessages'
import { env } from './configs/env'
import { DEFAULT_LANGUAGE, LANGUAGES } from './i18n/language'
import { resendAdapter } from '@payloadcms/email-resend'
import { ArticleCategories, ArticleMedia, Articles } from './collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateCDNUrl =
  (cdnUrl: string) =>
  ({ filename, prefix }: { filename: string; prefix?: string }) => {
    const cleanPrefix = prefix ? `${prefix}/` : ''
    return `${cdnUrl}/${cleanPrefix}${filename}`
  }

const cdnStorageConfig = {
  disablePayloadAccessControl: true as const,
  ...(env.S3_CDN_URL
    ? {
        generateFileURL: generateCDNUrl(env.S3_CDN_URL),
      }
    : {}),
}

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    ProfileAvatar,
    ProfileIcons,
    HobbiesMedia,
    Feeds,
    FeedsMedia,
    Projects,
    ProjectsMedia,
    ContactMessages,
    Articles,
    ArticleCategories,
    ArticleMedia,
  ],
  globals: [Profile],
  localization: {
    locales: LANGUAGES.map((language) => language.code),
    defaultLocale: DEFAULT_LANGUAGE.code,
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: env.DATABASE_URL,
  }),
  email: resendAdapter({
    defaultFromAddress: env.CONTACT_EMAIL_FROM || 'onboarding@resend.dev',
    defaultFromName: 'Personal Website',
    apiKey: env.RESEND_API_KEY || '',
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        'profile-avatar': cdnStorageConfig,
        'profile-icons': cdnStorageConfig,
        'hobbies-media': cdnStorageConfig,
        'feeds-media': cdnStorageConfig,
        'projects-media': cdnStorageConfig,
      },
      bucket: env.S3_BUCKET,
      config: {
        credentials: {
          accessKeyId: env.S3_ACCESS_KEY_ID,
          secretAccessKey: env.S3_SECRET_ACCESS_KEY,
        },
        region: env.S3_REGION,
        endpoint: env.S3_ENDPOINT,
      },
    }),
  ],
})
