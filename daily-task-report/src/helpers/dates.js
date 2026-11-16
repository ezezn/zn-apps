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
