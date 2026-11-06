import { createApp } from 'vue'
import { router } from './router/index.js'
import './style.css'
import App from './App.vue'
import { i18n } from './i18n.js'

const app = createApp(App)

// 2. Le dices a Vue que utilice el router
app.use(router)
app.use(i18n)

// 3. Finalmente montas la aplicación
app.mount('#app')
