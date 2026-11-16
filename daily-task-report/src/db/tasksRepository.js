import { db } from './database.js'
import { normalizeTask } from '../helpers/tasks.js'
import { planMerge } from '../helpers/merge.js'

/**
 * Thin persistence layer over Dexie. Keeping it separate from the Pinia store
 * lets the store stay focused on state and lets tests exercise the pure
 * helpers without an IndexedDB instance.
 */
export const tasksRepository = {
  async list() {
    return db.tasks.toArray()
  },

  async create(payload) {
    const task = normalizeTask(payload)
    const id = await db.tasks.add(task)
    return { ...task, id }
  },

  async update(id, payload) {
    const task = normalizeTask(payload)
    await db.tasks.update(id, task)
    return { ...task, id }
  },

  async remove(id) {
    await db.tasks.delete(id)
  },

  /** Merges a backup by external id inside one transaction. */
  async mergeAll(payloads = []) {
    const plan = planMerge(await db.tasks.toArray(), payloads)
    const additions = plan.entries
      .filter((entry) => entry.status === 'new')
      .map((entry) => entry.task)
    const updates = plan.entries.filter((entry) => entry.status === 'update')

    await db.transaction('rw', db.tasks, async () => {
      for (const entry of updates) {
        await db.tasks.update(entry.existingId, entry.task)
      }
      if (additions.length > 0) await db.tasks.bulkAdd(additions)
    })

    return {
      tasks: await db.tasks.toArray(),
      added: additions.length,
      updated: updates.length,
      unchanged: plan.unchanged
    }
  },

  async clearAll() {
    await db.tasks.clear()
  }
}
