<template>
  <ZnScreen :title="t('settings.title')">
    <div class="settings-page">
      <ZnSection :title="t('settings.languageSection')" :columns="1">
        <ZnSwitch
          :model-value="useSystem"
          :label-left="t('settings.useSystemLanguage')"
          @update:model-value="setUseSystem"
        />

        <ZnSelect
          :model-value="locale"
          :label="t('settings.language')"
          :options="languageOptions"
          :disabled="useSystem"
          @update:model-value="setLocale"
        />
      </ZnSection>

      <ZnSection :title="t('settings.themeSection')" :columns="1">
        <ZnSelect
          :model-value="preference"
          :label="t('settings.theme')"
          :options="themeOptions"
          @update:model-value="setPreference"
        />
      </ZnSection>

      <ZnSection :title="t('settings.entitySection')" :columns="2">
        <p class="settings-hint zn-span-2">{{ t('settings.entityHint') }}</p>

        <ZnSingleLineText
          :model-value="entityNames.en.singular"
          :label="`${t('settings.entityEnglish')} · ${t('settings.singular')}`"
          :maxlength="60"
          @update:model-value="setEntityName('en', 'singular', $event)"
        />
        <ZnSingleLineText
          :model-value="entityNames.en.plural"
          :label="`${t('settings.entityEnglish')} · ${t('settings.plural')}`"
          :maxlength="60"
          @update:model-value="setEntityName('en', 'plural', $event)"
        />
        <ZnSingleLineText
          :model-value="entityNames.es.singular"
          :label="`${t('settings.entitySpanish')} · ${t('settings.singular')}`"
          :maxlength="60"
          @update:model-value="setEntityName('es', 'singular', $event)"
        />
        <ZnSingleLineText
          :model-value="entityNames.es.plural"
          :label="`${t('settings.entitySpanish')} · ${t('settings.plural')}`"
          :maxlength="60"
          @update:model-value="setEntityName('es', 'plural', $event)"
        />

        <p class="settings-preview zn-span-2">
          {{ t('settings.namingPreview', { singular, plural }) }}
        </p>
      </ZnSection>

      <ZnSection :title="t('settings.dataSection')" :columns="1">
        <p class="settings-hint">{{ t('settings.dataHint') }}</p>

        <ZnRow padding="0" gap="12px" wrap>
          <ZnButton variant="outlined" @click="exportData">
            <template #icon>
              <ZnIcon name="download" :size="18" />
            </template>
            {{ t('settings.exportData') }}
          </ZnButton>
          <ZnButton variant="outlined" @click="pickImportFile">
            <template #icon>
              <ZnIcon name="upload" :size="18" />
            </template>
            {{ t('settings.importData') }}
          </ZnButton>
          <ZnButton
            variant="text"
            class="data-danger"
            :disabled="store.total === 0"
            @click="deleteAllData"
          >
            <template #icon>
              <ZnIcon name="delete_forever" :size="18" />
            </template>
            {{ t('settings.deleteAll') }}
          </ZnButton>
        </ZnRow>

        <input
          ref="fileInput"
          class="data-file-input"
          type="file"
          accept="application/json,.json"
          @change="onImportFile"
        />

        <p
          v-if="feedback"
          class="data-feedback"
          :class="`data-feedback--${feedback.type}`"
          :role="feedback.type === 'error' ? 'alert' : 'status'"
        >
          {{ feedback.message }}
        </p>
      </ZnSection>
    </div>

    <TaskImportDialog
      v-model="isImportOpen"
      :tasks="pendingImport"
      :existing-tasks="store.tasks"
      :saving="store.saving"
      @confirm="confirmImport"
    />
  </ZnScreen>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import {
  ZnButton,
  ZnIcon,
  ZnRow,
  ZnScreen,
  ZnSection,
  ZnSelect,
  ZnSingleLineText,
  ZnSwitch,
  useDialogs
} from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import { useAppLocale } from '../composables/useAppLocale.js'
import { useAppTheme } from '../composables/useAppTheme.js'
import { entityNames, setEntityName, useEntityLabels } from '../composables/useEntityLabels.js'
import { useTasksStore } from '../stores/tasks.js'
import { useUpdatesStore } from '../stores/updates.js'
import { backupFileName, parseBackup, serializeBackup } from '../helpers/backup.js'
import TaskImportDialog from '../components/TaskImportDialog.vue'

const t = (...args) => i18n.global.t(...args)
const { confirm } = useDialogs()
const { useSystem, locale, setUseSystem, setLocale } = useAppLocale()
const { preference, setPreference } = useAppTheme()
const { singular, plural } = useEntityLabels()
const store = useTasksStore()
const updatesStore = useUpdatesStore()

const fileInput = ref(null)
const feedback = ref(null)
const isImportOpen = ref(false)
const pendingImport = ref([])

const languageOptions = computed(() => [
  { value: 'en', label: t('settings.english') },
  { value: 'es', label: t('settings.spanish') }
])

const themeOptions = computed(() => [
  { value: 'system', label: t('settings.themeSystem') },
  { value: 'light', label: t('settings.themeLight') },
  { value: 'dark', label: t('settings.themeDark') }
])

onMounted(() => store.load())

function exportData() {
  try {
    const blob = new Blob([serializeBackup(store.tasks)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = backupFileName()
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    feedback.value = { type: 'success', message: t('settings.exportDone') }
  } catch {
    feedback.value = { type: 'error', message: t('settings.exportError') }
  }
}

function pickImportFile() {
  fileInput.value?.click()
}

async function onImportFile(event) {
  const file = event.target.files?.[0]
  // Permite volver a elegir el mismo archivo más adelante.
  event.target.value = ''
  if (!file) return

  let imported
  try {
    imported = parseBackup(await file.text())
  } catch {
    feedback.value = { type: 'error', message: t('settings.importError') }
    return
  }

  if (imported.length === 0) {
    feedback.value = {
      type: 'error',
      message: t('settings.importEmpty', { entityPlural: plural.value })
    }
    return
  }

  feedback.value = null
  pendingImport.value = imported
  isImportOpen.value = true
}

async function confirmImport() {
  const result = await store.mergeTasks(pendingImport.value)
  isImportOpen.value = false

  feedback.value = result
    ? {
        type: 'success',
        message: t('settings.importDone', { added: result.added, updated: result.updated })
      }
    : { type: 'error', message: t('settings.importError') }
}

async function deleteAllData() {
  const accepted = await confirm(
    t('settings.deleteAllConfirm', { count: store.total, entityPlural: plural.value }),
    {
      title: t('settings.deleteAllTitle'),
      confirmText: t('settings.deleteAll'),
      cancelText: t('common.cancel')
    }
  )
  if (!accepted) return

  const cleared = await store.clearTasks()
  // El repositorio vació ambas tablas en una transacción.
  if (cleared) updatesStore.forgetAll()
  feedback.value = cleared
    ? { type: 'success', message: t('settings.deleteAllDone') }
    : { type: 'error', message: t('tasks.removeError') }
}
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: var(--md-section-gap, 24px);
  width: min(100%, 880px);
  margin: 0 auto;
}

.settings-hint,
.settings-preview {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}

.settings-preview {
  font-weight: 500;
  color: var(--md-primary);
}

.data-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.data-feedback {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.data-feedback--success {
  color: var(--md-primary);
}

.data-feedback--error {
  color: var(--md-error);
}

.data-danger {
  color: var(--md-error);
}
</style>
