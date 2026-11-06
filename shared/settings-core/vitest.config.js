import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    name: 'settings-core',
    environment: 'happy-dom',
    globals: true,
    setupFiles: [resolve(__dirname, '../../vitest.setup.js')],
    include: ['src/**/*.{test,spec}.js']
  }
})
