import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'ZnAppsUiDataForm',
      fileName: 'ui-data-form',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', '@zn-apps/ui-core', '@zn-apps/ui-data-core'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})
