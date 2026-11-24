import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnDashletSummary from '../ZnDashletSummary.vue'

describe('ZnDashletSummary', () => {
  it('renders with default props', () => {
    const wrapper = mount(ZnDashletSummary)
    expect(wrapper.find('.zn-dashlet').exists()).toBe(true)
  })

  it('renders double-row layout by default', () => {
    const wrapper = mount(ZnDashletSummary, {
      props: { value: 100, subtitle: 'Total', secondaryValue: 50, secondaryLabel: 'Meta' }
    })
    expect(wrapper.find('.zn-dashlet-summary__row').exists()).toBe(true)
    expect(wrapper.find('.zn-dashlet-summary__row--bottom').exists()).toBe(true)
  })

  it('renders side-by-side layout when prop is set', () => {
    const wrapper = mount(ZnDashletSummary, {
      props: {
        value: 100,
        subtitle: 'Total',
        secondaryValue: 50,
        secondaryLabel: 'Meta',
        layout: 'side-by-side'
      }
    })
    expect(wrapper.find('.zn-dashlet-summary__row.side-by-side').exists()).toBe(true)
  })

  it('renders the large value correctly', () => {
    const wrapper = mount(ZnDashletSummary, {
      props: { value: 250 }
    })
    expect(wrapper.find('.zn-dashlet-summary__value-large').text()).toBe('250')
  })

  it('renders the subtitle correctly', () => {
    const wrapper = mount(ZnDashletSummary, {
      props: { value: 100, subtitle: 'Objetivo' }
    })
    expect(wrapper.find('.zn-dashlet-summary__label-large').text()).toBe('Objetivo')
  })

  it('renders the secondary value correctly', () => {
    const wrapper = mount(ZnDashletSummary, {
      props: { secondaryValue: 75, secondaryLabel: 'Avance' }
    })
    expect(wrapper.find('.zn-dashlet-summary__value-small').text()).toBe('75')
  })

  it('renders the secondary subtitle correctly', () => {
    const wrapper = mount(ZnDashletSummary, {
      props: { secondarySubtitle: 'Progreso' }
    })
    expect(wrapper.find('.zn-dashlet-summary__label-small').text()).toBe('Progreso')
  })

  it('applies the correct variant', () => {
    const wrapper = mount(ZnDashletSummary, { props: { variant: 'info' } })
    expect(wrapper.find('.zn-dashlet--info').exists()).toBe(true)
  })

  it('toggles filled mode', () => {
    const wrapperFilled = mount(ZnDashletSummary, { props: { filled: true } })
    expect(wrapperFilled.attributes('style')).toContain('background:')

    const wrapperOutline = mount(ZnDashletSummary, { props: { filled: false } })
    expect(wrapperOutline.attributes('style')).toContain('background: transparent')
  })
})