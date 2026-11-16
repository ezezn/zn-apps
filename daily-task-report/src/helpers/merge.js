import { normalizeTask } from './tasks.js'

/** External id is the merge key; matching ignores case and surrounding spaces. */
export function taskKey(task) {
  return String(task?.externalId ?? '').trim().toLowerCase()
}

function isSameTask(existing, incoming) {
  const left = normalizeTask(existing)
  const right = normalizeTask(incoming)
  return Object.keys(right).every((key) =>
    key === 'externalId' ? taskKey(left) === taskKey(right) : left[key] === right[key]
  )
}

/**
 * Plans how an imported backup merges into the local list, without touching
 * the database:
 *
 * - same external id → `update` (imported values win) or `unchanged`
 * - new external id or no external id → `new`
 * - duplicated external ids inside the file → the last occurrence wins
 */
export function planMerge(existingTasks = [], importedTasks = []) {
  const imported = []
  const positions = new Map()

  for (const raw of Array.isArray(importedTasks) ? importedTasks : []) {
    const task = normalizeTask(raw)
    if (!task.name && !task.externalId) continue

    const key = taskKey(task)
    if (!key) {
      imported.push(task)
      continue
    }

    if (positions.has(key)) {
      imported[positions.get(key)] = task
    } else {
      positions.set(key, imported.push(task) - 1)
    }
  }

  const existingByKey = new Map()
  for (const task of existingTasks) {
    const key = taskKey(task)
    if (key) existingByKey.set(key, task)
  }

  const entries = imported.map((task) => {
    const key = taskKey(task)
    const existing = key ? existingByKey.get(key) : null
    if (!existing) return { task, status: 'new' }

    return {
      task,
      status: isSameTask(existing, task) ? 'unchanged' : 'update',
      existingId: existing.id
    }
  })

  return {
    entries,
    total: entries.length,
    added: entries.filter((entry) => entry.status === 'new').length,
    updated: entries.filter((entry) => entry.status === 'update').length,
    unchanged: entries.filter((entry) => entry.status === 'unchanged').length
  }
}
