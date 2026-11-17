import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import { routes } from '../router/index.js'
import { i18n } from '../i18n.js'
import { pinia } from '../stores/index.js'

describe('app shell', () => {
  afterEach(() => vi.restoreAllMocks())

  function mockViewport(isMobile) {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: isMobile,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  }

  async function mountApp(isMobile, entry = '/tasks') {
    mockViewport(isMobile)
    const router = createRouter({ history: createMemoryHistory(), routes })
    router.push(entry)
    await router.isReady()

    const wrapper = mount(App, { global: { plugins: [router, i18n, pinia] } })
    await wrapper.vm.$nextTick()
    return wrapper
  }

  it('starts on the route content with the navigation in a closed drawer on mobile', async () => {
    const wrapper = await mountApp(true)

    expect(wrapper.find('.zn-master-slave-layout__master--screen').exists()).toBe(false)
    expect(wrapper.find('.zn-screen__menu').exists()).toBe(true)
    expect(wrapper.find('.zn-drawer--modal').classes()).not.toContain('zn-drawer--open')
    expect(wrapper.find('main').text()).not.toBe('')

    await wrapper.find('.zn-screen__menu').trigger('click')
    expect(wrapper.find('.zn-drawer--modal').classes()).toContain('zn-drawer--open')
    wrapper.unmount()
  })

  it('lands on the task page when the app is opened from the PWA start url', async () => {
    const wrapper = await mountApp(true, '/index.html')

    expect(wrapper.vm.$route.fullPath).toBe('/tasks')
    expect(wrapper.find('.zn-master-slave-layout__master--screen').exists()).toBe(false)
    expect(wrapper.find('.zn-screen__menu').exists()).toBe(true)
    expect(wrapper.find('main').text()).not.toBe('')
    wrapper.unmount()
  })

  it('keeps the navigation docked beside the content on desktop', async () => {
    const wrapper = await mountApp(false)

    expect(wrapper.find('.zn-master-slave-layout__master--pane').exists()).toBe(true)
    expect(wrapper.find('.zn-screen__menu').exists()).toBe(false)
    wrapper.unmount()
  })
})
