import { computed, ref } from 'vue'
import { i18n, settings } from '../i18n.js'
import { REPORT_SECTION_KEYS } from '../helpers/reports.js'

/**
 * Templates available in the Export dialog of the Reports page. The default
 * template is built in and always listed first; the rest are configured by the
 * user in Settings and stored as `{ id, name, body }`.
 */
export const DEFAULT_TEMPLATE_ID = 'default'

export const DEFAULT_REPORT_TEMPLATE =
  '*What did I achieve yesterday?*\n' +
  '{yesterday}\n' +
  '\n' +
  '*What do I plan to work on today?*\n' +
  '{today}\n' +
  '\n' +
  "*I think I'll finish*\n" +
  '{finish}\n' +
  '\n' +
  '*Do I have any blockers?*\n' +
  '{blockers}'

export const reportTemplates = ref(readReportTemplates())

const LAST_TEMPLATE_KEY = 'lastReportTemplateId'

/** Last template chosen in the export dialog, remembered per device. */
export const lastReportTemplateId = ref(
  String(settings.get(LAST_TEMPLATE_KEY, '') ?? '').trim()
)

function text(value) {
  return String(value ?? '').trim()
}

export function normalizeReportTemplate(entry = {}) {
  return {
    id: text(entry.id),
    name: text(entry.name),
    body: String(entry.body ?? '')
  }
}

function readReportTemplates() {
  const stored = settings.get('reportTemplates', [])
  if (!Array.isArray(stored)) return []
  return stored.map(normalizeReportTemplate).filter((template) => template.name)
}

function persistReportTemplates(next) {
  reportTemplates.value = next
  settings.set('reportTemplates', next)
}

function createTemplateId() {
  const cryptoApi = globalThis.crypto
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID()
  return `template-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function defaultReportTemplate() {
  return {
    id: DEFAULT_TEMPLATE_ID,
    name: i18n.global.t('reports.templates.defaultName'),
    body: DEFAULT_REPORT_TEMPLATE,
    isDefault: true
  }
}

/** `{ name, body }` with `required` keys for each empty field. */
export function validateReportTemplate(entry = {}) {
  const template = normalizeReportTemplate(entry)
  const errors = {}
  if (!template.name) errors.name = 'required'
  if (!text(template.body)) errors.body = 'required'
  return errors
}

/** Creates or replaces a template. `originalId` identifies the edited row. */
export function saveReportTemplate(entry, { originalId = null } = {}) {
  const template = normalizeReportTemplate(entry)
  if (validateReportTemplate(template).name) return false

  const index = originalId
    ? reportTemplates.value.findIndex((item) => item.id === originalId)
    : -1

  if (index >= 0) template.id = reportTemplates.value[index].id
  else if (!template.id) template.id = createTemplateId()

  const next = [...reportTemplates.value]
  if (index >= 0) next[index] = template
  else next.push(template)
  persistReportTemplates(next)
  return true
}

export function setLastReportTemplateId(id) {
  const value = text(id) || DEFAULT_TEMPLATE_ID
  lastReportTemplateId.value = value
  settings.set(LAST_TEMPLATE_KEY, value)
}

/** The remembered template when it still exists; otherwise the default one. */
export function rememberedReportTemplateId() {
  const stored = lastReportTemplateId.value
  const exists =
    stored === DEFAULT_TEMPLATE_ID || reportTemplates.value.some((item) => item.id === stored)
  return exists ? stored : DEFAULT_TEMPLATE_ID
}

export function removeReportTemplate(id) {
  const next = reportTemplates.value.filter((item) => item.id !== id)
  if (next.length === reportTemplates.value.length) return false
  persistReportTemplates(next)
  if (lastReportTemplateId.value === id) setLastReportTemplateId(DEFAULT_TEMPLATE_ID)
  return true
}

/** Default template first, then the user templates, for the export selector. */
export function useReportTemplates() {
  const templates = computed(() => [defaultReportTemplate(), ...reportTemplates.value])

  function templateById(id) {
    return templates.value.find((template) => template.id === id) ?? null
  }

  return { templates, templateById, placeholders: REPORT_SECTION_KEYS }
}
