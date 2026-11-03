import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('Zound Box App', () => {
  it('renderiza correctamente el título de la aplicación', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Zound Box')
  })

  it('muestra controles separados para sonidos principales y ambientales', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('Sonido en primer plano')
    expect(wrapper.text()).toContain('Sonidos de fondo')
    expect(wrapper.text()).toContain('Piano suave')
    expect(wrapper.text()).toContain('Lluvia suave')
    expect(wrapper.text()).toContain('Bosque')
    expect(wrapper.text()).toContain('Chimenea')
    expect(wrapper.text()).toContain('Olas del mar')
  })

  it('permite alternar el estado del switch de modo oscuro', async () => {
    const wrapper = mount(App)
    const switchInput = wrapper.find('input[type="checkbox"]')
    expect(switchInput.exists()).toBe(true)

    expect(switchInput.element.checked).toBe(false)
    await switchInput.setValue(true)
    expect(switchInput.element.checked).toBe(true)
  })

  it('actualiza el resumen al activar sonidos de fondo', async () => {
    const wrapper = mount(App)
    const switches = wrapper.findAll('input[type="checkbox"]')

    expect(switches).toHaveLength(6)
    expect(wrapper.text()).toContain('0 sonidos de fondo activos')

    await switches[2].setValue(true)

    expect(wrapper.text()).toContain('1 sonido de fondo activo')
  })
})
