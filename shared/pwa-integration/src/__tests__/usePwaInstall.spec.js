import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import {
  isPwaInstalled,
  initPwaInstallListener,
  onPwaStateChange,
  getDeferredPrompt,
  clearDeferredPrompt,
  promptPwaInstall
} from '../utils/pwaState.js'
import { usePwaInstall } from '../composables/usePwaInstall.js'

describe('pwaState utilities & usePwaInstall composable', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    clearDeferredPrompt()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
    clearDeferredPrompt()
  })

  it('isPwaInstalled returns true when standalone display-mode matches', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(display-mode: standalone)',
      media: query
    }))

    expect(isPwaInstalled()).toBe(true)
  })

  it('isPwaInstalled returns true on iOS standalone navigator', () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false })
    Object.defineProperty(window.navigator, 'standalone', {
      value: true,
      configurable: true
    })

    expect(isPwaInstalled()).toBe(true)

    Object.defineProperty(window.navigator, 'standalone', {
      value: false,
      configurable: true
    })
  })

  it('captures beforeinstallprompt event and triggers promptPwaInstall', async () => {
    initPwaInstallListener()

    const mockPromptEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted' })
    }

    const stateListener = vi.fn()
    const unsubscribe = onPwaStateChange(stateListener)

    // Simular disparo del evento por el navegador
    window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockPromptEvent))

    expect(mockPromptEvent.preventDefault).toHaveBeenCalled()
    expect(getDeferredPrompt()).toBeDefined()

    // Ejecutar instalación
    const result = await promptPwaInstall()
    expect(mockPromptEvent.prompt).toHaveBeenCalled()
    expect(result).toEqual({ outcome: 'accepted' })
    expect(getDeferredPrompt()).toBeNull()

    unsubscribe()
  })

  it('usePwaInstall composable reacts to install prompt state', async () => {
    const TestComponent = defineComponent({
      setup() {
        return usePwaInstall()
      },
      template: `<div>isInstalled: {{ isInstalled }} - canInstall: {{ canInstall }}</div>`
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.canInstall).toBe(false)

    // Simular beforeinstallprompt
    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'dismissed' })
    }
    window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockEvent))

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.canInstall).toBe(true)

    // Llamar promptInstall desde el composable
    const outcome = await wrapper.vm.promptInstall()
    expect(outcome).toEqual({ outcome: 'dismissed' })

    await wrapper.vm.$nextTick()
    expect(wrapper.vm.canInstall).toBe(false)

    wrapper.unmount()
  })
})
