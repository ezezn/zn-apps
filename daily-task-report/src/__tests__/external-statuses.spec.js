import { describe, it, expect, beforeEach } from 'vitest'
import { i18n, settings } from '../i18n.js'
import {
  externalStatuses,
  externalStatusLabel,
  normalizeExternalStatus,
  removeExternalStatus,
  saveExternalStatus,
  useExternalStatuses,
  validateExternalStatus
} from '../composables/useExternalStatuses.js'

describe('external statuses', () => {
  beforeEach(() => {
    settings.set('externalStatuses', [])
    externalStatuses.value = []
    i18n.global.locale.value = 'en'
  })

  it('normalizes and trims both labels', () => {
    expect(normalizeExternalStatus({ labels: { en: ' Open ', es: ' Abierta ' } }))
      .toEqual({ value: '', labels: { en: 'Open', es: 'Abierta' } })
  })

  it('requires only the English label', () => {
    expect(validateExternalStatus({ labels: { en: '', es: 'Abierta' } }))
      .toEqual({ labelEn: 'required' })
    expect(validateExternalStatus({ labels: { en: 'Open', es: '' } })).toEqual({})
  })

  it('creates statuses with a hidden generated id and persists them', () => {
    expect(saveExternalStatus({ labels: { en: 'Open', es: 'Abierta' } })).toBe(true)
    expect(saveExternalStatus({ labels: { en: 'Closed' } })).toBe(true)

    const [open, closed] = externalStatuses.value
    expect(open.value).toBeTruthy()
    expect(closed.value).toBeTruthy()
    expect(open.value).not.toBe(closed.value)
    expect(open.labels).toEqual({ en: 'Open', es: 'Abierta' })
    expect(settings.get('externalStatuses')).toEqual([open, closed])
  })

  it('edits a status keeping its id and deletes it', () => {
    saveExternalStatus({ labels: { en: 'Open', es: 'Abierta' } })
    const value = externalStatuses.value[0].value

    saveExternalStatus(
      { labels: { en: 'Open', es: 'En curso' } },
      { originalValue: value }
    )

    expect(externalStatuses.value).toHaveLength(1)
    expect(externalStatuses.value[0]).toEqual({
      value,
      labels: { en: 'Open', es: 'En curso' }
    })
    expect(removeExternalStatus(value)).toBe(true)
    expect(settings.get('externalStatuses')).toEqual([])
  })

  it('labels in the active locale and falls back to English', () => {
    const status = { value: 'id', labels: { en: 'Open', es: '' } }

    expect(externalStatusLabel({ value: 'id', labels: { en: 'Open', es: 'Abierta' } }, 'es'))
      .toBe('Abierta')
    expect(externalStatusLabel(status, 'es')).toBe('Open')
    expect(externalStatusLabel(status, 'en')).toBe('Open')
  })

  it('offers localized options and keeps an unconfigured value visible', () => {
    saveExternalStatus({ labels: { en: 'Open', es: 'Abierta' } })
    const value = externalStatuses.value[0].value
    i18n.global.locale.value = 'es'
    const { options, labelFor, optionsWithCurrent } = useExternalStatuses()

    expect(options.value).toEqual([{ value, label: 'Abierta' }])
    expect(labelFor(value)).toBe('Abierta')
    expect(labelFor('unknown-id')).toBe('unknown-id')
    expect(optionsWithCurrent('unknown-id')).toEqual([
      { value, label: 'Abierta' },
      { value: 'unknown-id', label: 'unknown-id' }
    ])
  })
})
