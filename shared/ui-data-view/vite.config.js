import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ZnAppsUiDataView',
      fileName: 'ui-data-view',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@zn-apps/ui-core', '@zn-apps/ui-data-core', '@zn-apps/ui-data-richtext'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
