<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ZnButton, ZnIcon } from '@zn-apps/ui-core'
import { onPwaUpdateChange, updatePwa } from '../utils/pwaUpdate.js'

const props = defineProps({
  title: { type: String, default: 'Hay una actualización disponible' },
  message: { type: String, default: 'La aplicación tiene una nueva versión. ¿Quieres actualizarla ahora?' },
  updateText: { type: String, default: 'Actualizar' },
  dismissText: { type: String, default: 'Ahora no' },
  persistDismissKey: { type: String, default: 'zn-pwa-update-dismissed' }
})

const emit = defineEmits(['update', 'updated', 'dismiss'])
const isVisible = ref(false)
const isUpdating = ref(false)
let unsubscribe = null

function isDismissed() {
  if (!props.persistDismissKey || typeof sessionStorage === 'undefined') return false
  try {
    return sessionStorage.getItem(props.persistDismissKey) === 'true'
  } catch {
    return false
  }
}

function clearDismissed() {
  if (!props.persistDismissKey || typeof sessionStorage === 'undefined') return
  try {
    sessionStorage.removeItem(props.persistDismissKey)
  } catch {
    // Ignorar almacenamiento no disponible (modo privado)
  }
}

function dismiss() {
  isVisible.value = false
  if (props.persistDismissKey && typeof sessionStorage !== 'undefined') {
    try {
      sessionStorage.setItem(props.persistDismissKey, 'true')
    } catch {
      // Ignorar almacenamiento no disponible (modo privado)
    }
  }
  emit('dismiss')
}

async function applyUpdate() {
  isUpdating.value = true
  emit('update')
  const applied = await updatePwa()
  if (!applied) {
    isUpdating.value = false
    return
  }
  clearDismissed()
  emit('updated')
}

onMounted(() => {
  unsubscribe = onPwaUpdateChange(({ updateAvailable }) => {
    if (!updateAvailable) {
      // La versión activa ya está al día: el descarte anterior deja de aplicar.
      isVisible.value = false
      clearDismissed()
      return
    }
    if (!isDismissed()) isVisible.value = true
  })
})

onUnmounted(() => unsubscribe?.())
</script>

<template>
  <Transition name="zn-pwa-popup">
    <aside v-if="isVisible" class="zn-pwa-popup" role="alertdialog" aria-modal="false">
      <div class="zn-pwa-popup__card">
        <div class="zn-pwa-popup__header">
          <div class="zn-pwa-popup__media"><ZnIcon name="system_update" :size="36" /></div>
          <div class="zn-pwa-popup__text">
            <h3 class="zn-pwa-popup__title">{{ title }}</h3>
            <p class="zn-pwa-popup__message">{{ message }}</p>
          </div>
        </div>
        <div class="zn-pwa-popup__actions">
          <ZnButton variant="text" type="button" @click="dismiss">{{ dismissText }}</ZnButton>
          <ZnButton variant="filled" type="button" :disabled="isUpdating" @click="applyUpdate">
            <template #icon><ZnIcon name="system_update" :size="20" /></template>
            {{ updateText }}
          </ZnButton>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.zn-pwa-popup { position: fixed; bottom: 24px; right: 24px; z-index: 9999; max-width: 420px; width: calc(100% - 32px); box-sizing: border-box; }
@media (max-width: 600px) { .zn-pwa-popup { bottom: calc(16px + env(safe-area-inset-bottom, 0px)); right: 16px; left: 16px; width: auto; } }
.zn-pwa-popup__card { display: flex; flex-direction: column; gap: 16px; padding: 20px; border-radius: 20px; background: var(--md-surface, #FEF7FF); color: var(--md-on-surface, #1D1B20); border: 1px solid var(--md-outline-variant, rgba(121, 116, 126, .2)); box-shadow: 0 10px 24px -4px rgba(0, 0, 0, .15); }
.zn-pwa-popup__header { display: flex; align-items: flex-start; gap: 16px; }
.zn-pwa-popup__media { flex: 0 0 auto; display: grid; place-items: center; width: 48px; height: 48px; border-radius: 12px; background: var(--md-primary-container, #EADDFF); color: var(--md-on-primary-container, #21005D); }
.zn-pwa-popup__text { flex: 1; min-width: 0; }.zn-pwa-popup__title { margin: 0 0 4px; font-size: 1.1rem; font-weight: 500; }.zn-pwa-popup__message { margin: 0; font-size: .9rem; line-height: 1.4; color: var(--md-on-surface-variant, #49454F); }.zn-pwa-popup__actions { display: flex; justify-content: flex-end; gap: 8px; }
.zn-pwa-popup-enter-active, .zn-pwa-popup-leave-active { transition: opacity .3s, transform .3s; }.zn-pwa-popup-enter-from, .zn-pwa-popup-leave-to { opacity: 0; transform: translateY(20px) scale(.96); }
</style>
