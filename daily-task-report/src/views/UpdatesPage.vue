<template>
  <ZnScreen :title="t('updates.title')" :subtitle="summary">
    <template #actions>
      <ZnButton variant="filled" @click="openCreate">
        <template #icon>
          <ZnIcon name="add" :size="20" />
        </template>
        <span class="new-update-label">{{ t('updates.new') }}</span>
      </ZnButton>
    </template>

    <div class="updates-page">
      <p v-if="store.error" class="updates-alert" role="alert">{{ t(`updates.${store.error}`) }}</p>

      <p v-if="store.loading" class="updates-state">{{ t('updates.loading') }}</p>

      <ZnBox v-else-if="store.isEmpty" variant="outlined" class="updates-state updates-state--empty">
        <ZnIcon name="system_update" :size="40" />
        <p class="updates-state__title">{{ t('updates.emptyTitle') }}</p>
        <p class="updates-state__text">{{ t('updates.emptyMessage') }}</p>
        <ZnButton variant="filled" @click="openCreate">
          <template #icon>
            <ZnIcon name="add" :size="20" />
          </template>
          {{ t('updates.new') }}
        </ZnButton>
      </ZnBox>

      <ul v-else class="updates-list">
        <li v-for="update in store.sortedUpdates" :key="update.id" class="updates-item">
          <div class="updates-item__header">
            <div class="updates-item__heading">
              <span class="updates-item__task">{{ taskName(update.taskId) }}</span>
              <time class="updates-item__date" :datetime="update.createdAt">
                {{ formatDate(update.createdAt) }}
              </time>
            </div>

            <ZnRow padding="0" gap="4px" class="updates-item__actions">
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('common.edit')"
                :title="t('common.edit')"
                @click="openEdit(update)"
              >
                <ZnIcon name="edit" :size="20" :label="t('common.edit')" />
              </ZnButton>
              <ZnButton
                variant="text"
                icon-only
                :aria-label="t('common.delete')"
                :title="t('common.delete')"
                @click="removeUpdate(update)"
              >
                <ZnIcon name="delete" :size="20" :label="t('common.delete')" />
              </ZnButton>
            </ZnRow>
          </div>

          <p class="updates-item__description">{{ update.description }}</p>
        </li>
      </ul>
    </div>

    <UpdateDialog
      v-model="isDialogOpen"
      :update="editingUpdate"
      :tasks="tasksStore.tasks"
      :saving="store.saving"
      @submit="submitUpdate"
    />
  </ZnScreen>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ZnBox, ZnButton, ZnIcon, ZnRow, ZnScreen, useDialogs } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import { useTasksStore } from '../stores/tasks.js'
import { useUpdatesStore } from '../stores/updates.js'
import { formatTaskDateTime } from '../helpers/dates.js'
import UpdateDialog from '../components/UpdateDialog.vue'

const t = (...args) => i18n.global.t(...args)
const { confirm } = useDialogs()
const store = useUpdatesStore()
const tasksStore = useTasksStore()

const isDialogOpen = ref(false)
const editingUpdate = ref(null)

const summary = computed(() => t('updates.summary', { count: store.total }))

function formatDate(value) {
  return formatTaskDateTime(value, i18n.global.locale.value)
}

function taskName(taskId) {
  return tasksStore.findById(taskId)?.name ?? t('updates.unknownTask')
}

onMounted(async () => {
  // Las tareas se necesitan para nombrar y reasignar actualizaciones.
  await tasksStore.load()
  await store.load({ force: true })
})

function openCreate() {
  editingUpdate.value = null
  isDialogOpen.value = true
}

function openEdit(update) {
  editingUpdate.value = update
  isDialogOpen.value = true
}

async function submitUpdate(payload) {
  const saved = editingUpdate.value
    ? await store.updateUpdate(editingUpdate.value.id, payload)
    : await store.createUpdate(payload)

  if (saved) isDialogOpen.value = false
}

async function removeUpdate(update) {
  const accepted = await confirm(t('updates.deleteMessage'), {
    title: t('updates.deleteTitle'),
    confirmText: t('common.delete'),
    cancelText: t('common.cancel')
  })
  if (!accepted) return
  await store.deleteUpdate(update.id)
}
</script>

<style scoped>
.updates-page {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.updates-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.updates-item {
  padding: 16px;
  border-radius: 16px;
  background: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
}

.updates-item__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.updates-item__heading {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.updates-item__task {
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.updates-item__date {
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
}

.updates-item__description {
  margin: 8px 0 0;
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  white-space: pre-line;
}

/* `ZnRow` mide 100 %: aquí debe ajustarse al ancho de los dos botones. */
.updates-item__actions {
  width: auto;
  flex: 0 0 auto;
  margin-left: auto;
}

.updates-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 32px 16px;
  color: var(--md-on-surface-variant);
  text-align: center;
}

.updates-state--empty {
  background: var(--md-surface-container-low);
}

.updates-state__title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1rem;
  font-weight: 500;
}

.updates-state__text {
  margin: 0 0 8px;
  font-size: 0.875rem;
}

.updates-alert {
  margin: 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--md-error-container, var(--md-surface-variant));
  color: var(--md-on-error-container, var(--md-error));
  font-size: 0.875rem;
}

@media (max-width: 720px) {
  .new-update-label {
    display: none;
  }
}
</style>
