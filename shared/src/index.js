// shared/src/index.js

// Importación del CSS Global (Reset + Fuentes). 

// 1. Importamos los pesos 400 (Regular) y 500 (Medium) desde Fontsource
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'

// Al compilar en modo librería o consumirse en desarrollo, Vite procesará este archivo.
import './assets/css/global.css'

// Componentes de Infraestructura de UI
export { default as ZnApp } from './components/ZnApp.vue'
export { default as ZnScreen } from './components/ZnScreen.vue'
export { default as ZnRow } from './components/ZnRow.vue'
export { default as ZnSection } from './components/ZnSection.vue' //
export { default as ZnButton } from './components/ZnButton.vue'

// Componentes Atómicos e Utilidades previos
export { default as CustomButton } from './components/CustomButton.vue'
export { useOnlineStatus } from './composables/useOnlineStatus.js'
export { formatDate } from './utils/helpers.js'
