import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'shared/ui-core/vitest.config.js',
      'shared/settings-core/vitest.config.js',
      'shared/ui-about/vitest.config.js',
      'shared/pwa-integration/vitest.config.js',
      'shared/ui-data-core/vitest.config.js',
      'shared/ui-data-form/vitest.config.js',
      'shared/ui-data-view/vitest.config.js',
      'shared/ui-data-editor/vitest.config.js',
      'shared/ui-data-richtext/vitest.config.js',
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
