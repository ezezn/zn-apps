/**
 * Utilidades para manipular metadatos de la aplicación y colores de barras del sistema
 * (status bar superior, barra inferior de navegación y fondo del documento durante la carga/overscroll).
 */

const DEFAULT_THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]'

/**
 * Obtiene o crea la etiqueta <meta name="theme-color"> en el <head>.
 *
 * @returns {HTMLMetaElement | null}
 */
export function getOrCreateThemeColorMeta() {
  if (typeof document === 'undefined') return null

  let meta = document.querySelector(DEFAULT_THEME_COLOR_META_SELECTOR)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    document.head.appendChild(meta)
  }
  return meta
}

/**
 * Obtiene el color de tema actual configurado en <meta name="theme-color">.
 *
 * @returns {string | null}
 */
export function getMetaThemeColor() {
  if (typeof document === 'undefined') return null
  const meta = document.querySelector(DEFAULT_THEME_COLOR_META_SELECTOR)
  return meta ? meta.getAttribute('content') : null
}

/**
 * Actualiza el color de la barra superior/status bar mediante <meta name="theme-color">.
 *
 * @param {string} color Código de color válido en CSS (hex, rgb, etc.).
 * @returns {boolean} true si se aplicó con éxito.
 */
export function setThemeColor(color) {
  if (!color || typeof document === 'undefined') return false

  const meta = getOrCreateThemeColorMeta()
  if (meta) {
    meta.setAttribute('content', color)
    return true
  }
  return false
}

/**
 * Actualiza el color de fondo raíz de la app (html y body) para afectar el fondo de carga,
 * overscroll y la barra de navegación inferior en dispositivos móviles compatibles.
 *
 * @param {string} color Código de color válido en CSS.
 * @returns {boolean}
 */
export function setAppBackgroundColor(color) {
  if (!color || typeof document === 'undefined') return false

  try {
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = color
    }
    if (document.body) {
      document.body.style.backgroundColor = color
    }
    return true
  } catch {
    return false
  }
}

/**
 * Resuelve el color de fondo actual del heading de una `ZnScreen` en el DOM,
 * o de las variables CSS de tokens de Material Design 3 (`--md-background` / `--md-surface`).
 *
 * @param {Object} [options]
 * @param {string} [options.selector='.zn-screen__header'] Selector CSS del header.
 * @param {'background' | 'surface'} [options.tokenFallback='background'] Token de fallback.
 * @returns {string | null}
 */
export function resolveScreenHeadingColor(options = {}) {
  const { selector = '.zn-screen__header', tokenFallback = 'background' } = options

  if (typeof document === 'undefined') return null

  // 1. Intentar obtener el color computado del elemento de cabecera si existe en el DOM
  const header = document.querySelector(selector)
  if (header && typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
    const computedBg = window.getComputedStyle(header).backgroundColor
    if (computedBg && computedBg !== 'transparent' && computedBg !== 'rgba(0, 0, 0, 0)') {
      return computedBg
    }
  }

  // 2. Fallback a la variable CSS del tema MD3 (--md-background o --md-surface)
  if (document.documentElement && typeof window !== 'undefined' && typeof window.getComputedStyle === 'function') {
    const styles = window.getComputedStyle(document.documentElement)
    const varName = tokenFallback === 'surface' ? '--md-surface' : '--md-background'
    const tokenVal = styles.getPropertyValue(varName).trim()
    if (tokenVal) return tokenVal
  }

  return null
}

/**
 * Sincroniza el color de tema (<meta name="theme-color">) y el fondo de la app con el fondo
 * del heading de `ZnScreen`.
 *
 * @param {Object} [options]
 * @param {string} [options.selector='.zn-screen__header'] Selector del header.
 * @param {boolean} [options.syncBackground=true] Si además debe actualizar el fondo del body.
 * @param {string} [options.fallbackColor='#FEF7FF'] Color por defecto si no se detecta.
 * @returns {string | null} El color que fue aplicado.
 */
export function syncWithScreenHeading(options = {}) {
  const { selector = '.zn-screen__header', syncBackground = true, fallbackColor = '#FEF7FF' } = options

  const color = resolveScreenHeadingColor({ selector }) || fallbackColor
  if (color) {
    setThemeColor(color)
    if (syncBackground) {
      setAppBackgroundColor(color)
    }
  }
  return color
}

/**
 * Modifica metadatos visuales combinados de la app: barra superior, fondo de carga y estilo iOS.
 *
 * @param {Object} colors
 * @param {string} [colors.themeColor] Color para <meta name="theme-color">.
 * @param {string} [colors.backgroundColor] Color de fondo para html/body.
 * @param {'default' | 'black' | 'black-translucent'} [colors.statusBarStyle] Estilo de status bar en iOS.
 * @returns {boolean}
 */
export function setAppMetaColors({ themeColor, backgroundColor, statusBarStyle } = {}) {
  let success = false

  if (themeColor) {
    success = setThemeColor(themeColor) || success
  }

  if (backgroundColor) {
    success = setAppBackgroundColor(backgroundColor) || success
  }

  if (statusBarStyle && typeof document !== 'undefined') {
    let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    if (!appleMeta) {
      appleMeta = document.createElement('meta')
      appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style')
      document.head.appendChild(appleMeta)
    }
    appleMeta.setAttribute('content', statusBarStyle)
    success = true
  }

  return success
}
