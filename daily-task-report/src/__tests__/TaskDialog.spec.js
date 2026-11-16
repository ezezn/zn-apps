import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskDialog from '../components/TaskDialog.vue'
import { i18n } from '../i18n.js'

function mountDialog(props = {}) {
  return mount(TaskDialog, {
    props: { modelValue: true, task: null, ...props }
  })
}

function inputByLabel(wrapper, labelText) {
  const label = wrapper.findAll('label').find((node) => node.text().trim().startsWith(labelText))
  return wrapper.find(`#${label.attributes('for')}`)
}

function actionButton(wrapper, text) {
  return wrapper.findAll('footer button').find((button) => button.text().includes(text))
}

describe('TaskDialog', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  it('opens in create mode with the name and external id empty', () => {
    const wrapper = mountDialog()

    expect(wrapper.text()).toContain('New Task')
    expect(wrapper.text()).toContain('The added date is prefilled')
    expect(inputByLabel(wrapper, 'Name').element.value).toBe('')
    expect(inputByLabel(wrapper, 'External ID').element.value).toBe('')
    expect(inputByLabel(wrapper, 'Added at').element.value).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })

  it('validates the required fields before emitting submit', async () => {
    const wrapper = mountDialog()

    await actionButton(wrapper, 'Save').trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.findAll('.zn-field__supporting--error').length).toBe(2)
    expect(wrapper.text()).toContain('This field is required')
  })

  it('clears a field error as soon as the value changes', async () => {
    const wrapper = mountDialog()

    await actionButton(wrapper, 'Save').trigger('click')
    expect(wrapper.findAll('.zn-field__supporting--error').length).toBe(2)

    await inputByLabel(wrapper, 'Name').setValue('Nueva tarea')

    expect(wrapper.findAll('.zn-field__supporting--error').length).toBe(1)
  })

  it('emits a normalized task on save', async () => {
    const wrapper = mountDialog()

    await inputByLabel(wrapper, 'Name').setValue('  Nueva tarea  ')
    await inputByLabel(wrapper, 'External ID').setValue(' EXT-7 ')
    await actionButton(wrapper, 'Save').trigger('click')

    const payload = wrapper.emitted('submit')?.[0]?.[0]
    expect(payload).toMatchObject({
      name: 'Nueva tarea',
      externalId: 'EXT-7',
      status: 'active'
    })
    expect(payload).not.toHaveProperty('id')
    expect(payload.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })

  it('opens in edit mode with the current values', async () => {
    const task = {
      id: 4,
      name: 'Cierre mensual',
      externalId: 'EXT-4',
      description: 'Cerrar el mes',
      taskDate: '2026-11-01',
      addedAt: '2026-11-02T08:30',
      externalUrl: '',
      status: 'inactive',
      externalStatus: 'Closed'
    }
    const wrapper = mountDialog({ task })

    expect(wrapper.text()).toContain('Edit Task')
    expect(wrapper.text()).not.toContain('The added date is prefilled')
    expect(inputByLabel(wrapper, 'Name').element.value).toBe('Cierre mensual')
    expect(inputByLabel(wrapper, 'External ID').element.value).toBe('EXT-4')
    expect(inputByLabel(wrapper, 'Added at').element.value).toBe('2026-11-02T08:30')

    await actionButton(wrapper, 'Save').trigger('click')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      name: 'Cierre mensual',
      externalId: 'EXT-4',
      status: 'inactive'
    })
  })

  it('emits update:modelValue when cancelling', async () => {
    const wrapper = mountDialog()

    await actionButton(wrapper, 'Cancel').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
