import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      { find: '@zn-apps/shared/dist/shared.css', replacement: resolve(__dirname, '../shared/src/assets/css/global.css') },
      { find: '@zn-apps/shared', replacement: resolve(__dirname, '../shared/src/index.js') },
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
