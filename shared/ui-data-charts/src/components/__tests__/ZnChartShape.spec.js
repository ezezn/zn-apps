import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnChartShape from '../ZnChartShape.vue'
import { ChartTypes } from '../../utils/chart-data.js'

const wide = [
  { month: 'Jan', sales: 10, costs: 4 },
  { month: 'Feb', sales: 20, costs: 8 },
  { month: 'Mar', sales: 12, costs: 6 },
]

const circular = [
  { label: 'A', value: 1 },
  { label: 'B', value: 3 },
]

describe('ZnChartShape', () => {
  it('draws a compact svg with no text or interactive marks', async () => {
    const wrapper = mount(ZnChartShape, {
      props: { data: wide, config: { type: ChartTypes.BAR, category: 'month', value: 'sales' } },
    })

    const svg = wrapper.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('viewBox')).toBe('0 0 64 40')
    expect(wrapper.findAll('.zn-chart-shape__bar')).toHaveLength(3)
    expect(wrapper.text()).toBe('')
    expect(wrapper.find('[data-chart-mark]').exists()).toBe(false)
    expect(wrapper.find('[role="button"]').exists()).toBe(false)
  })

  it('ignores labels and axes from the shared config', async () => {
    const wrapper = mount(ZnChartShape, {
      props: {
        data: wide,
        config: {
          type: ChartTypes.BAR_STACKED,
          category: 'month',
          series: ['sales', 'costs'],
          xAxis: { title: 'Month' },
          yAxis: { title: 'Units' },
          legend: true,
        },
      },
    })

    expect(wrapper.findAll('.zn-chart-shape__bar')).toHaveLength(6)
    expect(wrapper.text()).toBe('')
    expect(wrapper.find('text').exists()).toBe(false)
  })

  it('draws lines and areas without dots', async () => {
    const line = mount(ZnChartShape, {
      props: { data: wide, config: { type: ChartTypes.LINE_MULTI, category: 'month', series: ['sales'] } },
    })
    const area = mount(ZnChartShape, {
      props: { data: wide, config: { type: ChartTypes.AREA, category: 'month', series: ['sales'] } },
    })

    expect(line.findAll('.zn-chart-shape__line')).toHaveLength(1)
    expect(line.findAll('.zn-chart-shape__area')).toHaveLength(0)
    expect(line.find('circle').exists()).toBe(false)

    expect(area.findAll('.zn-chart-shape__area')).toHaveLength(1)
    expect(area.findAll('.zn-chart-shape__line')).toHaveLength(1)
  })

  it('splits a pie and closes a donut', () => {
    const pie = mount(ZnChartShape, { props: { data: circular, config: { type: ChartTypes.PIE } } })
    const donut = mount(ZnChartShape, {
      props: { data: circular, config: { type: ChartTypes.DONUT, donut: { innerRadius: 0.6 } } },
    })

    expect(pie.findAll('.zn-chart-shape__slice')).toHaveLength(2)
    const donutPath = donut.find('.zn-chart-shape__slice').attributes('d')
    expect(donutPath.split('A')).toHaveLength(3)
    expect(pie.find('.zn-chart-shape__slice').attributes('d').split('A')).toHaveLength(2)
  })

  it('colors series from the config palette', () => {
    const wrapper = mount(ZnChartShape, {
      props: { data: wide, config: { type: ChartTypes.LINE_MULTI, series: ['sales', 'costs'], colors: ['#ff0000', '#00ff00'] } },
    })

    const styles = wrapper.findAll('.zn-chart-shape__line').map((line) => line.attributes('style'))
    expect(styles).toEqual([
      '--zn-chart-mark-color: #ff0000;',
      '--zn-chart-mark-color: #00ff00;',
    ])
  })

  it('renders an empty placeholder and stays decorative by default', () => {
    const wrapper = mount(ZnChartShape, { props: { data: [], config: { type: ChartTypes.BAR } } })
    const svg = wrapper.find('svg')

    expect(wrapper.find('.zn-chart-shape__placeholder').exists()).toBe(true)
    expect(wrapper.findAll('.zn-chart-shape__bar')).toHaveLength(0)
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('role')).toBeUndefined()
  })

  it('exposes an accessible name when requested', () => {
    const wrapper = mount(ZnChartShape, {
      props: { data: wide, config: { type: ChartTypes.BAR, category: 'month', value: 'sales' }, width: 32, height: 24, ariaLabel: 'Sales preview' },
    })

    expect(wrapper.find('svg').attributes('role')).toBe('img')
    expect(wrapper.find('svg').attributes('aria-label')).toBe('Sales preview')
    expect(wrapper.find('svg').attributes('viewBox')).toBe('0 0 32 24')
  })
})
