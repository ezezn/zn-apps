/**
 * Calendar date utilities (no Vue, no DOM).
 *
 * Dates travel as local ISO strings: `YYYY-MM-DD` for days and
 * `YYYY-MM-DDTHH:mm` for timed events. Everything here works with local dates,
 * so a calendar day never shifts because of the time zone.
 */

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/

function pad(value) {
  return String(value).padStart(2, '0')
}

/** Parses a Date, timestamp or ISO string into a valid local Date (or null). */
export function parseDate(value) {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : new Date(value)
  }

  if (typeof value === 'number') {
    const fromNumber = new Date(value)
    return Number.isNaN(fromNumber.getTime()) ? null : fromNumber
  }

  if (typeof value !== 'string') return null

  const match = DATE_RE.exec(value.trim())
  if (!match) return null

  const [, year, month, day, hours, minutes] = match
  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    hours === undefined ? 12 : Number(hours),
    minutes === undefined ? 0 : Number(minutes),
    0,
    0
  )

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null
  }

  return date
}

/** `YYYY-MM-DD` in local time. */
export function toISODate(value) {
  const date = parseDate(value)
  if (!date) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** `YYYY-MM-DDTHH:mm` in local time. */
export function toISODateTime(value) {
  const date = parseDate(value)
  if (!date) return ''
  return `${toISODate(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

export function startOfDay(value) {
  const date = parseDate(value)
  if (!date) return null
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function addDays(value, amount) {
  const date = parseDate(value)
  if (!date) return null
  const next = new Date(date)
  next.setDate(next.getDate() + amount)
  return next
}

export function addMonths(value, amount) {
  const date = parseDate(value)
  if (!date) return null
  const next = new Date(date)
  const day = next.getDate()
  next.setDate(1)
  next.setMonth(next.getMonth() + amount)
  // Clamp to the last day of the target month (e.g. Jan 31 → Feb 28).
  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(day, lastDay))
  return next
}

export function startOfMonth(value) {
  const date = parseDate(value)
  if (!date) return null
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/** `weekStartsOn`: 0 = Sunday … 6 = Saturday. Defaults to Monday (1). */
export function startOfWeek(value, weekStartsOn = 1) {
  const date = parseDate(value)
  if (!date) return null
  const offset = (date.getDay() - weekStartsOn + 7) % 7
  const start = addDays(date, -offset)
  return startOfDay(start)
}

export function isSameDay(a, b) {
  const dateA = startOfDay(a)
  const dateB = startOfDay(b)
  if (!dateA || !dateB) return false
  return dateA.getTime() === dateB.getTime()
}

export function isSameMonth(a, b) {
  const dateA = parseDate(a)
  const dateB = parseDate(b)
  if (!dateA || !dateB) return false
  return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth()
}

/** Inclusive day comparison: `start <= day <= end`. */
export function isWithinRange(day, start, end) {
  const target = startOfDay(day)
  const from = startOfDay(start)
  const to = startOfDay(end)
  if (!target || !from) return false
  const bound = to || from
  return target.getTime() >= from.getTime() && target.getTime() <= bound.getTime()
}

/** Orders a range so `start` is never after `end`. */
export function orderRange(a, b) {
  const first = startOfDay(a)
  const second = startOfDay(b)
  if (!first) return { start: null, end: second }
  if (!second) return { start: first, end: null }
  return first.getTime() <= second.getTime()
    ? { start: first, end: second }
    : { start: second, end: first }
}

/** Six-week month grid (42 days) starting on the first visible week day. */
export function buildMonthMatrix(value, weekStartsOn = 1) {
  const monthStart = startOfMonth(value)
  if (!monthStart) return []
  const gridStart = startOfWeek(monthStart, weekStartsOn)
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

export function buildWeek(value, weekStartsOn = 1) {
  const start = startOfWeek(value, weekStartsOn)
  if (!start) return []
  return Array.from({ length: 7 }, (_, index) => addDays(start, index))
}

/**
 * Normalizes external event input into day-aware entries.
 * Accepted: `{ id, title, start, end, color }` where `start`/`end` are ISO
 * strings (date or date-time). A missing `end` means a single-day event.
 */
export function normalizeEvents(input) {
  if (!Array.isArray(input)) return []

  return input
    .map((event, index) => {
      if (!event || typeof event !== 'object') return null

      const start = parseDate(event.start)
      if (!start) return null

      const end = parseDate(event.end) || start
      const { start: startDate, end: endDate } = orderRange(start, end)
      const hasTime =
        typeof event.start === 'string' ? /[T ]\d{2}:\d{2}/.test(event.start) : false

      return {
        id: event.id ?? `calendar-event-${index}`,
        title: String(event.title ?? ''),
        color: event.color ? String(event.color) : '',
        start,
        end,
        startDate,
        endDate,
        allDay: !hasTime
      }
    })
    .filter(Boolean)
}

/** Events that overlap a given day (multi-day events appear on every day). */
export function eventsForDay(events, day) {
  const target = startOfDay(day)
  if (!target) return []

  return (events || []).filter(
    (event) => isWithinRange(target, event.startDate, event.endDate)
  )
}

/** True when the event covers more than one calendar day. */
export function isMultiDayEvent(event) {
  if (!event || !event.startDate || !event.endDate) return false
  return event.startDate.getTime() !== event.endDate.getTime()
}

function parseColor(color) {
  if (typeof color !== 'string') return null
  const value = color.trim()
  if (value.startsWith('#')) {
    const hex = value.slice(1)
    if (hex.length === 3) {
      return hex.split('').map((char) => parseInt(char + char, 16))
    }
    if (hex.length === 6) {
      return [0, 2, 4].map((index) => parseInt(hex.slice(index, index + 2), 16))
    }
    return null
  }
  const match = /^rgba?\(([^)]+)\)$/i.exec(value)
  if (!match) return null
  const parts = match[1].split(',').slice(0, 3).map((part) => Number.parseFloat(part))
  return parts.every((part) => Number.isFinite(part)) ? parts : null
}

/** Picks black or white text for readable contrast over `color`. */
export function contrastTextColor(color) {
  const rgb = parseColor(color)
  if (!rgb) return 'var(--zn-calendar-event-text, var(--md-on-primary))'

  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
  })
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.4 ? '#000000' : '#ffffff'
}

/**
 * Inline custom properties consumed by every event renderer.
 * `variant`: `accent` (colored notch over a tinted surface) or `filled`
 * (the event color as background, with contrast-safe text).
 */
export function calendarEventStyle(event, variant = 'accent') {
  const color = event?.color || 'var(--md-primary)'
  const style = { '--zn-calendar-event-color': color }

  if (variant === 'filled') {
    style['--zn-calendar-event-text'] = contrastTextColor(color)
  }

  return style
}

export function formatTime(value, locale = 'en') {
  const date = parseDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function formatDayMonth(value, locale = 'en') {
  const date = parseDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short' }).format(date)
}

export function formatMonthYear(value, locale = 'en') {
  const date = parseDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)
}

export function formatDayLong(value, locale = 'en') {
  const date = parseDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date)
}

export function formatDayShort(value, locale = 'en') {
  const date = parseDate(value)
  if (!date) return ''
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date)
}

/** Range title: collapses to one date when the range starts and ends together. */
export function formatRangeLabel(start, end, locale = 'en') {
  const from = parseDate(start)
  if (!from) return ''
  const to = parseDate(end)

  if (!to || isSameDay(from, to)) return formatDayLong(from, locale)

  if (isSameMonth(from, to)) {
    const monthYear = new Intl.DateTimeFormat(locale, {
      month: 'long',
      year: 'numeric'
    }).format(to)
    return `${from.getDate()} – ${to.getDate()} ${monthYear}`
  }

  return `${formatDayShort(from, locale)} – ${formatDayShort(to, locale)}`
}

export function weekdayLabels(locale = 'en', weekStartsOn = 1, format = 'short') {
  // 2024-01-01 is a Monday, a stable reference week.
  const monday = new Date(2024, 0, 1)
  const formatter = new Intl.DateTimeFormat(locale, { weekday: format })
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(addDays(monday, (weekStartsOn + index + 6) % 7))
  )
}

export function monthOptions(locale = 'en') {
  const formatter = new Intl.DateTimeFormat(locale, { month: 'long' })
  return Array.from({ length: 12 }, (_, month) => ({
    value: month,
    label: formatter.format(new Date(2021, month, 1))
  }))
}

/** `span` years on each side of the reference year, always including it. */
export function yearOptions(year, span = 6) {
  const current = Number(year)
  if (!Number.isFinite(current)) return []
  return Array.from({ length: span * 2 + 1 }, (_, index) => {
    const value = current - span + index
    return { value, label: String(value) }
  })
}

/** Reads a v-model value into `{ start, end }` Date bounds. */
export function readSelection(modelValue, selectionMode = 'single') {
  const empty = { start: null, end: null }

  if (selectionMode === 'range') {
    if (Array.isArray(modelValue)) {
      return orderRange(modelValue[0], modelValue[1])
    }
    if (modelValue && typeof modelValue === 'object') {
      return orderRange(modelValue.start, modelValue.end)
    }
    const single = startOfDay(modelValue)
    return { start: single, end: null }
  }

  const raw = Array.isArray(modelValue) ? modelValue[0] : modelValue
  const start = startOfDay(raw)
  return { start, end: start ? new Date(start) : null }
}
