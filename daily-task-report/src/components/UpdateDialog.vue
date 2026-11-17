<template>
  <ZnDialog
    :model-value="modelValue"
    :title="title"
    max-width="640px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="update-dialog__hint">{{ t('updates.createHint') }}</p>

    <ZnDataForm
      ref="formRef"
      v-model="draft"
      :schema="schema"
      :show-actions="false"
      @change="onFieldChange"
      @save="handleSave"
    />

    <template #actions>
      <ZnButton variant="text" :disabled="saving" @click="close">{{ t('common.cancel') }}</ZnButton>
      <ZnButton variant="filled" :disabled="saving" @click="formRef?.save()">
        {{ t('common.save') }}
      </ZnButton>
    </template>
  </ZnDialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ZnButton, ZnDialog } from '@zn-apps/ui-core'
import { ZnDataForm } from '@zn-apps/ui-data-form'
import { clone } from '@zn-apps/ui-data-core'
import { i18n } from '../i18n.js'
import { updateFormSchema } from '../data/update-schema.js'
import {
  createUpdateDraft,
  normalizeUpdate,
  validateUpdate
} from '../helpers/updates.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** `null` → create; otherwise the update being edited. */
  update: { type: Object, default: null },
  /** Task preselected when creating from a card. */
  taskId: { type: Number, default: null },
  /** Tasks offered in the selector (id + name). */
  tasks: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const t = (...args) => i18n.global.t(...args)

const formRef = ref(null)
const draft = ref(createUpdateDraft())
const errors = ref({})

const title = computed(() =>
  props.update ? t('updates.editTitle') : t('updates.new')
)

const schema = computed(() =>
  updateFormSchema({ t, errors: errors.value, tasks: props.tasks })
)

watch(
  () => [props.modelValue, props.update, props.taskId],
  ([open]) => {
    if (!open) return
    draft.value = props.update
      ? normalizeUpdate(clone(props.update))
      : createUpdateDraft({ taskId: props.taskId })
    errors.value = {}
  },
  { immediate: true }
)

function onFieldChange(_value, path) {
  if (errors.value[path]) errors.value = { ...errors.value, [path]: '' }
}

function handleSave(value) {
  const update = normalizeUpdate(value)
  const invalid = validateUpdate(update)
  errors.value = {
    taskId: invalid.taskId ? t('errors.required') : '',
    description: invalid.description ? t('errors.required') : '',
    createdAt: invalid.createdAt ? t('errors.required') : ''
  }
  if (Object.keys(invalid).length > 0) return
  emit('submit', update)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.update-dialog__hint {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
