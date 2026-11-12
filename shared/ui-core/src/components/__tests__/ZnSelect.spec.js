import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnSelect from '../input/ZnSelect.vue'

const teleportStub = { global: { stubs: { teleport: true } } }

const options = [
  { value: 'a', label: 'Opción A' },
  { value: 'b', label: 'Opción B' },
  { value: 'c', label: 'Opción C' }
]

describe('ZnSelect', () => {
  it('muestra el placeholder y no abre el menú por defecto', () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: null, options, placeholder: 'Selecciona' },
      ...teleportStub
    })

    expect(wrapper.find('.zn-select__value').text()).toBe('Selecciona')
    expect(wrapper.find('.zn-select__menu').exists()).toBe(false)
  })

  it('oculta el placeholder mientras la etiqueta no flota', () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: null, options, label: 'Elegir', placeholder: 'Selecciona' },
      ...teleportStub
    })

    expect(wrapper.find('.zn-select__value').text()).toBe('')
  })

  it('abre el menú y permite seleccionar una opción', async () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: null, options, label: 'Elegir' },
      ...teleportStub
    })

    await wrapper.find('.zn-select__trigger').trigger('click')

    const menu = wrapper.find('.zn-select__menu')
    expect(menu.exists()).toBe(true)
    expect(menu.findAll('.zn-select__option')).toHaveLength(3)

    await menu.findAll('.zn-select__option')[1].trigger('click')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['b'])
    expect(wrapper.emitted('change')[0]).toEqual(['b'])
    expect(wrapper.find('.zn-select__menu').exists()).toBe(false)

    await wrapper.setProps({ modelValue: 'b' })
    expect(wrapper.find('.zn-select__value').text()).toBe('Opción B')
  })

  it('limita la altura del menú con maxVisibleItems y activa scroll', async () => {
    const manyOptions = Array.from({ length: 12 }, (_, index) => `Opción ${index}`)
    const wrapper = mount(ZnSelect, {
      props: { modelValue: null, options: manyOptions, maxVisibleItems: 4 },
      ...teleportStub
    })

    await wrapper.find('.zn-select__trigger').trigger('click')

    const menu = wrapper.find('.zn-select__menu')
    expect(menu.attributes('style')).toContain('max-height: 200px')
  })

  it('soporta selección múltiple con chips y eliminación', async () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: [], options, multiple: true },
      ...teleportStub
    })

    const trigger = wrapper.find('.zn-select__trigger')
    await trigger.trigger('click')
    await wrapper.findAll('.zn-select__option')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['a']])

    await wrapper.setProps({ modelValue: ['a'] })
    await wrapper.findAll('.zn-select__option')[2].trigger('click')

    expect(wrapper.emitted('update:modelValue')[1]).toEqual([['a', 'c']])

    await wrapper.setProps({ modelValue: ['a', 'c'] })
    expect(wrapper.findAll('.zn-select__chip')).toHaveLength(2)
  })

  it('permite quitar un chip de selección múltiple', async () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: ['a', 'b'], options, multiple: true },
      ...teleportStub
    })

    await wrapper.findAll('.zn-select__chip-remove')[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['b']])
  })

  it('no selecciona opciones deshabilitadas', async () => {
    const wrapper = mount(ZnSelect, {
      props: {
        modelValue: null,
        options: [{ value: 'x', label: 'Bloqueada', disabled: true }, ...options]
      },
      ...teleportStub
    })

    await wrapper.find('.zn-select__trigger').trigger('click')
    const option = wrapper.findAll('.zn-select__option')[0]
    expect(option.attributes('disabled')).toBeDefined()

    await option.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('navega con teclado y selecciona con Enter', async () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: null, options },
      ...teleportStub
    })

    const trigger = wrapper.find('.zn-select__trigger')
    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.zn-select__menu').exists()).toBe(true)
    expect(wrapper.find('.zn-select__option--active').text()).toBe('Opción A')

    await trigger.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.find('.zn-select__option--active').text()).toBe('Opción B')

    await trigger.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['b'])
  })

  it('cierra el menú con Escape', async () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: null, options },
      ...teleportStub
    })

    const trigger = wrapper.find('.zn-select__trigger')
    await trigger.trigger('click')
    expect(wrapper.find('.zn-select__menu').exists()).toBe(true)

    await trigger.trigger('keydown', { key: 'Escape' })
    expect(wrapper.find('.zn-select__menu').exists()).toBe(false)
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('no abre el menú si está deshabilitado', async () => {
    const wrapper = mount(ZnSelect, {
      props: { modelValue: null, options, disabled: true },
      ...teleportStub
    })

    const trigger = wrapper.find('.zn-select__trigger')
    expect(trigger.attributes('disabled')).toBeDefined()

    await trigger.trigger('click')
    expect(wrapper.find('.zn-select__menu').exists()).toBe(false)
  })
})
