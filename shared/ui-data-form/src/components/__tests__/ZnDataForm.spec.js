import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZnDataForm from '../ZnDataForm.vue'

const schema = {
  sections: [
    {
      title: 'Profile',
      layout: 2,
      fields: [
        { path: 'name', type: 'text', label: 'Name', required: true },
        { path: 'contact.email', type: 'email', label: 'Email' },
        { path: 'active', type: 'switch', label: 'Active', default: true }
      ]
    }
  ]
}

function findButton(wrapper, label) {
  return wrapper.findAll('button').find((button) => button.text() === label)
}

describe('ZnDataForm', () => {
  it('renderiza las secciones y aplica los defaults del esquema', () => {
    const wrapper = mount(ZnDataForm, {
      props: { schema, modelValue: { name: 'Ada' } }
    })

    expect(wrapper.text()).toContain('Profile')
    expect(wrapper.find('input').element.value).toBe('Ada')
    expect(wrapper.find('.zn-switch__input').element.checked).toBe(true)
  })

  it('mantiene el borrador y sólo confirma al guardar (live=false)', async () => {
    const wrapper = mount(ZnDataForm, {
      props: { schema, modelValue: { name: 'Ada' } }
    })

    await wrapper.find('input').setValue('Grace')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')[0][0]).toMatchObject({ name: 'Grace' })

    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('update:modelValue')[0][0]).toMatchObject({
      name: 'Grace',
      active: true
    })
    expect(wrapper.emitted('save')).toHaveLength(1)
  })

  it('emite update:modelValue en cada cambio cuando live=true', async () => {
    const wrapper = mount(ZnDataForm, {
      props: { schema, modelValue: { name: 'Ada' }, live: true }
    })

    await wrapper.find('input').setValue('Grace')

    expect(wrapper.emitted('update:modelValue')[0][0]).toMatchObject({ name: 'Grace' })
  })

  it('reset restaura el valor inicial y clear vacía el borrador', async () => {
    const wrapper = mount(ZnDataForm, {
      props: { schema, modelValue: { name: 'Ada' } }
    })

    await wrapper.find('input').setValue('Grace')
    await findButton(wrapper, 'Reset').trigger('click')

    expect(wrapper.find('input').element.value).toBe('Ada')
    expect(wrapper.emitted('reset')[0][0]).toMatchObject({ name: 'Ada' })

    await findButton(wrapper, 'Clear').trigger('click')

    expect(wrapper.find('input').element.value).toBe('')
    expect(wrapper.emitted('clear')).toHaveLength(1)
  })

  it('propaga variante y tamaño con prioridad de sección y de campo', () => {
    const inputSchema = {
      variant: 'filled',
      size: 'small',
      sections: [
        { fields: [{ path: 'a', type: 'text', label: 'A' }] },
        {
          variant: 'outlined',
          size: 'large',
          fields: [
            { path: 'b', type: 'text', label: 'B' },
            { path: 'c', type: 'text', label: 'C', variant: 'filled', size: 'small' }
          ]
        }
      ]
    }

    const wrapper = mount(ZnDataForm, {
      props: { schema: inputSchema, modelValue: {}, showActions: false }
    })

    const fields = wrapper.findAll('.zn-field')
    expect(fields[0].classes()).toContain('zn-field--filled')
    expect(fields[0].classes()).toContain('zn-field--small')
    expect(fields[1].classes()).toContain('zn-field--outlined')
    expect(fields[1].classes()).toContain('zn-field--large')
    expect(fields[2].classes()).toContain('zn-field--filled')
    expect(fields[2].classes()).toContain('zn-field--small')
  })

  it('renderiza y edita listas libres con chips', async () => {
    const listSchema = {
      sections: [
        {
          fields: [
            { path: 'keywords', type: 'list', label: 'Palabras clave' }
          ]
        }
      ]
    }

    const wrapper = mount(ZnDataForm, {
      props: { schema: listSchema, modelValue: { keywords: ['md3'] }, live: true, showActions: false }
    })

    expect(wrapper.findAll('.zn-chip')).toHaveLength(1)
    expect(wrapper.find('.zn-chip').text()).toBe('md3')

    const input = wrapper.find('.zn-list-input__entry input')
    await input.setValue('chips')
    await input.trigger('keydown', { key: 'Enter' })

    const next = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(next.keywords).toEqual(['md3', 'chips'])

    await wrapper.findAll('.zn-chip__remove')[0].trigger('click')
    const afterRemove = wrapper.emitted('update:modelValue').at(-1)[0]
    expect(afterRemove.keywords).toEqual(['chips'])
  })

  it('acepta variant y size como props del formulario', () => {
    const wrapper = mount(ZnDataForm, {
      props: { schema, modelValue: {}, variant: 'filled', size: 'large' }
    })

    const field = wrapper.findAll('.zn-field')[0]
    expect(field.classes()).toContain('zn-field--filled')
    expect(field.classes()).toContain('zn-field--large')
  })

  it('cancel descarta el borrador y restaura el valor inicial', async () => {
    const wrapper = mount(ZnDataForm, {
      props: { schema, modelValue: { name: 'Ada' } }
    })

    await wrapper.find('input').setValue('Grace')
    await findButton(wrapper, 'Cancel').trigger('click')

    expect(wrapper.find('input').element.value).toBe('Ada')
    expect(wrapper.emitted('cancel')).toHaveLength(1)
  })
})
