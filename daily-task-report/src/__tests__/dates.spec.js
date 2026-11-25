import { describe, it, expect } from 'vitest'
import { dayCountBetween, durationParts } from '../helpers/dates.js'

describe('date distance helpers', () => {
  it('counts whole calendar days between two local dates', () => {
    expect(dayCountBetween('2026-11-24', '2026-11-24')).toBe(0)
    expect(dayCountBetween('2026-11-24', '2026-12-04')).toBe(10)
    expect(dayCountBetween('2026-11-24', '2027-02-28')).toBe(96)
    expect(dayCountBetween('2026-11-24', '2026-11-20')).toBe(-4)
    expect(dayCountBetween('', '2026-11-24')).toBeNull()
  })

  it('splits a day count into months, weeks and days', () => {
    expect(durationParts(96)).toEqual([
      { unit: 'month', value: 3 },
      { unit: 'day', value: 6 }
    ])
    expect(durationParts(10)).toEqual([
      { unit: 'week', value: 1 },
      { unit: 'day', value: 3 }
    ])
    expect(durationParts(45)).toEqual([
      { unit: 'month', value: 1 },
      { unit: 'week', value: 2 },
      { unit: 'day', value: 1 }
    ])
    expect(durationParts(7)).toEqual([{ unit: 'week', value: 1 }])
    expect(durationParts(0)).toEqual([])
    expect(durationParts('x')).toEqual([])
  })
})
