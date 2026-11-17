import { toDateTimeInputValue } from './dates.js'

function text(value) {
  return String(value ?? '').trim()
}

function id(value) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : null
}

/**
 * Single place where an update DTO is built. An update belongs to one task and
 * records what changed and when it was set.
 */
export function normalizeUpdate(payload = {}) {
  return {
    taskId: id(payload.taskId),
    description: text(payload.description),
    createdAt: text(payload.createdAt)
  }
}

/** Draft for the create dialog: the date defaults to the current time. */
export function createUpdateDraft(overrides = {}) {
  return normalizeUpdate({
    createdAt: toDateTimeInputValue(),
    ...overrides
  })
}

/** Returns `{ field: 'required' }` for every invalid field. */
export function validateUpdate(update = {}) {
  const errors = {}
  if (!update.taskId) errors.taskId = 'required'
  if (!text(update.description)) errors.description = 'required'
  if (!text(update.createdAt)) errors.createdAt = 'required'
  return errors
}

/**
 * Newest first. `createdAt` is a local `YYYY-MM-DDTHH:mm` string, so a plain
 * comparison orders it correctly; equal timestamps fall back to the newest id.
 */
export function sortUpdatesDesc(updates = []) {
  return [...updates].sort((a, b) => {
    const left = String(a.createdAt ?? '')
    const right = String(b.createdAt ?? '')
    if (left !== right) return left < right ? 1 : -1
    return (Number(b.id) || 0) - (Number(a.id) || 0)
  })
}

export function updatesForTask(updates = [], taskId) {
  const wanted = id(taskId)
  if (!wanted) return []
  return sortUpdatesDesc(updates.filter((update) => update.taskId === wanted))
}
