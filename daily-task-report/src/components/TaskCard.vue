<template>
  <ZnCard variant="filled" class="task-card">
    <div class="task-card__header">
      <div class="task-card__heading">
        <h2 class="task-card__name">
          <a
            v-if="link"
            class="task-card__name-link"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
          >{{ task.name }}</a>
          <template v-else>{{ task.name }}</template>
        </h2>
        <span class="task-card__external-id">{{ task.externalId }}</span>
      </div>

      <ZnRow padding="0" gap="4px" class="task-card__actions">
        <ZnButton
          variant="text"
          icon-only
          :aria-label="t('common.edit')"
          :title="t('common.edit')"
          @click="$emit('edit', task)"
        >
          <ZnIcon name="edit" :size="20" :label="t('common.edit')" />
        </ZnButton>
        <ZnButton
          variant="text"
          icon-only
          :aria-label="t('common.delete')"
          :title="t('common.delete')"
          @click="$emit('delete', task)"
        >
          <ZnIcon name="delete" :size="20" :label="t('common.delete')" />
        </ZnButton>
      </ZnRow>
    </div>

    <ZnRow class="task-card__meta" padding="0" gap="8px" wrap align="center">
      <ZnChip
        variant="assist"
        size="small"
        :class="['task-status', `task-status--${task.status}`]"
      >
        <template #icon>
          <span class="task-status__dot" aria-hidden="true" />
        </template>
        {{ statusLabel(t, task.status) }}
      </ZnChip>

      <ZnChip v-if="task.externalStatus" variant="suggestion" size="small">
        <template #icon>
          <ZnIcon name="cloud" :size="16" />
        </template>
        {{ externalStatusLabel(task.externalStatus) }}
      </ZnChip>

      <!-- Comparte la última fila visible, alineado al borde derecho. -->
      <ZnButton
        variant="text"
        class="task-card__toggle"
        :aria-expanded="expanded ? 'true' : 'false'"
        @click="expanded = !expanded"
      >
        <template #icon>
          <ZnIcon :name="expanded ? 'expand_less' : 'expand_more'" :size="20" />
        </template>
        {{ expanded ? t('tasks.hideDetails') : t('tasks.showDetails') }}
      </ZnButton>
    </ZnRow>

    <div v-if="expanded" class="task-card__details">
      <ZnDataView :model-value="viewValue" :schema="viewSchema" />

      <section class="task-card__updates">
        <h3 class="task-card__updates-title">{{ t('updates.sectionTitle') }}</h3>

        <p v-if="taskUpdates.length === 0" class="task-card__updates-empty">
          {{ t('updates.emptyForTask') }}
        </p>

        <ul v-else class="task-card__updates-list">
          <li v-for="update in taskUpdates" :key="update.id" class="task-card__update">
            <div class="task-card__update-header">
              <time class="task-card__update-date" :datetime="update.createdAt">
                {{ formatDate(update.createdAt) }}
              </time>
              <ZnButton
                variant="text"
                icon-only
                class="task-card__update-edit"
                :aria-label="t('common.edit')"
                :title="t('common.edit')"
                @click="$emit('edit-update', update)"
              >
                <ZnIcon name="edit" :size="18" />
              </ZnButton>
            </div>
            <p class="task-card__update-description">{{ update.description }}</p>
          </li>
        </ul>
      </section>

      <ZnButton
        v-if="link"
        tag="a"
        variant="outlined"
        :href="link"
        target="_blank"
        rel="noopener noreferrer"
        class="task-card__link"
      >
        <template #icon>
          <ZnIcon name="open_in_new" :size="18" />
        </template>
        {{ t('tasks.openLink') }}
      </ZnButton>
    </div>
  </ZnCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnButton, ZnCard, ZnChip, ZnIcon, ZnRow } from '@zn-apps/ui-core'
import { ZnDataView } from '@zn-apps/ui-data-view'
import { i18n } from '../i18n.js'
import { statusLabel, taskViewSchema } from '../data/task-schema.js'
import { useExternalStatuses } from '../composables/useExternalStatuses.js'
import { absoluteUrl } from '../helpers/tasks.js'
import { sortUpdatesDesc } from '../helpers/updates.js'
import { formatTaskDate, formatTaskDateTime } from '../helpers/dates.js'

const props = defineProps({
  task: {
    type: Object,
    required: true
  },
  /** Change log entries of this task (any order; the card sorts them). */
  updates: { type: Array, default: () => [] }
})

defineEmits(['edit', 'delete', 'edit-update'])

const t = (...args) => i18n.global.t(...args)
const expanded = ref(false)

const link = computed(() => absoluteUrl(props.task.externalUrl))
const { labelFor: externalStatusLabel, optionsWithCurrent } = useExternalStatuses()
const taskUpdates = computed(() => sortUpdatesDesc(props.updates))

function formatDate(value) {
  return formatTaskDateTime(value, i18n.global.locale.value)
}

const viewSchema = computed(() =>
  taskViewSchema({
    t,
    externalStatusOptions: optionsWithCurrent(props.task.externalStatus)
  })
)

const viewValue = computed(() => ({
  ...props.task,
  taskDate: formatTaskDate(props.task.taskDate, i18n.global.locale.value),
  addedAt: formatTaskDateTime(props.task.addedAt, i18n.global.locale.value)
}))
</script>

<style scoped>
.task-card {
  width: 100%;
}

.task-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

/* Las acciones siempre se pegan al borde derecho, aunque el nombre sea corto.
   `ZnRow` trae width:100%, que dentro del header acaparaba la línea y dejaba el
   título en una columna mínima: aquí se ajusta al ancho de los botones. */
.task-card__actions {
  width: auto;
  flex: 0 0 auto;
  margin-left: auto;
}

.task-card__heading {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.task-card__name {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1.0625rem;
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

/* El título abre el enlace externo sin gritar: hereda tipografía y color. */
.task-card__name-link {
  color: inherit;
  text-decoration: none;
  border-radius: 4px;
}

.task-card__name-link:hover {
  text-decoration: underline;
}

.task-card__name-link:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.task-card__external-id {
  color: var(--md-on-surface-variant);
  font-family: monospace;
  font-size: 0.8125rem;
  overflow-wrap: anywhere;
}

.task-card__meta {
  margin-top: 12px;
}

.task-status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--md-on-surface-variant);
}

.task-status--active .task-status__dot {
  background: #386A20;
}

.task-status--inactive .task-status__dot {
  background: var(--md-outline);
}

.task-card__toggle {
  margin-left: auto;
  padding-left: 12px;
}

.task-card__details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
  padding-top: 16px;
  /* La card es filled: el separador necesita contraste sobre surface-variant. */
  border-top: 1px solid color-mix(in srgb, var(--md-on-surface) 12%, transparent);
}

.task-card__link {
  align-self: flex-end;
}

.task-card__updates {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card__updates-title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  font-weight: 500;
}

.task-card__updates-empty {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}

.task-card__updates-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.task-card__update {
  padding: 8px 12px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--md-surface) 55%, transparent);
}

.task-card__update-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-card__update-date {
  flex: 1 1 auto;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
}

.task-card__update-edit {
  flex: 0 0 auto;
}

.task-card__update-description {
  margin: 2px 0 0;
  color: var(--md-on-surface);
  font-size: 0.875rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
  white-space: pre-line;
}
</style>
