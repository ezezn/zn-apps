// shared/ui-core/src/index.js

// Importación del CSS Global (Reset + Fuentes). 

// 1. Importamos los pesos 400 (Regular) y 500 (Medium) desde Fontsource
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'

// Al compilar en modo librería o consumirse en desarrollo, Vite procesará este archivo.
import './assets/css/global.css'

// Componentes de Infraestructura de UI
export { default as ZnApp } from './components/ZnApp.vue'
export { default as ZnScreen } from './components/ZnScreen.vue'
export { default as ZnScrollArea } from './components/ZnScrollArea.vue'
export { default as ZnRow } from './components/ZnRow.vue'
export { default as ZnSection } from './components/ZnSection.vue' //
export { default as ZnTabs } from './components/ZnTabs.vue'
export { default as ZnButton } from './components/ZnButton.vue'
export { default as ZnCard } from './components/ZnCard.vue'
export { default as ZnImage } from './components/ZnImage.vue'
export { default as ZnBox } from './components/ZnBox.vue'
export { default as ZnSwitch } from './components/ZnSwitch.vue'
export { default as ZnDialog } from './components/ZnDialog.vue'
export { default as ZnDialogHost } from './components/ZnDialogHost.vue'
export { default as ZnMasterSlaveLayout } from './components/ZnMasterSlaveLayout.vue'

// Iconos Material Design (sprites SVG)
export { default as ZnIcon } from './components/ZnIcon.vue'
export {
  ICON_FAMILIES,
  DEFAULT_ICON_FAMILY,
  loadIconFamily,
  iconExists,
  iconNames,
  iconSymbolId,
  iconSpriteUrl
} from './icons/index.js'

// Componentes Atómicos e Utilidades previos
export { useOnlineStatus } from './composables/useOnlineStatus.js'
export { useDialogs } from './composables/useDialogs.js'
export { formatDate } from './utils/helpers.js'
