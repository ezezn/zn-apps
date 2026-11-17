import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnMasterSlaveLayout from '../layout/ZnMasterSlaveLayout.vue'
import ZnScreen from '../layout/ZnScreen.vue'

describe('ZnMasterSlaveLayout', () => {
  afterEach(() => vi.restoreAllMocks())

  function mockViewport(isMobile) {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: isMobile,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })
  }

  async function mountLayout({ viewKey = null, isMobile = true } = {}) {
    mockViewport(isMobile)

    const wrapper = mount(ZnMasterSlaveLayout, {
      props: { viewKey },
      slots: {
        master: '<a href="/settings">Settings</a>',
        default: '<ZnScreen title="Home" />'
      },
      global: { components: { ZnScreen } }
    })
    await wrapper.vm.$nextTick()
    return wrapper
  }

  it('keeps the navigation docked beside the content on desktop', async () => {
    const wrapper = await mountLayout({ viewKey: '/tasks', isMobile: false })

    expect(wrapper.find('.zn-master-slave-layout__master--pane').exists()).toBe(true)
    expect(wrapper.find('.zn-drawer').exists()).toBe(false)
    expect(wrapper.find('.zn-screen__menu').exists()).toBe(false)
    wrapper.unmount()
  })

  it('shows the initial route content and hides the navigation in a closed drawer (content-first)', async () => {
    const wrapper = await mountLayout({ viewKey: '/tasks' })

    expect(wrapper.classes()).toContain('zn-master-slave-layout--mobile-detail')
    expect(wrapper.find('.zn-master-slave-layout__master--screen').exists()).toBe(false)
    expect(wrapper.find('.zn-drawer--modal').exists()).toBe(true)
    expect(wrapper.find('.zn-drawer').classes()).not.toContain('zn-drawer--open')
    expect(wrapper.find('.zn-master-slave-layout__slave').element.inert).toBe(false)
    expect(wrapper.find('.zn-screen__menu').exists()).toBe(true)

    await wrapper.find('.zn-screen__menu').trigger('click')
    expect(wrapper.find('.zn-drawer').classes()).toContain('zn-drawer--open')

    await wrapper.find('.zn-drawer a').trigger('click')
    expect(wrapper.find('.zn-drawer').classes()).not.toContain('zn-drawer--open')
    expect(wrapper.classes()).toContain('zn-master-slave-layout--mobile-detail')
    wrapper.unmount()
  })

  it('starts on the master when no route is selected (navigation-first), then opens changed views', async () => {
    const wrapper = await mountLayout()

    expect(wrapper.classes()).not.toContain('zn-master-slave-layout--mobile-detail')
    expect(wrapper.find('.zn-master-slave-layout__master--screen').exists()).toBe(true)
    expect(wrapper.find('.zn-drawer').exists()).toBe(false)
    expect(wrapper.find('.zn-master-slave-layout__slave').element.inert).toBe(true)
    expect(wrapper.find('.zn-screen__menu').exists()).toBe(false)

    await wrapper.setProps({ viewKey: '/settings' })
    expect(wrapper.classes()).toContain('zn-master-slave-layout--mobile-detail')
    expect(wrapper.find('.zn-master-slave-layout__master--screen').exists()).toBe(false)
    expect(wrapper.find('.zn-drawer--modal').exists()).toBe(true)
    expect(wrapper.find('.zn-screen__menu').exists()).toBe(true)
    expect(wrapper.find('.zn-master-slave-layout__slave').element.inert).toBe(false)
    wrapper.unmount()
  })

  it('does not focus an empty content slot while the router is still resolving', async () => {
    mockViewport(true)

    const wrapper = mount(ZnMasterSlaveLayout, {
      props: { viewKey: '/' },
      slots: {
        master: '<a href="/tasks">Tasks</a>'
      }
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.classes()).not.toContain('zn-master-slave-layout--mobile-detail')
    expect(wrapper.find('.zn-master-slave-layout__master--screen').exists()).toBe(true)
    expect(wrapper.find('.zn-master-slave-layout__slave').text()).toBe('')
    wrapper.unmount()
  })

  it('opens the drawer from a master navigation link selection', async () => {
    const wrapper = await mountLayout()
    await wrapper.find('.zn-master-slave-layout__master--screen a').trigger('click')

    expect(wrapper.classes()).toContain('zn-master-slave-layout--mobile-detail')
    expect(wrapper.find('.zn-drawer').classes()).not.toContain('zn-drawer--open')
    wrapper.unmount()
  })
})
