import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnDashletCounter from '../ZnDashletCounter.vue'

describe('ZnDashletCounter', () => {
  it('renders with default props', () => {
    const wrapper = mount(ZnDashletCounter)
    expect(wrapper.find('.zn-dashlet').exists()).toBe(true)
    expect(wrapper.find('.zn-dashlet-counter__value').exists()).toBe(true)
  })

  it('renders the value correctly', () => {
    const wrapper = mount(ZnDashletCounter, { props: { value: 42 } })
    expect(wrapper.find('.zn-dashlet-counter__value').text()).toBe('42')
  })

  it('renders the label correctly', () => {
    const wrapper = mount(ZnDashletCounter, { props: { label: 'Ventas' } })
    expect(wrapper.find('.zn-dashlet-counter__label').text()).toBe('Ventas')
  })

  it('renders the subtitle correctly', () => {
    const wrapper = mount(ZnDashletCounter, {
      props: { value: 100, label: 'Ventas', subtitle: 'Este mes' }
    })
    expect(wrapper.find('.zn-dashlet-counter__subtitle').text()).toBe('Este mes')
  })

  it('renders without subtitle when not provided', () => {
    const wrapper = mount(ZnDashletCounter, { props: { value: 50, label: 'Usuarios' } })
    expect(wrapper.find('.zn-dashlet-counter__subtitle').exists()).toBe(false)
  })

  it('applies the correct variant', () => {
    const wrapper = mount(ZnDashletCounter, { props: { variant: 'success' } })
    expect(wrapper.find('.zn-dashlet--success').exists()).toBe(true)
  })

  it('toggles filled mode', () => {
    const wrapperFilled = mount(ZnDashletCounter, { props: { filled: true } })
    expect(wrapperFilled.attributes('style')).toContain('background:')

    const wrapperOutline = mount(ZnDashletCounter, { props: { filled: false } })
    expect(wrapperOutline.attributes('style')).toContain('background: transparent')
  })
})