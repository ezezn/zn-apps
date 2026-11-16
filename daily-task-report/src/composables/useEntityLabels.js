import { computed, reactive } from 'vue'
import { i18n, settings } from '../i18n.js'

/**
 * Defaults per locale. `Task` is the internal code name: the user can replace
 * the singular/plural labels in Settings so the public repo never exposes the
 * real work vocabulary.
 */
export const DEFAULT_ENTITY_NAMES = {
  en: { singular: 'Task', plural: 'Tasks' },
  es: { singular: 'Tarea', plural: 'Tareas' }
}

function readNames(locale) {
  const stored = settings.entity?.names?.[locale] || {}
  return {
    singular: String(stored.singular ?? DEFAULT_ENTITY_NAMES[locale].singular),
    plural: String(stored.plural ?? DEFAULT_ENTITY_NAMES[locale].plural)
  }
}

/** Reactive mirror of `settings.entity.names` (settings-core is not reactive). */
export const entityNames = reactive({
  en: readNames('en'),
  es: readNames('es')
})

export function setEntityName(locale, key, value) {
  if (!entityNames[locale] || !(key in entityNames[locale])) return
  const normalized = String(value ?? '')
  entityNames[locale][key] = normalized
  settings.set(`entity.names.${locale}.${key}`, normalized)
}

export function useEntityLabels() {
  const locale = computed(() => (i18n.global.locale.value === 'es' ? 'es' : 'en'))
  const names = computed(() => entityNames[locale.value])

  const singular = computed(() => names.value.singular.trim() || DEFAULT_ENTITY_NAMES[locale.value].singular)
  const plural = computed(() => names.value.plural.trim() || DEFAULT_ENTITY_NAMES[locale.value].plural)

  return { locale, names, singular, plural }
}
