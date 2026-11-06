import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import {
  setThemeColor,
  getMetaThemeColor,
  setAppBackgroundColor,
  resolveScreenHeadingColor,
  syncWithScreenHeading,
  setAppMetaColors
} from '../utils/metaTheme.js'
import { usePwaMeta } from '../composables/usePwaMeta.js'

describe('metaTheme utilities & usePwaMeta composable', () => {
  beforeEach(() => {
    // Limpiar metas y estilos previos
    document.querySelectorAll('meta[name="theme-color"]').forEach(el => el.remove())
    document.querySelectorAll('meta[name="apple-mobile-web-app-status-bar-style"]').forEach(el => el.remove())
    document.documentElement.style.backgroundColor = ''
    document.body.style.backgroundColor = ''
  })

  it('setThemeColor creates or updates meta[name="theme-color"]', () => {
    expect(getMetaThemeColor()).toBeNull()

    const ok = setThemeColor('#6750A4')
    expect(ok).toBe(true)
    expect(getMetaThemeColor()).toBe('#6750A4')

    setThemeColor('#141218')
    expect(getMetaThemeColor()).toBe('#141218')
  })

  it('setAppBackgroundColor modifies documentElement and body background styles', () => {
    setAppBackgroundColor('#FEF7FF')
    expect(document.documentElement.style.backgroundColor).toBe('#FEF7FF')
    expect(document.body.style.backgroundColor).toBe('#FEF7FF')
  })

  it('setAppMetaColors sets themeColor, backgroundColor and statusBarStyle simultaneously', () => {
    setAppMetaColors({
      themeColor: '#FF5722',
      backgroundColor: '#FAFAFA',
      statusBarStyle: 'black-translucent'
    })

    expect(getMetaThemeColor()).toBe('#FF5722')
    expect(document.body.style.backgroundColor).toBe('#FAFAFA')

    const appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    expect(appleMeta).not.toBeNull()
    expect(appleMeta.getAttribute('content')).toBe('black-translucent')
  })

  it('syncWithScreenHeading reads header element color or fallback', () => {
    // Simular un header de ZnScreen en el DOM
    const header = document.createElement('header')
    header.className = 'zn-screen__header'
    header.style.backgroundColor = 'rgb(103, 80, 164)'
    document.body.appendChild(header)

    const applied = syncWithScreenHeading()
    expect(applied).toBe('rgb(103, 80, 164)')
    expect(getMetaThemeColor()).toBe('rgb(103, 80, 164)')
    expect(document.documentElement.style.backgroundColor).toBe('rgb(103, 80, 164)')

    header.remove()
  })

  it('usePwaMeta composable manages reactive theme and background colors', async () => {
    const TestComponent = defineComponent({
      setup() {
        return usePwaMeta({
          initialThemeColor: '#123456',
          initialBackgroundColor: '#abcdef'
        })
      },
      template: `<div>{{ themeColor }} - {{ backgroundColor }}</div>`
    })

    const wrapper = mount(TestComponent)
    expect(wrapper.vm.themeColor).toBe('#123456')
    expect(wrapper.vm.backgroundColor).toBe('#abcdef')
    expect(getMetaThemeColor()).toBe('#123456')

    wrapper.vm.setThemeColor('#654321')
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.themeColor).toBe('#654321')
    expect(getMetaThemeColor()).toBe('#654321')

    wrapper.unmount()
  })
})
