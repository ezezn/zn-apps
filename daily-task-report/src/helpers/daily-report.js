import { toDateInputValue } from './dates.js'

/** `YYYY-MM-DD` part of an update timestamp (`YYYY-MM-DDTHH:mm`). */
export function updateDateValue(createdAt) {
  return String(createdAt ?? '').slice(0, 10)
}

/** JS weekday (`0` Sunday … `6` Saturday) of a local `YYYY-MM-DD`; `null` when invalid. */
export function weekdayOf(dateValue) {
  const [year, month, day] = String(dateValue ?? '').split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day).getDay()
}

/**
 * Local `YYYY-MM-DD` of the nearest business day before `dateValue`.
 * Without `workDays` (or with an empty list) it is the plain calendar day
 * before; with configured business days, weekends and other non-working days
 * are skipped. `nonWorkingDates` holds extra `YYYY-MM-DD` values (the
 * configured non-working days, e.g. holidays or vacations) that are skipped
 * too, even when no business days are configured. Returns `''` when
 * `dateValue` is invalid.
 */
export function previousDateValue(dateValue, workDays = [], nonWorkingDates = []) {
  const [year, month, day] = String(dateValue ?? '').split('-').map(Number)
  if (!year || !month || !day) return ''

  const days = Array.isArray(workDays) ? workDays.map(Number) : []
  const blocked =
    nonWorkingDates instanceof Set
      ? nonWorkingDates
      : new Set((Array.isArray(nonWorkingDates) ? nonWorkingDates : []).map(String))

  if (days.length === 0 && blocked.size === 0) {
    return toDateInputValue(new Date(year, month - 1, day - 1))
  }

  const cursor = new Date(year, month - 1, day)
  // A long stretch of holidays must never fall through to the plain day.
  for (let step = 0; step < 366; step += 1) {
    cursor.setDate(cursor.getDate() - 1)
    const value = toDateInputValue(cursor)
    if (blocked.has(value)) continue
    if (days.length === 0 || days.includes(cursor.getDay())) return value
  }

  // Unreachable with at least one valid weekday: keep the calendar day.
  return toDateInputValue(new Date(year, month - 1, day - 1))
}

/**
 * Groups the updates of every task by day so the Home view can ask "what
 * happened on this date" without rescanning the whole log per list.
 */
function updatesByTaskAndDay(updates = []) {
  const byTask = new Map()
  updates.forEach((update) => {
    const day = updateDateValue(update.createdAt)
    if (!day) return
    const key = String(update.taskId)
    if (!byTask.has(key)) byTask.set(key, new Map())
    const days = byTask.get(key)
    if (!days.has(day)) days.set(day, [])
    days.get(day).push(update)
  })
  return byTask
}

/**
 * Builds the three Home lists for `date`:
 * - `current`: tasks with at least one update created on `date`.
 * - `previous`: tasks with at least one update created on the nearest business
 *   day before `date` (`workDays`, Monday–Friday by default).
 * - `pending`: active tasks that appear in neither list (no recent updates).
 *
 * `current` and `previous` are `{ task, updates }` entries; `pending` is a list
 * of tasks. Ordering is left to the view.
 *
 * `nonWorkingDates` are extra days (holidays, vacations…) skipped when looking
 * back to the previous business day.
 */
export function buildDailyReport({
  tasks = [],
  updates = [],
  date = '',
  workDays = [1, 2, 3, 4, 5],
  nonWorkingDates = []
} = {}) {
  const dayBefore = previousDateValue(date, workDays, nonWorkingDates)
  const byTask = updatesByTaskAndDay(updates)

  function entriesFor(day) {
    if (!day) return []
    return tasks
      .filter((task) => byTask.get(String(task.id))?.has(day))
      .map((task) => ({ task, updates: byTask.get(String(task.id)).get(day) }))
  }

  const current = entriesFor(date)
  const previous = entriesFor(dayBefore)
  const shown = new Set([...current, ...previous].map((entry) => entry.task.id))
  const pending = tasks.filter((task) => task.status === 'active' && !shown.has(task.id))

  return { date, previousDate: dayBefore, current, previous, pending }
}
