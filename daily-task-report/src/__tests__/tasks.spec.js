import { describe, it, expect } from 'vitest'
import {
  ALL_STATUSES,
  absoluteUrl,
  createTaskDraft,
  filterTasks,
  normalizeTask,
  sortTasks,
  validateTask
} from '../helpers/tasks.js'
import { formatTaskDate, formatTaskDateTime, parseLocalDate } from '../helpers/dates.js'

const baseTasks = [
  { id: 1, name: 'Árbol caído', externalId: 'EXT-2', status: 'active', externalStatus: 'open', taskDate: '2026-11-02', addedAt: '2026-11-05T09:00' },
  { id: 2, name: 'Revisar informe', externalId: 'EXT-1', status: 'active', externalStatus: 'closed', taskDate: '2026-10-30', addedAt: '2026-11-06T10:30' },
  { id: 3, name: 'Cierre mensual', externalId: 'EXT-3', status: 'inactive', externalStatus: 'open', taskDate: '', addedAt: '2026-11-01T08:15' }
]

describe('task helpers', () => {
  it('normalizes the DTO and falls back to the default status', () => {
    const task = normalizeTask({ name: '  Uno  ', externalId: ' A-1 ', status: 'unknown' })
    expect(task.name).toBe('Uno')
    expect(task.externalId).toBe('A-1')
    expect(task.status).toBe('active')
    expect(task.description).toBe('')
  })

  it('requires name, external id and added date', () => {
    expect(validateTask({ name: ' ', externalId: '', addedAt: '' })).toEqual({
      name: 'required',
      externalId: 'required',
      addedAt: 'required'
    })
    expect(validateTask({ name: 'A', externalId: 'B', addedAt: '2026-11-16T10:00' })).toEqual({})
  })

  it('creates drafts with a current datetime-local value', () => {
    const draft = createTaskDraft()
    expect(draft.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    expect(draft.status).toBe('active')
  })

  it('scopes validation and defaults through createTaskDraft overrides', () => {
    const draft = createTaskDraft({ name: 'Draft', status: 'inactive' })
    expect(draft.name).toBe('Draft')
    expect(draft.status).toBe('inactive')
    expect(draft.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
  })
})

describe('filterTasks', () => {
  it('returns every task with the all-status filter and no search', () => {
    expect(filterTasks(baseTasks, { search: '', status: ALL_STATUSES })).toHaveLength(3)
  })

  it('matches names ignoring case and diacritics', () => {
    const result = filterTasks(baseTasks, { search: 'arbol', status: ALL_STATUSES })
    expect(result.map((task) => task.id)).toEqual([1])
  })

  it('matches the external id', () => {
    const result = filterTasks(baseTasks, { search: 'ext-1', status: ALL_STATUSES })
    expect(result.map((task) => task.id)).toEqual([2])
  })

  it('filters by internal status', () => {
    const result = filterTasks(baseTasks, { search: '', status: 'inactive' })
    expect(result.map((task) => task.id)).toEqual([3])
  })

  it('filters by external status', () => {
    const result = filterTasks(baseTasks, { search: '', externalStatus: 'open' })
    expect(result.map((task) => task.id)).toEqual([1, 3])

    const combined = filterTasks(baseTasks, { search: '', status: 'active', externalStatus: 'open' })
    expect(combined.map((task) => task.id)).toEqual([1])
  })
})

describe('sortTasks', () => {
  it('sorts by name ascending and descending', () => {
    expect(sortTasks(baseTasks, { sortBy: 'name', direction: 'asc' }, 'es').map((task) => task.id)).toEqual([1, 3, 2])
    expect(sortTasks(baseTasks, { sortBy: 'name', direction: 'desc' }, 'es').map((task) => task.id)).toEqual([2, 3, 1])
  })

  it('sorts by added date descending and keeps empty values last', () => {
    const tasks = [...baseTasks, { id: 4, name: 'Sin fecha', externalId: 'EXT-4', status: 'active', taskDate: '', addedAt: '' }]
    const result = sortTasks(tasks, { sortBy: 'addedAt', direction: 'desc' })
    expect(result.map((task) => task.id)).toEqual([2, 1, 3, 4])

    const ascending = sortTasks(tasks, { sortBy: 'addedAt', direction: 'asc' })
    expect(ascending.map((task) => task.id)).toEqual([3, 1, 2, 4])
  })

  it('does not mutate the source array', () => {
    const original = [...baseTasks]
    sortTasks(baseTasks, { sortBy: 'taskDate', direction: 'asc' })
    expect(baseTasks).toEqual(original)
  })
})

describe('absoluteUrl', () => {
  it('adds https:// when the scheme is missing and keeps existing schemes', () => {
    expect(absoluteUrl('example.com/task/1')).toBe('https://example.com/task/1')
    expect(absoluteUrl('http://example.com')).toBe('http://example.com')
    expect(absoluteUrl('  ')).toBe('')
  })
})

describe('date helpers', () => {
  it('parses local date and datetime values', () => {
    const date = parseLocalDate('2026-11-16')
    expect(date?.getFullYear()).toBe(2026)
    expect(date?.getMonth()).toBe(10)
    expect(date?.getDate()).toBe(16)
    expect(parseLocalDate('')).toBeNull()
  })

  it('formats dates and datetimes for display', () => {
    expect(formatTaskDate('2026-11-16', 'en')).toContain('2026')
    expect(formatTaskDateTime('2026-11-16T09:30', 'es')).toContain('2026')
    expect(formatTaskDate('', 'en')).toBe('')
  })
})
