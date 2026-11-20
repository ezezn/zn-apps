import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ReportCreateDialog from '../components/ReportCreateDialog.vue'
import { i18n } from '../i18n.js'

const tasks = [
  { id: 1, name: 'Revisar informe' },
  { id: 2, name: 'Cierre mensual' }
]

const updates = [
  { id: 10, taskId: 1, description: 'Avancé la revisión', createdAt: '2026-11-19T09:00' },
  { id: 11, taskId: 2, description: 'Trabajando en el cierre', createdAt: '2026-11-20T08:30' }
]

function mountDialog(props = {}) {
  return mount(ReportCreateDialog, {
    props: {
      modelValue: true,
      today: '2026-11-20',
      previousDate: '2026-11-19',
      tasks,
      updates,
      ...props
    }
  })
}

function actionButton(wrapper, text) {
  return wrapper.findAll('footer button').find((button) => button.text().includes(text))
}

describe('ReportCreateDialog', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
  })

  it('seeds yesterday and today from the Home lists', () => {
    const wrapper = mountDialog()

    expect(wrapper.text()).toContain('New report')
    expect(wrapper.text()).toContain('What I did yesterday')
    expect(wrapper.text()).toContain('What I am working on today')

    const textareas = wrapper.findAll('.report-dialog__textarea')
    expect(textareas.map((node) => node.element.value)).toEqual([
      'Avancé la revisión',
      'Trabajando en el cierre'
    ])

    wrapper.unmount()
  })

  it('lets the user edit an update comment and add a blocker note', async () => {
    const wrapper = mountDialog()

    await wrapper.findAll('.report-dialog__textarea')[0].setValue('Revisión completada')
    const addButtons = wrapper.findAll('.report-dialog__add')
    await addButtons[3].trigger('click')
    const textareas = wrapper.findAll('.report-dialog__textarea')
    await textareas[2].setValue('Esperando aprobación')

    await actionButton(wrapper, 'Create report').trigger('click')

    const payload = wrapper.emitted('submit')?.[0]?.[0]
    expect(payload.sections.yesterday[0]).toMatchObject({
      kind: 'update',
      taskId: 1,
      updateId: 10,
      taskName: 'Revisar informe',
      description: 'Revisión completada'
    })
    expect(payload.sections.blockers[0]).toMatchObject({
      kind: 'text',
      description: 'Esperando aprobación'
    })
    expect(payload.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)

    wrapper.unmount()
  })

  it('adds a case reference to the could-finish section', async () => {
    const wrapper = mountDialog()

    await wrapper.find('.report-dialog__select').setValue('2')
    const finishSection = wrapper.findAll('.report-dialog__section')[2]
    const addCase = finishSection
      .findAll('button')
      .find((button) => button.text().includes('Add case'))
    await addCase.trigger('click')

    await actionButton(wrapper, 'Create report').trigger('click')

    const payload = wrapper.emitted('submit')?.[0]?.[0]
    expect(payload.sections.finish[0]).toMatchObject({
      kind: 'update',
      taskId: 2,
      updateId: null,
      taskName: 'Cierre mensual'
    })

    wrapper.unmount()
  })

  it('removes items and refuses to create an empty report', async () => {
    const wrapper = mountDialog({ updates: [] })

    await actionButton(wrapper, 'Create report').trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
    expect(wrapper.text()).toContain('Add at least one item to create the report.')

    wrapper.unmount()
  })

  it('emits update:modelValue when cancelling', async () => {
    const wrapper = mountDialog()

    await actionButton(wrapper, 'Cancel').trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
    wrapper.unmount()
  })
})
