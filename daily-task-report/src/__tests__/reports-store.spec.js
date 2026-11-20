import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { reportsRepository } from '../db/reportsRepository.js'
import { useReportsStore } from '../stores/reports.js'

vi.mock('../db/reportsRepository.js', () => ({
  reportsRepository: {
    list: vi.fn(),
    create: vi.fn(),
    remove: vi.fn(),
    clearAll: vi.fn()
  }
}))

const storedReports = [
  {
    id: 1,
    createdAt: '2026-11-10T09:30',
    sections: { yesterday: [], today: [], finish: [], blockers: [] }
  },
  {
    id: 2,
    createdAt: '2026-11-12T18:00',
    sections: { yesterday: [], today: [{ kind: 'text', description: 'Hoy' }], finish: [], blockers: [] }
  }
]

describe('reports store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    reportsRepository.list.mockResolvedValue(storedReports.map((report) => ({ ...report })))
  })

  it('loads once and exposes the reports newest first', async () => {
    const store = useReportsStore()

    await store.load()
    await store.load()

    expect(reportsRepository.list).toHaveBeenCalledTimes(1)
    expect(store.loaded).toBe(true)
    expect(store.total).toBe(2)
    expect(store.sortedReports.map((report) => report.id)).toEqual([2, 1])
  })

  it('creates a report and appends it', async () => {
    const store = useReportsStore()
    await store.load()
    reportsRepository.create.mockResolvedValue({
      id: 3,
      createdAt: '2026-11-20T10:00',
      sections: { yesterday: [], today: [], finish: [], blockers: [] }
    })

    const created = await store.createReport({ createdAt: '2026-11-20T10:00' })

    expect(created.id).toBe(3)
    expect(store.total).toBe(3)
    expect(store.sortedReports[0].id).toBe(3)
  })

  it('copies a report with a new creation moment', async () => {
    const store = useReportsStore()
    await store.load()
    reportsRepository.create.mockImplementation(async (payload) => ({ ...payload, id: 9 }))

    await store.copyReport(store.sortedReports[0])

    const payload = reportsRepository.create.mock.calls[0][0]
    expect(payload.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    expect(payload.createdAt).not.toBe(store.sortedReports[1].createdAt)
    expect(payload.sections.today).toHaveLength(1)
  })

  it('deletes a report and reports errors', async () => {
    const store = useReportsStore()
    await store.load()
    reportsRepository.remove.mockResolvedValue(undefined)

    expect(await store.deleteReport(1)).toBe(true)
    expect(store.reports.map((report) => report.id)).toEqual([2])

    reportsRepository.remove.mockRejectedValue(new Error('boom'))
    expect(await store.deleteReport(2)).toBe(false)
    expect(store.error).toBe('removeError')
  })

  it('drops the in-memory copy when all data is deleted', async () => {
    const store = useReportsStore()
    await store.load()

    store.forgetAll()

    expect(store.reports).toEqual([])
    expect(store.loaded).toBe(true)
  })
})
