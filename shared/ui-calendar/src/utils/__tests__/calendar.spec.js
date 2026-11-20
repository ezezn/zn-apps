import { describe, expect, it } from 'vitest'
import {
  buildMonthMatrix,
  buildWeek,
  calendarEventStyle,
  contrastTextColor,
  eventsForDay,
  formatRangeLabel,
  isWithinRange,
  normalizeEvents,
  orderRange,
  parseDate,
  readSelection,
  startOfWeek,
  toISODate,
  weekdayLabels
} from '../calendar.js'

describe('calendar utilities', () => {
  it('parses ISO dates as local dates and rejects invalid input', () => {
    expect(toISODate('2026-11-18')).toBe('2026-11-18')
    expect(toISODate('2026-11-18T23:30')).toBe('2026-11-18')
    expect(parseDate('2026-02-31')).toBeNull()
    expect(parseDate('')).toBeNull()
    expect(parseDate(null)).toBeNull()
  })

  it('starts weeks on the configured day', () => {
    // 2026-11-18 is a Wednesday.
    expect(toISODate(startOfWeek('2026-11-18', 1))).toBe('2026-11-16')
    expect(toISODate(startOfWeek('2026-11-18', 0))).toBe('2026-11-15')
    expect(weekdayLabels('en', 1).slice(0, 2)).toEqual(['Mon', 'Tue'])
    expect(buildWeek('2026-11-18', 1)).toHaveLength(7)
  })

  it('builds a six-week month grid that includes leading and trailing days', () => {
    // November 2026 starts on a Sunday.
    const grid = buildMonthMatrix('2026-11-18', 1)

    expect(grid).toHaveLength(42)
    expect(toISODate(grid[0])).toBe('2026-10-26')
    expect(toISODate(grid[6])).toBe('2026-11-01')
    expect(toISODate(grid[41])).toBe('2026-12-06')
  })

  it('orders ranges and keeps them inclusive', () => {
    const { start, end } = orderRange('2026-11-20', '2026-11-10')

    expect(toISODate(start)).toBe('2026-11-10')
    expect(toISODate(end)).toBe('2026-11-20')
    expect(isWithinRange('2026-11-10', start, end)).toBe(true)
    expect(isWithinRange('2026-11-20', start, end)).toBe(true)
    expect(isWithinRange('2026-11-21', start, end)).toBe(false)
  })

  it('reads single and range model values', () => {
    expect(toISODate(readSelection('2026-11-18').start)).toBe('2026-11-18')
    expect(toISODate(readSelection(['2026-11-18']).start)).toBe('2026-11-18')

    const range = readSelection({ start: '2026-11-20', end: '2026-11-10' }, 'range')
    expect(toISODate(range.start)).toBe('2026-11-10')
    expect(toISODate(range.end)).toBe('2026-11-20')
  })

  it('normalizes events and marks multi-day ones on every covered day', () => {
    const events = normalizeEvents([
      { id: 'a', title: 'Single', start: '2026-11-10T09:00' },
      { id: 'b', title: 'Trip', start: '2026-11-12', end: '2026-11-14', color: '#123456' },
      { title: 'Invalid', start: 'not-a-date' }
    ])

    expect(events).toHaveLength(2)
    expect(events[0].allDay).toBe(false)
    expect(events[1].allDay).toBe(true)
    expect(events[1].color).toBe('#123456')
    expect(eventsForDay(events, '2026-11-13').map((event) => event.title)).toEqual(['Trip'])
    expect(eventsForDay(events, '2026-11-15')).toEqual([])
  })

  it('picks a readable text color over event colors', () => {
    expect(contrastTextColor('#ffffff')).toBe('#000000')
    expect(contrastTextColor('#111111')).toBe('#ffffff')
    expect(contrastTextColor('rgb(103, 80, 164)')).toBe('#ffffff')
    expect(contrastTextColor('var(--md-primary)')).toContain('var(--zn-calendar-event-text')

    expect(calendarEventStyle({ color: '#ffffff' }, 'filled')).toEqual({
      '--zn-calendar-event-color': '#ffffff',
      '--zn-calendar-event-text': '#000000'
    })
    expect(calendarEventStyle({})).toEqual({ '--zn-calendar-event-color': 'var(--md-primary)' })
  })

  it('formats range titles for the active locale', () => {
    expect(formatRangeLabel('2026-11-03', '2026-11-09', 'en')).toBe('3 – 9 November 2026')
    expect(formatRangeLabel('2026-11-03', null, 'en')).toContain('November 3, 2026')
  })
})
