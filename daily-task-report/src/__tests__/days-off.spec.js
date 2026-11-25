import { describe, it, expect, beforeEach } from 'vitest'
import { i18n, settings } from '../i18n.js'
import {
  DAY_OFF_COLORS,
  dayOffCalendarEvent,
  dayOffCovers,
  dayOffDates,
  dayOffsInMonth,
  normalizeDayOff,
  upcomingDayOffs,
  validateDayOff
} from '../helpers/days-off.js'
import {
  daysOff,
  removeDayOff,
  saveDayOff,
  useDaysOff
} from '../composables/useDaysOff.js'

describe('days off helpers', () => {
  it('normalizes a single-day entry and swaps a reversed range', () => {
    expect(normalizeDayOff({ type: 'vacation', start: '2026-11-20' })).toEqual({
      id: '',
      type: 'vacation',
      start: '2026-11-20',
      end: '2026-11-20',
      note: ''
    })

    const reversed = normalizeDayOff({
      type: 'sick',
      start: '2026-11-25T08:00',
      end: '2026-11-22',
      note: '  Flu  '
    })
    expect(reversed.start).toBe('2026-11-22')
    expect(reversed.end).toBe('2026-11-25')
    expect(reversed.note).toBe('Flu')
  })

  it('falls back to a known type and requires a start date', () => {
    expect(normalizeDayOff({ type: 'unknown', start: '2026-11-20' }).type).toBe('nonWorking')
    expect(validateDayOff({ start: '' })).toEqual({ start: 'required' })
    expect(validateDayOff({ start: '2026-11-20' })).toEqual({})
  })

  it('covers every day of a range, both included', () => {
    const entry = normalizeDayOff({ start: '2026-11-20', end: '2026-11-22' })

    expect(dayOffCovers(entry, '2026-11-19')).toBe(false)
    expect(dayOffCovers(entry, '2026-11-20')).toBe(true)
    expect(dayOffCovers(entry, '2026-11-21')).toBe(true)
    expect(dayOffCovers(entry, '2026-11-22')).toBe(true)
    expect(dayOffCovers(entry, '2026-11-23')).toBe(false)
  })

  it('expands the collection into a set of covered dates', () => {
    const dates = dayOffDates([
      { start: '2026-11-20', end: '2026-11-22' },
      { start: '2026-12-24' }
    ])

    expect([...dates].sort()).toEqual([
      '2026-11-20',
      '2026-11-21',
      '2026-11-22',
      '2026-12-24'
    ])
  })

  it('lists the entries overlapping a month, oldest first', () => {
    const entries = [
      { id: 'c', type: 'vacation', start: '2026-12-24', end: '2026-12-31' },
      { id: 'b', type: 'sick', start: '2026-11-25' },
      { id: 'a', type: 'nonWorking', start: '2026-10-30', end: '2026-11-02' }
    ]

    expect(dayOffsInMonth(entries, { year: 2026, month: 10 }).map((entry) => entry.id))
      .toEqual(['a', 'b'])
    expect(dayOffsInMonth(entries, { year: 2026, month: 11 }).map((entry) => entry.id))
      .toEqual(['c'])
  })

  it('lists the entries still ahead, soonest first', () => {
    const entries = [
      { id: 'past', type: 'sick', start: '2026-11-10' },
      { id: 'next', type: 'birthday', start: '2026-12-01' },
      { id: 'now', type: 'vacation', start: '2026-11-20', end: '2026-11-25' }
    ]

    // An entry that is still running counts as upcoming.
    expect(upcomingDayOffs(entries, '2026-11-24').map((entry) => entry.id))
      .toEqual(['now', 'next'])
    expect(upcomingDayOffs(entries, '2026-12-02')).toEqual([])
    expect(upcomingDayOffs(entries, '')).toEqual([])
  })

  it('builds a calendar event with the type color', () => {
    const event = dayOffCalendarEvent(
      { id: 'x', type: 'nationalHoliday', start: '2026-11-20' },
      'National holiday'
    )

    expect(event).toEqual({
      id: 'x',
      title: 'National holiday',
      start: '2026-11-20',
      end: '2026-11-20',
      color: DAY_OFF_COLORS.nationalHoliday
    })
  })
})

describe('days off collection', () => {
  beforeEach(() => {
    settings.set('daysOff', [])
    daysOff.value = []
    i18n.global.locale.value = 'en'
  })

  it('creates entries with a generated id and persists them', () => {
    const first = saveDayOff({ type: 'vacation', start: '2026-11-20', end: '2026-11-22' })
    const second = saveDayOff({ type: 'birthday', start: '2026-11-29' })

    expect(first.id).toBeTruthy()
    expect(second.id).toBeTruthy()
    expect(first.id).not.toBe(second.id)
    expect(daysOff.value).toHaveLength(2)
    expect(settings.get('daysOff')).toEqual(daysOff.value)
  })

  it('rejects an entry without a start date', () => {
    expect(saveDayOff({ type: 'vacation' })).toBeNull()
    expect(daysOff.value).toHaveLength(0)
  })

  it('edits an entry keeping its id and deletes it', () => {
    const saved = saveDayOff({ type: 'vacation', start: '2026-11-20' })

    const edited = saveDayOff(
      { type: 'unpaid', start: '2026-11-23', end: '2026-11-24', note: 'Trip' },
      { originalId: saved.id }
    )

    expect(edited.id).toBe(saved.id)
    expect(daysOff.value).toHaveLength(1)
    expect(daysOff.value[0]).toMatchObject({
      type: 'unpaid',
      start: '2026-11-23',
      end: '2026-11-24',
      note: 'Trip'
    })

    expect(removeDayOff(saved.id)).toBe(true)
    expect(settings.get('daysOff')).toEqual([])
    expect(removeDayOff('missing')).toBe(false)
  })

  it('localizes the type labels, dates and calendar events', () => {
    saveDayOff({ type: 'vacation', start: '2026-11-20', end: '2026-11-22' })
    const { labelFor, typeOptions, events, dates } = useDaysOff()

    expect(labelFor('vacation')).toBe('Vacation')
    expect(labelFor('unknown')).toBe('unknown')
    expect(typeOptions.value).toContainEqual({ value: 'sick', label: 'Sick leave' })
    expect(events.value[0]).toMatchObject({
      title: 'Vacation',
      start: '2026-11-20',
      end: '2026-11-22'
    })
    expect([...dates.value].sort()).toEqual(['2026-11-20', '2026-11-21', '2026-11-22'])

    i18n.global.locale.value = 'es'
    expect(labelFor('vacation')).toBe('Vacaciones')
    expect(useDaysOff().events.value[0].title).toBe('Vacaciones')
  })
})
