import { describe, it, expect, beforeEach } from 'vitest'
import { settings } from '../i18n.js'
import {
  DEFAULT_WORK_DAYS,
  normalizeWorkDays,
  setWorkDay,
  setWorkDays,
  useBusinessDays,
  workDays
} from '../composables/useBusinessDays.js'

describe('business days', () => {
  beforeEach(() => {
    settings.set('workDays', [...DEFAULT_WORK_DAYS])
    workDays.value = [...DEFAULT_WORK_DAYS]
  })

  it('defaults to Monday to Friday', () => {
    expect(workDays.value).toEqual([1, 2, 3, 4, 5])
    expect(settings.get('workDays')).toEqual([1, 2, 3, 4, 5])
  })

  it('normalizes to unique valid days, Monday first', () => {
    expect(normalizeWorkDays([0, 6, 1, 1, 9, 'x'])).toEqual([1, 6, 0])
    expect(normalizeWorkDays('weekend')).toEqual([1, 2, 3, 4, 5])
    expect(normalizeWorkDays([])).toEqual([1, 2, 3, 4, 5])
  })

  it('enables and disables one day and persists the list', () => {
    expect(setWorkDay(6, true)).toBe(true)
    expect(workDays.value).toEqual([1, 2, 3, 4, 5, 6])

    expect(setWorkDay(1, false)).toBe(true)
    expect(workDays.value).toEqual([2, 3, 4, 5, 6])
    expect(settings.get('workDays')).toEqual([2, 3, 4, 5, 6])
  })

  it('keeps at least one business day selected', () => {
    setWorkDays([3])

    expect(setWorkDay(3, false)).toBe(false)
    expect(workDays.value).toEqual([3])
    expect(useBusinessDays().isLastWorkDay(3)).toBe(true)
    expect(useBusinessDays().isLastWorkDay(1)).toBe(false)
  })
})
