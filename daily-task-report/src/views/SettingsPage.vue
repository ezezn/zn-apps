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

      <ZnSection :title="t('settings.workDaysSection')" :columns="1">
        <p class="settings-hint">{{ t('settings.workDaysHint') }}</p>

        <ul class="work-days">
          <li v-for="day in days" :key="day" class="work-days__item">
            <ZnSwitch
              :model-value="isWorkDay(day)"
              :label-left="weekdayLabel(day)"
              :disabled="isLastWorkDay(day)"
              @update:model-value="toggleWorkDay(day, $event)"
            />
          </li>
        </ul>
      </ZnSection>

      <ZnSection :title="t('settings.templatesSection')" :columns="1">
        <p class="settings-hint">{{ t('settings.templatesHint') }}</p>

        <ul class="status-list">
          <li class="status-list__item">
            <span class="status-list__label">{{ defaultTemplate.name }}</span>
            <span class="template-badge">{{ t('settings.templatesDefault') }}</span>
          </li>
          <li
            v-for="template in userTemplates"
            :key="template.id"
            class="status-list__item"
          >
            <span class="status-list__label">{{ template.name }}</span>
            <ZnRow padding="0" gap="4px" class="status-list__actions">
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('common.edit')"
                :title="t('common.edit')"
                @click="editTemplate(template)"
              >
                <ZnIcon name="edit" :size="20" />
              </ZnButton>
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('common.delete')"
                :title="t('common.delete')"
                @click="deleteTemplate(template)"
              >
                <ZnIcon name="delete" :size="20" />
              </ZnButton>
            </ZnRow>
          </li>
        </ul>

        <ZnRow padding="0" gap="12px" wrap>
          <ZnButton variant="outlined" @click="addTemplate">
            <template #icon>
              <ZnIcon name="add" :size="18" />
            </template>
            {{ t('settings.templatesAdd') }}
          </ZnButton>
        </ZnRow>
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

      <ZnSection :title="t('settings.externalStatusSection')" :columns="1">
        <p class="settings-hint">{{ t('settings.externalStatusHint') }}</p>

        <p v-if="statuses.length === 0" class="settings-hint">
          {{ t('settings.externalStatusEmpty') }}
        </p>

        <ul v-else class="status-list">
          <li v-for="status in statuses" :key="status.value" class="status-list__item">
            <span class="status-list__label">{{ labelFor(status.value) }}</span>
            <ZnRow padding="0" gap="4px" class="status-list__actions">
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('common.edit')"
                :title="t('common.edit')"
                @click="editStatus(status)"
              >
                <ZnIcon name="edit" :size="20" />
              </ZnButton>
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('common.delete')"
                :title="t('common.delete')"
                @click="deleteStatus(status)"
              >
                <ZnIcon name="delete" :size="20" />
              </ZnButton>
            </ZnRow>
          </li>
        </ul>

        <ZnRow padding="0" gap="12px" wrap>
          <ZnButton variant="outlined" @click="addStatus">
            <template #icon>
              <ZnIcon name="add" :size="18" />
            </template>
            {{ t('settings.externalStatusAdd') }}
          </ZnButton>
        </ZnRow>
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
            :disabled="store.total === 0 && reportsStore.total === 0"
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
      :tasks="pendingImport.tasks"
      :updates="pendingImport.updates"
      :reports="pendingImport.reports"
      :existing-tasks="store.tasks"
      :saving="store.saving"
      @confirm="confirmImport"
    />

    <ExternalStatusDialog
      v-model="isStatusDialogOpen"
      :status="editingStatus"
      @submit="submitStatus"
    />

    <ReportTemplateDialog
      v-model="isTemplateDialogOpen"
      :template="editingTemplate"
      @submit="submitTemplate"
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
import { setWorkDay, useBusinessDays } from '../composables/useBusinessDays.js'
import { useTasksStore } from '../stores/tasks.js'
import { useUpdatesStore } from '../stores/updates.js'
import { useReportsStore } from '../stores/reports.js'
import { backupFileName, parseBackup, serializeBackup } from '../helpers/backup.js'
import TaskImportDialog from '../components/TaskImportDialog.vue'
import ExternalStatusDialog from '../components/ExternalStatusDialog.vue'
import ReportTemplateDialog from '../components/ReportTemplateDialog.vue'
import {
  defaultReportTemplate,
  removeReportTemplate,
  saveReportTemplate,
  useReportTemplates
} from '../composables/useReportTemplates.js'
import {
  removeExternalStatus,
  saveExternalStatus,
  useExternalStatuses
} from '../composables/useExternalStatuses.js'

const t = (...args) => i18n.global.t(...args)
const { confirm } = useDialogs()
const { useSystem, locale, setUseSystem, setLocale } = useAppLocale()
const { preference, setPreference } = useAppTheme()
const { singular, plural } = useEntityLabels()
const { days, isWorkDay, isLastWorkDay } = useBusinessDays()
const store = useTasksStore()
const updatesStore = useUpdatesStore()
const reportsStore = useReportsStore()

