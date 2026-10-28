import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('Zound Box App', () => {
  it('renderiza correctamente el título de la aplicación', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Zound Box')
  })

  it('renderiza las secciones principales de la interfaz', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Variantes de Énfasis')
    expect(wrapper.text()).toContain('Botones con Iconos')
    expect(wrapper.text()).toContain('Layouts Multicolumna Estrictos')
    expect(wrapper.text()).toContain('Grilla de Alta Densidad')
  })

  it('permite alternar el estado del switch de modo oscuro', async () => {
    const wrapper = mount(App)
    const switchInput = wrapper.find('input[type="checkbox"]')
    expect(switchInput.exists()).toBe(true)

    expect(switchInput.element.checked).toBe(false)
    await switchInput.setValue(true)
    expect(switchInput.element.checked).toBe(true)
  })
})
