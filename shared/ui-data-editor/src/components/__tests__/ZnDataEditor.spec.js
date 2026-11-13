import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { beforeAll, describe, expect, it } from 'vitest'
import ZnDataEditor from '../ZnDataEditor.vue'

const schema = {
  sections: [
    {
      title: 'Perfil',
      layout: 1,
      fields: [
        { path: 'name', type: 'text', label: 'Nombre' },
        { path: 'role', type: 'select', label: 'Rol', options: [
          { value: 'admin', label: 'Administración' },
          { value: 'editor', label: 'Edición' }
        ] },
        { path: 'system.id', type: 'text', label: 'ID', disabled: true }
      ]
    }
  ]
}

const modelValue = {
  name: 'Ada Lovelace',
  role: 'admin',
  system: { id: 'usr-001' }
}

function saveButton(wrapper) {
  return wrapper.findAll('button').find((button) => button.text() === 'Save')
}

beforeAll(() => {
  // happy-dom no implementa el diálogo modal nativo en todas sus versiones.
  const proto = window.HTMLDialogElement?.prototype
  if (proto && typeof proto.showModal !== 'function') {
    proto.showModal = function showModal() {
      this.open = true
    }
    proto.close = function close(value) {
      this.open = false
      this.returnValue = value ?? ''
      this.dispatchEvent(new Event('close'))
    }
  }
})

describe('ZnDataEditor', () => {
  it('presenta los valores con un trigger editable por campo', () => {
    const wrapper = mount(ZnDataEditor, { props: { schema, modelValue } })

    const fields = wrapper.findAll('.zn-view-field')
    expect(fields).toHaveLength(3)
    expect(fields[0].text()).toContain('Ada Lovelace')
    expect(fields[1].text()).toContain('Administración')
    expect(wrapper.findAll('.zn-field-trigger')).toHaveLength(3)
  })

  it('abre el diálogo y confirma la edición en la ruta del campo', async () => {
    const wrapper = mount(ZnDataEditor, { props: { schema, modelValue } })

    await wrapper.findAll('.zn-field-trigger')[0].trigger('click')
    await nextTick()
    await nextTick()

    const dialog = wrapper.find('dialog')
    expect(dialog.element.open).toBe(true)
    expect(dialog.text()).toContain('Edit Nombre')

    await dialog.find('input').setValue('Grace Hopper')
    await saveButton(wrapper).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    expect(wrapper.emitted('update:modelValue')[0][0]).toMatchObject({ name: 'Grace Hopper' })
    expect(wrapper.emitted('change')[0][0]).toMatchObject({ name: 'Grace Hopper' })
    expect(wrapper.emitted('change')[0][1]).toBe('name')
    expect(dialog.element.open).toBe(false)
  })

  it('no abre el diálogo para campos disabled o readonly', async () => {
    const wrapper = mount(ZnDataEditor, { props: { schema, modelValue } })

    const disabledTrigger = wrapper.findAll('.zn-field-trigger')[2]
    expect(disabledTrigger.classes()).toContain('zn-field-trigger--disabled')

    await disabledTrigger.trigger('click')
    await nextTick()

    expect(wrapper.find('dialog').element.open).toBe(false)
  })

  it('con live=false sólo emite change hasta llamar a save()', async () => {
    const wrapper = mount(ZnDataEditor, {
      props: { schema, modelValue, live: false }
    })

    await wrapper.findAll('.zn-field-trigger')[0].trigger('click')
    await nextTick()
    await nextTick()

    await wrapper.find('dialog input').setValue('Grace Hopper')
    await saveButton(wrapper).trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.emitted('change')[0][0]).toMatchObject({ name: 'Grace Hopper' })

    wrapper.vm.save()

    expect(wrapper.emitted('update:modelValue')[0][0]).toMatchObject({ name: 'Grace Hopper' })
    expect(wrapper.emitted('save')).toHaveLength(1)
  })

  it('expone reset y clear para vaciar o restaurar el borrador', async () => {
    const wrapper = mount(ZnDataEditor, { props: { schema, modelValue } })

    wrapper.vm.clear()
    await nextTick()
    expect(wrapper.vm.value).toEqual({})
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toEqual({})
    expect(wrapper.emitted('clear')).toHaveLength(1)

    wrapper.vm.reset()
    await nextTick()
    expect(wrapper.vm.value).toMatchObject(modelValue)
    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toMatchObject(modelValue)
    expect(wrapper.emitted('reset')).toHaveLength(1)
  })
})
