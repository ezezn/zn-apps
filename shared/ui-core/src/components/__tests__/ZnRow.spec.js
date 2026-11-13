import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnRow from '../containers/ZnRow.vue'

describe('ZnRow', () => {
  it('aplica padding, gap y alineación por defecto', () => {
    const wrapper = mount(ZnRow)

    expect(wrapper.attributes('style')).toContain('padding: 16px')
    expect(wrapper.attributes('style')).toContain('gap: 12px')
    expect(wrapper.attributes('style')).toContain('align-items: center')
    expect(wrapper.attributes('style')).toContain('flex-direction: row')
  })

  it('soporta dirección columna, justificación y wrap', () => {
    const wrapper = mount(ZnRow, {
      props: {
        padding: '0',
        gap: '8px',
        direction: 'column',
        justify: 'space-between',
        align: 'stretch',
        wrap: true
      }
    })

    const style = wrapper.attributes('style')
    expect(style).toContain('flex-direction: column')
    expect(style).toContain('justify-content: space-between')
    expect(style).toContain('align-items: stretch')
    expect(style).toContain('flex-wrap: wrap')
  })
})
