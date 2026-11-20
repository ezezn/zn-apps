import Dexie from 'dexie'

/**
 * Local-only storage: task data never leaves the device.
 * Use a new version() + upgrade() to evolve the schema instead of editing
 * version 1 in place.
 */
export const db = new Dexie('daily-task-report')

db.version(1).stores({
  tasks: '++id, externalId, name, status, taskDate, addedAt'
})

// v2: the internal status was reduced to `active` | `inactive`.
db.version(2)
  .stores({
    tasks: '++id, externalId, name, status, taskDate, addedAt'
  })
  .upgrade((tx) =>
    tx
      .table('tasks')
      .toCollection()
      .modify((task) => {
        if (task.status === 'active' || task.status === 'inactive') return
        task.status = task.status === 'done' || task.status === 'cancelled' ? 'inactive' : 'active'
      })
  )

// v3: task updates — the change log attached to each task.
db.version(3).stores({
  tasks: '++id, externalId, name, status, taskDate, addedAt',
  updates: '++id, taskId, createdAt'
})

// v4: reports — immutable document snapshots built from a day's updates.
db.version(4).stores({
  tasks: '++id, externalId, name, status, taskDate, addedAt',
  updates: '++id, taskId, createdAt',
  reports: '++id, createdAt'
})
