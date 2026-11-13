import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'ui-data-core',
    environment: 'node',
    globals: true,
    include: ['src/**/*.{test,spec}.js']
  }
})
