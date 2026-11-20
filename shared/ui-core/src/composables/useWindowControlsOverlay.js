import { onMounted, onUnmounted, readonly, ref } from 'vue'

/** Empty titlebar rect, used as the SSR / unsupported fallback. */
const EMPTY_RECT = Object.freeze({ x: 0, y: 0, width: 0, height: 0 })

function overlayApi() {
  if (typeof navigator === 'undefined') return null
  return navigator.windowControlsOverlay ?? null
}

/**
 * Window Controls Overlay (WCO) state for an installed desktop PWA.
 *
 * Chromium exposes `navigator.windowControlsOverlay` only while the app runs
 * with `display_override: ['window-controls-overlay', ...]`. In a regular tab,
 * a mobile browser or Chromium without the API, everything stays inert:
 * `isOverlayVisible` is false and `titlebarRect` is all zeros.
 *
 * Geometry changes are coalesced with `requestAnimationFrame`, so dragging,
 * maximizing or toggling the overlay never floods Vue with updates.
 */
export function useWindowControlsOverlay() {
  const api = overlayApi()
  const isSupported = ref(Boolean(api))
  const isOverlayVisible = ref(Boolean(api?.visible))
  const titlebarRect = ref({ ...EMPTY_RECT })

  let frame = null

  function readGeometry() {
    frame = null
    const overlay = overlayApi()
    if (!overlay) {
      isSupported.value = false
      isOverlayVisible.value = false
      titlebarRect.value = { ...EMPTY_RECT }
      return
    }

    isSupported.value = true
    isOverlayVisible.value = Boolean(overlay.visible)
    const rect = typeof overlay.getTitlebarAreaRect === 'function'
      ? overlay.getTitlebarAreaRect()
      : null
    titlebarRect.value = rect
      ? { x: rect.x ?? 0, y: rect.y ?? 0, width: rect.width ?? 0, height: rect.height ?? 0 }
      : { ...EMPTY_RECT }
  }

  function scheduleRead() {
    if (typeof requestAnimationFrame !== 'function') {
      readGeometry()
      return
    }
    if (frame !== null) cancelAnimationFrame(frame)
    frame = requestAnimationFrame(readGeometry)
  }

  onMounted(() => {
    const overlay = overlayApi()
    if (!overlay) return
    readGeometry()
    overlay.addEventListener?.('geometrychange', scheduleRead)
  })

  onUnmounted(() => {
    const overlay = overlayApi()
    overlay?.removeEventListener?.('geometrychange', scheduleRead)
    if (frame !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(frame)
      frame = null
    }
  })

  return {
    isSupported: readonly(isSupported),
    isOverlayVisible: readonly(isOverlayVisible),
    titlebarRect: readonly(titlebarRect)
  }
}
