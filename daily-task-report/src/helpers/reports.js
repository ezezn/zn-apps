import { toDateTimeInputValue } from './dates.js'

/**
 * The four fixed sections of a report, in document order.
 * Labels live in i18n (`reports.sections.*`).
 */
export const REPORT_SECTION_KEYS = Object.freeze(['yesterday', 'today', 'finish', 'blockers'])

export const REPORT_ITEM_KINDS = Object.freeze(['update', 'text'])

function text(value) {
  return String(value ?? '').trim()
}

function id(value) {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : null
}

function dayOf(value) {
  return String(value ?? '').slice(0, 10)
}

/**
 * One line of a report section. `update` items keep
 * `{ taskId, updateId, taskName }` as a snapshot so the report stays readable
 * after the task or the update is deleted; `text` items are plain notes.
 */
export function normalizeReportItem(payload = {}) {
  const kind = REPORT_ITEM_KINDS.includes(payload.kind) ? payload.kind : 'text'
  const isUpdate = kind === 'update'
  return {
    kind,
    taskId: isUpdate ? id(payload.taskId) : null,
    updateId: isUpdate ? id(payload.updateId) : null,
    taskName: isUpdate ? text(payload.taskName) : '',
    description: text(payload.description)
  }
}

export function normalizeReport(payload = {}) {
  const sections = {}
  REPORT_SECTION_KEYS.forEach((key) => {
    const items = Array.isArray(payload.sections?.[key]) ? payload.sections[key] : []
    sections[key] = items.map(normalizeReportItem)
  })
  return {
    createdAt: text(payload.createdAt),
    sections
  }
}

/** One item per update of `day`, with the task name snapshotted. */
function updateItemsForDay({ tasks, updates, day }) {
  if (!day) return []
  const tasksById = new Map(tasks.map((task) => [Number(task.id), task]))
  return updates
    .filter((update) => dayOf(update.createdAt) === day && tasksById.has(Number(update.taskId)))
    .sort((a, b) => {
      const left = String(a.createdAt ?? '')
      const right = String(b.createdAt ?? '')
      if (left !== right) return left < right ? -1 : 1
      return (Number(a.id) || 0) - (Number(b.id) || 0)
    })
    .map((update) => {
      const task = tasksById.get(Number(update.taskId))
      return normalizeReportItem({
        kind: 'update',
        taskId: update.taskId,
        updateId: update.id,
        taskName: task.name,
        description: update.description
      })
    })
}

/**
 * Initial document for the Home button: the previous-day updates become
 * "What I did yesterday" and the selected day's updates become "What I am
 * working on today". Finalize and blockers start empty for the user to fill.
 */
export function createReportDraft({
  tasks = [],
  updates = [],
  today = '',
  previousDate = '',
  createdAt = toDateTimeInputValue()
} = {}) {
  return normalizeReport({
    createdAt,
    sections: {
      yesterday: updateItemsForDay({ tasks, updates, day: previousDate }),
      today: updateItemsForDay({ tasks, updates, day: today }),
      finish: [],
      blockers: []
    }
  })
}

export function createTextReportItem(overrides = {}) {
  return normalizeReportItem({ kind: 'text', ...overrides })
}

/**
 * A task reference without an existing update (used for “could finish today”):
 * it starts from the task description and behaves like a pending update.
 */
export function createReportTaskItem(task = {}) {
  return normalizeReportItem({
    kind: 'update',
    taskId: task.id,
    updateId: null,
    taskName: task.name,
    description: task.description
  })
}

/**
 * Drops empty plain notes; task references stay even without text so the
 * selected case is never lost.
 */
export function pruneEmptyReportItems(report = {}) {
  const normalized = normalizeReport(report)
  REPORT_SECTION_KEYS.forEach((key) => {
    normalized.sections[key] = normalized.sections[key].filter(
      (item) => item.description !== '' || item.kind === 'update'
    )
  })
  return normalized
}

export function reportItemCount(report = {}) {
  return REPORT_SECTION_KEYS.reduce(
    (total, key) => total + (report.sections?.[key]?.length ?? 0),
    0
  )
}

/** Local `YYYY-MM-DD` of the creation moment. */
export function reportDateValue(report = {}) {
  return dayOf(report.createdAt)
}

/** Inclusive day filter; `from`/`to` are local `YYYY-MM-DD` values. */
export function filterReports(reports = [], { from = '', to = '' } = {}) {
  let start = dayOf(from)
  let end = dayOf(to)
  if (start && end && start > end) [start, end] = [end, start]

  return reports.filter((report) => {
    const day = reportDateValue(report)
    if (!start && !end) return true
    if (!day) return false
    if (start && day < start) return false
    if (end && day > end) return false
    return true
  })
}

/** Newest first; `createdAt` is a sortable local timestamp. */
export function sortReportsDesc(reports = []) {
  return [...reports].sort((a, b) => {
    const left = String(a.createdAt ?? '')
    const right = String(b.createdAt ?? '')
    if (left !== right) return left < right ? 1 : -1
    return (Number(b.id) || 0) - (Number(a.id) || 0)
  })
}

/** Deep copy with a new creation moment (the report's identity). */
export function duplicateReport(report = {}, { createdAt = toDateTimeInputValue() } = {}) {
  return normalizeReport({
    createdAt,
    sections: REPORT_SECTION_KEYS.reduce((sections, key) => {
      sections[key] = (report.sections?.[key] ?? []).map((item) => ({ ...item }))
      return sections
    }, {})
  })
}
