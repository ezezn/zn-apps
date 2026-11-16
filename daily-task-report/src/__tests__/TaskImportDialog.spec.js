import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskImportDialog from '../components/TaskImportDialog.vue'
import { i18n } from '../i18n.js'

const existing = [
  {
    id: 1,
    name: 'Revisar informe',
    externalId: 'EXT-1',
    description: 'Actual',
    taskDate: '',
    addedAt: '2026-11-05T09:00',
    externalUrl: '',
    status: 'active',
    externalStatus: ''
  }
]

function mountDialog(props = {}) {
  return mount(TaskImportDialog, {
    props: {
      modelValue: true,
      tasks: [],
      existingTasks: [],
      ...props
    }
  })
}

function actionButton(wrapper, text) {
  return wrapper.findAll('footer button').find((button) => button.text().includes(text))
}

describe('TaskImportDialog', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  it('summarizes the merge plan and lists the data to import', () => {
    const wrapper = mountDialog({
      existingTasks: existing,
      tasks: [
        { externalId: 'EXT-2', name: 'Cierre mensual', addedAt: '2026-11-06T10:30', status: 'inactive' },
        { externalId: 'EXT-1', name: 'Revisar informe', description: 'Actualizado', addedAt: '2026-11-05T09:00', status: 'active' }
      ]
    })

    expect(wrapper.text()).toContain('1 to add · 1 to update · 0 unchanged')
    expect(wrapper.text()).toContain('Cierre mensual')
    expect(wrapper.text()).toContain('EXT-2')
    expect(wrapper.text()).toContain('New')
    expect(wrapper.text()).toContain('Update')
    expect(wrapper.text()).toContain('Data to import')
    expect(actionButton(wrapper, 'Import').attributes('disabled')).toBeUndefined()
  })

  it('disables the action when everything is unchanged', () => {
    const wrapper = mountDialog({
      existingTasks: existing,
      tasks: [{ ...existing[0] }]
    })

    expect(wrapper.text()).toContain('Everything is already up to date.')
    expect(actionButton(wrapper, 'Import').attributes('disabled')).toBeDefined()
  })

  it('shows the empty message and disables the action for an empty file', () => {
    const wrapper = mountDialog()

    expect(wrapper.text()).toContain('The file contains no Tasks.')
    expect(actionButton(wrapper, 'Import').attributes('disabled')).toBeDefined()
  })

  it('emits confirm and cancel', async () => {
    const wrapper = mountDialog({
      tasks: [{ externalId: 'EXT-7', name: 'Nueva', addedAt: '2026-11-16T08:00' }]
    })

    await actionButton(wrapper, 'Import').trigger('click')
    expect(wrapper.emitted('confirm')).toHaveLength(1)

    await actionButton(wrapper, 'Cancel').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })
})
