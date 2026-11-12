<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { ZnIcon, ZnTabs } from '@zn-apps/ui-core'

const props = defineProps({
  name: { type: String, required: true },
  version: { type: String, required: true },
  description: { type: String, required: true },
  author: { type: String, required: true },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  imageAlt: { type: String, default: '' },
  /** URL del CHANGELOG (Markdown o texto plano). Se descarga al abrir la pestaña. */
  changelogUrl: { type: String, default: '' },
  /** Texto ya cargado del CHANGELOG; evita el fetch si se proporciona. */
  changelog: { type: String, default: '' },
  creditsLabel: { type: String, default: 'Créditos' },
  changelogLabel: { type: String, default: 'Changelog' },
  loadingText: { type: String, default: 'Cargando changelog…' },
  emptyText: { type: String, default: 'No hay changelog disponible.' },
  errorText: { type: String, default: 'No se pudo cargar el changelog.' }
})

const activeTab = ref('credits')
const changelogText = ref(props.changelog)
const isLoading = ref(false)
const loadError = ref('')
let controller = null

const tabs = computed(() => [
  { value: 'credits', label: props.creditsLabel },
  { value: 'changelog', label: props.changelogLabel }
])

async function loadChangelog() {
  if (changelogText.value || isLoading.value) return

  if (props.changelog) {
    changelogText.value = props.changelog
    return
  }

  if (!props.changelogUrl) return

  controller?.abort()
  controller = new AbortController()
  isLoading.value = true
  loadError.value = ''

  try {
    const response = await fetch(props.changelogUrl, { signal: controller.signal })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    changelogText.value = await response.text()
  } catch (error) {
    if (error?.name !== 'AbortError') loadError.value = props.errorText
  } finally {
    isLoading.value = false
  }
}

watch(activeTab, (value) => {
  if (value === 'changelog') loadChangelog()
})

watch(
  () => props.changelog,
  (value) => {
    if (value) {
      changelogText.value = value
      loadError.value = ''
    }
  }
)

watch(
  () => props.changelogUrl,
  () => {
    if (props.changelog) return
    controller?.abort()
    changelogText.value = ''
    loadError.value = ''
    if (activeTab.value === 'changelog') loadChangelog()
  }
)

onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <div class="zn-about">
    <ZnTabs v-model="activeTab" :tabs="tabs" variant="secondary">
      <template #panel="{ tab }">
        <div v-if="tab.value === 'credits'" class="zn-about__credits">
          <div class="zn-about__primary">
            <img
              v-if="image"
              class="zn-about__icon zn-about__image"
              :src="image"
              :alt="imageAlt || name"
            >
            <ZnIcon v-else class="zn-about__icon" :name="icon || 'info'" :size="48" />
            <div class="zn-about__heading">
              <h2 class="zn-about__name">{{ name }}</h2>
              <p class="zn-about__version">v{{ version }}</p>
            </div>
          </div>

          <div class="zn-about__secondary">
            <p class="zn-about__description">{{ description }}</p>
            <p class="zn-about__author">{{ author }}</p>
          </div>
        </div>

        <div v-else class="zn-about__changelog" :aria-busy="isLoading ? 'true' : 'false'">
          <p v-if="isLoading" class="zn-about__changelog-state">{{ loadingText }}</p>
          <p
            v-else-if="loadError"
            class="zn-about__changelog-state zn-about__changelog-state--error"
            role="alert"
          >
            {{ loadError }}
          </p>
          <p v-else-if="!changelogText" class="zn-about__changelog-state">{{ emptyText }}</p>
          <pre v-else class="zn-about__changelog-text">{{ changelogText }}</pre>
        </div>
      </template>
    </ZnTabs>
  </div>
</template>

<style scoped>
.zn-about {
  display: block;
  min-width: 0;
}

.zn-about__credits {
  display: grid;
  gap: 20px;
}

.zn-about__primary {
  display: flex;
  align-items: center;
  gap: 16px;
}

.zn-about__icon {
  flex: 0 0 auto;
}

.zn-about__image {
  width: 48px;
  height: 48px;
  object-fit: contain;
}

.zn-about__heading {
  flex: 1;
  min-width: 0;
}

.zn-about__name {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.zn-about__version {
  margin: 4px 0 0;
  font-size: 1rem;
}

.zn-about__secondary {
  display: grid;
  gap: 8px;
}

.zn-about__description,
.zn-about__author {
  margin: 0;
}

.zn-about__author {
  font-size: 0.875rem;
}

/* --------------------------------------------------------------------------
   Changelog: contenedor con scrollbar
   -------------------------------------------------------------------------- */
.zn-about__changelog {
  box-sizing: border-box;
  max-height: min(50vh, 320px);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: var(--md-surface-container-low, var(--md-surface));
  color: var(--md-on-surface-variant, var(--md-on-background));
  scrollbar-width: thin;
}

.zn-about__changelog::-webkit-scrollbar {
  width: 8px;
}

.zn-about__changelog::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 8px;
  background-clip: content-box;
  background-color: var(--md-outline);
}

.zn-about__changelog-text {
  margin: 0;
  color: inherit;
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.zn-about__changelog-state {
  margin: 0;
  font-size: 0.875rem;
}

.zn-about__changelog-state--error {
  color: var(--md-error, #B3261E);
}
</style>
