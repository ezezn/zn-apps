import { toDateInputValue } from './dates.js'

/** `YYYY-MM-DD` part of an update timestamp (`YYYY-MM-DDTHH:mm`). */
export function updateDateValue(createdAt) {
  return String(createdAt ?? '').slice(0, 10)
}

/** Local `YYYY-MM-DD` of the day before `dateValue`; `''` when invalid. */
export function previousDateValue(dateValue) {
  const [year, month, day] = String(dateValue ?? '').split('-').map(Number)
  if (!year || !month || !day) return ''
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
 * - `previous`: tasks with at least one update created on the day before.
 * - `pending`: active tasks that appear in neither list (no recent updates).
 *
 * `current` and `previous` are `{ task, updates }` entries; `pending` is a list
 * of tasks. Ordering is left to the view.
 */
export function buildDailyReport({ tasks = [], updates = [], date = '' } = {}) {
  const dayBefore = previousDateValue(date)
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
