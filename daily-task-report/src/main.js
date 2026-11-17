import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n.js'
import { router } from './router/index.js'
import { pinia } from './stores/index.js'
import {
  initPwaInstallListener,
  initPwaUpdateListener,
  initPwaThemeSync
} from '@zn-apps/pwa-integration'

initPwaInstallListener()
initPwaUpdateListener()
initPwaThemeSync()

const app = createApp(App)
app.use(pinia).use(router).use(i18n)

// Monta con la ruta inicial ya resuelta: en móvil el layout da el foco al
// contenido desde el primer paint (sin un frame en blanco).
router.isReady().then(() => app.mount('#app'))
