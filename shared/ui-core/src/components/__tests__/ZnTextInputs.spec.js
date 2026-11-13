import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZnSingleLineText from '../input/ZnSingleLineText.vue'
import ZnMultilineText from '../input/ZnMultilineText.vue'
import ZnEmailInput from '../input/ZnEmailInput.vue'
import ZnPhoneInput from '../input/ZnPhoneInput.vue'
import ZnDateInput from '../input/ZnDateInput.vue'
import ZnTimeInput from '../input/ZnTimeInput.vue'
import ZnDateTimeInput from '../input/ZnDateTimeInput.vue'

describe('ZnSingleLineText', () => {
  it('emite update:modelValue al escribir y flota la etiqueta', async () => {
    const wrapper = mount(ZnSingleLineText, {
      props: { modelValue: '', label: 'Nombre' }
    })

    expect(wrapper.find('.zn-field__label').text()).toBe('Nombre')
    expect(wrapper.find('.zn-field').classes()).not.toContain('zn-field--floating')

    await wrapper.find('input').setValue('Ada')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Ada'])
  })

  it('flota la etiqueta cuando tiene valor y marca error accesible', () => {
    const wrapper = mount(ZnSingleLineText, {
      props: { modelValue: 'Ada', label: 'Nombre', error: 'Campo obligatorio' }
    })

    expect(wrapper.find('.zn-field').classes()).toContain('zn-field--floating')
    expect(wrapper.find('.zn-field').classes()).toContain('zn-field--error')
    expect(wrapper.find('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('.zn-field__supporting').text()).toBe('Campo obligatorio')
  })

  it('permite omitir la etiqueta y usar aria-label en el control', () => {
    const wrapper = mount(ZnSingleLineText, {
      props: { modelValue: '', placeholder: 'Buscar' },
      attrs: { 'aria-label': 'Buscar sonidos' }
    })

    expect(wrapper.find('.zn-field__label').exists()).toBe(false)
    expect(wrapper.find('.zn-field').classes()).not.toContain('zn-field--floating')
    expect(wrapper.find('input').attributes('aria-label')).toBe('Buscar sonidos')
  })

  it('marca el campo con icono inicial para desplazar la etiqueta en reposo', () => {
    const wrapper = mount(ZnSingleLineText, {
      props: { modelValue: '', label: 'Buscar' },
      slots: { leading: '<span class="test-leading">icono</span>' }
    })

    expect(wrapper.find('.zn-field').classes()).toContain('zn-field--has-leading')
    expect(wrapper.find('.test-leading').exists()).toBe(true)
  })

  it('no marca has-label cuando se omite la etiqueta', () => {
    const wrapper = mount(ZnSingleLineText, {
      props: { modelValue: '', placeholder: 'Buscar' }
    })

    expect(wrapper.find('.zn-field').classes()).not.toContain('zn-field--has-label')
    expect(wrapper.find('.zn-field__label').exists()).toBe(false)
  })

  it('aplica la variante outlined por defecto y filled cuando se solicita', () => {
    const outlined = mount(ZnSingleLineText, { props: { modelValue: '' } })
    expect(outlined.find('.zn-field').classes()).toContain('zn-field--outlined')
    expect(outlined.find('.zn-field__outline').exists()).toBe(true)

    const filled = mount(ZnSingleLineText, {
      props: { modelValue: '', label: 'Nombre', variant: 'filled' }
    })
    expect(filled.find('.zn-field').classes()).toContain('zn-field--filled')
    expect(filled.find('.zn-field__outline').exists()).toBe(false)
  })

  it('aplica medium por defecto y propaga los tamaños MD3', () => {
    const medium = mount(ZnSingleLineText, { props: { modelValue: '' } })
    expect(medium.find('.zn-field').classes()).toContain('zn-field--medium')

    const small = mount(ZnSingleLineText, {
      props: { modelValue: '', label: 'Compacto', size: 'small' }
    })
    expect(small.find('.zn-field').classes()).toContain('zn-field--small')

    const large = mount(ZnSingleLineText, {
      props: { modelValue: '', label: 'Amplio', size: 'large', variant: 'filled' }
    })
    expect(large.find('.zn-field').classes()).toContain('zn-field--large')
    expect(large.find('.zn-field').classes()).toContain('zn-field--filled')
  })

  it('mantiene la etiqueta flotante con floatLabel aunque esté vacío', () => {
    const wrapper = mount(ZnSingleLineText, {
      props: { modelValue: '', label: 'Nombre', floatLabel: true }
    })

    expect(wrapper.find('.zn-field').classes()).toContain('zn-field--floating')
  })

  it('muestra el texto de asistencia y respeta disabled/readonly', () => {
    const wrapper = mount(ZnSingleLineText, {
      props: { modelValue: '', hint: 'Solo números', disabled: true, readonly: true }
    })

    expect(wrapper.find('.zn-field__supporting').text()).toBe('Solo números')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })
})

describe('ZnMultilineText', () => {
  it('soporta la variante filled', () => {
    const wrapper = mount(ZnMultilineText, {
      props: { modelValue: '', label: 'Notas', variant: 'filled' }
    })
    expect(wrapper.find('.zn-field').classes()).toContain('zn-field--filled')
  })

  it('renderiza un textarea con las filas indicadas y emite cambios', async () => {
    const wrapper = mount(ZnMultilineText, {
      props: { modelValue: '', label: 'Comentarios', rows: 6 }
    })

    const textarea = wrapper.find('textarea')
    expect(textarea.attributes('rows')).toBe('6')

    await textarea.setValue('Hola mundo')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['Hola mundo'])
  })
})

describe('ZnEmailInput', () => {
  it('valida el formato al perder el foco', async () => {
    const wrapper = mount(ZnEmailInput, {
      props: { modelValue: 'no-es-un-correo', label: 'Correo' }
    })

    const input = wrapper.find('input[type="email"]')
    await input.trigger('blur')

    expect(wrapper.emitted('validation')[0]).toEqual([false])
    expect(wrapper.find('.zn-field--error').exists()).toBe(true)
  })

  it('acepta un correo válido y no muestra error', async () => {
    const wrapper = mount(ZnEmailInput, {
      props: { modelValue: 'ada@lovelace.dev', label: 'Correo' }
    })

    await wrapper.find('input').trigger('blur')

    expect(wrapper.emitted('validation')[0]).toEqual([true])
    expect(wrapper.find('.zn-field--error').exists()).toBe(false)
  })
})

describe('ZnPhoneInput', () => {
  it('sanea los caracteres no telefónicos', async () => {
    const wrapper = mount(ZnPhoneInput, {
      props: { modelValue: '', label: 'Teléfono' }
    })

    await wrapper.find('input').setValue('abc+34 600-123')

    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['+34 600-123'])
  })

  it('retira del DOM los caracteres descartados', async () => {
    const wrapper = mount(ZnPhoneInput, {
      props: { modelValue: '12', label: 'Teléfono' }
    })

    const input = wrapper.find('input')
    await input.setValue('12a')
    await wrapper.vm.$nextTick()

    expect(input.element.value).toBe('12')
  })

  it('valida el número de dígitos al salir del campo', async () => {
    const wrapper = mount(ZnPhoneInput, {
      props: { modelValue: '123', label: 'Teléfono', minDigits: 6 }
    })

    await wrapper.find('input').trigger('blur')

    expect(wrapper.emitted('update:valid')[0]).toEqual([false])
    expect(wrapper.find('.zn-field--error').exists()).toBe(true)
  })
})

