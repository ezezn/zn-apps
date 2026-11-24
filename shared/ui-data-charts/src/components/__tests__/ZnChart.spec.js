import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnChart from '../ZnChart.vue'
import { ChartTypes } from '../../utils/chart-data.js'

const bars = [
  { label: 'Alpha', value: 10 },
  { label: 'Beta', value: 20 },
]

const wide = [
  { month: 'Jan', sales: 10, costs: 4 },
  { month: 'Feb', sales: 20, costs: 8 },
]

describe('ZnChart', () => {
  it('renders one bar per row with the category labels', async () => {
    const wrapper = mount(ZnChart, { props: { data: bars, config: { type: ChartTypes.BAR } } })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.findAll('[data-chart-mark="bar"]')).toHaveLength(2)
    expect(wrapper.text()).toContain('Alpha')
    expect(wrapper.text()).toContain('Beta')
  })

  it('groups bars for multiple series', async () => {
    const wrapper = mount(ZnChart, {
      props: {
        data: wide,
        config: { type: ChartTypes.BAR_GROUPED, category: 'month', series: ['sales', 'costs'] },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('[data-chart-mark="bar"]')).toHaveLength(4)
    expect(wrapper.findAll('.zn-chart-legend__item')).toHaveLength(2)
  })

  it('stacks bars without dropping categories', async () => {
    const wrapper = mount(ZnChart, {
      props: {
        data: wide,
        config: { type: ChartTypes.BAR_STACKED, category: 'month', series: ['sales', 'costs'] },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('[data-chart-mark="bar"]')).toHaveLength(4)
  })

  it('renders one line and its points per series', async () => {
    const wrapper = mount(ZnChart, {
      props: {
        data: wide,
        config: { type: ChartTypes.LINE_MULTI, category: 'month', series: ['sales', 'costs'] },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.zn-chart__line')).toHaveLength(2)
    expect(wrapper.findAll('[data-chart-mark="point"]')).toHaveLength(4)
  })

  it('fills areas', async () => {
    const wrapper = mount(ZnChart, {
      props: {
        data: wide,
        config: { type: ChartTypes.AREA_STACKED, category: 'month', series: ['sales', 'costs'] },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.findAll('.zn-chart__area')).toHaveLength(2)
  })

  it('emits the clicked point and pins a popup until clicked again', async () => {
    const wrapper = mount(ZnChart, { props: { data: bars, config: { type: ChartTypes.BAR } } })
    await wrapper.vm.$nextTick()

    const firstBar = wrapper.findAll('[data-chart-mark="bar"]')[0]
    await firstBar.trigger('click')

    const [payload] = wrapper.emitted('point-click').at(-1)
    expect(payload).toMatchObject({
      type: 'bar',
      category: 'Alpha',
      categoryIndex: 0,
      series: 'value',
      seriesIndex: 0,
      value: 10,
      seriesValues: [10],
    })
    const tooltip = wrapper.find('.zn-chart-tooltip')
    expect(tooltip.exists()).toBe(true)
    expect(tooltip.text()).toContain('Alpha')
    expect(tooltip.text()).toContain('10')

    await firstBar.trigger('click')
    expect(wrapper.find('.zn-chart-tooltip').exists()).toBe(false)
  })

  it('still emits clicks when the popup is disabled', async () => {
    const wrapper = mount(ZnChart, {
      props: { data: bars, config: { type: ChartTypes.BAR, tooltip: false } },
    })
    await wrapper.vm.$nextTick()

    await wrapper.findAll('[data-chart-mark="bar"]')[0].trigger('click')
    expect(wrapper.emitted('point-click')).toHaveLength(1)
    expect(wrapper.find('.zn-chart-tooltip').exists()).toBe(false)
  })

  it('renders pie slices with labels and values in the popup', async () => {
    const wrapper = mount(ZnChart, {
      props: {
        data: [
          { label: 'A', value: 1 },
          { label: 'B', value: 3 },
        ],
        config: { type: ChartTypes.PIE },
      },
    })
    await wrapper.vm.$nextTick()

    const slices = wrapper.findAll('[data-chart-mark="slice"]')
    expect(slices).toHaveLength(2)
    expect(wrapper.findAll('.zn-chart-legend__item')).toHaveLength(2)

    await slices[0].trigger('click')
    const [payload] = wrapper.emitted('point-click').at(-1)
    expect(payload).toMatchObject({ type: 'pie', category: 'A', value: 1, percent: 25 })
    expect(wrapper.find('.zn-chart-tooltip').text()).toContain('25%')
  })

  it('shows the total in a donut center', async () => {
    const wrapper = mount(ZnChart, {
      props: {
        data: [{ label: 'A', value: 1 }, { label: 'B', value: 3 }],
        config: { type: ChartTypes.DONUT, donut: { totalLabel: 'Total' } },
      },
    })
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.zn-chart__total-value').text()).toBe('4')
    expect(wrapper.text()).toContain('Total')
  })

  it('renders a translated empty state', async () => {
    const wrapper = mount(ZnChart, {
      props: { data: [], config: { type: ChartTypes.LINE }, emptyText: 'Sin datos' },
    })
    expect(wrapper.find('[role="status"]').text()).toBe('Sin datos')
    expect(wrapper.find('svg').exists()).toBe(false)
  })

  it('uses a custom color palette', async () => {
    const wrapper = mount(ZnChart, {
      props: {
        data: wide,
        config: { type: ChartTypes.BAR, category: 'month', series: ['sales', 'costs'], colors: ['#ff0000', '#00ff00'] },
      },
    })
    await wrapper.vm.$nextTick()

    const styles = wrapper.findAll('.zn-chart__bar').map((bar) => bar.attributes('style'))
    expect(styles.slice(0, 2)).toEqual([
      '--zn-chart-mark-color: #ff0000;',
      '--zn-chart-mark-color: #ff0000;',
    ])
    expect(styles.slice(2)).toEqual([
      '--zn-chart-mark-color: #00ff00;',
      '--zn-chart-mark-color: #00ff00;',
    ])
  })
})
