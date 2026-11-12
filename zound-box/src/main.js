import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n.js'
import {
  initPwaInstallListener,
  initPwaUpdateListener,
  initPwaThemeSync
} from '@zn-apps/pwa-integration'

initPwaInstallListener()
initPwaUpdateListener()
initPwaThemeSync()

createApp(App).use(i18n).mount('#app')
