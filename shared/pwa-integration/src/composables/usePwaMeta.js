import { ref, onMounted, onUnmounted } from 'vue'
import {
  setThemeColor as updateThemeColor,
  setAppBackgroundColor as updateBackgroundColor,
  setAppMetaColors as updateAppMetaColors,
  getMetaThemeColor,
  syncWithScreenHeading as syncHeading
} from '../utils/metaTheme.js'

/**
 * Composable para gestionar reactivamente los metadatos visuales de la app PWA:
 * barra superior (<meta name="theme-color">), fondo de carga y barras del sistema.
 *
 * @param {Object} [options]
 * @param {string} [options.initialThemeColor] Color inicial para la barra superior.
 * @param {string} [options.initialBackgroundColor] Color inicial para el fondo de carga.
 * @param {boolean} [options.syncOnMount=false] Sincronizar automáticamente con el heading de ZnScreen al montar.
 * @param {boolean} [options.restoreOnUnmount=false] Restaurar los colores originales al desmontar el componente.
 */
export function usePwaMeta(options = {}) {
  const {
    initialThemeColor,
    initialBackgroundColor,
    syncOnMount = false,
    restoreOnUnmount = false
  } = options

  const themeColor = ref(initialThemeColor || getMetaThemeColor() || '')
  const backgroundColor = ref(initialBackgroundColor || '')

  let originalThemeColor = null
  let originalBackgroundColor = null

  function setThemeColor(color) {
    if (updateThemeColor(color)) {
      themeColor.value = color
    }
  }

  function setBackgroundColor(color) {
    if (updateBackgroundColor(color)) {
      backgroundColor.value = color
    }
  }

  function setAppMetaColors(params) {
    if (!params) return
    if (params.themeColor) {
      setThemeColor(params.themeColor)
    }
    if (params.backgroundColor) {
      setBackgroundColor(params.backgroundColor)
    }
    updateAppMetaColors(params)
  }

  function syncWithScreenHeading(syncOptions = {}) {
    const applied = syncHeading(syncOptions)
    if (applied) {
      themeColor.value = applied
      if (syncOptions.syncBackground !== false) {
        backgroundColor.value = applied
      }
    }
    return applied
  }

  onMounted(() => {
    if (typeof document !== 'undefined') {
      originalThemeColor = getMetaThemeColor()
      originalBackgroundColor = document.documentElement ? document.documentElement.style.backgroundColor : null
    }

    if (initialThemeColor) {
      setThemeColor(initialThemeColor)
    }
    if (initialBackgroundColor) {
      setBackgroundColor(initialBackgroundColor)
    }

    if (syncOnMount) {
      // Defer slightly para permitir que ZnScreen esté montada en el DOM
      setTimeout(() => {
        syncWithScreenHeading()
      }, 0)
    }
  })

  onUnmounted(() => {
    if (restoreOnUnmount) {
      if (originalThemeColor) {
        updateThemeColor(originalThemeColor)
      }
      if (originalBackgroundColor !== null) {
        updateBackgroundColor(originalBackgroundColor)
      }
    }
  })

  return {
    themeColor,
    backgroundColor,
    setThemeColor,
    setBackgroundColor,
    setAppMetaColors,
    syncWithScreenHeading
  }
}
