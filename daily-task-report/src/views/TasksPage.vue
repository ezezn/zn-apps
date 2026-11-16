<template>
  <ZnScreen :title="plural" :subtitle="summary">
    <template #actions>
      <ZnButton variant="filled" @click="openCreate">
        <template #icon>
          <ZnIcon name="add" :size="20" />
        </template>
        <span class="new-task-label">{{ t('tasks.new', { entity: singular }) }}</span>
      </ZnButton>
    </template>

    <div class="tasks-page">
      <div class="task-filters">
        <ZnSingleLineText
          v-model="store.filters.search"
          class="task-filters__search"
          :label="t('tasks.search')"
          variant="filled"
        >
          <template #leading>
            <ZnIcon name="search" :size="20" />
          </template>
        </ZnSingleLineText>

        <ZnSelect
          v-model="store.filters.status"
          :label="t('tasks.statusFilter')"
          :options="statusFilterOptions"
          variant="filled"
        />

        <ZnSelect
          v-model="store.filters.sortBy"
          :label="t('tasks.sortBy')"
          :options="sortOptions"
          variant="filled"
        />

        <ZnButton
          variant="outlined"
          icon-only
          class="task-filters__direction"
          :aria-label="directionLabel"
          :title="directionLabel"
          @click="store.toggleDirection()"
        >
          <ZnIcon :name="store.filters.direction === 'asc' ? 'arrow_upward' : 'arrow_downward'" :size="20" />
        </ZnButton>
      </div>

      <p v-if="store.error" class="task-alert" role="alert">{{ t(`tasks.${store.error}`) }}</p>

      <p v-if="store.loading" class="task-state">{{ t('tasks.loading') }}</p>

      <ZnBox v-else-if="store.isEmpty" variant="outlined" class="task-state task-state--empty">
        <ZnIcon name="task_alt" :size="40" />
        <p class="task-state__title">{{ t('tasks.emptyTitle', { entityPlural: plural }) }}</p>
        <p class="task-state__text">{{ t('tasks.emptyMessage') }}</p>
        <ZnButton variant="filled" @click="openCreate">
          <template #icon>
            <ZnIcon name="add" :size="20" />
          </template>
          {{ t('tasks.new', { entity: singular }) }}
        </ZnButton>
      </ZnBox>

      <p v-else-if="store.shown === 0" class="task-state">
        {{ t('tasks.noResults', { entityPlural: plural }) }}
      </p>

      <div v-else class="task-list">
        <TaskCard
          v-for="task in store.visibleTasks"
          :key="task.id"
          :task="task"
          @edit="openEdit"
          @delete="removeTask"
        />
      </div>
    </div>

    <TaskDialog
      v-model="isDialogOpen"
      :task="editingTask"
      :saving="store.saving"
      @submit="submitTask"
    />
  </ZnScreen>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ZnBox, ZnButton, ZnIcon, ZnScreen, ZnSelect, ZnSingleLineText, useDialogs } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import { useEntityLabels } from '../composables/useEntityLabels.js'
import { useTasksStore } from '../stores/tasks.js'
import { ALL_STATUSES, TASK_STATUSES } from '../helpers/tasks.js'
import { statusOptions } from '../data/task-schema.js'
import TaskCard from '../components/TaskCard.vue'
import TaskDialog from '../components/TaskDialog.vue'

const t = (...args) => i18n.global.t(...args)
const { confirm } = useDialogs()
const { singular, plural } = useEntityLabels()
const store = useTasksStore()

const isDialogOpen = ref(false)
const editingTask = ref(null)

const summary = computed(() => t('tasks.summary', { shown: store.shown, total: store.total }))

const statusFilterOptions = computed(() => [
  { value: ALL_STATUSES, label: t('tasks.allStatuses') },
  ...statusOptions(t).filter((option) => TASK_STATUSES.includes(option.value))
])

const sortOptions = computed(() => [
  { value: 'name', label: t('tasks.sortName') },
  { value: 'taskDate', label: t('tasks.sortTaskDate') },
  { value: 'addedAt', label: t('tasks.sortAddedAt') }
])

const directionLabel = computed(() =>
  store.filters.direction === 'asc' ? t('tasks.sortAsc') : t('tasks.sortDesc')
)

onMounted(() => store.load())

function openCreate() {
  editingTask.value = null
  isDialogOpen.value = true
}

function openEdit(task) {
  editingTask.value = task
  isDialogOpen.value = true
}

async function submitTask(payload) {
  const saved = editingTask.value
    ? await store.updateTask(editingTask.value.id, payload)
    : await store.createTask(payload)

  if (saved) isDialogOpen.value = false
}

async function removeTask(task) {
  const accepted = await confirm(t('tasks.deleteMessage', { name: task.name }), {
    title: t('tasks.deleteTitle', { entity: singular.value }),
    confirmText: t('common.delete'),
    cancelText: t('common.cancel')
  })
  if (!accepted) return
  await store.deleteTask(task.id)
}
</script>

<style scoped>
.tasks-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: min(100%, 960px);
  margin: 0 auto;
}

.task-filters {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 32px 16px;
  color: var(--md-on-surface-variant);
  text-align: center;
}

.task-state--empty {
  background: var(--md-surface-container-low);
}

.task-state__title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1rem;
  font-weight: 500;
}

.task-state__text {
  margin: 0 0 8px;
  font-size: 0.875rem;
}

.task-alert {
  margin: 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--md-error-container, var(--md-surface-variant));
  color: var(--md-on-error-container, var(--md-error));
  font-size: 0.875rem;
}

@media (max-width: 720px) {
  .task-filters {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .task-filters__search {
    grid-column: 1 / -1;
  }

  .new-task-label {
    display: none;
  }
}
</style>
