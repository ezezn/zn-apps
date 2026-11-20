import { normalizeTask } from './tasks.js'
import { toDateInputValue } from './dates.js'
import { REPORT_SECTION_KEYS } from './reports.js'

export const BACKUP_APP = 'daily-task-report'
/** v2 adds the update log and the reports, linked by a stable task `ref`. */
export const BACKUP_VERSION = 2

export function backupFileName(date = new Date()) {
  return `${BACKUP_APP}-${toDateInputValue(date)}.json`
}

function text(value) {
  return String(value ?? '').trim()
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Stable reference of a task inside one backup file. Local Dexie ids are not
 * portable, so updates and report items point at this `ref` instead:
 * the external id when there is one, otherwise a file-local fallback.
 */
function createTaskRefs(tasks) {
  const refById = new Map()
  const used = new Set()

  tasks.forEach((task, index) => {
    const base = text(task.externalId) || `task-${task.id ?? index + 1}`
    let ref = base
    let suffix = 2
    while (used.has(ref)) {
      ref = `${base}-${suffix}`
      suffix += 1
    }
    used.add(ref)
    if (task.id !== undefined && task.id !== null) refById.set(Number(task.id), ref)
  })

  return refById
}

/**
 * JSON-friendly copy of everything Dexie stores. Tasks lose their local ids;
 * updates and report items keep their task link through `ref`.
 */
export function buildBackup(
  { tasks = [], updates = [], reports = [] } = {},
  { exportedAt = new Date() } = {}
) {
  const taskList = Array.isArray(tasks) ? tasks : []
  const refById = createTaskRefs(taskList)

  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: exportedAt instanceof Date ? exportedAt.toISOString() : String(exportedAt),
    tasks: taskList.map((task) => {
      const { id, ...rest } = task
      return { ref: refById.get(Number(id)) ?? '', ...normalizeTask(rest) }
    }),
    updates: (Array.isArray(updates) ? updates : []).map((update) => ({
      ref: refById.get(Number(update.taskId)) ?? '',
      description: text(update.description),
      createdAt: text(update.createdAt)
    })),
    reports: (Array.isArray(reports) ? reports : []).map((report) => ({
      createdAt: text(report.createdAt),
      sections: REPORT_SECTION_KEYS.reduce((sections, key) => {
        sections[key] = (report.sections?.[key] ?? []).map((item) => ({
          kind: item.kind === 'update' ? 'update' : 'text',
          ref: item.kind === 'update' ? refById.get(Number(item.taskId)) ?? '' : '',
          taskName: text(item.taskName),
          description: text(item.description)
        }))
        return sections
      }, {})
    }))
  }
}

export function serializeBackup(data, options) {
  return JSON.stringify(buildBackup(data, options), null, 2)
}

/**
 * Validates a backup file and returns its normalized `{ tasks, updates,
 * reports }`. Task ids are dropped so Dexie assigns new ones; the `ref` of
 * each task is what links its updates and report items. Throws for anything
 * that is not a backup.
 */
export function parseBackup(fileText) {
  let data
  try {
    data = JSON.parse(fileText)
  } catch {
    throw new Error('invalid-json')
  }

  if (!isObject(data)) {
    throw new Error('invalid-format')
  }
  if (data.app && data.app !== BACKUP_APP) {
    throw new Error('invalid-app')
  }
  if (!Array.isArray(data.tasks)) {
    throw new Error('invalid-format')
  }

  const tasks = data.tasks
    .filter(isObject)
    .map((raw) => {
      const task = normalizeTask(raw)
      return { ref: text(raw.ref) || task.externalId, ...task }
    })
    .filter((task) => task.name || task.externalId)

  // Without a ref an update cannot be linked to a task: it is unusable.
  const updates = (Array.isArray(data.updates) ? data.updates : [])
    .filter(isObject)
    .map((raw) => ({
      ref: text(raw.ref ?? raw.taskExternalId),
      description: text(raw.description),
      createdAt: text(raw.createdAt)
    }))
    .filter((update) => update.ref && update.description && update.createdAt)

  const reports = (Array.isArray(data.reports) ? data.reports : [])
    .filter(isObject)
    .map((raw) => ({
      createdAt: text(raw.createdAt),
      sections: REPORT_SECTION_KEYS.reduce((sections, key) => {
        sections[key] = (Array.isArray(raw.sections?.[key]) ? raw.sections[key] : [])
          .filter(isObject)
          .map((item) => ({
            kind: item.kind === 'update' ? 'update' : 'text',
            ref: text(item.ref ?? item.taskExternalId),
            taskName: text(item.taskName),
            description: text(item.description)
          }))
          .filter(
            (item) =>
              item.description ||
              (item.kind === 'update' && (item.ref || item.taskName))
          )
        return sections
      }, {})
    }))
    .filter((report) => report.createdAt)

  return { tasks, updates, reports }
}
