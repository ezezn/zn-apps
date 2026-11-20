import { describe, it, expect } from 'vitest'
import {
  createReportDraft,
  createReportTaskItem,
  createTextReportItem,
  duplicateReport,
  filterReports,
  normalizeReport,
  normalizeReportItem,
  pruneEmptyReportItems,
  reportItemCount,
  sortReportsDesc
} from '../helpers/reports.js'

const tasks = [
  { id: 1, name: 'Revisar informe' },
  { id: 2, name: 'Cierre mensual' }
]

const updates = [
  { id: 10, taskId: 1, description: 'Avancé la revisión', createdAt: '2026-11-19T09:00' },
  { id: 11, taskId: 2, description: 'Cierre empezado', createdAt: '2026-11-19T17:00' },
  { id: 12, taskId: 2, description: 'Trabajando en el cierre', createdAt: '2026-11-20T08:30' },
  { id: 13, taskId: 99, description: 'Tarea desconocida', createdAt: '2026-11-20T09:00' }
]

const report = {
  id: 1,
  createdAt: '2026-11-10T09:30',
  sections: {
    yesterday: [{ kind: 'update', taskId: 1, updateId: 10, taskName: 'Revisar informe', description: 'Ayer' }],
    today: [],
    finish: [{ kind: 'text', description: 'Cerrar el informe' }],
    blockers: []
  }
}

describe('report helpers', () => {
  it('normalizes items and ignores task data on text items', () => {
    expect(normalizeReportItem({ kind: 'text', taskId: 7, taskName: 'X', description: '  Nota  ' }))
      .toEqual({ kind: 'text', taskId: null, updateId: null, taskName: '', description: 'Nota' })
    expect(normalizeReportItem({ kind: 'update', taskId: '2', updateId: '8', taskName: ' Tarea ', description: ' Hecho ' }))
      .toEqual({ kind: 'update', taskId: 2, updateId: 8, taskName: 'Tarea', description: 'Hecho' })
  })

  it('always exposes the four sections', () => {
    const normalized = normalizeReport({
      createdAt: '2026-11-20T10:00',
      sections: { today: [{ kind: 'text', description: 'Hoy' }] }
    })

    expect(Object.keys(normalized.sections)).toEqual(['yesterday', 'today', 'finish', 'blockers'])
    expect(normalized.sections.today).toHaveLength(1)
    expect(normalized.sections.blockers).toEqual([])
  })

  it('seeds yesterday and today with one item per known update', () => {
    const draft = createReportDraft({
      tasks,
      updates,
      today: '2026-11-20',
      previousDate: '2026-11-19',
      createdAt: '2026-11-20T10:00'
    })

    expect(draft.sections.yesterday.map((item) => item.updateId)).toEqual([10, 11])
    expect(draft.sections.today.map((item) => item.updateId)).toEqual([12])
    expect(draft.sections.yesterday[0]).toMatchObject({
      kind: 'update',
      taskId: 1,
      taskName: 'Revisar informe',
      description: 'Avancé la revisión'
    })
    expect(draft.sections.finish).toEqual([])
    expect(draft.sections.blockers).toEqual([])
  })

  it('builds a task reference without an existing update', () => {
    expect(createReportTaskItem({ id: 2, name: 'Cierre mensual', description: 'En curso' }))
      .toEqual({
        kind: 'update',
        taskId: 2,
        updateId: null,
        taskName: 'Cierre mensual',
        description: 'En curso'
      })
  })

  it('keeps task references even when they have no text yet', () => {
    const pruned = pruneEmptyReportItems({
      createdAt: '2026-11-20T10:00',
      sections: {
        finish: [createReportTaskItem({ id: 2, name: 'Cierre mensual' })],
        blockers: [createTextReportItem({ description: '   ' })]
      }
    })

    expect(pruned.sections.finish).toHaveLength(1)
    expect(pruned.sections.blockers).toEqual([])
  })

  it('prunes empty notes and counts the remaining items', () => {
    const pruned = pruneEmptyReportItems({
      createdAt: '2026-11-20T10:00',
      sections: {
        today: [{ kind: 'text', description: '  ' }, createTextReportItem({ description: 'Hoy' })],
        blockers: [{ kind: 'text', description: '' }]
      }
    })

    expect(pruned.sections.today).toHaveLength(1)
    expect(pruned.sections.blockers).toEqual([])
    expect(reportItemCount(pruned)).toBe(1)
  })

  it('filters inclusively by day range and swaps an inverted range', () => {
    const reports = [
      { id: 1, createdAt: '2026-11-01T08:00' },
      { id: 2, createdAt: '2026-11-10T09:30' },
      { id: 3, createdAt: '2026-11-20T18:00' }
    ]

    expect(filterReports(reports, { from: '2026-11-10', to: '2026-11-20' }).map((item) => item.id))
      .toEqual([2, 3])
    expect(filterReports(reports, { from: '2026-11-20', to: '2026-11-10' }).map((item) => item.id))
      .toEqual([2, 3])
    expect(filterReports(reports, { from: '2026-11-11' }).map((item) => item.id)).toEqual([3])
    expect(filterReports(reports, { to: '2026-11-09' }).map((item) => item.id)).toEqual([1])
    expect(filterReports(reports)).toHaveLength(3)
  })

  it('sorts newest first with the id as tiebreaker', () => {
    const sorted = sortReportsDesc([
      { id: 1, createdAt: '2026-11-01T08:00' },
      { id: 3, createdAt: '2026-11-20T09:00' },
      { id: 2, createdAt: '2026-11-20T09:00' }
    ])

    expect(sorted.map((item) => item.id)).toEqual([3, 2, 1])
  })

  it('duplicates the document with a new creation moment and independent items', () => {
    const copy = duplicateReport(report, { createdAt: '2026-11-21T11:00' })

    expect(copy.createdAt).toBe('2026-11-21T11:00')
    expect(copy.sections.yesterday).toEqual(report.sections.yesterday)
    expect(copy.sections.finish[0]).not.toBe(report.sections.finish[0])

    copy.sections.yesterday[0].description = 'Cambiado'
    expect(report.sections.yesterday[0].description).toBe('Ayer')
  })
})
