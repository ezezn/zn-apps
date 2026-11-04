import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnScreen from '../ZnScreen.vue'

describe('ZnScreen Component', () => {
  it('renders the title and subtitle as a structured heading', () => {
    const wrapper = mount(ZnScreen, { props: { title: 'Biblioteca', subtitle: 'Tus sonidos guardados' } })

    expect(wrapper.find('.zn-screen__header').exists()).toBe(true)
    expect(wrapper.find('.zn-screen__title').text()).toBe('Biblioteca')
    expect(wrapper.find('.zn-screen__subtitle').text()).toBe('Tus sonidos guardados')
  })

  it('supports title or subtitle independently', () => {
    const titleOnly = mount(ZnScreen, { props: { title: 'Inicio' } })
    expect(titleOnly.find('.zn-screen__title').text()).toBe('Inicio')
    expect(titleOnly.find('.zn-screen__subtitle').exists()).toBe(false)

    const subtitleOnly = mount(ZnScreen, { props: { subtitle: 'Vista general' } })
    expect(subtitleOnly.find('.zn-screen__header').exists()).toBe(true)
    expect(subtitleOnly.find('.zn-screen__title').exists()).toBe(false)
    expect(subtitleOnly.find('.zn-screen__subtitle').text()).toBe('Vista general')
  })

  it('omits the header when no heading content or header slots are provided', () => {
    const wrapper = mount(ZnScreen)
    expect(wrapper.find('.zn-screen__header').exists()).toBe(false)
  })

  it('keeps the title slot as a custom title override', () => {
    const wrapper = mount(ZnScreen, {
      props: { title: 'Fallback', subtitle: 'Descripción' },
      slots: { title: '<strong>Personalizado</strong>' }
    })

    expect(wrapper.find('.zn-screen__title strong').text()).toBe('Personalizado')
    expect(wrapper.find('.zn-screen__subtitle').text()).toBe('Descripción')
  })
})
