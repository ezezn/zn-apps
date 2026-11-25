<template>
  <ZnDialog
    :model-value="modelValue"
    :title="title"
    max-width="640px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="day-off-dialog__hint">{{ t('daysOff.dialogHint') }}</p>

    <ZnDataForm
      ref="formRef"
      v-model="draft"
      :schema="schema"
      :show-actions="false"
      @change="onFieldChange"
      @save="handleSave"
    />

    <template #actions>
      <ZnButton variant="text" @click="close">{{ t('common.cancel') }}</ZnButton>
      <ZnButton variant="filled" @click="formRef?.save()">{{ t('common.save') }}</ZnButton>
    </template>
  </ZnDialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ZnButton, ZnDialog } from '@zn-apps/ui-core'
import { ZnDataForm } from '@zn-apps/ui-data-form'
import { i18n } from '../i18n.js'
import { dayOffFormSchema } from '../data/day-off-schema.js'
import { normalizeDayOff, validateDayOff } from '../helpers/days-off.js'
import { toDateInputValue } from '../helpers/dates.js'
import { useDaysOff } from '../composables/useDaysOff.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** `null` → create; otherwise the entry being edited. */
  dayOff: { type: Object, default: null },
  /** Prefilled start date for a new entry (the calendar's selected day). */
  defaultDate: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const t = (...args) => i18n.global.t(...args)
const { typeOptions } = useDaysOff()

const formRef = ref(null)
const draft = ref(emptyDraft())
const errors = ref({})

const title = computed(() =>
  props.dayOff ? t('daysOff.editTitle') : t('daysOff.add')
)

const schema = computed(() =>
  dayOffFormSchema({ t, errors: errors.value, typeOptions: typeOptions.value })
)

watch(
  () => [props.modelValue, props.dayOff],
  ([open]) => {
    if (!open) return
    draft.value = props.dayOff
      ? normalizeDayOff(props.dayOff)
      : emptyDraft(props.defaultDate)
    errors.value = {}
  },
  { immediate: true }
)

function emptyDraft(start = '') {
  return {
    type: 'vacation',
    start: String(start || '').slice(0, 10) || toDateInputValue(),
    end: '',
    note: ''
  }
}

function onFieldChange(_value, path) {
  if (errors.value[path]) errors.value = { ...errors.value, [path]: '' }
}

function handleSave(value) {
  const dayOff = normalizeDayOff(value)
  const invalid = validateDayOff(dayOff)
  errors.value = { start: invalid.start ? t('errors.required') : '' }
  if (Object.keys(invalid).length > 0) return
  emit('submit', dayOff)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.day-off-dialog__hint {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
