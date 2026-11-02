import { describe, it, expect, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useOnlineStatus } from '../useOnlineStatus.js'

const TestComponent = defineComponent({
  setup() {
    const { isOnline } = useOnlineStatus()
    return { isOnline }
  },
  template: '<div>{{ isOnline ? "online" : "offline" }}</div>'
})

describe('useOnlineStatus composable', () => {
  it('inicializa con el valor actual de navigator.onLine', () => {
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true })
    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toBe('online')
    wrapper.unmount()
  })

  it('reacciona a los eventos offline y online en window', async () => {
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true })
    const wrapper = mount(TestComponent)
    expect(wrapper.text()).toBe('online')

    // Disparar evento offline
    Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true })
    window.dispatchEvent(new Event('offline'))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('offline')

    // Disparar evento online
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true })
    window.dispatchEvent(new Event('online'))
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toBe('online')

    wrapper.unmount()
  })
})