describe('Campos temporales nativos', () => {
  const cases = [
    [ZnDateInput, 'date'],
    [ZnTimeInput, 'time'],
    [ZnDateTimeInput, 'datetime-local']
  ]

  it.each(cases)('renderiza el tipo nativo correcto', (Component, type) => {
    const wrapper = mount(Component, {
      props: { modelValue: '', label: 'Fecha' }
    })

    expect(wrapper.find(`input[type="${type}"]`).exists()).toBe(true)
  })

  it('propaga la variante filled al campo de fecha', () => {
    const wrapper = mount(ZnDateInput, {
      props: { modelValue: '', label: 'Fecha', variant: 'filled' }
    })

    expect(wrapper.find('.zn-field').classes()).toContain('zn-field--filled')
  })

  it('propaga el tamaño small a los campos de fecha y email', () => {
    const date = mount(ZnDateInput, {
      props: { modelValue: '', label: 'Fecha', size: 'small' }
    })
    expect(date.find('.zn-field').classes()).toContain('zn-field--small')

    const email = mount(ZnEmailInput, {
      props: { modelValue: '', label: 'Correo', size: 'large', variant: 'filled' }
    })
    expect(email.find('.zn-field').classes()).toContain('zn-field--large')
    expect(email.find('.zn-field').classes()).toContain('zn-field--filled')
  })

  it('mantiene la etiqueta flotante en campos temporales vacíos', () => {
    const wrapper = mount(ZnDateInput, {
      props: { modelValue: '', label: 'Fecha' }
    })

    expect(wrapper.find('.zn-field').classes()).toContain('zn-field--floating')
  })

  it('propaga min y max al input de fecha', () => {
    const wrapper = mount(ZnDateInput, {
      props: { modelValue: '2026-11-12', label: 'Fecha', min: '2026-01-01', max: '2026-12-31' }
    })

    const input = wrapper.find('input')
    expect(input.attributes('min')).toBe('2026-01-01')
    expect(input.attributes('max')).toBe('2026-12-31')
  })
})
