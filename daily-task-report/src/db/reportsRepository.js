import { db } from './database.js'
import { normalizeReport } from '../helpers/reports.js'

/**
 * Reports are document snapshots: the row stores the four sections with the
 * text and task/update references captured at creation time.
 */
export const reportsRepository = {
  async list() {
    return db.reports.toArray()
  },

  async create(payload) {
    const report = normalizeReport(payload)
    const id = await db.reports.add(report)
    return { ...report, id }
  },

  async remove(id) {
    await db.reports.delete(Number(id))
  },

  async clearAll() {
    await db.reports.clear()
  }
}
