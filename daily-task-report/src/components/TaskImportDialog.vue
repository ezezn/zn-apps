<template>
  <ZnDialog
    :model-value="modelValue"
    :title="t('settings.importTitle')"
    max-width="720px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="import-dialog">
      <p class="import-dialog__hint">{{ t('settings.importHint') }}</p>

      <p v-if="plan.total > 0" class="import-dialog__summary">
        {{ t('settings.importSummary', { added: plan.added, updated: plan.updated, unchanged: plan.unchanged }) }}
      </p>

      <p v-if="extrasCount > 0" class="import-dialog__summary">
        {{ t('settings.importExtras', { updates: updates.length, reports: reports.length }) }}
      </p>

      <h3 v-if="plan.total > 0" class="import-dialog__title">{{ t('settings.importPreview') }}</h3>

      <ul v-if="plan.total > 0" class="import-list">
        <li
          v-for="(entry, index) in plan.entries"
          :key="`${entry.task.externalId}-${index}`"
          class="import-list__item"
        >
          <div class="import-list__main">
            <span class="import-list__name">{{ entry.task.name || '—' }}</span>
            <span class="import-list__id">{{ entry.task.externalId || '—' }}</span>
          </div>
          <div class="import-list__meta">
            <span class="import-list__status">{{ statusLabel(t, entry.task.status) }}</span>
            <span :class="['import-state', `import-state--${entry.status}`]">
              {{ stateLabel(entry.status) }}
            </span>
          </div>
        </li>
      </ul>

      <p v-else-if="extrasCount === 0" class="import-dialog__empty">
        {{ t('settings.importEmpty', { entityPlural: plural }) }}
      </p>

      <p
        v-if="plan.total > 0 && plan.added + plan.updated === 0 && extrasCount === 0"
        class="import-dialog__note"
      >
        {{ t('settings.importUpToDate') }}
      </p>
    </div>

    <template #actions>
      <ZnButton variant="text" :disabled="saving" @click="close">{{ t('common.cancel') }}</ZnButton>
      <ZnButton variant="filled" :disabled="!canImport || saving" @click="$emit('confirm')">
        {{ t('settings.importAction') }}
      </ZnButton>
    </template>
  </ZnDialog>
</template>

<script setup>
import { computed } from 'vue'
import { ZnButton, ZnDialog } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import { useEntityLabels } from '../composables/useEntityLabels.js'
import { planMerge } from '../helpers/merge.js'
import { statusLabel } from '../data/task-schema.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** Tasks parsed from the selected backup file. */
  tasks: { type: Array, default: () => [] },
  /** Updates parsed from the file (already linked by task ref). */
  updates: { type: Array, default: () => [] },
  /** Reports parsed from the file. */
  reports: { type: Array, default: () => [] },
  /** Current local tasks, used to compute the merge preview. */
  existingTasks: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const t = (...args) => i18n.global.t(...args)
const { plural } = useEntityLabels()

const plan = computed(() => planMerge(props.existingTasks, props.tasks))
const extrasCount = computed(() => props.updates.length + props.reports.length)
const canImport = computed(
  () => plan.value.added + plan.value.updated > 0 || extrasCount.value > 0
)

function stateLabel(status) {
  if (status === 'update') return t('settings.importStatusUpdate')
  if (status === 'unchanged') return t('settings.importStatusUnchanged')
  return t('settings.importStatusNew')
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.import-dialog {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.import-dialog__hint,
.import-dialog__summary,
.import-dialog__empty,
.import-dialog__note {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--md-on-surface-variant);
}

.import-dialog__summary {
  color: var(--md-primary);
  font-weight: 500;
}

.import-dialog__note {
  color: var(--md-outline);
}

.import-dialog__title {
  margin: 8px 0 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--md-on-surface-variant);
}

.import-list {
  overflow-y: auto;
  max-height: 320px;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid var(--md-surface-variant);
  border-radius: 12px;
}

.import-list__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
}

.import-list__item + .import-list__item {
  border-top: 1px solid var(--md-surface-variant);
}

.import-list__main {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.import-list__name {
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  overflow-wrap: anywhere;
}

.import-list__id {
  color: var(--md-on-surface-variant);
  font-family: monospace;
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}

.import-list__meta {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: var(--md-on-surface-variant);
}

.import-state {
  padding: 2px 8px;
  border-radius: 999px;
  font-weight: 500;
  white-space: nowrap;
}

.import-state--new {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

.import-state--update {
  background: var(--md-secondary-container, var(--md-surface-variant));
  color: var(--md-on-secondary-container, var(--md-on-surface-variant));
}

.import-state--unchanged {
  background: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
}
</style>
