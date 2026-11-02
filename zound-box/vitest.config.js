import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@zn-apps/ui-core/dist/ui-core.css', replacement: resolve(__dirname, '../shared/ui-core/src/assets/css/global.css') },
      { find: '@zn-apps/ui-core', replacement: resolve(__dirname, '../shared/ui-core/src/index.js') },
    ],
  },
  test: {
    name: 'zound-box',
    environment: 'happy-dom',
    globals: true,
    setupFiles: [resolve(__dirname, '../vitest.setup.js')],
    include: ['src/**/*.{test,spec}.js'],
  },
})
