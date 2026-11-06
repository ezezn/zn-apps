import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { getSystemColorScheme, onSystemColorSchemeChange } from '../utils/colorScheme.js'
import { useColorScheme } from '../composables/useColorScheme.js'

describe('colorScheme utilities & useColorScheme composable', () => {
  const originalMatchMedia = window.matchMedia

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('getSystemColorScheme returns "dark" when prefers-color-scheme matches', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    expect(getSystemColorScheme()).toBe('dark')
  })

  it('getSystemColorScheme returns "light" when prefers-color-scheme does not match', () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    expect(getSystemColorScheme()).toBe('light')
  })

  it('onSystemColorSchemeChange attaches listener and fires callback', () => {
    let capturedHandler = null
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((event, handler) => {
        if (event === 'change') capturedHandler = handler
      }),
      removeEventListener: vi.fn()
    }))

    const callback = vi.fn()
    const unsubscribe = onSystemColorSchemeChange(callback)

    expect(capturedHandler).toBeDefined()
    capturedHandler({ matches: true })
    expect(callback).toHaveBeenCalledWith('dark')

    capturedHandler({ matches: false })
    expect(callback).toHaveBeenCalledWith('light')

    unsubscribe()
  })

  it('useColorScheme manages system scheme and manual preference', async () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true, // dark
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))

    const TestComponent = defineComponent({
      setup() {
        return useColorScheme()
      },
      template: `<div>{{ resolvedTheme }} - isDark: {{ isDark }}</div>`
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.systemColorScheme).toBe('dark')
    expect(wrapper.vm.preference).toBe('system')
    expect(wrapper.vm.resolvedTheme).toBe('dark')
    expect(wrapper.vm.isDark).toBe(true)
    expect(wrapper.vm.isLight).toBe(false)

    // Cambiar a preferencia manual "light"
    wrapper.vm.setPreference('light')
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.preference).toBe('light')
    expect(wrapper.vm.resolvedTheme).toBe('light')
    expect(wrapper.vm.isDark).toBe(false)
    expect(wrapper.vm.isLight).toBe(true)

    // Volver a preferencia "system"
    wrapper.vm.setPreference('system')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.resolvedTheme).toBe('dark')

    wrapper.unmount()
  })
})
