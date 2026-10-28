import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'shared/vitest.config.js',
      'zound-box/vitest.config.js',
      'kitchensink/vitest.config.js',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './coverage',
    },
  },
})
