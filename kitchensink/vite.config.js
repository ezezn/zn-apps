import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { existsSync, readdirSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))
const publicIconsDir = resolve(__dirname, 'public/icons')
const hasIconSprites = existsSync(publicIconsDir)
  && readdirSync(publicIconsDir).some((file) => /^sprite-[a-z-]+\.svg$/.test(file))

export default defineConfig({
  base: '/zn-apps/kitchensink/',
  resolve: {
    alias: {
      // Resolve @zn-apps/ui-core to the source (dev + build) to use the generated
      // icon name catalogs and sprite chunks instead of the pre-built dist package.
      '@zn-apps/ui-core'(request) {
        if (request === '@zn-apps/ui-core') {
          return resolve(__dirname, '../shared/ui-core/src/index.js')
        }
        if (request === '@zn-apps/ui-core/dist/ui-core.css') {
          return resolve(__dirname, '../shared/ui-core/src/assets/css/global.css')
        }
        return request
      },
      '@zn-apps/settings-core': resolve(__dirname, '../shared/settings-core/src/index.js'),
      '@zn-apps/ui-about': resolve(__dirname, '../shared/ui-about/src/index.js'),
      '@zn-apps/pwa-integration': resolve(__dirname, '../shared/pwa-integration/src/index.js'),
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        mode: 'development',
        // Los sprites solo existen si el perfil de iconos genera alguno.
        // Incluirlos en el precache permite usar los iconos desde la primera
        // visita sin conexión, además del caché bajo demanda.
        globPatterns: [
          '**/*.{js,css,html,ico,png,webmanifest}',
          ...(hasIconSprites ? ['icons/sprite-*.svg'] : [])
        ],
        // Los sprites de iconos se descargan bajo demanda: se cachean en la
        // primera visita para que la app siga funcionando offline.
        runtimeCaching: [
          {
            urlPattern: /\/icons\/sprite-[a-z-]+\.svg$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'zn-icon-sprites',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 30 }
            }
          }
        ]
      },
      manifest: {
        name: 'Dev Kitchensink',
        short_name: 'kitchensink',
        description: 'Kitchensink for the local Material UI and helpers of this monorepo',
        start_url: '/zn-apps/kitchensink/index.html',
        scope: '/zn-apps/kitchensink/',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'pwa-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
})
