/**
 * Detects a waiting service worker and lets the application apply it after
 * explicit user confirmation.
 *
 * A PWA installed on a phone or desktop may stay open for days without a
 * navigation, so the registration is also polled periodically (and when the
 * app returns to the foreground) to discover new deployments.
 */

const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000
const FOREGROUND_CHECK_INTERVAL_MS = 5 * 60 * 1000
const ACTIVATION_TIMEOUT_MS = 8000

let registration = null
let initialized = false
let updateAvailable = false
let reloadPending = false
let reloading = false
let checkTimer = null
let lastCheckAt = 0
let watchingVisibility = false
const listeners = new Set()

function notify() {
  for (const listener of listeners) {
    try {
      listener({ updateAvailable, registration })
    } catch (error) {
      console.error('[pwa-integration] Error in update listener:', error)
    }
  }
}

function inspect(nextRegistration) {
  if (!nextRegistration) return
  registration = nextRegistration
  updateAvailable = Boolean(registration.waiting)
  notify()
}

function reloadWindow() {
  if (reloading || typeof window === 'undefined') return
  reloading = true
  window.location.reload()
}

function watch(nextRegistration) {
  if (!nextRegistration || nextRegistration.__znUpdateWatched) return
  nextRegistration.__znUpdateWatched = true
  nextRegistration.addEventListener('updatefound', () => {
    const worker = nextRegistration.installing
    if (!worker) return
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        updateAvailable = true
        notify()
      }
    })
  })
  inspect(nextRegistration)
}

function checkForUpdate() {
  if (!registration) return
  lastCheckAt = Date.now()
  try {
    // `update()` re-fetches the service worker script and fires `updatefound`
    // when a new version is found.
    const pending = registration.update()
    if (pending && typeof pending.catch === 'function') pending.catch(() => {})
  } catch {
    // Ignorar navegadores sin soporte o registros no disponibles
  }
}

function handleVisibilityChange() {
  if (typeof document === 'undefined' || document.visibilityState !== 'visible') return
  if (Date.now() - lastCheckAt < FOREGROUND_CHECK_INTERVAL_MS) return
  checkForUpdate()
}

function startPeriodicChecks() {
  if (typeof window === 'undefined') return
  if (!checkTimer) {
    checkTimer = setInterval(checkForUpdate, UPDATE_CHECK_INTERVAL_MS)
  }
  if (!watchingVisibility && typeof document !== 'undefined') {
    watchingVisibility = true
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }
}

function waitForActivation(current) {
  return new Promise((resolve) => {
    const startedAt = Date.now()
    const check = () => {
      // The waiting worker leaves that slot once it activates.
      if (!current.waiting) return resolve(true)
      if (Date.now() - startedAt > ACTIVATION_TIMEOUT_MS) return resolve(false)
      setTimeout(check, 100)
    }
    check()
  })
}

export function initPwaUpdateListener() {
  if (initialized || typeof navigator === 'undefined' || !navigator.serviceWorker) return
  initialized = true

  navigator.serviceWorker.ready
    .then((nextRegistration) => {
      watch(nextRegistration)
      startPeriodicChecks()
    })
    .catch(() => {})

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    updateAvailable = false
    notify()
    if (reloadPending) {
      reloadPending = false
      reloadWindow()
    }
  })
}

export function onPwaUpdateChange(listener) {
  initPwaUpdateListener()
  listeners.add(listener)
  listener({ updateAvailable, registration })
  return () => listeners.delete(listener)
}

export function isPwaUpdateAvailable() {
  return updateAvailable
}

/**
 * Asks the waiting service worker to activate and reloads the page once the
 * new version takes control.
 *
 * @returns {Promise<boolean>} true when a new version was activated.
 */
export async function updatePwa() {
  const current = registration
  const waiting = current?.waiting
  if (!waiting) return false

  reloadPending = true
  waiting.postMessage({ type: 'SKIP_WAITING' })

  const activated = await waitForActivation(current)
  if (!activated) {
    reloadPending = false
    return false
  }

  reloadPending = false
  updateAvailable = false
  notify()
  reloadWindow()
  return true
}
