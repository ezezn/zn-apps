import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue' 
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/zn-apps/zound-box/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Sub Aplicación Uno',
        short_name: 'App1',
        description: 'PWA número uno independiente',
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