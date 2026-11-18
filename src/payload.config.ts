import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { sharpTransformer } from '@payloadcms/transformer-sharp'
import path from 'node:path'
import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import { fileURLToPath } from 'node:url'
import { ArticleCategories, Articles } from './collections/Articles'
import { ContactMessages } from './collections/ContactMessages'
import { Feeds } from './collections/Feeds'
import { Folders } from './collections/Folders'
import { Media } from './collections/Media'
import { Profile } from './collections/Profile'
import { Projects } from './collections/Projects'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { env } from './configs/env'
import { DEFAULT_LOCALE, LANGUAGES } from './constants/language'

const dirname = path.dirname(fileURLToPath(import.meta.url))

// Payload 4 enables versions and authorship by default. This site never used either,
// so opt out everywhere instead of growing a versions table per collection.
const legacyDefaults = <T extends CollectionConfig | GlobalConfig>(collection: T) =>
  ({
    ...collection,
    versions: false,
    authorship: false,
  }) as T

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
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Folders, Tags, Feeds, Projects, ContactMessages, Articles, ArticleCategories].map(
    legacyDefaults,
  ),
  globals: [Profile].map(legacyDefaults),
  localization: {
    locales: LANGUAGES.map((language) => language.code),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  // Payload 4 defaults to depth 1, this site relied on depth 2.
  defaultDepth: 2,
  editor: lexicalEditor(),
  secret: env.PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    // UUIDv7 ids: time-sortable and generated app-side, so the schema stays portable.
    idType: 'uuidv7',
    // Schema changes ship as reviewed migrations in `src/migrations`, never as an
    // implicit push against the database (development included).
    push: false,
    pool: {
      connectionString: env.DATABASE_URL,
    },
  }),
  email: resendAdapter({
    defaultFromAddress: env.CONTACT_EMAIL_FROM,
    defaultFromName: 'Personal Website',
    apiKey: env.RESEND_API_KEY,
  }),
  upload: {
    transformers: [
      sharpTransformer({
        collections: {
          media: {
            formatOptions: { format: 'avif', options: { quality: 80 } },
          },
        },
      }),
    ],
  },
  storage: [
    s3Storage({
      collections: {
        media: cdnStorageConfig,
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
