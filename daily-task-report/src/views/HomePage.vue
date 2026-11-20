<template>
  <ZnScreen :title="t('home.title')" :subtitle="selectedDateLabel">
    <div class="home-page">
      <section class="home-calendar">
        <div class="home-calendar__toolbar">
          <p class="home-calendar__hint">{{ t('home.calendarHint') }}</p>
          <ZnButtonGroup v-model="view" mandatory variant="outlined" density="small">
            <ZnButton value="week">{{ t('home.weekView') }}</ZnButton>
            <ZnButton value="month">{{ t('home.monthView') }}</ZnButton>
          </ZnButtonGroup>
        </div>

        <ZnCalendar
          v-model="selectedDate"
          :type-view="view"
          selection-mode="single"
          :locale="locale"
          :labels="calendarLabels"
          :show-events="false"
        />
      </section>

      <p v-if="tasksStore.error" class="home-alert" role="alert">
        {{ t(`tasks.${tasksStore.error}`) }}
      </p>
      <p v-else-if="updatesStore.error" class="home-alert" role="alert">
        {{ t(`updates.${updatesStore.error}`) }}
      </p>

      <p v-if="loading" class="home-state">{{ t('home.loading') }}</p>

      <template v-else>
        <DailyTaskList
          :title="t('home.currentTitle')"
          :entries="currentEntries"
          :empty-text="t('home.emptyCurrent')"
          collapsible
          expanded
          @create-update="openCreateUpdate"
          @edit-update="openEditUpdate"
        />
        <DailyTaskList
          :title="t('home.previousTitle')"
          :entries="previousEntries"
          :empty-text="t('home.emptyPrevious')"
          collapsible
          expanded
          @create-update="openCreateUpdate"
          @edit-update="openEditUpdate"
        />
        <DailyTaskList
          :title="t('home.pendingTitle')"
          :entries="pendingEntries"
          :empty-text="t('home.emptyPending', { entityPlural: plural })"
          collapsible
          @create-update="openCreateUpdate"
          @edit-update="openEditUpdate"
        />
      </template>
    </div>

    <UpdateDialog
      v-model="isUpdateDialogOpen"
      :update="editingUpdate"
      :task-id="updateTaskId"
      :previous-update="previousUpdate"
      :tasks="tasksStore.tasks"
      :saving="updatesStore.saving"
      @submit="submitUpdate"
    />
  </ZnScreen>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { ZnButton, ZnButtonGroup, ZnScreen } from '@zn-apps/ui-core'
import { ZnCalendar } from '@zn-apps/ui-calendar'
import { i18n } from '../i18n.js'
import { useEntityLabels } from '../composables/useEntityLabels.js'
import { useTasksStore } from '../stores/tasks.js'
import { useUpdatesStore } from '../stores/updates.js'
import { buildDailyReport } from '../helpers/daily-report.js'
import { sortTasks } from '../helpers/tasks.js'
import { formatTaskDate, toDateInputValue } from '../helpers/dates.js'
import DailyTaskList from '../components/DailyTaskList.vue'
import UpdateDialog from '../components/UpdateDialog.vue'

const t = (...args) => i18n.global.t(...args)
const { plural } = useEntityLabels()
const tasksStore = useTasksStore()
const updatesStore = useUpdatesStore()

/** Single selection: `YYYY-MM-DD`; the day starts on today. */
const selectedDate = ref(toDateInputValue())
/** Calendar view: `week` (default) or `month`. */
const view = ref('week')

const locale = computed(() => i18n.global.locale.value)
const loading = computed(() => tasksStore.loading || updatesStore.loading)

const isUpdateDialogOpen = ref(false)
const editingUpdate = ref(null)
const updateTaskId = ref(null)

/** Newest update of the card being extended, shown as read-only reference. */
const previousUpdate = computed(() => {
  if (editingUpdate.value || !updateTaskId.value) return null
  return updatesStore.forTask(updateTaskId.value)[0] ?? null
})
const selectedDateLabel = computed(() => formatTaskDate(selectedDate.value, locale.value))

const calendarLabels = computed(() => ({
  today: t('home.today'),
  previous: t('home.previous'),
  next: t('home.next'),
  month: t('home.month'),
  year: t('home.year'),
  date: t('home.date')
}))

const report = computed(() =>
  buildDailyReport({
    tasks: tasksStore.tasks,
    updates: updatesStore.updates,
    date: selectedDate.value
  })
)

/** Keeps the lists in a stable name order, like the tasks page. */
function byName(entries) {
  const order = sortTasks(
    entries.map((entry) => entry.task),
    { sortBy: 'name', direction: 'asc' },
    locale.value
  )
  const byId = new Map(entries.map((entry) => [entry.task.id, entry]))
  return order.map((task) => byId.get(task.id))
}

const currentEntries = computed(() => byName(report.value.current))
const previousEntries = computed(() => byName(report.value.previous))
const pendingEntries = computed(() =>
  byName(report.value.pending.map((task) => ({ task, updates: [] })))
)

onMounted(() => {
  tasksStore.load()
  updatesStore.load()
})

function openCreateUpdate(task) {
  editingUpdate.value = null
  updateTaskId.value = task.id
  isUpdateDialogOpen.value = true
}

function openEditUpdate(update) {
  editingUpdate.value = update
  updateTaskId.value = update.taskId ?? null
  isUpdateDialogOpen.value = true
}

/** Both stores are shared, so the three lists re-derive after a save. */
async function submitUpdate(payload) {
  const saved = editingUpdate.value
    ? await updatesStore.updateUpdate(editingUpdate.value.id, payload)
    : await updatesStore.createUpdate(payload)

  if (saved) isUpdateDialogOpen.value = false
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.home-calendar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-calendar__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.home-calendar__hint {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}

.home-alert {
  margin: 0;
  padding: 12px 16px;
  border-radius: 12px;
  background: var(--md-error-container, var(--md-surface-variant));
  color: var(--md-on-error-container, var(--md-error));
  font-size: 0.875rem;
}

.home-state {
  margin: 0;
  padding: 24px 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  text-align: center;
}

@media (max-width: 720px) {
  .home-calendar__toolbar {
    justify-content: flex-start;
  }
}
</style>
