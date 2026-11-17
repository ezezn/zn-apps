import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { updatesRepository } from '../db/updatesRepository.js'
import { useUpdatesStore } from '../stores/updates.js'

vi.mock('../db/updatesRepository.js', () => ({
  updatesRepository: {
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn()
  }
}))

const storedUpdates = [
  { id: 1, taskId: 1, description: 'Creada', createdAt: '2026-11-02T09:00' },
  { id: 2, taskId: 1, description: 'Revisada', createdAt: '2026-11-09T15:00' },
  { id: 3, taskId: 2, description: 'Otra tarea', createdAt: '2026-11-04T10:00' }
]

describe('updates store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    updatesRepository.list.mockResolvedValue(storedUpdates.map((update) => ({ ...update })))
  })

  it('loads once and exposes the whole log newest first', async () => {
    const store = useUpdatesStore()

    await store.load()
    await store.load()

    expect(updatesRepository.list).toHaveBeenCalledTimes(1)
    expect(store.loaded).toBe(true)
    expect(store.total).toBe(3)
    expect(store.sortedUpdates.map((update) => update.id)).toEqual([2, 3, 1])
  })

  it('reloads when forced', async () => {
    const store = useUpdatesStore()

    await store.load()
    await store.load({ force: true })

    expect(updatesRepository.list).toHaveBeenCalledTimes(2)
  })

  it('returns the log of one task newest first', () => {
    const store = useUpdatesStore()
    store.updates = storedUpdates.map((update) => ({ ...update }))

    expect(store.forTask(1).map((update) => update.id)).toEqual([2, 1])
    expect(store.forTask(2).map((update) => update.id)).toEqual([3])
  })

  it('creates an update and appends it', async () => {
    const store = useUpdatesStore()
    store.updates = storedUpdates.map((update) => ({ ...update }))
    updatesRepository.create.mockResolvedValue({ id: 4, taskId: 2, description: 'Nueva', createdAt: '2026-11-12T08:00' })

    const created = await store.createUpdate({ taskId: 2, description: 'Nueva', createdAt: '2026-11-12T08:00' })

    expect(created.id).toBe(4)
    expect(store.total).toBe(4)
    expect(store.forTask(2).map((update) => update.id)).toEqual([4, 3])
  })

  it('updates an entry in place', async () => {
    const store = useUpdatesStore()
    store.updates = storedUpdates.map((update) => ({ ...update }))
    updatesRepository.update.mockResolvedValue({ id: 3, taskId: 2, description: 'Editada', createdAt: '2026-11-04T10:00' })

    await store.updateUpdate(3, { taskId: 2, description: 'Editada', createdAt: '2026-11-04T10:00' })

    expect(store.updates.find((update) => update.id === 3).description).toBe('Editada')
    expect(store.total).toBe(3)
  })

  it('removes an entry and reports errors', async () => {
    const store = useUpdatesStore()
    store.updates = storedUpdates.map((update) => ({ ...update }))
    updatesRepository.remove.mockResolvedValue(undefined)

    expect(await store.deleteUpdate(1)).toBe(true)
    expect(store.updates.map((update) => update.id)).toEqual([2, 3])

    updatesRepository.remove.mockRejectedValue(new Error('boom'))
    expect(await store.deleteUpdate(2)).toBe(false)
    expect(store.error).toBe('removeError')
  })

  it('drops the in-memory entries of a deleted task without touching the repository', () => {
    const store = useUpdatesStore()
    store.updates = storedUpdates.map((update) => ({ ...update }))

    store.forgetTask(1)
    expect(store.updates.map((update) => update.id)).toEqual([3])

    store.forgetAll()
    expect(store.updates).toEqual([])
    expect(store.loaded).toBe(true)
  })
})
