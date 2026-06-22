import { defineConfig } from 'vite'
import vue from '@vitejs/vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/zn-apps/pwa-app2/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
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