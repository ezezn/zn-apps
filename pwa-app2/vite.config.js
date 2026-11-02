import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' 
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/zn-apps/pwa-app2/',
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
    }
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        mode: 'development'
      },
      manifest: {
        name: 'Sub Aplicación Dos',
        short_name: 'App2',
        description: 'PWA número dos independiente',
        start_url: '/zn-apps/pwa-app2/index.html',
        scope: '/zn-apps/pwa-app2/',
        theme_color: '#10b981',
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
