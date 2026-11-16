import { normalizeTask } from './tasks.js'
import { toDateInputValue } from './dates.js'

export const BACKUP_APP = 'daily-task-report'
export const BACKUP_VERSION = 1

export function backupFileName(date = new Date()) {
  return `${BACKUP_APP}-${toDateInputValue(date)}.json`
}

/** JSON-friendly copy of the tasks, without local Dexie ids. */
export function buildBackup(tasks = [], { exportedAt = new Date() } = {}) {
  return {
    app: BACKUP_APP,
    version: BACKUP_VERSION,
    exportedAt: exportedAt instanceof Date ? exportedAt.toISOString() : String(exportedAt),
    tasks: (Array.isArray(tasks) ? tasks : []).map(({ id, ...task }) => normalizeTask(task))
  }
}

export function serializeBackup(tasks, options) {
  return JSON.stringify(buildBackup(tasks, options), null, 2)
}

/**
 * Validates a backup file and returns its normalized tasks (ids are dropped so
 * Dexie assigns new ones). Throws for anything that is not a backup.
 */
export function parseBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('invalid-json')
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('invalid-format')
  }
  if (data.app && data.app !== BACKUP_APP) {
    throw new Error('invalid-app')
  }
  if (!Array.isArray(data.tasks)) {
    throw new Error('invalid-format')
  }

  return data.tasks
    .filter((task) => task && typeof task === 'object' && !Array.isArray(task))
    .map((task) => normalizeTask(task))
    .filter((task) => task.name || task.externalId)
}
