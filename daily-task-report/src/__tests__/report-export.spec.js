import { describe, it, expect } from 'vitest'
import {
  EMPTY_SECTION_TEXT,
  renderReportItem,
  renderReportSection,
  renderReportTemplate,
  reportExportFileName
} from '../helpers/report-export.js'
import { DEFAULT_REPORT_TEMPLATE } from '../composables/useReportTemplates.js'

const tasks = [
  { id: 1, name: 'Revisar wizard', externalUrl: 'https://example.test/#Case/1' },
  { id: 2, name: 'Informe sin enlace' }
]

const report = {
  createdAt: '2026-11-20T15:30',
  sections: {
    yesterday: [
      {
        kind: 'update',
        taskId: 1,
        taskName: 'Revisar wizard',
        description: 'Revisé los comentarios del CR.'
      }
    ],
    today: [{ kind: 'text', description: 'Reunión de seguimiento.' }],
    finish: [],
    blockers: [
      {
        kind: 'update',
        taskId: 2,
        taskName: 'Informe sin enlace',
        description: 'Esperando datos.'
      }
    ]
  }
}

describe('report export', () => {
  it('renders task updates as a link followed by the comment', () => {
    expect(renderReportItem(report.sections.yesterday[0], tasks)).toBe(
      '[Revisar wizard](https://example.test/#Case/1) -> Revisé los comentarios del CR.'
    )
  })

  it('falls back to the task name when there is no link and to the comment when the task is gone', () => {
    expect(renderReportItem(report.sections.blockers[0], tasks)).toBe(
      'Informe sin enlace -> Esperando datos.'
    )
    expect(
      renderReportItem({ kind: 'update', taskId: 99, taskName: '', description: 'Sólo texto' }, tasks)
    ).toBe('Sólo texto')
  })

  it('renders plain notes and empty sections', () => {
    expect(renderReportSection(report, 'today', tasks)).toBe('* Reunión de seguimiento.')
    expect(renderReportSection(report, 'finish', tasks)).toBe(EMPTY_SECTION_TEXT)
  })

  it('expands the default template and keeps unknown tokens', () => {
    const output = renderReportTemplate(DEFAULT_REPORT_TEMPLATE, { report, tasks })

    expect(output).toContain('*What did I achieve yesterday?*')
    expect(output).toContain(
      '* [Revisar wizard](https://example.test/#Case/1) -> Revisé los comentarios del CR.'
    )
    expect(output).toContain('*What do I plan to work on today?*')
    expect(output).toContain('* Reunión de seguimiento.')
    expect(output).toContain("*I think I'll finish*\nNo")
    expect(output).toContain('*Do I have any blockers?*')
    expect(output).toContain('* Informe sin enlace -> Esperando datos.')
    expect(renderReportTemplate('Hola {unknown}', { report, tasks })).toBe('Hola {unknown}')
  })

  it('names the downloaded file after the report creation moment', () => {
    expect(reportExportFileName(report)).toBe('report-2026-11-20-1530.md')
    expect(reportExportFileName({})).toMatch(/^report-\d{4}-\d{2}-\d{2}\.md$/)
  })
})
