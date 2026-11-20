import { db } from './database.js'
import { normalizeTask } from '../helpers/tasks.js'
import { normalizeUpdate } from '../helpers/updates.js'
import { normalizeReport, REPORT_SECTION_KEYS } from '../helpers/reports.js'
import { planMerge, taskKey } from '../helpers/merge.js'

function text(value) {
  return String(value ?? '').trim()
}

function updateKey(update) {
  return `${update.taskId}|${update.createdAt}|${update.description}`
}

/** Content-based identity of a report, so a repeated import adds no copy. */
function reportKey(report) {
  const items = REPORT_SECTION_KEYS.map((key) =>
    (report.sections[key] ?? [])
      .map((item) => `${item.kind}~${item.taskName}~${item.description}`)
      .join('|')
  ).join('||')
  return `${report.createdAt}::${items}`
}

/**
 * Restores a parsed backup inside one transaction: tasks merge by external id,
 * updates are appended to the resolved task (duplicates skipped) and reports
 * are added as document snapshots (an identical report is skipped). The task
 * `ref` of the file is translated to the local id the task got in this DB.
 */
export const backupRepository = {
  async importBackup({ tasks = [], updates = [], reports = [] } = {}) {
    return db.transaction('rw', db.tasks, db.updates, db.reports, async () => {
      const existingTasks = await db.tasks.toArray()
      const plan = planMerge(existingTasks, tasks.map(normalizeTask))

      // ref of the file → local task id (existing or newly created).
      const refToId = new Map()
      const refByKey = new Map()
      const idlessRefs = []

      tasks.forEach((entry) => {
        const task = normalizeTask(entry)
        const ref = text(entry.ref) || task.externalId
        if (!ref) return
        const key = taskKey(task)
        if (key) refByKey.set(key, ref)
        else idlessRefs.push(ref)
      })

      const existingByKey = new Map(
        existingTasks.filter((task) => taskKey(task)).map((task) => [taskKey(task), task.id])
      )

      function resolveRef(ref) {
        if (!ref) return null
        if (refToId.has(ref)) return refToId.get(ref)
        return existingByKey.get(taskKey({ externalId: ref })) ?? null
      }

      let added = 0
      let updated = 0
      let unchanged = 0
      let idlessIndex = 0

      for (const entry of plan.entries) {
        const key = taskKey(entry.task)
        const ref = key ? refByKey.get(key) : idlessRefs[idlessIndex++]

        let taskId
        if (entry.status === 'update') {
          taskId = entry.existingId
          await db.tasks.update(taskId, entry.task)
          updated += 1
        } else if (entry.status === 'unchanged') {
          taskId = entry.existingId
          unchanged += 1
        } else {
          taskId = await db.tasks.add(entry.task)
          added += 1
        }

        if (ref) refToId.set(ref, taskId)
      }

      const seenUpdates = new Set(
        (await db.updates.toArray()).map((update) => updateKey(update))
      )
      let updatesAdded = 0
      let updatesSkipped = 0

      for (const entry of updates) {
        const update = normalizeUpdate({
          taskId: resolveRef(entry.ref),
          description: entry.description,
          createdAt: entry.createdAt
        })
        const key = update.taskId ? updateKey(update) : ''
        if (!key || seenUpdates.has(key)) {
          updatesSkipped += 1
          continue
        }
        seenUpdates.add(key)
        await db.updates.add(update)
        updatesAdded += 1
      }

      const existingReports = await db.reports.toArray()
      const seenReports = new Set(existingReports.map((report) => reportKey(report)))
      let reportsAdded = 0
      let reportsSkipped = 0

      for (const entry of reports) {
        const report = normalizeReport({
          createdAt: entry.createdAt,
          sections: REPORT_SECTION_KEYS.reduce((sections, section) => {
            sections[section] = (entry.sections?.[section] ?? []).map((item) => ({
              kind: item.kind,
              taskId: item.kind === 'update' ? resolveRef(item.ref) : null,
              updateId: null,
              taskName: item.taskName,
              description: item.description
            }))
            return sections
          }, {})
        })

        const key = reportKey(report)
        if (!report.createdAt || seenReports.has(key)) {
          reportsSkipped += 1
          continue
        }
        seenReports.add(key)
        await db.reports.add(report)
        reportsAdded += 1
      }

      return {
        tasks: await db.tasks.toArray(),
        added,
        updated,
        unchanged,
        updatesAdded,
        updatesSkipped,
        reportsAdded,
        reportsSkipped
      }
    })
  }
}
