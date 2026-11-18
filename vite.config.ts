import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { withPayload } from '@payloadcms/tanstack-start'
import stylex from '@stylexjs/unplugin'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'

import { paraglideOptions } from './paraglide.config.mjs'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(
  withPayload(
    ({ pluginOptions }) => ({
      plugins: [
        // Must stay first: the RSC plugin has to claim client references before Stylex
        // or Paraglide transform the modules. Otherwise the admin layout is dropped from
        // the server render and hydration fails on /admin.
        rsc(pluginOptions.rsc),
        stylex.vite({
          useCSSLayers: true,
          // The plugin appends the collected rules to the first emitted CSS asset unless
          // told which one to use — without this they landed on a Payload admin chunk and
          // the frontend never linked them. The frontend entry's CSS chunk is emitted as
          // `index-<hash>.css`; TanStack Start links it on every route.
          cssInjectionTarget: (fileName) => /(^|\/)index(-[\w-]+)?\.css$/.test(fileName),
        }),
        paraglideVitePlugin(paraglideOptions),
        tanstackStart(pluginOptions.tanstackStart),
        viteReact(pluginOptions.react),
      ],
      resolve: {
        alias: {
          '@/': `${path.resolve(rootDir, 'src')}/`,
        },
      },
      server: {
        port: 3000,
        warmup: {
          clientFiles: [
            './src/app/__root.tsx',
            './src/app/_payload.tsx',
            './src/app/_payload/admin.index.tsx',
            './src/app/_payload/admin.$.tsx',
          ],
        },
      },
    }),
    { payloadConfigPath: path.resolve(rootDir, 'src', 'payload.config.ts') },
  ),
)
