<template>
  <ZnDialog
    :model-value="modelValue"
    :title="title"
    max-width="640px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p v-if="!task" class="task-dialog__hint">{{ t('tasks.createHint') }}</p>

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
import { useEntityLabels } from '../composables/useEntityLabels.js'
import { taskFormSchema } from '../data/task-schema.js'
import { createTaskDraft, normalizeTask, validateTask } from '../helpers/tasks.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** `null` → create; otherwise the Task being edited. */
  task: { type: Object, default: null },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const t = (...args) => i18n.global.t(...args)
const { singular } = useEntityLabels()

const formRef = ref(null)
const draft = ref(createTaskDraft())
const errors = ref({})

const title = computed(() =>
  props.task
    ? t('tasks.editTitle', { entity: singular.value })
    : t('tasks.new', { entity: singular.value })
)

const schema = computed(() => taskFormSchema({ t, errors: errors.value }))

watch(
  () => [props.modelValue, props.task],
  ([open]) => {
    if (!open) return
    draft.value = props.task ? normalizeTask(clone(props.task)) : createTaskDraft()
    errors.value = {}
  },
  { immediate: true }
)

function onFieldChange(_value, path) {
  if (errors.value[path]) errors.value = { ...errors.value, [path]: '' }
}

function handleSave(value) {
  const task = normalizeTask(value)
  const invalid = validateTask(task)
  errors.value = {
    name: invalid.name ? t('errors.required') : '',
    externalId: invalid.externalId ? t('errors.required') : '',
    addedAt: invalid.addedAt ? t('errors.required') : ''
  }
  if (Object.keys(invalid).length > 0) return
  emit('submit', task)
}

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.task-dialog__hint {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>
