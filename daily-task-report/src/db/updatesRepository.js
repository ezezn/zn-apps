import { db } from './database.js'
import { normalizeUpdate } from '../helpers/updates.js'

/**
 * Persistence for the task change log. Updates are stored in their own table
 * keyed by `taskId`; the task itself stays untouched when a log entry changes.
 */
export const updatesRepository = {
  async list() {
    return db.updates.toArray()
  },

  async listByTask(taskId) {
    return db.updates.where('taskId').equals(Number(taskId)).toArray()
  },

  async create(payload) {
    const update = normalizeUpdate(payload)
    const id = await db.updates.add(update)
    return { ...update, id }
  },

  async update(id, payload) {
    const update = normalizeUpdate(payload)
    await db.updates.update(id, update)
    return { ...update, id }
  },

  async remove(id) {
    await db.updates.delete(id)
  },

  async removeByTask(taskId) {
    await db.updates.where('taskId').equals(Number(taskId)).delete()
  },

  async clearAll() {
    await db.updates.clear()
  }
}
