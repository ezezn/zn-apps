import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ZnAppsUiDataCharts',
      fileName: 'ui-data-charts',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue']
    }
  }
})
