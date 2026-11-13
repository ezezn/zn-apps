import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@zn-apps/ui-core/dist/ui-core.css', replacement: resolve(__dirname, '../shared/ui-core/src/assets/css/global.css') },
      { find: '@zn-apps/ui-core', replacement: resolve(__dirname, '../shared/ui-core/src/index.js') },
      { find: '@zn-apps/settings-core', replacement: resolve(__dirname, '../shared/settings-core/src/index.js') },
      { find: '@zn-apps/ui-about', replacement: resolve(__dirname, '../shared/ui-about/src/index.js') },
      { find: '@zn-apps/pwa-integration', replacement: resolve(__dirname, '../shared/pwa-integration/src/index.js') },
      { find: '@zn-apps/ui-data-core', replacement: resolve(__dirname, '../shared/ui-data-core/src/index.js') },
      { find: '@zn-apps/ui-data-form', replacement: resolve(__dirname, '../shared/ui-data-form/src/index.js') },
      { find: '@zn-apps/ui-data-view', replacement: resolve(__dirname, '../shared/ui-data-view/src/index.js') },
      { find: '@zn-apps/ui-data-editor', replacement: resolve(__dirname, '../shared/ui-data-editor/src/index.js') },
    ],
  },
  test: {
    name: 'kitchensink',
    environment: 'happy-dom',
    globals: true,
    setupFiles: [resolve(__dirname, '../vitest.setup.js')],
    include: ['src/**/*.{test,spec}.js'],
  },
})
