import { REPORT_SECTION_KEYS } from './reports.js'
import { toDateInputValue } from './dates.js'

/** Placeholder token of a section inside a template: `{yesterday}`… */
export const REPORT_TEMPLATE_TOKENS = REPORT_SECTION_KEYS

/** Text used when a section has no items (matches the default template). */
export const EMPTY_SECTION_TEXT = 'No'

function text(value) {
  return String(value ?? '').trim()
}

function taskUrl(task = {}) {
  return text(task.externalUrl)
}

/**
 * One markdown bullet for a report item:
 * - an update becomes `[Task name](url) -> comment` (the name alone when the
 *   task has no external link, the comment alone when the task is unknown);
 * - a plain note becomes just its comment.
 */
export function renderReportItem(item = {}, tasks = []) {
  const description = text(item.description)
  if (item.kind !== 'update') return description

  const task = tasks.find((entry) => Number(entry.id) === Number(item.taskId))
  const name = text(task?.name) || text(item.taskName)
  const url = taskUrl(task)
  const label = name && url ? `[${name}](${url})` : name

  if (!label) return description
  return description ? `${label} -> ${description}` : label
}

/** Bullets of one section, or `No` when the section has no items. */
export function renderReportSection(report = {}, section = '', tasks = []) {
  const items = report.sections?.[section] ?? []
  const lines = items
    .map((item) => renderReportItem(item, tasks))
    .filter((line) => line !== '')
    .map((line) => `* ${line}`)

  return lines.length > 0 ? lines.join('\n') : EMPTY_SECTION_TEXT
}

/**
 * Expands a template into the final markdown text. Every `{section}` token is
 * replaced by that section's bullets; unknown tokens are left untouched so a
 * typo stays visible instead of silently disappearing.
 */
export function renderReportTemplate(template = '', { report = {}, tasks = [] } = {}) {
  const rendered = String(template ?? '').replace(/\{(\w+)\}/g, (match, token) =>
    REPORT_TEMPLATE_TOKENS.includes(token)
      ? renderReportSection(report, token, tasks)
      : match
  )
  return rendered.trim()
}

/** `report-2026-11-20-1530.md`, based on the report creation moment. */
export function reportExportFileName(report = {}) {
  const value = text(report.createdAt)
  if (!value) return `report-${toDateInputValue()}.md`
  const match = value.match(/^(\d{4}-\d{2}-\d{2})(?:T(\d{2}):(\d{2}))?/)
  if (!match) return 'report.md'
  const [, day, hours, minutes] = match
  return hours ? `report-${day}-${hours}${minutes}.md` : `report-${day}.md`
}
