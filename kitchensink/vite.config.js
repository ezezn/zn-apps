import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' 
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/zn-apps/kitchensink/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
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
            src: 'favicon.ico',
            sizes: '64x64',
            type: 'image/x-icon'
          }
        ]
      }
    })
  ]
})