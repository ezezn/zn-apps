import { createApp } from 'vue'
import { router } from './router/index.js'
import './style.css'
import App from './App.vue'

const app = createApp(App)

// 2. Le dices a Vue que utilice el router
app.use(router)

// 3. Finalmente montas la aplicación
app.mount('#app')
