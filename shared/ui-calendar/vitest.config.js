import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@zn-apps/ui-core/dist/ui-core.css': resolve(__dirname, '../ui-core/src/assets/css/global.css'),
      '@zn-apps/ui-core': resolve(__dirname, '../ui-core/src/index.js')
    }
  },
  test: {
    name: 'ui-calendar',
    environment: 'happy-dom',
    globals: true,
    setupFiles: [resolve(__dirname, '../../vitest.setup.js')],
    include: ['src/**/*.{test,spec}.js']
  }
})
