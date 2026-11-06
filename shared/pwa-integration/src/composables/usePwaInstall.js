import { ref, onMounted, onUnmounted } from 'vue'
import {
  isPwaInstalled,
  promptPwaInstall,
  onPwaStateChange,
  getDeferredPrompt
} from '../utils/pwaState.js'

/**
 * Composable para gestionar el estado de instalación de la PWA y activar el diálogo de instalación.
 *
 * @returns {{
 *   isInstalled: import('vue').Ref<boolean>,
 *   canInstall: import('vue').Ref<boolean>,
 *   promptInstall: () => Promise<{ outcome: 'accepted' | 'dismissed' } | null>
 * }}
 */
export function usePwaInstall() {
  const isInstalled = ref(isPwaInstalled())
  const canInstall = ref(Boolean(getDeferredPrompt()))

  let unsubscribe = null

  function handleStateChange(state) {
    isInstalled.value = state.isInstalled
    canInstall.value = state.canInstall
  }

  async function promptInstall() {
    return await promptPwaInstall()
  }

  onMounted(() => {
    isInstalled.value = isPwaInstalled()
    unsubscribe = onPwaStateChange(handleStateChange)
  })

  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
  })

  return {
    isInstalled,
    canInstall,
    promptInstall
  }
}
