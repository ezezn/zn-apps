import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnMasterSlaveLayout from '../ZnMasterSlaveLayout.vue'
import ZnScreen from '../ZnScreen.vue'

describe('ZnMasterSlaveLayout', () => {
  afterEach(() => vi.restoreAllMocks())

  function mountMobileLayout() {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    })

    return mount(ZnMasterSlaveLayout, {
      props: { viewKey: '/home' },
      slots: {
        master: '<a href="/settings">Settings</a>',
        default: '<ZnScreen title="Home" />'
      },
      global: { components: { ZnScreen } }
    })
  }

  it('shows the master screen first on mobile and changes to the slave when the view key changes', async () => {
    const wrapper = mountMobileLayout()
    expect(wrapper.classes()).not.toContain('zn-master-slave-layout--mobile-detail')

    await wrapper.setProps({ viewKey: '/settings' })
    expect(wrapper.classes()).toContain('zn-master-slave-layout--mobile-detail')
    expect(wrapper.find('.zn-master-slave-layout__master').element.inert).toBe(true)
    expect(wrapper.find('.zn-master-slave-layout__slave').element.inert).toBe(false)
    expect(wrapper.find('.zn-screen__back').exists()).toBe(true)

    await wrapper.find('.zn-screen__back').trigger('click')
    expect(wrapper.classes()).not.toContain('zn-master-slave-layout--mobile-detail')
    expect(wrapper.find('.zn-master-slave-layout__master').element.inert).toBe(false)
    expect(wrapper.find('.zn-master-slave-layout__slave').element.inert).toBe(true)
    wrapper.unmount()
  })

  it('shows the slave when a master navigation link is selected', async () => {
    const wrapper = mountMobileLayout()
    await wrapper.find('a').trigger('click')
    expect(wrapper.classes()).toContain('zn-master-slave-layout--mobile-detail')
    wrapper.unmount()
  })
})
