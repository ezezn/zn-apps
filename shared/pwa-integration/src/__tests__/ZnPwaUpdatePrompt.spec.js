import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'

const updateState = vi.hoisted(() => ({
  listener: null,
  updatePwa: vi.fn(async () => true)
}))

vi.mock('../utils/pwaUpdate.js', () => ({
  onPwaUpdateChange: (listener) => {
    updateState.listener = listener
    listener({ updateAvailable: false })
    return () => {
      updateState.listener = null
    }
  },
  updatePwa: (...args) => updateState.updatePwa(...args)
}))

import ZnPwaUpdatePrompt from '../components/ZnPwaUpdatePrompt.vue'

async function mountWithUpdate(wrapperProps = {}) {
  const wrapper = mount(ZnPwaUpdatePrompt, { props: wrapperProps })
  updateState.listener({ updateAvailable: true })
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('ZnPwaUpdatePrompt.vue', () => {
  beforeEach(() => {
    sessionStorage.clear()
    updateState.updatePwa.mockResolvedValue(true)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the popup when an update is available', async () => {
    const wrapper = await mountWithUpdate({
      title: 'Actualización disponible',
      message: 'Hay una nueva versión de la app.'
    })

    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(true)
    expect(wrapper.find('.zn-pwa-popup__title').text()).toBe('Actualización disponible')
    expect(wrapper.find('.zn-pwa-popup__message').text()).toBe('Hay una nueva versión de la app.')
  })

  it('hides the popup and remembers the dismissal', async () => {
    const wrapper = await mountWithUpdate()
    const dismissButton = wrapper.findAll('button')[0]

    await dismissButton.trigger('click')

    expect(wrapper.emitted('dismiss')).toBeTruthy()
    expect(sessionStorage.getItem('zn-pwa-update-dismissed')).toBe('true')
    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(false)
  })

  it('applies the update and clears the dismissal marker', async () => {
    const wrapper = mount(ZnPwaUpdatePrompt)
    updateState.listener({ updateAvailable: true })
    await wrapper.vm.$nextTick()
    sessionStorage.setItem('zn-pwa-update-dismissed', 'true')

    const updateButton = wrapper.findAll('button')[1]
    await updateButton.trigger('click')
    await vi.waitFor(() => expect(updateState.updatePwa).toHaveBeenCalled())

    expect(wrapper.emitted('update')).toBeTruthy()
    expect(wrapper.emitted('updated')).toBeTruthy()
    expect(sessionStorage.getItem('zn-pwa-update-dismissed')).toBeNull()
  })

  it('keeps the prompt usable when the update cannot be applied', async () => {
    updateState.updatePwa.mockResolvedValue(false)
    const wrapper = await mountWithUpdate()
    const updateButton = wrapper.findAll('button')[1]

    await updateButton.trigger('click')
    await vi.waitFor(() => expect(updateState.updatePwa).toHaveBeenCalled())

    expect(wrapper.emitted('updated')).toBeFalsy()
    expect(updateButton.attributes('disabled')).toBeUndefined()
    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(true)
  })

  it('hides the prompt once the app is up to date', async () => {
    const wrapper = await mountWithUpdate()
    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(true)

    updateState.listener({ updateAvailable: false })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.zn-pwa-popup').exists()).toBe(false)
  })
})
