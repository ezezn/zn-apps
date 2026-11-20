<template>
  <ZnDialog
    :model-value="modelValue"
    :title="title"
    max-width="640px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="report-template-dialog__hint">{{ t('settings.templateDialogHint') }}</p>

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
import { reportTemplateFormSchema } from '../data/report-template-schema.js'
import {
  normalizeReportTemplate,
  validateReportTemplate
} from '../composables/useReportTemplates.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** `null` → create; otherwise the template being edited. */
  template: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const t = (...args) => i18n.global.t(...args)

const formRef = ref(null)
const draft = ref(emptyDraft())
const errors = ref({})

const title = computed(() =>
  props.template ? t('settings.templatesEdit') : t('settings.templatesAdd')
)

const schema = computed(() => reportTemplateFormSchema({ t, errors: errors.value }))

watch(
  () => [props.modelValue, props.template],
  ([open]) => {
    if (!open) return
    draft.value = props.template
      ? normalizeReportTemplate(props.template)
      : emptyDraft()
    errors.value = {}
  },
  { immediate: true }
)

function emptyDraft() {
  return { name: '', body: '' }
}

function onFieldChange(_value, path) {
  if (errors.value[path]) errors.value = { ...errors.value, [path]: '' }
}

function handleSave(value) {
  const template = normalizeReportTemplate(value)
  const invalid = validateReportTemplate(template)
  errors.value = {
    name: invalid.name ? t('errors.required') : '',
    body: invalid.body ? t('errors.required') : ''
  }
  if (Object.keys(invalid).length > 0) return
  emit('submit', template)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.report-template-dialog__hint {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
