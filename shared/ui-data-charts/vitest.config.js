import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    name: 'ui-data-charts',
    environment: 'happy-dom',
    globals: true,
    setupFiles: [resolve(__dirname, '../../vitest.setup.js')],
    include: ['src/**/*.{test,spec}.js']
  }
})
