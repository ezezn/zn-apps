import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnApp from '../ZnApp.vue'

describe('ZnApp Component', () => {
  beforeEach(() => {
    document.body.className = ''
  })

  afterEach(() => {
    document.body.className = ''
  })

  it('aplica tema claro cuando mode="light"', async () => {
    const wrapper = mount(ZnApp, {
      props: { mode: 'light' },
      slots: { default: '<div class="content">App</div>' }
    })

    expect(wrapper.classes()).toContain('zn-theme-light')
    expect(document.body.classList.contains('zn-theme-light')).toBe(true)
    wrapper.unmount()
  })

  it('aplica tema oscuro cuando mode="dark"', async () => {
    const wrapper = mount(ZnApp, {
      props: { mode: 'dark' }
    })

    expect(wrapper.classes()).toContain('zn-theme-dark')
    expect(document.body.classList.contains('zn-theme-dark')).toBe(true)
    wrapper.unmount()
  })

  it('reacciona a cambios reactivos en la prop mode', async () => {
    const wrapper = mount(ZnApp, {
      props: { mode: 'light' }
    })

    expect(wrapper.classes()).toContain('zn-theme-light')
    expect(document.body.classList.contains('zn-theme-light')).toBe(true)

    await wrapper.setProps({ mode: 'dark' })

    expect(wrapper.classes()).toContain('zn-theme-dark')
    expect(document.body.classList.contains('zn-theme-dark')).toBe(true)
    expect(document.body.classList.contains('zn-theme-light')).toBe(false)

    wrapper.unmount()
  })

  it('limpia las clases de tema del body al desmontarse', () => {
    const wrapper = mount(ZnApp, {
      props: { mode: 'dark' }
    })
    expect(document.body.classList.contains('zn-theme-dark')).toBe(true)

    wrapper.unmount()
    expect(document.body.classList.contains('zn-theme-dark')).toBe(false)
  })
})
