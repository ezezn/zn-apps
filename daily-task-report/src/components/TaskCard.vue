<template>
  <ZnCard variant="outlined" class="task-card">
    <div class="task-card__header">
      <div class="task-card__heading">
        <h2 class="task-card__name">{{ task.name }}</h2>
        <span class="task-card__external-id">{{ task.externalId }}</span>
      </div>

      <ZnRow padding="0" gap="4px">
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
        {{ task.externalStatus }}
      </ZnChip>
    </ZnRow>

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

    <div v-if="expanded" class="task-card__details">
      <ZnDataView :model-value="viewValue" :schema="viewSchema" />

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
import { absoluteUrl } from '../helpers/tasks.js'
import { formatTaskDate, formatTaskDateTime } from '../helpers/dates.js'

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

const t = (...args) => i18n.global.t(...args)
const expanded = ref(false)

const link = computed(() => absoluteUrl(props.task.externalUrl))

const viewSchema = computed(() => taskViewSchema({ t }))

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

.task-card__heading {
  display: flex;
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
  margin-top: 8px;
  padding-left: 12px;
}

.task-card__details {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--md-surface-variant);
}

.task-card__link {
  align-self: flex-start;
}
</style>
