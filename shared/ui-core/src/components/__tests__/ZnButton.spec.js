import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnButton from '../ZnButton.vue'

describe('ZnButton Component', () => {
  it('renderiza la variante filled por defecto', () => {
    const wrapper = mount(ZnButton, {
      slots: { default: 'Presionar' }
    })
    expect(wrapper.classes()).toContain('zn-button--filled')
    expect(wrapper.text()).toBe('Presionar')
  })

  it('aplica las clases de las diferentes variantes (tonal, outlined, elevated, text)', async () => {
    const variants = ['tonal', 'elevated', 'outlined', 'text']
    for (const variant of variants) {
      const wrapper = mount(ZnButton, { props: { variant } })
      expect(wrapper.classes()).toContain(`zn-button--${variant}`)
    }
  })

  it('soporta la propiedad disabled', () => {
    const wrapper = mount(ZnButton, {
      props: { disabled: true }
    })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('soporta renderizar un tag diferente como <a>', () => {
    const wrapper = mount(ZnButton, {
      props: { tag: 'a' },
      slots: { default: 'Enlace' }
    })
    expect(wrapper.element.tagName.toLowerCase()).toBe('a')
    expect(wrapper.attributes('role')).toBe('button')
  })

  it('renderiza en modo iconOnly con clase adecuada', () => {
    const wrapper = mount(ZnButton, {
      props: { iconOnly: true },
      slots: { default: '<svg data-testid="test-svg"></svg>' }
    })
    expect(wrapper.classes()).toContain('zn-button--icon-only')
    expect(wrapper.find('[data-testid="test-svg"]').exists()).toBe(true)
  })

  it('renderiza el slot icon junto al texto cuando no es iconOnly', () => {
    const wrapper = mount(ZnButton, {
      slots: {
        icon: '<span class="test-icon">icon</span>',
        default: 'Botón con icono'
      }
    })
    expect(wrapper.find('.zn-button__icon-slot').exists()).toBe(true)
    expect(wrapper.find('.test-icon').text()).toBe('icon')
    expect(wrapper.find('.zn-button__text').text()).toBe('Botón con icono')
  })
})