const fileInput = ref(null)
const feedback = ref(null)
const isImportOpen = ref(false)
const pendingImport = ref({ tasks: [], updates: [], reports: [] })
const isStatusDialogOpen = ref(false)
const editingStatus = ref(null)
const { statuses, labelFor } = useExternalStatuses()

const isTemplateDialogOpen = ref(false)
const editingTemplate = ref(null)
const { templates } = useReportTemplates()
const defaultTemplate = computed(() => defaultReportTemplate())
const userTemplates = computed(() =>
  templates.value.filter((template) => !template.isDefault)
)

const languageOptions = computed(() => [
  { value: 'en', label: t('settings.english') },
  { value: 'es', label: t('settings.spanish') }
])

const WEEKDAY_KEYS = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  0: 'sunday'
}

function weekdayLabel(day) {
  return t(`settings.weekdays.${WEEKDAY_KEYS[day]}`)
}

function toggleWorkDay(day, enabled) {
  setWorkDay(day, Boolean(enabled))
}

const themeOptions = computed(() => [
  { value: 'system', label: t('settings.themeSystem') },
  { value: 'light', label: t('settings.themeLight') },
  { value: 'dark', label: t('settings.themeDark') }
])

onMounted(() => {
  store.load()
  updatesStore.load()
  reportsStore.load()
})

async function exportData() {
  try {
    // The backup carries the whole Dexie content, so make sure every store is loaded.
    await Promise.all([store.load(), updatesStore.load(), reportsStore.load()])
    const blob = new Blob(
      [
        serializeBackup({
          tasks: store.tasks,
          updates: updatesStore.updates,
          reports: reportsStore.reports
        })
      ],
      { type: 'application/json' }
    )
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

  const empty =
    imported.tasks.length === 0 && imported.updates.length === 0 && imported.reports.length === 0
  if (empty) {
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
  const result = await store.importBackup(pendingImport.value)
  isImportOpen.value = false

  if (!result) {
    feedback.value = { type: 'error', message: t('settings.importError') }
    return
  }

  // The repository wrote updates and reports directly; refresh their stores.
  await Promise.all([
    updatesStore.load({ force: true }),
    reportsStore.load({ force: true })
  ])

  feedback.value = {
    type: 'success',
    message: t('settings.importDone', {
      added: result.added,
      updated: result.updated,
      updates: result.updatesAdded,
      reports: result.reportsAdded
    })
  }
}

function addStatus() {
  editingStatus.value = null
  isStatusDialogOpen.value = true
}

function editStatus(status) {
  editingStatus.value = status
  isStatusDialogOpen.value = true
}

function submitStatus(status) {
  const saved = saveExternalStatus(status, { originalValue: editingStatus.value?.value ?? null })
  if (saved) isStatusDialogOpen.value = false
}

async function deleteStatus(status) {
  const accepted = await confirm(
    t('settings.externalStatusDeleteMessage', { label: labelFor(status.value) }),
    {
      title: t('settings.externalStatusDeleteTitle'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel')
    }
  )
  if (!accepted) return
  removeExternalStatus(status.value)
}

function addTemplate() {
  editingTemplate.value = null
  isTemplateDialogOpen.value = true
}

function editTemplate(template) {
  editingTemplate.value = template
  isTemplateDialogOpen.value = true
}

function submitTemplate(template) {
  const saved = saveReportTemplate(template, {
    originalId: editingTemplate.value?.id ?? null
  })
  if (saved) isTemplateDialogOpen.value = false
}

async function deleteTemplate(template) {
  const accepted = await confirm(
    t('settings.templatesDeleteMessage', { name: template.name }),
    {
      title: t('settings.templatesDeleteTitle'),
      confirmText: t('common.delete'),
      cancelText: t('common.cancel')
    }
  )
  if (!accepted) return
  removeReportTemplate(template.id)
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
  // El repositorio vació tareas, actualizaciones y reportes en una transacción.
  if (cleared) {
    updatesStore.forgetAll()
    reportsStore.forgetAll()
  }
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

.work-days {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.work-days__item {
  display: flex;
  align-items: center;
  min-width: 0;
}

.status-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.status-list__item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 12px;
  background: var(--md-surface-container);
}

.status-list__label {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.status-list__actions {
  flex: 0 0 auto;
  width: auto;
}

.template-badge {
  flex: 0 0 auto;
  padding: 2px 10px;
  border-radius: 10px;
  background: var(--md-secondary-container, var(--md-surface-variant));
  color: var(--md-on-secondary-container, var(--md-on-surface-variant));
  font-size: 0.75rem;
  font-weight: 500;
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
