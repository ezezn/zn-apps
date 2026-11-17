import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { tasksRepository } from '../db/tasksRepository.js'
import { updatesRepository } from '../db/updatesRepository.js'
import UpdatesPage from '../views/UpdatesPage.vue'
import { i18n } from '../i18n.js'

vi.mock('../db/tasksRepository.js', () => ({
  tasksRepository: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    mergeAll: vi.fn(),
    clearAll: vi.fn()
  }
}))

vi.mock('../db/updatesRepository.js', () => ({
  updatesRepository: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn()
  }
}))

const tasks = [
  { id: 1, name: 'Revisar informe', externalId: 'EXT-1', status: 'active', taskDate: '', addedAt: '2026-11-01T09:00', description: '', externalUrl: '', externalStatus: '' },
  { id: 2, name: 'Cierre mensual', externalId: 'EXT-2', status: 'active', taskDate: '', addedAt: '2026-11-02T09:00', description: '', externalUrl: '', externalStatus: '' }
]

const updates = [
  { id: 1, taskId: 1, description: 'Primera revisión', createdAt: '2026-11-02T09:00' },
  { id: 2, taskId: 2, description: 'Cierre ajustado', createdAt: '2026-11-09T15:30' },
  { id: 3, taskId: 1, description: 'Observación agregada', createdAt: '2026-11-05T11:00' }
]

function mountPage() {
  return mount(UpdatesPage, { global: { plugins: [createPinia(), i18n] } })
}

describe('UpdatesPage', () => {
  beforeEach(() => {
    i18n.global.locale.value = 'en'
    tasksRepository.list.mockResolvedValue(tasks.map((task) => ({ ...task })))
    updatesRepository.list.mockResolvedValue(updates.map((update) => ({ ...update })))
  })

  it('lists every update newest first with its task name', async () => {
    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.findAll('.updates-item__description').map((node) => node.text())).toEqual([
      'Cierre ajustado',
      'Observación agregada',
      'Primera revisión'
    ])
    expect(wrapper.findAll('.updates-item__task').map((node) => node.text())).toEqual([
      'Cierre mensual',
      'Revisar informe',
      'Revisar informe'
    ])
    expect(wrapper.text()).toContain('3 updates')
  })

  it('opens the editor with the selected update', async () => {
    const wrapper = mountPage()
    await flushPromises()

    await wrapper.findAll('.updates-item__actions button')[0].trigger('click')

    expect(wrapper.text()).toContain('Edit update')
    expect(wrapper.find('textarea').element.value).toBe('Cierre ajustado')
  })

  it('shows the empty state when there is no log', async () => {
    updatesRepository.list.mockResolvedValue([])
    const wrapper = mountPage()
    await flushPromises()

    expect(wrapper.text()).toContain('No updates yet')
    expect(wrapper.findAll('.updates-item')).toHaveLength(0)
  })
})
