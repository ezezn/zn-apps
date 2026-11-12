import { ref, onMounted, onUnmounted } from 'vue'
import { onPwaUpdateChange, updatePwa } from '../utils/pwaUpdate.js'

export function usePwaUpdate() {
  const updateAvailable = ref(false)
  let unsubscribe = null

  onMounted(() => {
    unsubscribe = onPwaUpdateChange((state) => {
      updateAvailable.value = state.updateAvailable
    })
  })

  onUnmounted(() => {
    unsubscribe?.()
    unsubscribe = null
  })

  return {
    updateAvailable,
    updateApp: updatePwa
  }
}
