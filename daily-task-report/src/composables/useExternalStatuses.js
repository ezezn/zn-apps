import { computed, ref } from 'vue'
import { i18n, settings } from '../i18n.js'

/**
 * Possible values of the external status, configured by the user in Settings.
 * Each entry is `{ value, labels: { en, es } }`: `value` is an automatic,
 * invisible unique id stored on the task; the labels are the only visible part.
 */
export const externalStatuses = ref(readExternalStatuses())

function text(value) {
  return String(value ?? '').trim()
}

export function normalizeExternalStatus(entry = {}) {
  const labels = entry.labels ?? {}
  return {
    value: text(entry.value),
    labels: {
      en: text(labels.en),
      es: text(labels.es)
    }
  }
}

/** Label in `locale`, falling back to English and then to the stored value. */
export function externalStatusLabel(status = {}, locale = 'en') {
  const labels = status.labels ?? {}
  return labels[locale] || labels.en || status.value
}

function readExternalStatuses() {
  const stored = settings.get('externalStatuses', [])
  if (!Array.isArray(stored)) return []
  return stored
    .map(normalizeExternalStatus)
    .filter((status) => status.value)
}

function persistExternalStatuses(next) {
  externalStatuses.value = next
  settings.set('externalStatuses', next)
}

function findIndexByValue(value) {
  return externalStatuses.value.findIndex((status) => status.value === value)
}

/** Unique id, generated here and never shown or edited in the UI. */
export function createExternalStatusId() {
  const cryptoApi = globalThis.crypto
  if (cryptoApi?.randomUUID) return cryptoApi.randomUUID()
  return `status-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** `{ labelEn? }` with `required` when the English label is missing. */
export function validateExternalStatus(entry = {}) {
  const status = normalizeExternalStatus(entry)
  const errors = {}
  if (!status.labels.en) errors.labelEn = 'required'
  return errors
}

/** Creates or replaces a status. `originalValue` identifies the row being edited. */
export function saveExternalStatus(entry, { originalValue = null } = {}) {
  const status = normalizeExternalStatus(entry)
  if (!status.labels.en) return false

  const replacedIndex = originalValue === null ? -1 : findIndexByValue(originalValue)
  if (replacedIndex >= 0) {
    // The id is the identity of the row: editing only replaces the labels.
    status.value = externalStatuses.value[replacedIndex].value
  } else if (!status.value) {
    do {
      status.value = createExternalStatusId()
    } while (findIndexByValue(status.value) >= 0)
  }

  const next = [...externalStatuses.value]
  if (replacedIndex >= 0) next[replacedIndex] = status
  else next.push(status)
  persistExternalStatuses(next)
  return true
}

export function removeExternalStatus(value) {
  const index = findIndexByValue(value)
  if (index < 0) return false
  persistExternalStatuses(externalStatuses.value.filter((_, position) => position !== index))
  return true
}

/** Reactive options for the task form and localized labels for the cards. */
export function useExternalStatuses() {
  const locale = computed(() => (i18n.global.locale.value === 'es' ? 'es' : 'en'))

  const options = computed(() =>
    externalStatuses.value.map((status) => ({
      value: status.value,
      label: externalStatusLabel(status, locale.value)
    }))
  )

  function labelFor(value) {
    const status = externalStatuses.value.find((item) => item.value === value)
    return status ? externalStatusLabel(status, locale.value) : String(value ?? '')
  }

  /** Keeps a stored value that is no longer configured visible in the form. */
  function optionsWithCurrent(value) {
    if (!value || options.value.some((option) => option.value === value)) return options.value
    return [...options.value, { value, label: String(value) }]
  }

  return { locale, statuses: externalStatuses, options, labelFor, optionsWithCurrent }
}
