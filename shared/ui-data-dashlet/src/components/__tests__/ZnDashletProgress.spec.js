import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnDashletProgress from '../ZnDashletProgress.vue'

const fillStyle = (wrapper) => wrapper.find('.zn-dashlet-progress__fill').attributes('style')

describe('ZnDashletProgress', () => {
  it('renders the dashlet container and the track', () => {
    const wrapper = mount(ZnDashletProgress)
    expect(wrapper.find('.zn-dashlet').exists()).toBe(true)
    expect(wrapper.find('.zn-dashlet-progress').exists()).toBe(true)
  })

  it('computes the fill width from value and max', () => {
    const wrapper = mount(ZnDashletProgress, { props: { value: 50, max: 200 } })
    expect(fillStyle(wrapper)).toContain('width: 25%')
  })

  it('clamps values above max to 100%', () => {
    const wrapper = mount(ZnDashletProgress, { props: { value: 150, max: 100 } })
    expect(fillStyle(wrapper)).toContain('width: 100%')
  })

  it('clamps negative values to 0%', () => {
    const wrapper = mount(ZnDashletProgress, { props: { value: -20 } })
    expect(fillStyle(wrapper)).toContain('width: 0%')
  })

  it('renders 0% when max is not positive', () => {
    const wrapper = mount(ZnDashletProgress, { props: { value: 40, max: 0 } })
    expect(fillStyle(wrapper)).toContain('width: 0%')
  })

  it('shows the rounded percentage by default', () => {
    const wrapper = mount(ZnDashletProgress, { props: { value: 2, max: 3 } })
    expect(wrapper.find('.zn-dashlet-progress__value').text()).toBe('67%')
  })

  it('hides the percentage when showValue is false', () => {
    const wrapper = mount(ZnDashletProgress, { props: { value: 75, showValue: false } })
    expect(wrapper.find('.zn-dashlet-progress__value').exists()).toBe(false)
  })

  it('applies the bar height and adds room for the label', () => {
    const wrapper = mount(ZnDashletProgress, { props: { height: 12 } })
    expect(wrapper.find('.zn-dashlet-progress').attributes('style')).toContain('height: 12px')
    expect(wrapper.find('.zn-dashlet').element.style.height).toBe('28px')

    const withoutValue = mount(ZnDashletProgress, { props: { height: 12, showValue: false } })
    expect(withoutValue.find('.zn-dashlet').element.style.height).toBe('12px')
  })

  it('paints the fill with the variant color only when filled', () => {
    const filled = mount(ZnDashletProgress, { props: { filled: true } })
    expect(fillStyle(filled)).toContain('background: var(--zn-dashlet-bg)')

    const outline = mount(ZnDashletProgress, { props: { filled: false } })
    expect(fillStyle(outline)).toContain('background: currentcolor')
  })

  it('applies the correct variant', () => {
    const wrapper = mount(ZnDashletProgress, { props: { variant: 'warning' } })
    expect(wrapper.find('.zn-dashlet--warning').exists()).toBe(true)
  })
})
