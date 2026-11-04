import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ZnAppsUiAbout',
      fileName: 'ui-about',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@zn-apps/ui-core']
    }
  }
})
