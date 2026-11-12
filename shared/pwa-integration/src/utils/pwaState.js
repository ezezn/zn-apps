/**
 * Utilidades para detección del estado de instalación de la PWA
 * e interceptación del prompt nativo de instalación (`beforeinstallprompt`).
 */

let deferredInstallPrompt = null
let isInitialized = false
const stateChangeListeners = new Set()

/**
 * Comprueba si la aplicación se está ejecutando actualmente en modo instalado (Standalone/PWA).
 *
 * @returns {boolean} true si la app se ejecuta como PWA instalada.
 */
export function isPwaInstalled() {
  if (typeof window === 'undefined') return false

  // 1. Navegadores modernos (Chrome, Edge, Firefox, Android)
  if (typeof window.matchMedia === 'function') {
    try {
      if (window.matchMedia('(display-mode: standalone)').matches) return true
      if (window.matchMedia('(display-mode: window-controls-overlay)').matches) return true
    } catch {
      // Ignorar fallo de matchMedia
    }
  }

  // 2. Safari en iOS / iPadOS
  if (typeof window.navigator !== 'undefined' && window.navigator.standalone === true) {
    return true
  }

  // 3. Android TWA (Trusted Web Activity)
  if (typeof document !== 'undefined' && document.referrer && document.referrer.startsWith('android-app://')) {
    return true
  }

  return false
}

/**
 * Notifica a todos los listeners registrados sobre el cambio de estado actual.
 */
function notifyStateChange() {
  const isInstalled = isPwaInstalled()
  const canInstall = Boolean(deferredInstallPrompt)
  for (const listener of stateChangeListeners) {
    try {
      listener({ isInstalled, canInstall, prompt: deferredInstallPrompt })
    } catch (err) {
      console.error('[pwa-integration] Error in state listener:', err)
    }
  }
}

/**
 * Inicializa los listeners globales para capturar el evento `beforeinstallprompt` y `appinstalled`.
 * Es idempotente (solo se inicializa una vez).
 *
 * @debe ser llamado al menos una vez durante el ciclo de vida de la aplicación,
 * preferiblemente en main.js o en el componente raíz.
 */
export function initPwaInstallListener() {
  if (isInitialized || typeof window === 'undefined') return
  isInitialized = true

  window.addEventListener('beforeinstallprompt', (event) => {
    // Previene que el navegador muestre su mini-infobar automático para permitir prompt personalizado
    event.preventDefault()
    deferredInstallPrompt = event
    notifyStateChange()
  })

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null
    notifyStateChange()
  })
}

/**
 * Suscribe un listener a cambios en la disponibilidad del prompt de instalación.
 *
 * @param {function} listener - Callback que recibe el estado actualizado.
 * @returns {function} Función para desuscribirse.
 */
export function onPwaStateChange(listener) {
  initPwaInstallListener()
  stateChangeListeners.add(listener)

  // Notificar estado inmediato al suscribir
  listener({
    isInstalled: isPwaInstalled(),
    canInstall: Boolean(deferredInstallPrompt),
    prompt: deferredInstallPrompt
  })

  return () => {
    stateChangeListeners.delete(listener)
  }
}

/**
 * Retorna el evento `beforeinstallprompt` diferido actualmente disponible, si existe.
 */
export function getDeferredPrompt() {
  return deferredInstallPrompt
}

/**
 * Limpia la referencia al prompt diferido.
 */
export function clearDeferredPrompt() {
  deferredInstallPrompt = null
  notifyStateChange()
}

/**
 * Dispara el diálogo nativo de instalación de la PWA si el navegador lo tiene diferido.
 *
 * @returns {Promise<{ outcome: 'accepted' | 'dismissed' } | null>}
 */
export async function promptPwaInstall() {
  if (!deferredInstallPrompt) {
    return null
  }

  const promptEvent = deferredInstallPrompt
  try {
    await promptEvent.prompt()
    const choiceResult = await promptEvent.userChoice
    clearDeferredPrompt()
    return choiceResult
  } catch (err) {
    clearDeferredPrompt()
    throw err
  }
}