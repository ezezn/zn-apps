import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' 
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/zn-apps/pwa-app1/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sub Aplicación Uno',
        short_name: 'App1',
        description: 'PWA número uno independiente',
        start_url: '/zn-apps/pwa-app1/index.html',
        scope: '/zn-apps/pwa-app1/',
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