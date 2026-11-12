import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnScrollArea from '../layout/ZnScrollArea.vue'

describe('ZnScrollArea', () => {
  afterEach(() => vi.useRealTimers())

  it('hides the native scrollbar and exposes an accessible region label', () => {
    const wrapper = mount(ZnScrollArea, {
      props: { label: 'Resultados' },
      slots: { default: '<p>Contenido</p>' }
    })

    expect(wrapper.find('.zn-scroll-area__viewport').attributes('role')).toBe('region')
    expect(wrapper.find('.zn-scroll-area__viewport').attributes('aria-label')).toBe('Resultados')
    expect(wrapper.find('.zn-scroll-area__viewport').classes()).toContain('zn-scroll-area__viewport')
    expect(wrapper.text()).toContain('Contenido')
  })

  it('shows a proportional thumb while scrolling and fades it after scrolling stops', async () => {
    vi.useFakeTimers()
    const wrapper = mount(ZnScrollArea, { slots: { default: '<div style="height: 400px">Contenido</div>' } })
    const root = wrapper.element
    const viewport = wrapper.find('.zn-scroll-area__viewport').element

    Object.defineProperties(root, { clientHeight: { configurable: true, value: 100 } })
    Object.defineProperties(viewport, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 400 },
      scrollTop: { configurable: true, writable: true, value: 150 }
    })

    await wrapper.find('.zn-scroll-area__viewport').trigger('scroll')
    const indicator = wrapper.find('.zn-scroll-area__indicator')
    expect(indicator.classes()).toContain('zn-scroll-area__indicator--visible')
    expect(wrapper.find('.zn-scroll-area__thumb').attributes('style')).toContain('translateY(32px)')

    vi.advanceTimersByTime(850)
    await wrapper.vm.$nextTick()
    expect(indicator.classes()).not.toContain('zn-scroll-area__indicator--visible')
  })
})
