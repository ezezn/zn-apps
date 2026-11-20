import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { tasksRepository } from '../db/tasksRepository.js'
import { backupRepository } from '../db/backupRepository.js'
import { useTasksStore } from '../stores/tasks.js'

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

vi.mock('../db/backupRepository.js', () => ({
  backupRepository: { importBackup: vi.fn() }
}))

const storedTasks = [
  { id: 1, name: 'Revisar informe', externalId: 'EXT-1', status: 'active', taskDate: '2026-11-02', addedAt: '2026-11-05T09:00', description: '', externalUrl: '', externalStatus: '' },
  { id: 2, name: 'Cierre mensual', externalId: 'EXT-2', status: 'inactive', taskDate: '', addedAt: '2026-11-06T10:30', description: '', externalUrl: '', externalStatus: 'closed' }
]

describe('tasks store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    tasksRepository.list.mockResolvedValue(storedTasks.map((task) => ({ ...task })))
  })

  it('loads the repository once and exposes the sorted list', async () => {
    const store = useTasksStore()

    await store.load()
    await store.load()

    expect(tasksRepository.list).toHaveBeenCalledTimes(1)
    expect(store.loaded).toBe(true)
    expect(store.total).toBe(2)
    expect(store.visibleTasks.map((task) => task.id)).toEqual([2, 1])
  })

  it('filters by search and status', () => {
    const store = useTasksStore()
    store.tasks = storedTasks.map((task) => ({ ...task }))

    store.filters.search = 'informe'
    expect(store.visibleTasks.map((task) => task.id)).toEqual([1])

    store.filters.search = ''
    store.filters.status = 'inactive'
    expect(store.visibleTasks.map((task) => task.id)).toEqual([2])
    expect(store.hasActiveFilters).toBe(true)

    store.filters.status = 'all'
    store.filters.externalStatus = 'closed'
    expect(store.visibleTasks.map((task) => task.id)).toEqual([2])
    expect(store.hasActiveFilters).toBe(true)

    store.resetFilters()
    expect(store.filters.status).toBe('all')
    expect(store.filters.externalStatus).toBe('all')
    expect(store.hasActiveFilters).toBe(false)
  })

  it('switches sort field and direction', () => {
    const store = useTasksStore()
    store.tasks = storedTasks.map((task) => ({ ...task }))

    store.setSortBy('name')
    store.setDirection('asc')
    expect(store.visibleTasks.map((task) => task.id)).toEqual([2, 1])

    store.toggleDirection()
    expect(store.filters.direction).toBe('desc')
    expect(store.visibleTasks.map((task) => task.id)).toEqual([1, 2])
  })

  it('creates, updates and deletes through the repository', async () => {
    const store = useTasksStore()
    const payload = { name: 'Nueva', externalId: 'EXT-3', status: 'active', addedAt: '2026-11-16T10:00' }

    tasksRepository.create.mockResolvedValue({ ...payload, id: 3 })
    await store.createTask(payload)
    expect(store.total).toBe(1)

    tasksRepository.update.mockResolvedValue({ ...payload, id: 3, name: 'Editada' })
    await store.updateTask(3, payload)
    expect(store.findById(3).name).toBe('Editada')

    tasksRepository.remove.mockResolvedValue(undefined)
    expect(await store.deleteTask(3)).toBe(true)
    expect(store.total).toBe(0)
  })

  it('merges an import through the repository and reports the counts', async () => {
    const store = useTasksStore()
    const imported = [{ name: 'Nueva', externalId: 'EXT-9', addedAt: '2026-11-16T10:00' }]
    const merged = [{ ...storedTasks[0], id: 1 }, { ...imported[0], id: 3, status: 'active', description: '', taskDate: '', externalUrl: '', externalStatus: '' }]

    tasksRepository.mergeAll.mockResolvedValue({ tasks: merged, added: 1, updated: 0, unchanged: 0 })
    const result = await store.mergeTasks(imported)

    expect(tasksRepository.mergeAll).toHaveBeenCalledWith(imported)
    expect(result).toMatchObject({ added: 1, updated: 0, unchanged: 0 })
    expect(store.total).toBe(2)
    expect(store.saving).toBe(false)
  })

  it('restores a full backup through the backup repository', async () => {
    const store = useTasksStore()
    const backup = { tasks: [], updates: [], reports: [] }
    const result = {
      tasks: storedTasks,
      added: 2,
      updated: 0,
      unchanged: 0,
      updatesAdded: 3,
      updatesSkipped: 0,
      reportsAdded: 1,
      reportsSkipped: 0
    }

    backupRepository.importBackup.mockResolvedValue(result)
    expect(await store.importBackup(backup)).toBe(result)

    expect(backupRepository.importBackup).toHaveBeenCalledWith(backup)
    expect(store.total).toBe(2)
    expect(store.loaded).toBe(true)
  })

  it('returns null and keeps the error key when a merge fails', async () => {
    const store = useTasksStore()
    tasksRepository.mergeAll.mockRejectedValue(new Error('quota'))

    expect(await store.mergeTasks([{ name: 'X', externalId: 'E-1' }])).toBeNull()
    expect(store.error).toBe('saveError')
  })

  it('clears every local task after confirmation', async () => {
    const store = useTasksStore()
    await store.load()
    tasksRepository.clearAll.mockResolvedValue(undefined)

    expect(await store.clearTasks()).toBe(true)
    expect(tasksRepository.clearAll).toHaveBeenCalledTimes(1)
    expect(store.total).toBe(0)
  })

  it('reports a localized error key when saving fails', async () => {
    const store = useTasksStore()
    tasksRepository.create.mockRejectedValue(new Error('quota'))

    const result = await store.createTask({ name: 'X', externalId: 'Y', addedAt: '2026-11-16T10:00' })

    expect(result).toBeNull()
    expect(store.error).toBe('saveError')
    expect(store.saving).toBe(false)
  })
})
