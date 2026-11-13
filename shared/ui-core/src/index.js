// shared/ui-core/src/index.js

// Importación del CSS Global (Reset + Fuentes). 

// 1. Importamos los pesos 400 (Regular) y 500 (Medium) desde Fontsource
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'

// Al compilar en modo librería o consumirse en desarrollo, Vite procesará este archivo.
import './assets/css/global.css'

// Componentes de Layout (estructura de la aplicación y de las pantallas)
export { default as ZnApp } from './components/layout/ZnApp.vue'
export { default as ZnScreen } from './components/layout/ZnScreen.vue'
export { default as ZnScrollArea } from './components/layout/ZnScrollArea.vue'
export { default as ZnMasterSlaveLayout } from './components/layout/ZnMasterSlaveLayout.vue'

// Componentes de Navegación
export { default as ZnTabs } from './components/navigation/ZnTabs.vue'

// Contenedores (distribución de contenido)
export { default as ZnBox } from './components/containers/ZnBox.vue'
export { default as ZnRow } from './components/containers/ZnRow.vue'
export { default as ZnSection } from './components/containers/ZnSection.vue'
export { default as ZnCard } from './components/containers/ZnCard.vue'

// Controles (interacción del usuario)
export { default as ZnButton } from './components/controls/ZnButton.vue'
export { default as ZnChip } from './components/controls/ZnChip.vue'
export { default as ZnSwitch } from './components/controls/ZnSwitch.vue'

// Entradas de datos (formularios)
// `ZnFieldShell` es la anatomía interna compartida por los campos MD3; se exporta
// para que librerías derivadas (p. ej. `ui-data-form`) puedan construir campos
// propios sin duplicar contorno, etiqueta flotante ni estados.
export { default as ZnFieldShell } from './components/input/ZnFieldShell.vue'
export { default as ZnSingleLineText } from './components/input/ZnSingleLineText.vue'
export { default as ZnMultilineText } from './components/input/ZnMultilineText.vue'
export { default as ZnEmailInput } from './components/input/ZnEmailInput.vue'
export { default as ZnPhoneInput } from './components/input/ZnPhoneInput.vue'
export { default as ZnDateInput } from './components/input/ZnDateInput.vue'
export { default as ZnTimeInput } from './components/input/ZnTimeInput.vue'
export { default as ZnDateTimeInput } from './components/input/ZnDateTimeInput.vue'
export { default as ZnSelect } from './components/input/ZnSelect.vue'
export { default as ZnRangeInput } from './components/input/ZnRangeInput.vue'
export { default as ZnDateRangeInput } from './components/input/ZnDateRangeInput.vue'
export { default as ZnTimeRangeInput } from './components/input/ZnTimeRangeInput.vue'
export { default as ZnDateTimeRangeInput } from './components/input/ZnDateTimeRangeInput.vue'

// Diálogos y overlays
export { default as ZnDialog } from './components/dialogs/ZnDialog.vue'
export { default as ZnDialogHost } from './components/dialogs/ZnDialogHost.vue'

// Recursos multimedia
// Iconos Material Design (sprites SVG)
export { default as ZnIcon } from './components/media/ZnIcon.vue'
export { default as ZnImage } from './components/media/ZnImage.vue'
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
