import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnChip from '../controls/ZnChip.vue'

describe('ZnChip', () => {
  it('aplica la variante y el tamaño por defecto', () => {
    const wrapper = mount(ZnChip, { props: { label: 'Etiqueta' } })

    expect(wrapper.classes()).toContain('zn-chip--assist')
    expect(wrapper.classes()).toContain('zn-chip--medium')
    expect(wrapper.text()).toBe('Etiqueta')
  })

  it('soporta las cuatro variantes MD3 y la escala de tamaños', () => {
    const variants = ['assist', 'filter', 'input', 'suggestion']

    for (const variant of variants) {
      const wrapper = mount(ZnChip, { props: { variant, label: variant } })
      expect(wrapper.classes()).toContain(`zn-chip--${variant}`)
    }

    const small = mount(ZnChip, { props: { size: 'small' } })
    expect(small.classes()).toContain('zn-chip--small')

    const large = mount(ZnChip, { props: { size: 'large' } })
    expect(large.classes()).toContain('zn-chip--large')
  })

  it('muestra el check solo en filtros seleccionados', () => {
    const selected = mount(ZnChip, {
      props: { variant: 'filter', label: 'Filtro', selected: true }
    })
    expect(selected.classes()).toContain('zn-chip--selected')
    expect(selected.find('.zn-chip__leading').exists()).toBe(true)

    const unselected = mount(ZnChip, {
      props: { variant: 'filter', label: 'Filtro' }
    })
    expect(unselected.find('.zn-chip__leading').exists()).toBe(false)
  })

  it('expone el filtro como checkbox accesible al ser interactivo', () => {
    const wrapper = mount(ZnChip, {
      props: { variant: 'filter', label: 'Filtro', selected: true, clickable: true }
    })

    expect(wrapper.attributes('role')).toBe('checkbox')
    expect(wrapper.attributes('aria-checked')).toBe('true')
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('emite remove desde el botón de quitar', async () => {
    const wrapper = mount(ZnChip, {
      props: { variant: 'input', label: 'Ada', removable: true }
    })

    await wrapper.find('.zn-chip__remove').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
  })

  it('marca el estilo elevado y bloquea la interacción si está deshabilitado', async () => {
    const wrapper = mount(ZnChip, {
      props: { variant: 'suggestion', label: 'Sugerencia', elevated: true, disabled: true, clickable: true }
    })

    expect(wrapper.classes()).toContain('zn-chip--elevated')
    expect(wrapper.classes()).toContain('zn-chip--disabled')
    expect(wrapper.attributes('tabindex')).toBeUndefined()

    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
  })
})
