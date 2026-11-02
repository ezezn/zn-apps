import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnSwitch from '../ZnSwitch.vue'

describe('ZnSwitch Component', () => {
  it('renderiza en estado apagado por defecto', () => {
    const wrapper = mount(ZnSwitch, {
      props: { modelValue: false }
    })
    expect(wrapper.find('.zn-switch').classes()).not.toContain('zn-switch--checked')
    const input = wrapper.find('input[type="checkbox"]')
    expect(input.element.checked).toBe(false)
  })

  it('refleja estado encendido cuando modelValue es true', () => {
    const wrapper = mount(ZnSwitch, {
      props: { modelValue: true }
    })
    expect(wrapper.find('.zn-switch').classes()).toContain('zn-switch--checked')
    const input = wrapper.find('input[type="checkbox"]')
    expect(input.element.checked).toBe(true)
  })

  it('emite update:modelValue y change al hacer toggle', async () => {
    const wrapper = mount(ZnSwitch, {
      props: { modelValue: false }
    })
    const input = wrapper.find('input[type="checkbox"]')
    
    await input.setValue(true)

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([true])
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')[0]).toEqual([true])
  })

  it('muestra las etiquetas laterales labelLeft y labelRight', () => {
    const wrapper = mount(ZnSwitch, {
      props: {
        modelValue: false,
        labelLeft: 'Izquierda',
        labelRight: 'Derecha'
      }
    })
    expect(wrapper.find('.zn-switch__label--left').text()).toBe('Izquierda')
    expect(wrapper.find('.zn-switch__label--right').text()).toBe('Derecha')
  })

  it('aplica estado deshabilitado si prop disabled es true', () => {
    const wrapper = mount(ZnSwitch, {
      props: { disabled: true }
    })
    expect(wrapper.classes()).toContain('zn-switch-wrapper--disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('activa clase has-icons cuando se proveen slots de icono', () => {
    const wrapper = mount(ZnSwitch, {
      props: { modelValue: true },
      slots: {
        iconOn: '<span class="icon-on">ON</span>'
      }
    })
    expect(wrapper.find('.zn-switch').classes()).toContain('zn-switch--has-icons')
    expect(wrapper.find('.icon-on').text()).toBe('ON')
  })

  it('soporta variantes con texto dentro mediante props textOn y textOff', () => {
    const wrapperOn = mount(ZnSwitch, {
      props: { modelValue: true, textOn: 'ON', textOff: 'OFF' }
    })
    expect(wrapperOn.find('.zn-switch').classes()).toContain('zn-switch--has-icons')
    expect(wrapperOn.find('.zn-switch__icon').text()).toBe('ON')

    const wrapperOff = mount(ZnSwitch, {
      props: { modelValue: false, textOn: 'ON', textOff: 'OFF' }
    })
    expect(wrapperOff.find('.zn-switch').classes()).toContain('zn-switch--has-icons')
    expect(wrapperOff.find('.zn-switch__icon').text()).toBe('OFF')
  })

  it('funciona como switch puro sin etiquetas exteriores (standalone)', () => {
    const wrapper = mount(ZnSwitch, {
      props: { modelValue: true }
    })
    expect(wrapper.find('.zn-switch__label--left').exists()).toBe(false)
    expect(wrapper.find('.zn-switch__label--right').exists()).toBe(false)
    expect(wrapper.find('.zn-switch').exists()).toBe(true)
  })
})
