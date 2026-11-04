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
  base: '/zn-apps/zound-box/',
  resolve: {
    alias: {
      // Resolve @zn-apps/ui-core to the source (dev + build) to use the generated
      // icon name catalogs and sprite chunks instead of the pre-built dist package.
      '@zn-apps/ui-core/dist/ui-core.css': resolve(__dirname, '../shared/ui-core/src/assets/css/global.css'),
      '@zn-apps/ui-core': resolve(__dirname, '../shared/ui-core/src/index.js'),
      '@zn-apps/ui-about': resolve(__dirname, '../shared/ui-about/src/index.js'),
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
        name: 'Zound Box',
        short_name: 'Zound Box',
        description: 'Combina sonidos ambientales y sonidos de seseo para relajarse.',
        start_url: '/zn-apps/zound-box/index.html',
        scope: '/zn-apps/zound-box/',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ]
})
