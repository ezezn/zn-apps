import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { reportsRepository } from '../db/reportsRepository.js'
import ReportsPage from '../views/ReportsPage.vue'
import { i18n } from '../i18n.js'

vi.mock('../db/reportsRepository.js', () => ({
  reportsRepository: {
    list: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn()
  }
}))

const reports = [
  {
    id: 1,
    createdAt: '2026-11-10T09:30',
    sections: {
      yesterday: [{ kind: 'text', description: 'Ayer uno' }],
      today: [{ kind: 'text', description: 'Hoy uno' }],
      finish: [],
      blockers: []
    }
  },
  {
    id: 2,
    createdAt: '2026-11-20T18:00',
    sections: {
      yesterday: [{ kind: 'text', description: 'Ayer dos' }],
      today: [{ kind: 'text', description: 'Hoy dos' }],
      finish: [{ kind: 'text', description: 'Finalizar' }],
      blockers: [{ kind: 'update', taskId: 1, updateId: 4, taskName: 'Revisar informe', description: 'Bloqueo' }]
    }
  }
]

function mountPage() {
  return mount(ReportsPage, { global: { plugins: [createPinia(), i18n] } })
}

describe('ReportsPage', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
    reportsRepository.list.mockResolvedValue(reports.map((report) => ({ ...report })))
    reportsRepository.create.mockImplementation(async (payload) => ({ ...payload, id: 3 }))
  })

  it('lists the reports newest first with their four sections', async () => {
    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.findAll('.report-card')).toHaveLength(2)
    expect(wrapper.findAll('.report-card__name')[0].text()).toContain('2026')
    expect(wrapper.text()).toContain('What I did yesterday')
    expect(wrapper.text()).toContain('Blockers')
    expect(wrapper.text()).toContain('Revisar informe')
    expect(wrapper.text()).toContain('Bloqueo')
    expect(wrapper.text()).toContain('2 of 2')

    wrapper.unmount()
  })

  it('filters by a date range using the date fields', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const [from, to] = wrapper.findAll('input[type="date"]')
    await from.setValue('2026-11-19')
    await to.setValue('2026-11-21')

    expect(wrapper.findAll('.report-card')).toHaveLength(1)
    expect(wrapper.text()).toContain('Hoy dos')
    expect(wrapper.text()).toContain('1 of 2')

    await wrapper.find('.reports-filters button').trigger('click')
    expect(wrapper.findAll('.report-card')).toHaveLength(2)

    wrapper.unmount()
  })

  it('announces the report of a single selected day with an anchor link', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const [from, to] = wrapper.findAll('input[type="date"]')
    await from.setValue('2026-11-20')
    await to.setValue('2026-11-20')

    const alert = wrapper.find('.reports-day-alert')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toContain('A report already exists')
    expect(alert.find('a').attributes('href')).toBe('#report-2')
    expect(wrapper.find('#report-2').exists()).toBe(true)

    wrapper.unmount()
  })

  it('shows the no-results state when the range matches nothing', async () => {
    const wrapper = mountPage()
    await flushPromises()

    await wrapper.findAll('input[type="date"]')[0].setValue('2026-12-01')

    expect(wrapper.text()).toContain('No reports match these dates.')
    expect(wrapper.findAll('.report-card')).toHaveLength(0)

    wrapper.unmount()
  })

  it('opens the export dialog with the default template preview', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const exportButton = wrapper
      .findAll('.report-card__actions button')
      .find((button) => button.attributes('aria-label') === 'Export report')
    await exportButton.trigger('click')
    await flushPromises()

    expect(wrapper.find('.zn-dialog[open]').exists()).toBe(true)
    const preview = wrapper.find('#report-export-preview')
    expect(preview.element.value).toContain('*What did I achieve yesterday?*')
    expect(preview.element.value).toContain('* Ayer dos')
    expect(preview.element.value).toContain('*Do I have any blockers?*')

    wrapper.unmount()
  })

  it('copies a report into a new document with the current timestamp', async () => {
    const wrapper = mountPage()
    await flushPromises()

    const copyButton = wrapper
      .findAll('.report-card__actions button')
      .find((button) => button.attributes('aria-label') === 'Copy report')
    await copyButton.trigger('click')
    await flushPromises()

    const payload = reportsRepository.create.mock.calls[0][0]
    expect(payload.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    expect(payload.sections.blockers[0].taskName).toBe('Revisar informe')
    expect(wrapper.text()).toContain('Report copied with the current date and time.')

    wrapper.unmount()
  })
})
