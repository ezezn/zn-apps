import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ZnAppsUiDataDashlet',
      fileName: 'ui-data-dashlet',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@zn-apps/ui-core']
    }
  }
})