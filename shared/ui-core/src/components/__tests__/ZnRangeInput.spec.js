import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnRangeInput from '../input/ZnRangeInput.vue'
import ZnDateRangeInput from '../input/ZnDateRangeInput.vue'
import ZnTimeRangeInput from '../input/ZnTimeRangeInput.vue'
import ZnDateTimeRangeInput from '../input/ZnDateTimeRangeInput.vue'

describe('ZnRangeInput', () => {
  it('renderiza un único actuador en modo simple', () => {
    const wrapper = mount(ZnRangeInput, {
      props: { modelValue: 25, min: 0, max: 100, step: 5, label: 'Volumen' }
    })

    const inputs = wrapper.findAll('input[type="range"]')
    expect(inputs).toHaveLength(1)
    expect(inputs[0].attributes('step')).toBe('5')
    expect(wrapper.find('.zn-range__value').text()).toBe('25')
    expect(wrapper.find('.zn-range__active').attributes('style')).toContain('width: 25%')
  })

  it('emite update:modelValue al mover el actuador', async () => {
    const wrapper = mount(ZnRangeInput, {
      props: { modelValue: 10, min: 0, max: 100 }
    })

    await wrapper.find('input[type="range"]').setValue('40')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([40])
  })

  it('soporta rango de dos actuadores con formato personalizado', () => {
    const wrapper = mount(ZnRangeInput, {
      props: {
        modelValue: [20, 60],
        min: 0,
        max: 100,
        valueFormat: (value) => `${value} €`
      }
    })

    expect(wrapper.findAll('input[type="range"]')).toHaveLength(2)
    expect(wrapper.find('.zn-range__value').text()).toBe('20 € – 60 €')
    expect(wrapper.find('.zn-range__active').attributes('style')).toContain('left: 20%')
    expect(wrapper.find('.zn-range__active').attributes('style')).toContain('width: 40%')
  })

  it('no cruza los valores del rango dual', async () => {
    const wrapper = mount(ZnRangeInput, {
      props: { modelValue: [20, 60], min: 0, max: 100 }
    })

    const [start, end] = wrapper.findAll('input[type="range"]')
    await start.setValue('80')
    expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([60, 60])

    await end.setValue('10')
    expect(wrapper.emitted('update:modelValue')[1][0]).toEqual([20, 20])
  })

  it('dibuja las marcas del slider discreto', () => {
    const wrapper = mount(ZnRangeInput, {
      props: { modelValue: 4, min: 0, max: 10, step: 2, showTicks: true }
    })

    expect(wrapper.findAll('.zn-range__tick')).toHaveLength(6)
  })

  it('crece desde el centro en el slider centrado', () => {
    const wrapper = mount(ZnRangeInput, {
      props: { modelValue: 75, min: 0, max: 100, centered: true }
    })

    const style = wrapper.find('.zn-range__active').attributes('style')
    expect(style).toContain('left: 50%')
    expect(style).toContain('width: 25%')
  })

  it('aplica el estado deshabilitado', () => {
    const wrapper = mount(ZnRangeInput, {
      props: { modelValue: 30, disabled: true }
    })

    expect(wrapper.classes()).toContain('zn-range--disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })
})

describe('ZnDateRangeInput', () => {
  it('renderiza dos campos de fecha', () => {
    const wrapper = mount(ZnDateRangeInput, {
      props: { modelValue: ['', ''], startLabel: 'Desde', endLabel: 'Hasta' }
    })

    const inputs = wrapper.findAll('input[type="date"]')
    expect(inputs).toHaveLength(2)
    expect(wrapper.text()).toContain('Desde')
    expect(wrapper.text()).toContain('Hasta')
  })

  it('emite el par actualizado al cambiar una fecha', async () => {
    const wrapper = mount(ZnDateRangeInput, {
      props: { modelValue: ['2026-01-01', ''] }
    })

    const inputs = wrapper.findAll('input[type="date"]')
    await inputs[1].setValue('2026-02-01')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['2026-01-01', '2026-02-01']])
  })

  it('propaga la variante filled a ambos campos', () => {
    const wrapper = mount(ZnDateRangeInput, {
      props: { modelValue: ['', ''], variant: 'filled' }
    })

    expect(wrapper.findAll('.zn-temporal-range__field .zn-field--filled')).toHaveLength(2)
  })

  it('marca error cuando la fecha final es anterior a la inicial', () => {
    const wrapper = mount(ZnDateRangeInput, {
      props: { modelValue: ['2026-05-01', '2026-04-01'] }
    })

    expect(wrapper.find('.zn-temporal-range__field .zn-field--error').exists()).toBe(true)
    expect(wrapper.text()).toContain('no puede ser anterior')
  })

  it('restringe los límites de cada campo con la otra fecha', () => {
    const wrapper = mount(ZnDateRangeInput, {
      props: { modelValue: ['2026-05-01', '2026-06-01'] }
    })

    const inputs = wrapper.findAll('input[type="date"]')
    expect(inputs[0].attributes('max')).toBe('2026-06-01')
    expect(inputs[1].attributes('min')).toBe('2026-05-01')
  })
})

describe('ZnTimeRangeInput', () => {
  it('renderiza dos campos de hora y emite el par actualizado', async () => {
    const wrapper = mount(ZnTimeRangeInput, {
      props: { modelValue: ['09:00', ''], startLabel: 'Apertura', endLabel: 'Cierre' }
    })

    const inputs = wrapper.findAll('input[type="time"]')
    expect(inputs).toHaveLength(2)
    expect(wrapper.text()).toContain('Apertura')
    expect(wrapper.text()).toContain('Cierre')

    await inputs[1].setValue('18:30')
    expect(wrapper.emitted('update:modelValue')[0]).toEqual([['09:00', '18:30']])
  })

  it('flota las etiquetas aunque los campos estén vacíos', () => {
    const wrapper = mount(ZnTimeRangeInput, {
      props: { modelValue: ['', ''] }
    })

    expect(wrapper.findAll('.zn-temporal-range__field .zn-field--floating')).toHaveLength(2)
  })

  it('marca error cuando la hora final es anterior a la inicial', () => {
    const wrapper = mount(ZnTimeRangeInput, {
      props: { modelValue: ['18:00', '09:00'] }
    })

    expect(wrapper.find('.zn-temporal-range__field .zn-field--error').exists()).toBe(true)
    expect(wrapper.text()).toContain('no puede ser anterior')
  })
})

describe('ZnDateTimeRangeInput', () => {
  it('renderiza dos campos datetime-local con límites cruzados', () => {
    const wrapper = mount(ZnDateTimeRangeInput, {
      props: { modelValue: ['2026-05-01T09:00', '2026-05-01T18:00'] }
    })

    const inputs = wrapper.findAll('input[type="datetime-local"]')
    expect(inputs).toHaveLength(2)
    expect(inputs[0].attributes('max')).toBe('2026-05-01T18:00')
    expect(inputs[1].attributes('min')).toBe('2026-05-01T09:00')
  })

  it('emite el par de fecha-hora al cambiar el inicio', async () => {
    const wrapper = mount(ZnDateTimeRangeInput, {
      props: { modelValue: ['2026-05-01T09:00', '2026-05-01T18:00'] }
    })

    await wrapper.findAll('input[type="datetime-local"]')[0].setValue('2026-05-01T08:00')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual([
      ['2026-05-01T08:00', '2026-05-01T18:00']
    ])
  })
})
