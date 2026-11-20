import { describe, it, expect } from 'vitest'
import {
  buildDailyReport,
  previousDateValue,
  updateDateValue,
  weekdayOf
} from '../helpers/daily-report.js'

const task = (id, overrides = {}) => ({
  id,
  name: `Task ${id}`,
  externalId: `EXT-${id}`,
  status: 'active',
  addedAt: '2026-11-01T08:00',
  ...overrides
})

const update = (id, taskId, createdAt) => ({
  id,
  taskId,
  createdAt,
  description: `Update ${id}`
})

describe('daily-report helpers', () => {
  it('reads the day part of an update timestamp', () => {
    expect(updateDateValue('2026-11-19T10:30')).toBe('2026-11-19')
    expect(updateDateValue('')).toBe('')
    expect(updateDateValue(null)).toBe('')
  })

  it('computes the previous day across month and year boundaries', () => {
    expect(previousDateValue('2026-11-19')).toBe('2026-11-18')
    expect(previousDateValue('2026-03-01')).toBe('2026-02-28')
    expect(previousDateValue('2026-01-01')).toBe('2025-12-31')
    expect(previousDateValue('')).toBe('')
  })

  it('reads the local weekday of a date', () => {
    expect(weekdayOf('2026-11-20')).toBe(5)
    expect(weekdayOf('2026-11-22')).toBe(0)
    expect(weekdayOf('')).toBeNull()
  })

  it('skips non-working days when looking back to the previous business day', () => {
    expect(previousDateValue('2026-11-23', [1, 2, 3, 4, 5])).toBe('2026-11-20')
    expect(previousDateValue('2026-11-22', [1, 2, 3, 4, 5])).toBe('2026-11-20')
    expect(previousDateValue('2026-11-21', [1, 2, 3, 4, 5])).toBe('2026-11-20')
    // No configured business days keeps the plain calendar day.
    expect(previousDateValue('2026-11-23', [])).toBe('2026-11-22')
  })

  it('uses the configured business days for the previous list', () => {
    const tasks = [task(1, { name: 'Friday' }), task(2, { name: 'Thursday' })]
    const updates = [
      update(10, 1, '2026-11-20T09:00'),
      update(11, 2, '2026-11-19T09:00')
    ]

    const report = buildDailyReport({
      tasks,
      updates,
      date: '2026-11-23',
      workDays: [1, 2, 3, 4, 5]
    })

    expect(report.previousDate).toBe('2026-11-20')
    expect(report.previous.map((entry) => entry.task.id)).toEqual([1])
    expect(report.pending.map((item) => item.id)).toEqual([2])
  })

  it('splits tasks into current, previous and pending', () => {
    const tasks = [
      task(1, { name: 'Today' }),
      task(2, { name: 'Yesterday' }),
      task(3, { name: 'Both' }),
      task(4, { name: 'Pending' }),
      task(5, { name: 'Inactive', status: 'inactive' })
    ]
    const updates = [
      update(10, 1, '2026-11-19T09:00'),
      update(11, 2, '2026-11-18T17:00'),
      update(12, 3, '2026-11-18T12:00'),
      update(13, 3, '2026-11-19T08:00'),
      update(14, 5, '2026-11-19T10:00'),
      update(15, 4, '2026-11-10T10:00')
    ]

    const report = buildDailyReport({ tasks, updates, date: '2026-11-19' })

    expect(report.date).toBe('2026-11-19')
    expect(report.previousDate).toBe('2026-11-18')
    expect(report.current.map((entry) => entry.task.id).sort()).toEqual([1, 3, 5])
    expect(report.previous.map((entry) => entry.task.id).sort()).toEqual([2, 3])
    expect(report.pending.map((item) => item.id)).toEqual([4])
  })

  it('keeps only the updates of the requested day in each entry', () => {
    const tasks = [task(1)]
    const updates = [
      update(10, 1, '2026-11-18T09:00'),
      update(11, 1, '2026-11-19T09:00'),
      update(12, 1, '2026-11-19T18:00')
    ]

    const report = buildDailyReport({ tasks, updates, date: '2026-11-19' })

    expect(report.current[0].updates.map((item) => item.id)).toEqual([11, 12])
    expect(report.previous[0].updates.map((item) => item.id)).toEqual([10])
  })

  it('never lists the same task twice and ignores unknown tasks', () => {
    const tasks = [task(1)]
    const updates = [
      update(10, 1, '2026-11-19T09:00'),
      update(11, 99, '2026-11-19T09:00')
    ]

    const report = buildDailyReport({ tasks, updates, date: '2026-11-19' })

    expect(report.current).toHaveLength(1)
    expect(report.previous).toHaveLength(0)
    expect(report.pending).toHaveLength(0)
  })

  it('returns empty lists without a date', () => {
    const tasks = [task(1, { name: 'Pending' })]
    const report = buildDailyReport({ tasks, updates: [], date: '' })

    expect(report.current).toEqual([])
    expect(report.previous).toEqual([])
    expect(report.pending.map((item) => item.id)).toEqual([1])
  })
})
