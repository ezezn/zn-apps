import { ref } from 'vue'
import { settings } from '../i18n.js'

/**
 * Weekdays that count as working days, stored as JS day numbers
 * (0 = Sunday … 6 = Saturday). Monday first for display.
 */
export const WEEK_DAYS = [1, 2, 3, 4, 5, 6, 0]

/** Monday to Friday until the user changes it in Settings. */
export const DEFAULT_WORK_DAYS = [1, 2, 3, 4, 5]

/** Sorts the days Monday first, drops duplicates and out-of-range values. */
export function normalizeWorkDays(value) {
  if (!Array.isArray(value)) return [...DEFAULT_WORK_DAYS]
  const days = [...new Set(value.map(Number))]
    .filter((day) => Number.isInteger(day) && day >= 0 && day <= 6)
    .sort((a, b) => WEEK_DAYS.indexOf(a) - WEEK_DAYS.indexOf(b))
  return days.length ? days : [...DEFAULT_WORK_DAYS]
}

/** Reactive mirror of `settings.workDays` (settings-core is not reactive). */
export const workDays = ref(normalizeWorkDays(settings.get('workDays', DEFAULT_WORK_DAYS)))

/** Business days can never be empty: an empty list falls back to the defaults. */
export function setWorkDays(days) {
  const next = normalizeWorkDays(days)
  workDays.value = next
  settings.set('workDays', next)
  return next
}

/**
 * Enables or disables one weekday. Disabling the last remaining day is
 * rejected so the report always has a day to look back to.
 */
export function setWorkDay(day, enabled) {
  const weekday = Number(day)
  if (!WEEK_DAYS.includes(weekday)) return false
  const selected = workDays.value.includes(weekday)

  if (enabled) {
    if (selected) return true
    setWorkDays([...workDays.value, weekday])
    return true
  }

  if (!selected || workDays.value.length <= 1) return false
  setWorkDays(workDays.value.filter((value) => value !== weekday))
  return true
}

export function useBusinessDays() {
  function isWorkDay(day) {
    return workDays.value.includes(day)
  }

  /** True when `day` is the only selected weekday, so its switch stays on. */
  function isLastWorkDay(day) {
    return workDays.value.length === 1 && workDays.value[0] === day
  }

  return { workDays, days: WEEK_DAYS, isWorkDay, isLastWorkDay }
}
