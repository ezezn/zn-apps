import { ref } from 'vue'
import { i18n, settings, systemLocale } from '../i18n.js'

const useSystem = ref(settings.i18n.useSystem ?? true)
const locale = ref(i18n.global.locale.value)

function applyLocale() {
  const target = useSystem.value ? systemLocale() : locale.value
  i18n.global.locale.value = target === 'es' ? 'es' : 'en'
}

/**
 * Locale preference shared by the settings view and the app shell.
 * The value is persisted with `settings-core`, so a reload keeps the choice.
 */
export function useAppLocale() {
  function setUseSystem(value) {
    useSystem.value = Boolean(value)
    settings.i18n.useSystem = useSystem.value
    settings.i18n.locale = useSystem.value ? null : locale.value
    applyLocale()
  }

  function setLocale(value) {
    locale.value = value === 'es' ? 'es' : 'en'
    if (!useSystem.value) settings.i18n.locale = locale.value
    applyLocale()
  }

  return { useSystem, locale, setUseSystem, setLocale }
}
