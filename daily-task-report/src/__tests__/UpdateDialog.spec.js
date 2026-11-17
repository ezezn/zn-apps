import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import UpdateDialog from '../components/UpdateDialog.vue'
import { i18n } from '../i18n.js'

const tasks = [
  { id: 1, name: 'Revisar informe', externalId: 'EXT-1' },
  { id: 2, name: 'Cierre mensual', externalId: 'EXT-2' }
]

const update = {
  id: 7,
  taskId: 2,
  description: 'Se ajustó el cierre',
  createdAt: '2026-11-09T15:30'
}

function mountDialog(props = {}) {
  return mount(UpdateDialog, {
    props: { modelValue: true, update: null, taskId: null, tasks, ...props }
  })
}

function textareaByLabel(wrapper, labelText) {
  const label = wrapper.findAll('label').find((node) => node.text().trim().startsWith(labelText))
  return wrapper.find(`#${label.attributes('for')}`)
}

function actionButton(wrapper, text) {
  return wrapper.findAll('footer button').find((button) => button.text().includes(text))
}

describe('UpdateDialog', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  it('opens in create mode with the date prefilled and the task preselected', () => {
    const wrapper = mountDialog({ taskId: 1 })

    expect(wrapper.text()).toContain('New update')
    expect(wrapper.text()).toContain('The date and time default to now')
    expect(wrapper.text()).toContain('Revisar informe')
    expect(textareaByLabel(wrapper, 'What changed').element.value).toBe('')
  })

  it('validates the description before emitting submit', async () => {
    const wrapper = mountDialog({ taskId: 1 })

    await actionButton(wrapper, 'Save').trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('This field is required')
  })

  it('emits a normalized update on save', async () => {
    const wrapper = mountDialog({ taskId: 1 })

    await textareaByLabel(wrapper, 'What changed').setValue('  Se actualizó la fecha  ')
    await actionButton(wrapper, 'Save').trigger('click')

    const payload = wrapper.emitted('submit')?.[0]?.[0]
    expect(payload).toMatchObject({
      taskId: 1,
      description: 'Se actualizó la fecha'
    })
    expect(payload.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    expect(payload).not.toHaveProperty('id')
  })

  it('opens in edit mode with the current values', async () => {
    const wrapper = mountDialog({ update })

    expect(wrapper.text()).toContain('Edit update')
    expect(textareaByLabel(wrapper, 'What changed').element.value).toBe('Se ajustó el cierre')

    await actionButton(wrapper, 'Save').trigger('click')

    expect(wrapper.emitted('submit')?.[0]?.[0]).toMatchObject({
      taskId: 2,
      description: 'Se ajustó el cierre',
      createdAt: '2026-11-09T15:30'
    })
  })

  it('emits update:modelValue when cancelling', async () => {
    const wrapper = mountDialog()

    await actionButton(wrapper, 'Cancel').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
