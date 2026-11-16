import { describe, it, expect } from 'vitest'
import { planMerge, taskKey } from '../helpers/merge.js'

const existing = [
  {
    id: 1,
    name: 'Revisar informe',
    externalId: 'EXT-1',
    description: 'Actual',
    taskDate: '2026-11-02',
    addedAt: '2026-11-05T09:00',
    externalUrl: '',
    status: 'active',
    externalStatus: 'Open'
  },
  {
    id: 2,
    name: 'Cierre mensual',
    externalId: 'EXT-2',
    description: '',
    taskDate: '',
    addedAt: '2026-11-06T10:30',
    externalUrl: '',
    status: 'inactive',
    externalStatus: ''
  }
]

describe('planMerge', () => {
  it('classifies added, updated and unchanged entries', () => {
    const plan = planMerge(existing, [
      { externalId: 'EXT-1', name: 'Revisar informe', description: 'Actual', taskDate: '2026-11-02', addedAt: '2026-11-05T09:00', status: 'active', externalStatus: 'Open' },
      { externalId: 'EXT-2', name: 'Cierre mensual', addedAt: '2026-11-06T10:30', status: 'inactive', description: 'Nuevo detalle' },
      { externalId: 'EXT-3', name: 'Nueva tarea', addedAt: '2026-11-16T08:00', status: 'active' }
    ])

    expect(plan.total).toBe(3)
    expect(plan.added).toBe(1)
    expect(plan.updated).toBe(1)
    expect(plan.unchanged).toBe(1)

    const update = plan.entries.find((entry) => entry.status === 'update')
    expect(update.existingId).toBe(2)
    expect(update.task.description).toBe('Nuevo detalle')

    expect(plan.entries.find((entry) => entry.status === 'new').task.name).toBe('Nueva tarea')
  })

  it('matches external ids ignoring case and surrounding spaces', () => {
    const plan = planMerge(existing, [
      { externalId: '  ext-1 ', name: 'Revisar informe', description: 'Actual', taskDate: '2026-11-02', addedAt: '2026-11-05T09:00', status: 'active', externalStatus: 'Open' }
    ])

    expect(plan.unchanged).toBe(1)
    expect(plan.added).toBe(0)
    expect(taskKey({ externalId: ' EXT-1 ' })).toBe('ext-1')
  })

  it('keeps the last occurrence of a duplicated external id', () => {
    const plan = planMerge([], [
      { externalId: 'EXT-9', name: 'Primera', addedAt: '2026-11-16T08:00' },
      { externalId: 'ext-9', name: 'Segunda', addedAt: '2026-11-16T09:00' }
    ])

    expect(plan.total).toBe(1)
    expect(plan.entries[0].task.name).toBe('Segunda')
  })

  it('adds entries without an external id and skips empty rows', () => {
    const plan = planMerge(existing, [
      { name: 'Sin id', addedAt: '2026-11-16T08:00' },
      { name: '', externalId: '' }
    ])

    expect(plan.total).toBe(1)
    expect(plan.added).toBe(1)
    expect(plan.entries[0].task.externalId).toBe('')
  })
})
