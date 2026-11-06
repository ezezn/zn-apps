<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { ZnButton, ZnIcon } from '@zn-apps/ui-core'
import { isPwaInstalled, onPwaStateChange, promptPwaInstall } from '../utils/pwaState.js'

const props = defineProps({
  title: {
    type: String,
    default: '¿Deseas instalar esta aplicación?'
  },
  message: {
    type: String,
    default: 'Instálala en tu dispositivo para acceder de forma rápida y usarla sin conexión.'
  },
  installText: {
    type: String,
    default: 'Instalar'
  },
  dismissText: {
    type: String,
    default: 'Ahora no'
  },
  icon: {
    type: String,
    default: 'download'
  },
  image: {
    type: String,
    default: ''
  },
  delayMs: {
    type: Number,
    default: 1500
  },
  persistDismissKey: {
    type: String,
    default: 'zn-pwa-dismissed'
  },
  storageType: {
    type: String,
    default: 'session',
    validator: (val) => ['session', 'local', 'none'].includes(val)
  }
})

const emit = defineEmits(['install', 'installed', 'dismiss'])

const isVisible = ref(false)
const isInstalling = ref(false)
const hasInstalled = ref(false)

let timer = null
let unsubscribePwa = null

function getStorage() {
  if (typeof window === 'undefined') return null
  try {
    if (props.storageType === 'session') return window.sessionStorage
    if (props.storageType === 'local') return window.localStorage
  } catch {
    return null
  }
  return null
}

function isDismissed() {
  if (props.storageType === 'none' || !props.persistDismissKey) return false
  const storage = getStorage()
  if (!storage) return false
  return storage.getItem(props.persistDismissKey) === 'true'
}

function markDismissed() {
  if (props.storageType === 'none' || !props.persistDismissKey) return
  const storage = getStorage()
  if (storage) {
    try {
      storage.setItem(props.persistDismissKey, 'true')
    } catch {
      // Ignorar error de cuota o modo privado
    }
  }
}

function showPrompt() {
  if (hasInstalled.value || isPwaInstalled() || isDismissed()) {
    return
  }
  isVisible.value = true
}

async function handleInstall() {
  isInstalling.value = true
  emit('install')

  try {
    const result = await promptPwaInstall()
    if (result && result.outcome === 'accepted') {
      hasInstalled.value = true
      isVisible.value = false
      emit('installed')
    } else {
      handleDismiss()
    }
  } catch (err) {
    console.error('[ZnPwaInstallPrompt] Error during installation prompt:', err)
    handleDismiss()
  } finally {
    isInstalling.value = false
  }
}

function handleDismiss() {
  isVisible.value = false
  markDismissed()
  emit('dismiss')
}

onMounted(() => {
  hasInstalled.value = isPwaInstalled()
  if (hasInstalled.value || isDismissed()) {
    return
  }

  unsubscribePwa = onPwaStateChange((state) => {
    if (state.isInstalled) {
      hasInstalled.value = true
      isVisible.value = false
    }
  })

  // Mostrar el popup tras el retardo configurado si no está instalada
  timer = setTimeout(() => {
    showPrompt()
  }, props.delayMs)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
  if (unsubscribePwa) unsubscribePwa()
})
</script>

<template>
  <Transition name="zn-pwa-popup">
    <aside
      v-if="isVisible"
      class="zn-pwa-popup"
      role="alertdialog"
      aria-modal="false"
      aria-labelledby="zn-pwa-title"
      aria-describedby="zn-pwa-desc"
    >
      <div class="zn-pwa-popup__card">
        <div class="zn-pwa-popup__header">
          <div class="zn-pwa-popup__media">
            <img
              v-if="image"
              class="zn-pwa-popup__image"
              :src="image"
              :alt="title"
            >
            <ZnIcon
              v-else
              class="zn-pwa-popup__icon"
              :name="icon"
              :size="36"
            />
          </div>

          <div class="zn-pwa-popup__text">
            <h3 id="zn-pwa-title" class="zn-pwa-popup__title">
              {{ title }}
            </h3>
            <p id="zn-pwa-desc" class="zn-pwa-popup__message">
              {{ message }}
            </p>
          </div>
        </div>

        <div class="zn-pwa-popup__actions">
          <ZnButton
            variant="text"
            type="button"
            @click="handleDismiss"
          >
            {{ dismissText }}
          </ZnButton>

          <ZnButton
            variant="filled"
            type="button"
            :disabled="isInstalling"
            @click="handleInstall"
          >
            <template #icon>
              <ZnIcon name="download" :size="20" />
            </template>
            {{ installText }}
          </ZnButton>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.zn-pwa-popup {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  max-width: 420px;
  width: calc(100% - 32px);
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .zn-pwa-popup {
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
    right: 16px;
    left: 16px;
    width: auto;
  }
}

.zn-pwa-popup__card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: 20px;
  background-color: var(--md-surface, #FEF7FF);
  color: var(--md-on-surface, #1D1B20);
  border: 1px solid var(--md-outline-variant, rgba(121, 116, 126, 0.2));
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 10px 24px -4px rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
}

.zn-pwa-popup__header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.zn-pwa-popup__media {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background-color: var(--md-primary-container, #EADDFF);
  color: var(--md-on-primary-container, #21005D);
}

.zn-pwa-popup__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.zn-pwa-popup__text {
  flex: 1 1 auto;
  min-width: 0;
}

.zn-pwa-popup__title {
  margin: 0 0 4px 0;
  font-family: 'Roboto', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  line-height: 1.3;
  color: var(--md-on-surface, #1D1B20);
}

.zn-pwa-popup__message {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  line-height: 1.4;
  color: var(--md-on-surface-variant, #49454F);
}

.zn-pwa-popup__actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

/* Transición animada de entrada y salida */
.zn-pwa-popup-enter-active,
.zn-pwa-popup-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.zn-pwa-popup-enter-from,
.zn-pwa-popup-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.96);
}
</style>
