import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getSystemColorScheme, onSystemColorSchemeChange } from '../utils/colorScheme.js'

/**
 * Composable reactivo para detectar el esquema de colores del sistema (móvil/escritorio)
 * y gestionar la preferencia de tema de la aplicación (seguir al sistema o forzar claro/oscuro).
 *
 * @param {Object} [options]
 * @param {'system' | 'light' | 'dark'} [options.defaultPreference='system'] Preferencia inicial.
 * @returns {{
 *   systemColorScheme: import('vue').Ref<'light' | 'dark'>,
 *   preference: import('vue').Ref<'system' | 'light' | 'dark'>,
 *   resolvedTheme: import('vue').ComputedRef<'light' | 'dark'>,
 *   isDark: import('vue').ComputedRef<boolean>,
 *   isLight: import('vue').ComputedRef<boolean>,
 *   setPreference: (pref: 'system' | 'light' | 'dark') => void
 * }}
 */
export function useColorScheme(options = {}) {
  const { defaultPreference = 'system' } = options

  const systemColorScheme = ref(getSystemColorScheme())
  const preference = ref(defaultPreference)

  const resolvedTheme = computed(() => {
    return preference.value === 'system' ? systemColorScheme.value : preference.value
  })

  const isDark = computed(() => resolvedTheme.value === 'dark')
  const isLight = computed(() => resolvedTheme.value === 'light')

  let unsubscribe = null

  function updateSystemScheme(newScheme) {
    systemColorScheme.value = newScheme
  }

  function setPreference(newPref) {
    if (newPref === 'system' || newPref === 'light' || newPref === 'dark') {
      preference.value = newPref
    }
  }

  onMounted(() => {
    systemColorScheme.value = getSystemColorScheme()
    unsubscribe = onSystemColorSchemeChange(updateSystemScheme)
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  })

  return {
    systemColorScheme,
    preference,
    resolvedTheme,
    isDark,
    isLight,
    setPreference
  }
}
