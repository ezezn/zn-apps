<template>
  <ZnDialog
    :model-value="modelValue"
    :title="title"
    max-width="640px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="update-dialog__hint">{{ t('updates.createHint') }}</p>

    <section v-if="showPrevious" class="update-dialog__previous">
      <header class="update-dialog__previous-header">
        <h3 class="update-dialog__previous-title">{{ t('updates.previousTitle') }}</h3>
        <time class="update-dialog__previous-date" :datetime="previousUpdate.createdAt">
          {{ previousDate }}
        </time>
      </header>

      <p class="update-dialog__previous-text">{{ previousUpdate.description }}</p>

      <div class="update-dialog__previous-actions">
        <ZnButton variant="outlined" @click="copyPrevious">
          <template #icon>
            <ZnIcon name="content_copy" :size="18" />
          </template>
          <span aria-live="polite">{{ copied ? t('updates.copied') : t('updates.copy') }}</span>
        </ZnButton>
        <ZnButton variant="text" @click="usePrevious">
          {{ t('updates.usePrevious') }}
        </ZnButton>
      </div>
    </section>

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
import { computed, onUnmounted, ref, watch } from 'vue'
import { ZnButton, ZnDialog, ZnIcon } from '@zn-apps/ui-core'
import { ZnDataForm } from '@zn-apps/ui-data-form'
import { clone } from '@zn-apps/ui-data-core'
import { i18n } from '../i18n.js'
import { updateFormSchema } from '../data/update-schema.js'
import {
  createUpdateDraft,
  normalizeUpdate,
  validateUpdate
} from '../helpers/updates.js'
import { formatTaskDateTime } from '../helpers/dates.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** `null` → create; otherwise the update being edited. */
  update: { type: Object, default: null },
  /** Task preselected when creating from a card. */
  taskId: { type: Number, default: null },
  /** Last update of that task, shown read-only as a reference when creating. */
  previousUpdate: { type: Object, default: null },
  /** Tasks offered in the selector (id + name). */
  tasks: { type: Array, default: () => [] },
  saving: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'submit'])

const t = (...args) => i18n.global.t(...args)

const formRef = ref(null)
const draft = ref(createUpdateDraft())
const errors = ref({})
const copied = ref(false)
let copiedTimer = null

const showPrevious = computed(
  () => !props.update && Boolean(props.previousUpdate?.description)
)

const previousDate = computed(() =>
  props.previousUpdate
    ? formatTaskDateTime(props.previousUpdate.createdAt, i18n.global.locale.value)
    : ''
)

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
    copied.value = false
  },
  { immediate: true }
)

onUnmounted(() => clearTimeout(copiedTimer))

/** Copies the previous description, falling back to the legacy selection API. */
async function copyPrevious() {
  const value = props.previousUpdate?.description || ''
  if (!value) return

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
    } else if (!legacyCopy(value)) {
      return
    }
  } catch {
    if (!legacyCopy(value)) return
  }

  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}

function legacyCopy(value) {
  if (typeof document === 'undefined') return false
  const area = document.createElement('textarea')
  area.value = value
  area.readOnly = true
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const done = typeof document.execCommand === 'function' && document.execCommand('copy')
  document.body.removeChild(area)
  return done
}

/** Moves the previous text into the description field of the new update. */
function usePrevious() {
  if (!showPrevious.value) return
  draft.value = { ...draft.value, description: props.previousUpdate.description }
  errors.value = { ...errors.value, description: '' }
}

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

.update-dialog__previous {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px 16px;
  border: 1px solid var(--md-outline-variant, var(--md-outline));
  border-radius: 12px;
  background: var(--md-surface-container-low, var(--md-surface));
}

.update-dialog__previous-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px 12px;
}

.update-dialog__previous-title {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.update-dialog__previous-date {
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
}

.update-dialog__previous-text {
  margin: 0;
  max-height: 8rem;
  overflow-y: auto;
  color: var(--md-on-surface);
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-line;
  overflow-wrap: anywhere;
}

.update-dialog__previous-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
</style>
