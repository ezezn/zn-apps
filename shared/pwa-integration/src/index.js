/**
 * @zn-apps/pwa-integration
 *
 * Utilidades, composables y componentes para detección de estado PWA,
 * esquemas de color del sistema, sincronización de metadatos de barras
 * y diálogo interactivo de instalación.
 */

// Componentes
export { default as ZnPwaInstallPrompt } from './components/ZnPwaInstallPrompt.vue'

// Composables
export { useColorScheme } from './composables/useColorScheme.js'
export { usePwaMeta } from './composables/usePwaMeta.js'
export { usePwaInstall } from './composables/usePwaInstall.js'

// Utilidades de color scheme
export {
  getSystemColorScheme,
  onSystemColorSchemeChange
} from './utils/colorScheme.js'

// Utilidades de metadatos y temas
export {
  getOrCreateThemeColorMeta,
  getMetaThemeColor,
  setThemeColor,
  setAppBackgroundColor,
  resolveScreenHeadingColor,
  syncWithScreenHeading,
  setAppMetaColors
} from './utils/metaTheme.js'

// Utilidades de estado PWA
export {
  isPwaInstalled,
  initPwaInstallListener,
  onPwaStateChange,
  getDeferredPrompt,
  clearDeferredPrompt,
  promptPwaInstall
} from './utils/pwaState.js'
