import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const remotePatterns: any[] = [
  {
    protocol: 'https',
    hostname: 'cdn.mhmtaufiq.foo',
    pathname: '/**',
  },
]

if (process.env.S3_CDN_URL) {
  try {
    const url = new URL(process.env.S3_CDN_URL)
    remotePatterns.push({
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port || '',
      pathname: '/**',
    })
  } catch (e) {
    console.error('Invalid S3_CDN_URL in next.config.ts:', e)
  }
}

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        pathname: '/api/profile-avatar/file/**',
      },
      {
        pathname: '/api/profile-icons/file/**',
      },
      {
        pathname: '/api/hobbies-media/file/**',
      },
      {
        pathname: '/api/projects-media/file/**',
      },
      {
        pathname: '/api/feeds-media/file/**',
      },
    ],
    remotePatterns,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false })
