/**
 * Sincronización automática de los colores de las barras del sistema
 * (status bar superior y barra de navegación inferior de Android) con el
 * esquema de colores resuelto por la aplicación.
 *
 * `ZnApp` (`@zn-apps/ui-core`) refleja el tema resuelto en `<body>` mediante las
 * clases `zn-theme-light` / `zn-theme-dark`. Este módulo observa esas clases y
 * la preferencia del sistema para mantener el `<meta name="theme-color">` y el
 * fondo de `<html>` / `<body>` siempre alineados con el tema visible.
 */

import { getSystemColorScheme, onSystemColorSchemeChange } from './colorScheme.js'
import { setThemeColor, setAppBackgroundColor } from './metaTheme.js'

/**
 * Colores por defecto de las barras del sistema, alineados con los tokens
 * Material Design 3 de `ui-core` (`--md-background` de cada esquema).
 */
export const PWA_THEME_COLORS = {
  light: { themeColor: '#FEF7FF', backgroundColor: '#FEF7FF' },
  dark: { themeColor: '#141218', backgroundColor: '#141218' }
}

let disposeSync = null

/**
 * Obtiene el esquema de color resuelto por la aplicación.
 *
 * Prioriza las clases de tema que `ZnApp` inyecta en `<body>` (incluyen la
 * preferencia manual del usuario) y cae a `prefers-color-scheme` antes del montaje.
 *
 * @returns {'light' | 'dark'}
 */
export function getAppColorScheme() {
  if (typeof document !== 'undefined' && document.body) {
    if (document.body.classList.contains('zn-theme-dark')) return 'dark'
    if (document.body.classList.contains('zn-theme-light')) return 'light'
  }
  return getSystemColorScheme()
}

/**
 * Aplica los colores de barra del esquema indicado al documento.
 *
 * @param {'light' | 'dark'} [scheme=getAppColorScheme()]
 * @param {{ light?: { themeColor: string, backgroundColor: string }, dark?: { themeColor: string, backgroundColor: string } }} [colors=PWA_THEME_COLORS]
 * @returns {{ themeColor: string, backgroundColor: string } | null} Colores aplicados.
 */
export function applyPwaThemeColors(scheme = getAppColorScheme(), colors = PWA_THEME_COLORS) {
  const palette = (scheme === 'dark' ? colors.dark : colors.light) || PWA_THEME_COLORS.light
  const applied = setThemeColor(palette.themeColor)
  setAppBackgroundColor(palette.backgroundColor)
  return applied ? palette : null
}

/**
 * Mantiene los colores de las barras del sistema sincronizados con el tema de la
 * app de forma automática. Idempotente: llamarla varias veces no duplica listeners.
 *
 * Debe invocarse una vez en `src/main.js` de cada aplicación.
 *
 * @param {Object} [options]
 * @param {{ light?: { themeColor: string, backgroundColor: string }, dark?: { themeColor: string, backgroundColor: string } }} [options.colors]
 * @returns {() => void} Función para detener la sincronización.
 */
export function initPwaThemeSync(options = {}) {
  if (typeof document === 'undefined' || typeof window === 'undefined') return () => {}
  if (disposeSync) return disposeSync

  const colors = options.colors || PWA_THEME_COLORS

  const sync = () => {
    applyPwaThemeColors(getAppColorScheme(), colors)
  }

  // Aplica el color correcto desde el arranque (antes o después del montaje de ZnApp)
  sync()

  // ZnApp cambia el tema escribiendo las clases zn-theme-* en <body>
  const observer = typeof MutationObserver === 'function' && document.body
    ? new MutationObserver(sync)
    : null
  if (observer) {
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
  }

  // Cambios de esquema del sistema cuando la app sigue al sistema operativo
  const unsubscribeSystem = onSystemColorSchemeChange(sync)

  disposeSync = () => {
    if (observer) observer.disconnect()
    unsubscribeSystem()
    disposeSync = null
  }

  return disposeSync
}
