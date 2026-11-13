import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@zn-apps/ui-core': resolve(__dirname, '../ui-core/src/index.js'),
      '@zn-apps/ui-data-core': resolve(__dirname, '../ui-data-core/src/index.js'),
      '@zn-apps/ui-data-richtext': resolve(__dirname, '../ui-data-richtext/src/index.js')
    }
  },
  test: {
    name: 'ui-data-form',
    environment: 'happy-dom',
    globals: true,
    setupFiles: [resolve(__dirname, '../../vitest.setup.js')],
    include: ['src/**/*.{test,spec}.js']
  }
})
