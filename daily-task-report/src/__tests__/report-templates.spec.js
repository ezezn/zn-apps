import { describe, it, expect } from 'vitest'
import { settings } from '../i18n.js'
import {
  DEFAULT_TEMPLATE_ID,
  lastReportTemplateId,
  rememberedReportTemplateId,
  removeReportTemplate,
  reportTemplates,
  saveReportTemplate,
  setLastReportTemplateId,
  validateReportTemplate
} from '../composables/useReportTemplates.js'

describe('report templates', () => {
  it('requires a name and a body', () => {
    const invalid = validateReportTemplate({ name: '  ', body: ' ' })
    expect(invalid).toEqual({ name: 'required', body: 'required' })
  })

  it('saves a user template and keeps the default first in the dialog', () => {
    expect(saveReportTemplate({ name: 'Short', body: '{today}' })).toBe(true)
    const saved = reportTemplates.value.find((template) => template.name === 'Short')

    expect(saved.id).toBeTruthy()
    expect(settings.get('reportTemplates', [])).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'Short', body: '{today}' })])
    )
  })

  it('remembers the last template used on this device', () => {
    const [template] = reportTemplates.value
    setLastReportTemplateId(template.id)

    expect(lastReportTemplateId.value).toBe(template.id)
    expect(settings.get('lastReportTemplateId')).toBe(template.id)
    expect(rememberedReportTemplateId()).toBe(template.id)
  })

  it('falls back to the default template when the remembered one is deleted', () => {
    const [template] = reportTemplates.value
    setLastReportTemplateId(template.id)
    removeReportTemplate(template.id)

    expect(lastReportTemplateId.value).toBe(DEFAULT_TEMPLATE_ID)
    expect(rememberedReportTemplateId()).toBe(DEFAULT_TEMPLATE_ID)
  })
})
