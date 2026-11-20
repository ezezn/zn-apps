<template>
  <ZnDialog
    :model-value="modelValue"
    :title="t('reports.createTitle')"
    max-width="760px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="report-dialog__hint">
      {{ t('reports.createHint', { date: formattedToday }) }}
    </p>

    <div class="report-dialog__sections">
      <section
        v-for="section in REPORT_SECTION_KEYS"
        :key="section"
        class="report-dialog__section"
      >
        <header class="report-dialog__section-header">
          <h3 class="report-dialog__section-title">
            {{ t(`reports.sections.${section}`) }}
          </h3>
          <span class="report-dialog__count">{{ draft.sections[section].length }}</span>
        </header>

        <p v-if="draft.sections[section].length === 0" class="report-dialog__empty">
          {{ t('reports.emptySection') }}
        </p>

        <ul v-else class="report-dialog__items">
          <li
            v-for="(item, index) in draft.sections[section]"
            :key="`${section}-${index}`"
            class="report-dialog__item"
          >
            <div class="report-dialog__item-header">
              <span v-if="item.kind === 'update'" class="report-dialog__task">
                {{ item.taskName || t('reports.unknownTask') }}
              </span>
              <span v-else class="report-dialog__note-label">{{ t('reports.note') }}</span>

              <ZnButton
                variant="text"
                icon-only
                class="report-dialog__remove"
                :aria-label="t('reports.removeItem')"
                :title="t('reports.removeItem')"
                @click="removeItem(section, index)"
              >
                <ZnIcon name="delete" :size="18" />
              </ZnButton>
            </div>

            <textarea
              v-model="item.description"
              class="report-dialog__textarea"
              rows="2"
              :aria-label="t(`reports.sections.${section}`)"
              :placeholder="item.kind === 'update' ? t('reports.updatePlaceholder') : t('reports.notePlaceholder')"
            ></textarea>
          </li>
        </ul>

        <div v-if="section === 'finish'" class="report-dialog__task-add">
          <select
            v-model="selectedTaskId"
            class="report-dialog__select"
            :aria-label="t('reports.taskReference')"
            :disabled="tasks.length === 0"
          >
            <option value="">{{ t('reports.selectTask') }}</option>
            <option v-for="task in tasks" :key="task.id" :value="task.id">
              {{ task.name }}
            </option>
          </select>
          <ZnButton
            variant="outlined"
            :disabled="!selectedTaskId"
            @click="addTaskItem"
          >
            <template #icon>
              <ZnIcon name="add" :size="18" />
            </template>
            {{ t('reports.addTaskItem') }}
          </ZnButton>
        </div>

        <ZnButton variant="text" class="report-dialog__add" @click="addNote(section)">
          <template #icon>
            <ZnIcon name="add" :size="18" />
          </template>
          {{ t('reports.addNote') }}
        </ZnButton>
      </section>
    </div>

    <p v-if="error" class="report-dialog__error" role="alert">{{ error }}</p>

    <template #actions>
      <ZnButton variant="text" :disabled="saving" @click="close">{{ t('common.cancel') }}</ZnButton>
      <ZnButton variant="filled" :disabled="saving" @click="save">
        {{ t('reports.createAction') }}
      </ZnButton>
    </template>
  </ZnDialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ZnButton, ZnDialog, ZnIcon } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import {
  REPORT_SECTION_KEYS,
  createReportDraft,
  createReportTaskItem,
  createTextReportItem,
  pruneEmptyReportItems,
  reportItemCount
} from '../helpers/reports.js'
import { formatTaskDate, toDateTimeInputValue } from '../helpers/dates.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** Selected Home day (`YYYY-MM-DD`). */
  today: { type: String, default: '' },
  /** Previous business day used by the Home report. */
  previousDate: { type: String, default: '' },
  tasks: { type: Array, default: () => [] },
  updates: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const t = (...args) => i18n.global.t(...args)
const error = ref('')
const draft = ref(createReportDraft())
const selectedTaskId = ref('')

const formattedToday = computed(() =>
  formatTaskDate(props.today, i18n.global.locale.value)
)

watch(
  () => [props.modelValue, props.today, props.previousDate],
  ([open]) => {
    if (!open) return
    draft.value = createReportDraft({
      tasks: props.tasks,
      updates: props.updates,
      today: props.today,
      previousDate: props.previousDate
    })
    selectedTaskId.value = ''
    error.value = ''
  },
  { immediate: true }
)

function addTaskItem() {
  const task = props.tasks.find((item) => item.id === Number(selectedTaskId.value))
  if (!task) return
  draft.value.sections.finish.push(createReportTaskItem(task))
  selectedTaskId.value = ''
  error.value = ''
}

function addNote(section) {
  draft.value.sections[section].push(createTextReportItem())
}

function removeItem(section, index) {
  draft.value.sections[section].splice(index, 1)
}

function close() {
  emit('update:modelValue', false)
}

function save() {
  const report = pruneEmptyReportItems({
    ...draft.value,
    createdAt: toDateTimeInputValue()
  })

  if (reportItemCount(report) === 0) {
    error.value = t('reports.emptyError')
    return
  }

  error.value = ''
  emit('submit', report)
}
</script>

<style scoped>
.report-dialog__hint {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}

.report-dialog__sections {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.report-dialog__section {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-top: 12px;
  border-top: 1px solid color-mix(in srgb, var(--md-on-surface) 12%, transparent);
}

.report-dialog__section:first-child {
  padding-top: 0;
  border-top: 0;
}

.report-dialog__section-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-dialog__section-title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 0.9375rem;
  font-weight: 500;
}

.report-dialog__count {
  min-width: 22px;
  padding: 1px 7px;
  border-radius: 10px;
  background: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

.report-dialog__empty {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  font-style: italic;
}

.report-dialog__items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.report-dialog__item {
  padding: 8px 12px;
  border-radius: 10px;
  background: var(--md-surface-container-low, var(--md-surface-variant));
}

.report-dialog__item-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.report-dialog__task {
  flex: 1 1 auto;
  min-width: 0;
  color: var(--md-primary);
  font-size: 0.75rem;
  font-weight: 500;
  overflow-wrap: anywhere;
}

.report-dialog__note-label {
  flex: 1 1 auto;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.report-dialog__remove {
  flex: 0 0 auto;
}

.report-dialog__textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-top: 4px;
  padding: 8px 10px;
  border: 1px solid var(--md-outline);
  border-radius: 8px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  font-family: inherit;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
}

.report-dialog__textarea:focus-visible {
  border-color: var(--md-primary);
  outline: 2px solid var(--md-primary);
  outline-offset: 1px;
}

.report-dialog__add {
  align-self: flex-start;
}

.report-dialog__task-add {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.report-dialog__select {
  flex: 1 1 220px;
  min-width: 0;
  max-width: 320px;
  padding: 8px 10px;
  border: 1px solid var(--md-outline);
  border-radius: 8px;
  background: var(--md-surface);
  color: var(--md-on-surface);
  font-family: inherit;
  font-size: 0.875rem;
}

.report-dialog__select:focus-visible {
  border-color: var(--md-primary);
  outline: 2px solid var(--md-primary);
  outline-offset: 1px;
}

.report-dialog__error {
  margin: 12px 0 0;
  color: var(--md-error);
  font-size: 0.875rem;
}
</style>
