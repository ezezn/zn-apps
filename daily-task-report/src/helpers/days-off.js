import { parseLocalDate, toDateInputValue } from './dates.js'

/**
 * Why a day was not worked. The labels live in i18n
 * (`daysOff.types.*`); the keys are stable and stored in the settings.
 */
export const DAY_OFF_TYPES = Object.freeze([
  'sick',
  'moving',
  'marriage',
  'unpaid',
  'vacation',
  'birthday',
  'nationalHoliday',
  'nonWorking'
])

/** Calendar color per type, so every event is recognizable at a glance. */
export const DAY_OFF_COLORS = Object.freeze({
  sick: '#B3261E',
  moving: '#7A5AF8',
  marriage: '#D81B60',
  unpaid: '#6B7280',
  vacation: '#1E88E5',
  birthday: '#F9A825',
  nationalHoliday: '#2E7D32',
  nonWorking: '#8D6E63'
})

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function text(value) {
  return String(value ?? '').trim()
}

/** Local `YYYY-MM-DD` or `''`; anything longer is cut to its day part. */
export function dayValue(value) {
  const raw = text(value).slice(0, 10)
  return DATE_RE.test(raw) ? raw : ''
}

/**
 * One entry of the collection: `{ id, type, start, end, note }`.
 * `start`/`end` are local `YYYY-MM-DD` values, inclusive; an empty or earlier
 * `end` falls back to the start, so a single-day event is `start === end`.
 */
export function normalizeDayOff(payload = {}) {
  let start = dayValue(payload.start)
  let end = dayValue(payload.end)

  if (start && end && end < start) [start, end] = [end, start]
  if (!end) end = start

  return {
    id: text(payload.id),
    type: DAY_OFF_TYPES.includes(payload.type) ? payload.type : 'nonWorking',
    start,
    end,
    note: text(payload.note)
  }
}

/** `{ start: 'required' }` while the start date is missing or invalid. */
export function validateDayOff(payload = {}) {
  const dayOff = normalizeDayOff(payload)
  const errors = {}
  if (!dayOff.start) errors.start = 'required'
  return errors
}

export function createDayOffId() {
  const cryptoApi = globalThis.crypto
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID()
  return `day-off-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Inclusive check: the entry covers `dateValue`. */
export function dayOffCovers(entry, dateValue) {
  const day = dayValue(dateValue)
  if (!day) return false
  const start = dayValue(entry?.start)
  if (!start) return false
  const end = dayValue(entry?.end) || start
  return day >= start && day <= end
}

/**
 * Every covered day of the collection as a `Set` of `YYYY-MM-DD` values,
 * ready to be skipped by the previous-business-day lookup.
 */
export function dayOffDates(entries = []) {
  const dates = new Set()

  entries.forEach((entry) => {
    const start = parseLocalDate(dayValue(entry?.start))
    const end = parseLocalDate(dayValue(entry?.end) || dayValue(entry?.start))
    if (!start || !end || end < start) return

    const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate())
    // Guard against pathological ranges; ten years is far beyond a real use.
    for (let step = 0; step < 3660 && cursor <= end; step += 1) {
      dates.add(toDateInputValue(cursor))
      cursor.setDate(cursor.getDate() + 1)
    }
  })

  return dates
}

/** Month bounds (`month` is 0-based) as sortable `YYYY-MM-DD` values. */
function monthBounds({ year, month }) {
  const monthStart = new Date(Number(year), Number(month), 1)
  const monthEnd = new Date(Number(year), Number(month) + 1, 0)
  return { first: toDateInputValue(monthStart), last: toDateInputValue(monthEnd) }
}

/** Entries that still cover or start after `fromDate` (today by default), soonest first. */
export function upcomingDayOffs(entries = [], fromDate = toDateInputValue()) {
  const from = dayValue(fromDate)
  if (!from) return []

  return entries
    .map(normalizeDayOff)
    .filter((entry) => entry.start && entry.end >= from)
    .sort((a, b) => {
      if (a.start !== b.start) return a.start < b.start ? -1 : 1
      return a.end < b.end ? -1 : a.end > b.end ? 1 : 0
    })
}

/** Entries overlapping the month, oldest first. */
export function dayOffsInMonth(entries = [], month = {}) {
  const { first, last } = monthBounds(month)

  return entries
    .map(normalizeDayOff)
    .filter((entry) => {
      if (!entry.start) return false
      return entry.start <= last && entry.end >= first
    })
    .sort((a, b) => {
      if (a.start !== b.start) return a.start < b.start ? -1 : 1
      return a.end < b.end ? -1 : a.end > b.end ? 1 : 0
    })
}

/** `{ id, title, start, end, color }` as expected by `ZnCalendar`. */
export function dayOffCalendarEvent(entry, title = '') {
  const dayOff = normalizeDayOff(entry)
  return {
    id: dayOff.id,
    title,
    start: dayOff.start,
    end: dayOff.end,
    color: DAY_OFF_COLORS[dayOff.type]
  }
}
