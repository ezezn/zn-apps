import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnDashlet from '../ZnDashlet.vue'

describe('ZnDashlet', () => {
  it('renders with default variant neutral', () => {
    const wrapper = mount(ZnDashlet)
    expect(wrapper.find('.zn-dashlet').exists()).toBe(true)
    expect(wrapper.find('.zn-dashlet--neutral').exists()).toBe(true)
  })

  it('applies the correct variant class', () => {
    const wrapper = mount(ZnDashlet, { props: { variant: 'primary' } })
    expect(wrapper.find('.zn-dashlet--primary').exists()).toBe(true)

    const wrapper2 = mount(ZnDashlet, { props: { variant: 'success' } })
    expect(wrapper2.find('.zn-dashlet--success').exists()).toBe(true)
  })

  it('toggles filled mode', () => {
    const wrapperFilled = mount(ZnDashlet, { props: { filled: true } })
    expect(wrapperFilled.attributes('style')).toContain('background:')

    const wrapperOutline = mount(ZnDashlet, { props: { filled: false } })
    expect(wrapperOutline.attributes('style')).toContain('background: transparent')
  })

  it('accepts height prop', () => {
    const wrapper = mount(ZnDashlet, { props: { height: 200 } })
    expect(wrapper.find('.zn-dashlet').element.style.height).toBe('200px')
  })

  it('slots content correctly', () => {
    const wrapper = mount(ZnDashlet, {
      slots: { default: '<div>Hola Mundo</div>' }
    })
    expect(wrapper.text()).toContain('Hola Mundo')
  })
})