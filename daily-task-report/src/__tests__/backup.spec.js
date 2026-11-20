import { describe, it, expect } from 'vitest'
import {
  BACKUP_APP,
  BACKUP_VERSION,
  backupFileName,
  buildBackup,
  parseBackup,
  serializeBackup
} from '../helpers/backup.js'

const tasks = [
  {
    id: 3,
    name: ' Revisar informe ',
    externalId: ' EXT-1 ',
    description: 'Detalle',
    taskDate: '2026-11-02',
    addedAt: '2026-11-05T09:00',
    externalUrl: 'example.com/1',
    status: 'inactive',
    externalStatus: 'Closed'
  },
  {
    id: 4,
    name: 'Sin id externo',
    externalId: '',
    description: '',
    taskDate: '',
    addedAt: '2026-11-06T09:00',
    externalUrl: '',
    status: 'active',
    externalStatus: ''
  }
]

const updates = [
  { id: 10, taskId: 3, description: 'Primer avance', createdAt: '2026-11-05T10:00' },
  { id: 11, taskId: 4, description: 'Nota local', createdAt: '2026-11-06T10:00' }
]

const reports = [
  {
    id: 7,
    createdAt: '2026-11-06T18:00',
    sections: {
      yesterday: [
        {
          kind: 'update',
          taskId: 3,
          updateId: 10,
          taskName: 'Revisar informe',
          description: 'Primer avance'
        }
      ],
      today: [{ kind: 'text', description: 'Reunión' }],
      finish: [],
      blockers: [
        {
          kind: 'update',
          taskId: 4,
          updateId: 11,
          taskName: 'Sin id externo',
          description: 'Esperando datos'
        }
      ]
    }
  }
]

function build() {
  return buildBackup({ tasks, updates, reports }, { exportedAt: new Date('2026-11-16T10:00:00Z') })
}

describe('backup helpers', () => {
  it('builds a versioned backup without the local ids', () => {
    const backup = build()

    expect(backup.app).toBe(BACKUP_APP)
    expect(backup.version).toBe(BACKUP_VERSION)
    expect(backup.exportedAt).toBe('2026-11-16T10:00:00.000Z')
    expect(backup.tasks).toHaveLength(2)
    expect(backup.tasks[0]).not.toHaveProperty('id')
    expect(backup.tasks[0].name).toBe('Revisar informe')
    expect(backup.tasks[0].externalId).toBe('EXT-1')
  })

  it('links updates and report items to the task ref', () => {
    const backup = build()

    expect(backup.tasks.map((task) => task.ref)).toEqual(['EXT-1', 'task-4'])
    expect(backup.updates).toEqual([
      { ref: 'EXT-1', description: 'Primer avance', createdAt: '2026-11-05T10:00' },
      { ref: 'task-4', description: 'Nota local', createdAt: '2026-11-06T10:00' }
    ])
    expect(backup.reports[0].sections.yesterday[0]).toEqual({
      kind: 'update',
      ref: 'EXT-1',
      taskName: 'Revisar informe',
      description: 'Primer avance'
    })
    expect(backup.reports[0].sections.today[0]).toEqual({
      kind: 'text',
      ref: '',
      taskName: '',
      description: 'Reunión'
    })
  })

  it('drops the ids and the updateId while keeping the snapshot text', () => {
    const backup = build()

    expect(backup.updates[0]).not.toHaveProperty('id')
    expect(backup.updates[0]).not.toHaveProperty('taskId')
    expect(backup.reports[0]).not.toHaveProperty('id')
    expect(backup.reports[0].sections.blockers[0]).not.toHaveProperty('updateId')
    expect(backup.reports[0].sections.blockers[0].taskName).toBe('Sin id externo')
  })

  it('round-trips through serialize and parse', () => {
    const exported = serializeBackup({ tasks, updates, reports })
    const imported = parseBackup(exported)

    expect(imported.tasks).toHaveLength(2)
    expect(imported.tasks[0]).toMatchObject({
      ref: 'EXT-1',
      name: 'Revisar informe',
      externalId: 'EXT-1',
      status: 'inactive',
      externalStatus: 'Closed'
    })
    expect(imported.tasks[0]).not.toHaveProperty('id')
    expect(imported.updates).toHaveLength(2)
    expect(imported.updates[1]).toEqual({
      ref: 'task-4',
      description: 'Nota local',
      createdAt: '2026-11-06T10:00'
    })
    expect(imported.reports[0].sections.blockers[0]).toMatchObject({
      kind: 'update',
      ref: 'task-4',
      taskName: 'Sin id externo',
      description: 'Esperando datos'
    })
  })

  it('still reads a v1 file with only tasks', () => {
    const imported = parseBackup(
      JSON.stringify({ app: BACKUP_APP, version: 1, tasks: [tasks[0]] })
    )

    expect(imported.tasks).toHaveLength(1)
    expect(imported.tasks[0].ref).toBe('EXT-1')
    expect(imported.updates).toEqual([])
    expect(imported.reports).toEqual([])
  })

  it('rejects files that are not backups', () => {
    expect(() => parseBackup('not json')).toThrow('invalid-json')
    expect(() => parseBackup('[]')).toThrow('invalid-format')
    expect(() => parseBackup(JSON.stringify({ app: 'other-app', tasks: [] }))).toThrow('invalid-app')
    expect(() => parseBackup(JSON.stringify({ app: BACKUP_APP }))).toThrow('invalid-format')
  })

  it('drops unusable entries and keeps the valid ones', () => {
    const imported = parseBackup(
      JSON.stringify({
        app: BACKUP_APP,
        tasks: [null, 'texto', { name: '', externalId: '' }, { name: 'Válida', externalId: 'E-1' }],
        updates: [
          null,
          { ref: '', description: 'Sin tarea', createdAt: '2026-11-06T10:00' },
          { ref: 'E-1', description: '', createdAt: '2026-11-06T10:30' },
          { ref: 'E-1', description: 'Texto', createdAt: '2026-11-06T11:00' }
        ],
        reports: [null, { createdAt: '' }, { createdAt: '2026-11-06T18:00' }]
      })
    )

    expect(imported.tasks).toHaveLength(1)
    expect(imported.tasks[0].name).toBe('Válida')
    expect(imported.updates).toHaveLength(1)
    expect(imported.updates[0].description).toBe('Texto')
    expect(imported.reports).toHaveLength(1)
  })

  it('names the file after the app and the export date', () => {
    expect(backupFileName(new Date(2026, 10, 16))).toBe('daily-task-report-2026-11-16.json')
  })
})
