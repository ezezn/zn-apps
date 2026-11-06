import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnPwaInstallPrompt from '../components/ZnPwaInstallPrompt.vue'
import * as pwaState from '../utils/pwaState.js'

describe('ZnPwaInstallPrompt.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    localStorage.clear()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('does not display popup if PWA is already installed', async () => {
    vi.spyOn(pwaState, 'isPwaInstalled').mockReturnValue(true)

    const wrapper = mount(ZnPwaInstallPrompt, {
      props: { delayMs: 100 }
    })

    vi.advanceTimersByTime(200)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(false)
  })

  it('does not display popup if previously dismissed in session storage', async () => {
    vi.spyOn(pwaState, 'isPwaInstalled').mockReturnValue(false)
    sessionStorage.setItem('zn-pwa-dismissed', 'true')

    const wrapper = mount(ZnPwaInstallPrompt, {
      props: { delayMs: 100 }
    })

    vi.advanceTimersByTime(200)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(false)
  })

  it('displays popup with title and message after delayMs', async () => {
    vi.spyOn(pwaState, 'isPwaInstalled').mockReturnValue(false)

    const wrapper = mount(ZnPwaInstallPrompt, {
      props: {
        delayMs: 300,
        title: 'Instalar Zound Box',
        message: 'Reproduce sonidos sin conexión'
      }
    })

    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(false)

    vi.advanceTimersByTime(350)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(true)
    expect(wrapper.find('.zn-pwa-popup__title').text()).toBe('Instalar Zound Box')
    expect(wrapper.find('.zn-pwa-popup__message').text()).toBe('Reproduce sonidos sin conexión')
  })

  it('dismisses popup and remembers in storage when clicking dismiss button', async () => {
    vi.spyOn(pwaState, 'isPwaInstalled').mockReturnValue(false)

    const wrapper = mount(ZnPwaInstallPrompt, {
      props: { delayMs: 100 }
    })

    vi.advanceTimersByTime(150)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(true)

    // Buscar botón de descartar ("Ahora no")
    const buttons = wrapper.findAll('button')
    const dismissBtn = buttons[0] // El primer botón es 'variant="text"' Ahora no
    await dismissBtn.trigger('click')

    expect(wrapper.emitted('dismiss')).toBeTruthy()
    expect(sessionStorage.getItem('zn-pwa-dismissed')).toBe('true')
  })

  it('triggers install and emits installed on user acceptance', async () => {
    vi.spyOn(pwaState, 'isPwaInstalled').mockReturnValue(false)
    vi.spyOn(pwaState, 'promptPwaInstall').mockResolvedValue({ outcome: 'accepted' })

    const wrapper = mount(ZnPwaInstallPrompt, {
      props: { delayMs: 100 }
    })

    vi.advanceTimersByTime(150)
    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAll('button')
    const installBtn = buttons[1] // El segundo botón es 'variant="filled"' Instalar
    await installBtn.trigger('click')

    expect(pwaState.promptPwaInstall).toHaveBeenCalled()
    expect(wrapper.emitted('install')).toBeTruthy()

    // Esperar resolución de promesa
    await vi.runAllTimersAsync()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('installed')).toBeTruthy()
  })
})
