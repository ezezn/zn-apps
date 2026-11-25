import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnDashletSparkline from '../ZnDashletSparkline.vue'

describe('ZnDashletSparkline', () => {
  it('renders the dashlet container and the svg', () => {
    const wrapper = mount(ZnDashletSparkline)
    expect(wrapper.find('.zn-dashlet').exists()).toBe(true)
    expect(wrapper.find('.zn-dashlet-sparkline').exists()).toBe(true)
  })

  it('does not draw a line without at least two data points', () => {
    expect(mount(ZnDashletSparkline).find('.zn-dashlet-sparkline__line').exists()).toBe(false)
    expect(
      mount(ZnDashletSparkline, { props: { data: [5] } })
        .find('.zn-dashlet-sparkline__line')
        .exists()
    ).toBe(false)
  })

  it('draws a move followed by one line per extra point', () => {
    const wrapper = mount(ZnDashletSparkline, { props: { data: [10, 15, 12, 20, 18] } })
    const d = wrapper.find('.zn-dashlet-sparkline__line').attributes('d')
    expect(d.match(/M/g)).toHaveLength(1)
    expect(d.match(/L/g)).toHaveLength(4)
    expect(d.startsWith('M ')).toBe(true)
  })

  it('inverts the y axis so larger values sit higher', () => {
    const wrapper = mount(ZnDashletSparkline, { props: { data: [0, 10], width: 120, height: 40 } })
    // padding = 4 → first point x=4, last point x=116
    expect(wrapper.find('.zn-dashlet-sparkline__line').attributes('d')).toBe(
      'M 4.00 36.00 L 116.00 4.00'
    )
  })

  it('keeps the line centered when every value is equal', () => {
    const wrapper = mount(ZnDashletSparkline, { props: { data: [7, 7], width: 120, height: 40 } })
    expect(wrapper.find('.zn-dashlet-sparkline__line').attributes('d')).toBe(
      'M 4.00 20.00 L 116.00 20.00'
    )
  })

  it('applies width and height to the svg and the container', () => {
    const wrapper = mount(ZnDashletSparkline, { props: { width: 200, height: 60 } })
    const svg = wrapper.find('.zn-dashlet-sparkline')
    expect(svg.attributes('width')).toBe('200')
    expect(svg.attributes('height')).toBe('60')
    expect(svg.attributes('viewBox')).toBe('0 0 200 60')
    expect(wrapper.find('.zn-dashlet').element.style.height).toBe('60px')
    expect(wrapper.find('.zn-dashlet').element.style.width).toBe('200px')
  })

  it('applies the correct variant', () => {
    const wrapper = mount(ZnDashletSparkline, { props: { variant: 'success' } })
    expect(wrapper.find('.zn-dashlet--success').exists()).toBe(true)
  })

  it('toggles filled mode', () => {
    const wrapperFilled = mount(ZnDashletSparkline, { props: { filled: true } })
    expect(wrapperFilled.attributes('style')).toContain('background:')

    const wrapperOutline = mount(ZnDashletSparkline, { props: { filled: false } })
    expect(wrapperOutline.attributes('style')).toContain('background: transparent')
  })
})
