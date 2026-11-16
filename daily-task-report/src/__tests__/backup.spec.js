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
  }
]

describe('backup helpers', () => {
  it('builds a versioned backup without the local ids', () => {
    const backup = buildBackup(tasks, { exportedAt: new Date('2026-11-16T10:00:00Z') })

    expect(backup.app).toBe(BACKUP_APP)
    expect(backup.version).toBe(BACKUP_VERSION)
    expect(backup.exportedAt).toBe('2026-11-16T10:00:00.000Z')
    expect(backup.tasks).toHaveLength(1)
    expect(backup.tasks[0]).not.toHaveProperty('id')
    expect(backup.tasks[0].name).toBe('Revisar informe')
    expect(backup.tasks[0].externalId).toBe('EXT-1')
  })

  it('round-trips through serialize and parse', () => {
    const exported = serializeBackup(tasks)
    const imported = parseBackup(exported)

    expect(imported).toHaveLength(1)
    expect(imported[0]).toMatchObject({
      name: 'Revisar informe',
      externalId: 'EXT-1',
      status: 'inactive',
      externalStatus: 'Closed'
    })
    expect(imported[0]).not.toHaveProperty('id')
  })

  it('rejects files that are not backups', () => {
    expect(() => parseBackup('not json')).toThrow('invalid-json')
    expect(() => parseBackup('[]')).toThrow('invalid-format')
    expect(() => parseBackup(JSON.stringify({ app: 'other-app', tasks: [] }))).toThrow('invalid-app')
    expect(() => parseBackup(JSON.stringify({ app: BACKUP_APP }))).toThrow('invalid-format')
  })

  it('drops unusable entries and keeps the valid ones', () => {
    const imported = parseBackup(JSON.stringify({
      app: BACKUP_APP,
      tasks: [null, 'texto', { name: '', externalId: '' }, { name: 'Válida', externalId: 'E-1' }]
    }))

    expect(imported).toHaveLength(1)
    expect(imported[0].name).toBe('Válida')
  })

  it('names the file after the app and the export date', () => {
    expect(backupFileName(new Date(2026, 10, 16))).toBe('daily-task-report-2026-11-16.json')
  })
})
