function pad(value) {
  return String(value).padStart(2, '0')
}

/** `YYYY-MM-DD` in local time, the format expected by `<input type="date">`. */
export function toDateInputValue(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** `YYYY-MM-DDTHH:mm` in local time, the format of `<input type="datetime-local">`. */
export function toDateTimeInputValue(date = new Date()) {
  return `${toDateInputValue(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Parses `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm` as local time. */
export function parseLocalDate(value) {
  const [datePart = '', timePart = ''] = String(value ?? '').split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  if (!year || !month || !day) return null

  const [hours = '0', minutes = '0'] = timePart.split(':')
  const date = new Date(year, month - 1, day, Number(hours) || 0, Number(minutes) || 0)
  return Number.isNaN(date.getTime()) ? null : date
}

function format(value, locale, options) {
  const date = parseLocalDate(value)
  if (!date) return String(value ?? '')
  return new Intl.DateTimeFormat(locale === 'es' ? 'es' : 'en', options).format(date)
}

export function formatTaskDate(value, locale = 'en') {
  if (!value) return ''
  return format(value, locale, { dateStyle: 'medium' })
}

export function formatTaskDateTime(value, locale = 'en') {
  if (!value) return ''
  return format(value, locale, { dateStyle: 'medium', timeStyle: 'short' })
}

/**
 * Whole calendar days between two local `YYYY-MM-DD` values (`to - from`).
 * Built on UTC midnights so DST changes never add or drop a day; `null` when
 * either value is invalid.
 */
export function dayCountBetween(from, to) {
  const start = parseLocalDate(from)
  const end = parseLocalDate(to)
  if (!start || !end) return null
  const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  return Math.round((endUtc - startUtc) / 86400000)
}

/** Largest unit first; a month counts as 30 days and a week as 7. */
export const DURATION_UNITS = Object.freeze([
  ['month', 30],
  ['week', 7],
  ['day', 1]
])

/**
 * Readable decomposition of a day count: `96 → [3 months, 6 days]`,
 * `10 → [1 week, 3 days]`. Zero units are skipped, so `0 → []`.
 */
export function durationParts(days) {
  let remaining = Math.max(0, Math.trunc(Number(days) || 0))
  const parts = []

  DURATION_UNITS.forEach(([unit, size]) => {
    const value = Math.floor(remaining / size)
    if (value <= 0) return
    parts.push({ unit, value })
    remaining -= value * size
  })

  return parts
}

/** Time only, for entries already grouped under a known day. */
export function formatTaskTime(value, locale = 'en') {
  if (!value) return ''
  return format(value, locale, { timeStyle: 'short' })
}
