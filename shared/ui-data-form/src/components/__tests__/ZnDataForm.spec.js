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
