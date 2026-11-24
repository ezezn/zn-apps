import { computed, ref } from 'vue'
import { i18n, settings } from '../i18n.js'
import {
  DAY_OFF_TYPES,
  createDayOffId,
  dayOffCalendarEvent,
  dayOffDates,
  normalizeDayOff,
  validateDayOff
} from '../helpers/days-off.js'

/**
 * Editable collection of non-working days, configured in the app and mirrored
 * in `settings.daysOff` (settings-core is not reactive). Each entry is
 * `{ id, type, start, end, note }`; see `helpers/days-off.js`.
 */
export const daysOff = ref(readDaysOff())

function readDaysOff() {
  const stored = settings.get('daysOff', [])
  if (!Array.isArray(stored)) return []
  return stored
    .filter((entry) => entry && typeof entry === 'object')
    .map(normalizeDayOff)
    .filter((entry) => entry.start)
}

function persistDaysOff(next) {
  daysOff.value = next
  settings.set('daysOff', next)
}

function findIndexById(id) {
  return daysOff.value.findIndex((entry) => entry.id === id)
}

/**
 * Creates or replaces an entry. `originalId` identifies the row being edited,
 * whose generated id is preserved.
 */
export function saveDayOff(entry, { originalId = null } = {}) {
  const dayOff = normalizeDayOff(entry)
  if (validateDayOff(dayOff).start) return null

  const replacedIndex = originalId === null ? -1 : findIndexById(originalId)
  if (replacedIndex >= 0) {
    // The id is the identity of the row: editing never changes it.
    dayOff.id = daysOff.value[replacedIndex].id
  } else if (!dayOff.id) {
    do {
      dayOff.id = createDayOffId()
    } while (findIndexById(dayOff.id) >= 0)
  }

  const next = [...daysOff.value]
  if (replacedIndex >= 0) next[replacedIndex] = dayOff
  else next.push(dayOff)
  persistDaysOff(next)
  return dayOff
}

export function removeDayOff(id) {
  const index = findIndexById(id)
  if (index < 0) return false
  persistDaysOff(daysOff.value.filter((_, position) => position !== index))
  return true
}

/** Localized type options, calendar events and the covered dates. */
export function useDaysOff() {
  const locale = computed(() => (i18n.global.locale.value === 'es' ? 'es' : 'en'))

  function labelFor(type) {
    if (!DAY_OFF_TYPES.includes(type)) return String(type ?? '')
    return i18n.global.t(`daysOff.types.${type}`)
  }

  const typeOptions = computed(() =>
    DAY_OFF_TYPES.map((type) => ({ value: type, label: labelFor(type) }))
  )

  const sorted = computed(() =>
    [...daysOff.value].sort((a, b) => {
      if (a.start !== b.start) return a.start < b.start ? -1 : 1
      return a.end < b.end ? -1 : a.end > b.end ? 1 : 0
    })
  )

  /** Optional `YYYY-MM-DD` values skipped when looking back a business day. */
  const dates = computed(() => dayOffDates(daysOff.value))

  /** Calendar-ready entries with the localized type as title. */
  const events = computed(() =>
    daysOff.value.map((entry) => dayOffCalendarEvent(entry, labelFor(entry.type)))
  )

  return { locale, entries: daysOff, sorted, dates, events, typeOptions, labelFor }
}
