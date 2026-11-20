import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useWindowControlsOverlay } from '../useWindowControlsOverlay.js'

function mountComposable() {
  return mount({
    setup() {
      return useWindowControlsOverlay()
    },
    template: '<div />'
  })
}

function stubOverlay(overrides = {}) {
  const listeners = new Map()
  const api = {
    visible: true,
    getTitlebarAreaRect: () => ({ x: 0, y: 0, width: 800, height: 40 }),
    addEventListener: (event, handler) => listeners.set(event, handler),
    removeEventListener: (event) => listeners.delete(event),
    ...overrides
  }
  Object.defineProperty(navigator, 'windowControlsOverlay', {
    value: api,
    configurable: true
  })
  return { api, listeners }
}

afterEach(() => {
  delete navigator.windowControlsOverlay
  vi.unstubAllGlobals()
})

describe('useWindowControlsOverlay', () => {
  it('stays inert without the API', () => {
    const wrapper = mountComposable()

    expect(wrapper.vm.isSupported).toBe(false)
    expect(wrapper.vm.isOverlayVisible).toBe(false)
    expect(wrapper.vm.titlebarRect).toEqual({ x: 0, y: 0, width: 0, height: 0 })
    wrapper.unmount()
  })

  it('reads the visible state and the titlebar rect on mount', () => {
    stubOverlay({ visible: true })
    const wrapper = mountComposable()

    expect(wrapper.vm.isSupported).toBe(true)
    expect(wrapper.vm.isOverlayVisible).toBe(true)
    expect(wrapper.vm.titlebarRect).toEqual({ x: 0, y: 0, width: 800, height: 40 })
    wrapper.unmount()
  })

  it('updates the geometry on geometrychange through requestAnimationFrame', () => {
    vi.stubGlobal('requestAnimationFrame', (callback) => {
      callback()
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})

    const rect = { x: 80, y: 0, width: 900, height: 32 }
    const { api, listeners } = stubOverlay({ visible: true })
    const wrapper = mountComposable()

    api.visible = false
    api.getTitlebarAreaRect = () => rect
    listeners.get('geometrychange')()
    expect(wrapper.vm.isOverlayVisible).toBe(false)
    expect(wrapper.vm.titlebarRect).toEqual(rect)

    api.visible = true
    listeners.get('geometrychange')()
    expect(wrapper.vm.isOverlayVisible).toBe(true)

    wrapper.unmount()
    expect(listeners.has('geometrychange')).toBe(false)
  })
})
