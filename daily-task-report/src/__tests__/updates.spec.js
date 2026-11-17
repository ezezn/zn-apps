import { describe, it, expect } from 'vitest'
import {
  createUpdateDraft,
  normalizeUpdate,
  sortUpdatesDesc,
  updatesForTask,
  validateUpdate
} from '../helpers/updates.js'

const baseUpdates = [
  { id: 2, taskId: 1, description: 'Primera revisión', createdAt: '2026-11-02T09:00' },
  { id: 5, taskId: 1, description: 'Cierre', createdAt: '2026-11-10T18:30' },
  { id: 7, taskId: 2, description: 'Otra tarea', createdAt: '2026-11-05T12:00' }
]

describe('update helpers', () => {
  it('normalizes the DTO and rejects invalid task ids', () => {
    expect(normalizeUpdate({ taskId: '3', description: '  Cambio  ', createdAt: ' 2026-11-01T10:00 ' }))
      .toEqual({ taskId: 3, description: 'Cambio', createdAt: '2026-11-01T10:00' })
    expect(normalizeUpdate({ taskId: 0 }).taskId).toBeNull()
    expect(normalizeUpdate({ taskId: 'x' }).taskId).toBeNull()
  })

  it('builds a draft with the current date and the given task', () => {
    const draft = createUpdateDraft({ taskId: 9 })

    expect(draft.taskId).toBe(9)
    expect(draft.description).toBe('')
    expect(draft.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })

  it('validates task, description and date', () => {
    expect(validateUpdate({})).toEqual({
      taskId: 'required',
      description: 'required',
      createdAt: 'required'
    })
    expect(validateUpdate({ taskId: 1, description: 'ok', createdAt: '2026-11-01T10:00' })).toEqual({})
  })

  it('sorts newest first and keeps insertion order for equal dates', () => {
    const result = sortUpdatesDesc([
      ...baseUpdates,
      { id: 9, taskId: 1, description: 'Mismo instante', createdAt: '2026-11-10T18:30' }
    ])

    expect(result.map((update) => update.id)).toEqual([9, 5, 7, 2])
  })

  it('filters the log of one task', () => {
    expect(updatesForTask(baseUpdates, 1).map((update) => update.id)).toEqual([5, 2])
    expect(updatesForTask(baseUpdates, 2).map((update) => update.id)).toEqual([7])
    expect(updatesForTask(baseUpdates, null)).toEqual([])
  })
})
