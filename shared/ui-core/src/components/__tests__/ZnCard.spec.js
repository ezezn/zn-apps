import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnCard from '../ZnCard.vue'

describe('ZnCard Component', () => {
  it('renderiza con variante filled por defecto', () => {
    const wrapper = mount(ZnCard, {
      props: { title: 'Tarjeta Demo' },
      slots: { default: '<p>Cuerpo</p>' }
    })
    expect(wrapper.classes()).toContain('zn-card--filled')
    expect(wrapper.find('.zn-card__title').text()).toBe('Tarjeta Demo')
    expect(wrapper.text()).toContain('Cuerpo')
  })

  it('aplica las clases elevated y outlined correctamente', () => {
    const elevated = mount(ZnCard, { props: { variant: 'elevated' } })
    expect(elevated.classes()).toContain('zn-card--elevated')

    const outlined = mount(ZnCard, { props: { variant: 'outlined' } })
    expect(outlined.classes()).toContain('zn-card--outlined')
  })

  it('soporta imagen en cabecera con estilo de fondo', () => {
    const wrapper = mount(ZnCard, {
      props: {
        title: 'Con Imagen',
        image: 'https://example.com/cover.jpg',
        imageVariant: 'header'
      }
    })
    const header = wrapper.find('.zn-card__header')
    expect(header.classes()).toContain('zn-card__header--has-image')
    expect(header.attributes('style')).toContain('https://example.com/cover.jpg')
  })

  it('soporta imagen de fondo completo con clase zn-card--full-image', () => {
    const wrapper = mount(ZnCard, {
      props: {
        title: 'Full Image',
        image: 'https://example.com/bg.jpg',
        imageVariant: 'full'
      }
    })
    expect(wrapper.classes()).toContain('zn-card--full-image')
    expect(wrapper.attributes('style')).toContain('https://example.com/bg.jpg')
    expect(wrapper.find('.zn-card__scrim-full').exists()).toBe(true)
  })
})
