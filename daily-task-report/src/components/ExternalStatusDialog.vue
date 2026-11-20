<template>
  <ZnDialog
    :model-value="modelValue"
    :title="title"
    max-width="640px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="external-status-dialog__hint">{{ t('settings.externalStatusDialogHint') }}</p>

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
import { externalStatusFormSchema } from '../data/external-status-schema.js'
import {
  normalizeExternalStatus,
  validateExternalStatus
} from '../composables/useExternalStatuses.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** `null` → create; otherwise the external status being edited. */
  status: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const t = (...args) => i18n.global.t(...args)

const formRef = ref(null)
const draft = ref(emptyDraft())
const errors = ref({})

const title = computed(() =>
  props.status ? t('settings.externalStatusEdit') : t('settings.externalStatusAdd')
)

const schema = computed(() => externalStatusFormSchema({ t, errors: errors.value }))

watch(
  () => [props.modelValue, props.status],
  ([open]) => {
    if (!open) return
    draft.value = props.status ? normalizeExternalStatus(props.status) : emptyDraft()
    errors.value = {}
  },
  { immediate: true }
)

function emptyDraft() {
  return { labels: { en: '', es: '' } }
}

function onFieldChange(_value, path) {
  if (errors.value[path]) errors.value = { ...errors.value, [path]: '' }
}

function handleSave(value) {
  const status = normalizeExternalStatus(value)
  const invalid = validateExternalStatus(status)
  errors.value = { labelEn: invalid.labelEn ? t('errors.required') : '' }
  if (Object.keys(invalid).length > 0) return
  emit('submit', status)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.external-status-dialog__hint {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
