import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'shared/ui-core/vitest.config.js',
      'shared/settings-core/vitest.config.js',
      'shared/ui-about/vitest.config.js',
      'shared/pwa-integration/vitest.config.js',
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
