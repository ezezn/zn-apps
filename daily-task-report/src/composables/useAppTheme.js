import { ref } from 'vue'
import { settings } from '../i18n.js'

const VALID_PREFERENCES = ['system', 'light', 'dark']
const stored = settings.theme?.preference

const preference = ref(VALID_PREFERENCES.includes(stored) ? stored : 'system')

/**
 * Theme preference shared by `ZnApp` (mode) and the settings view.
 * `system` is delegated to `ZnApp`, which follows `prefers-color-scheme`.
 */
export function useAppTheme() {
  function setPreference(value) {
    if (!VALID_PREFERENCES.includes(value)) return
    preference.value = value
    settings.theme.preference = value
  }

  return { preference, setPreference }
}
