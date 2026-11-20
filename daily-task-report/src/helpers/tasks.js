import { toDateTimeInputValue } from './dates.js'

/** Internal statuses (only two). Labels live in i18n (`status.*`). */
export const TASK_STATUSES = Object.freeze(['active', 'inactive'])

export const DEFAULT_TASK_STATUS = 'active'

export const TASK_SORT_FIELDS = Object.freeze(['name', 'taskDate', 'addedAt'])

export const SORT_DIRECTIONS = Object.freeze(['asc', 'desc'])

export const ALL_STATUSES = 'all'

function text(value) {
  return String(value ?? '').trim()
}

/**
 * Single place where a Task DTO is built. Keeping the shape here makes the
 * code independent from the labels the user assigns in Settings.
 */
export function normalizeTask(payload = {}) {
  return {
    externalId: text(payload.externalId),
    name: text(payload.name),
    description: text(payload.description),
    taskDate: text(payload.taskDate),
    addedAt: text(payload.addedAt),
    externalUrl: text(payload.externalUrl),
    status: TASK_STATUSES.includes(payload.status) ? payload.status : DEFAULT_TASK_STATUS,
    externalStatus: text(payload.externalStatus)
  }
}

/** Draft used by the create dialog: the added date defaults to the current time. */
export function createTaskDraft(overrides = {}) {
  return normalizeTask({
    addedAt: toDateTimeInputValue(),
    ...overrides
  })
}

/** Returns `{ field: 'required' }` for every invalid field. */
export function validateTask(task = {}) {
  const errors = {}
  if (!text(task.name)) errors.name = 'required'
  if (!text(task.externalId)) errors.externalId = 'required'
  if (!text(task.addedAt)) errors.addedAt = 'required'
  return errors
}

export function normalizeSearch(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function filterTasks(
  tasks = [],
  { search = '', status = ALL_STATUSES, externalStatus = ALL_STATUSES } = {}
) {
  const query = normalizeSearch(search)
  const wantedStatus = status && status !== ALL_STATUSES ? status : null
  const wantedExternalStatus =
    externalStatus && externalStatus !== ALL_STATUSES ? externalStatus : null

  return tasks.filter((task) => {
    if (wantedStatus && task.status !== wantedStatus) return false
    if (wantedExternalStatus && task.externalStatus !== wantedExternalStatus) return false
    if (!query) return true
    return normalizeSearch(`${task.name ?? ''} ${task.externalId ?? ''}`).includes(query)
  })
}

function compareTextField(a, b, field, locale) {
  const left = String(a[field] ?? '')
  const right = String(b[field] ?? '')
  if (field === 'name') {
    return left.localeCompare(right, locale === 'es' ? 'es' : 'en', {
      numeric: true,
      sensitivity: 'base'
    })
  }
  if (left < right) return -1
  if (left > right) return 1
  return 0
}

export function sortTasks(tasks = [], { sortBy = 'addedAt', direction = 'desc' } = {}, locale = 'en') {
  const field = TASK_SORT_FIELDS.includes(sortBy) ? sortBy : 'addedAt'
  const factor = direction === 'asc' ? 1 : -1

  return [...tasks].sort((a, b) => {
    const left = String(a[field] ?? '')
    const right = String(b[field] ?? '')
    // Entries without a date/name always stay at the end, in either direction.
    if (!left && right) return 1
    if (left && !right) return -1
    return compareTextField(a, b, field, locale) * factor
  })
}

/** Adds a protocol to a user-typed link so it can be opened safely. */
export function absoluteUrl(value) {
  const raw = text(value)
  if (!raw) return ''
  if (/^[a-z][a-z\d+.-]*:/i.test(raw)) return raw
  return `https://${raw}`
}
