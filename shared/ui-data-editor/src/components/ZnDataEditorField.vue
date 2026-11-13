<script setup>
import { computed, nextTick, ref } from 'vue'
import { ZnButton, ZnDialog, ZnIcon, ZnRow } from '@zn-apps/ui-core'
import { ZnDataField } from '@zn-apps/ui-data-form'
import { ZnDataViewField } from '@zn-apps/ui-data-view'
import { LabelPositions, clone, fieldSpan } from '@zn-apps/ui-data-core'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  },
  field: {
    type: Object,
    required: true
  },
  labelPosition: {
    type: String,
    default: LabelPositions.TOP
  },
  emptyText: { type: String, default: '—' },
  trueText: { type: String, default: 'Yes' },
  falseText: { type: String, default: 'No' },
  dialogTitle: { type: String, default: '' },
  saveLabel: { type: String, default: 'Save' },
  cancelLabel: { type: String, default: 'Cancel' },
  /** Variante heredada para el input del diálogo; `field.variant` gana. */
  variant: { type: String, default: '' },
  /** Tamaño heredado para el input del diálogo; `field.size` gana. */
  size: { type: String, default: '' },
  /** Columnas efectivas de la sección para limitar `field.span`. */
  columns: { type: [Number, String], default: 1 }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isEditing = ref(false)
const editValue = ref(null)
const triggerRef = ref(null)

const span = computed(() => fieldSpan(props.field, props.columns))
const spanClass = computed(() => (span.value > 1 ? `zn-span-${span.value}` : null))

const title = computed(
  () => props.dialogTitle || (props.field.label ? `Edit ${props.field.label}` : 'Edit')
)

function startEdit() {
  if (props.field.disabled || props.field.readonly) return
  editValue.value = clone(props.modelValue)
  isEditing.value = true
  nextTick(() => triggerRef.value?.focus())
}

function saveEdit() {
  const value = clone(editValue.value)
  isEditing.value = false
  emit('update:modelValue', value)
  emit('change', value)
}

function cancelEdit() {
  isEditing.value = false
  editValue.value = null
}

function onTriggerKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    startEdit()
  }
}
</script>

<template>
  <div v-if="!field.hidden" class="zn-editor-field" :class="spanClass">
    <div
      ref="triggerRef"
      class="zn-field-trigger"
      :class="{ 'zn-field-trigger--disabled': field.disabled || field.readonly }"
      role="button"
      :tabindex="field.disabled || field.readonly ? -1 : 0"
      :aria-label="`Edit ${field.label || ''}`.trim()"
      @click="startEdit"
      @keydown="onTriggerKeydown"
    >
      <ZnDataViewField
        :field="field"
        :model-value="modelValue"
        :label-position="labelPosition"
        :empty-text="emptyText"
        :true-text="trueText"
        :false-text="falseText"
        :size="size"
        :columns="columns"
      />
      <ZnIcon v-if="!field.disabled && !field.readonly" name="edit" :size="18" class="zn-edit-icon" />
    </div>

    <ZnDialog
      :model-value="isEditing"
      :title="title"
      @update:model-value="(open) => { if (!open) cancelEdit() }"
      @close="cancelEdit"
    >
      <ZnRow
        class="zn-edit-dialog-content"
        direction="column"
        padding="8px 0"
        gap="0"
      >
        <ZnDataField
          v-model="editValue"
          :field="field"
          :variant="field.variant ?? variant"
          :size="field.size ?? size"
        />
      </ZnRow>

      <template #actions>
        <ZnButton variant="text" @click="cancelEdit">{{ cancelLabel }}</ZnButton>
        <ZnButton variant="filled" @click="saveEdit">{{ saveLabel }}</ZnButton>
      </template>
    </ZnDialog>
  </div>
</template>

<style scoped>
.zn-editor-field {
  position: relative;
  min-width: 0;
}

.zn-field-trigger {
  position: relative;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1);
}

.zn-field-trigger:hover,
.zn-field-trigger:focus-visible {
  background-color: var(--md-surface-container-highest);
  outline: none;
}

.zn-field-trigger--disabled {
  cursor: default;
}

.zn-field-trigger--disabled:hover {
  background-color: transparent;
}

.zn-edit-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--md-primary);
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1);
  pointer-events: none;
}

.zn-field-trigger:hover .zn-edit-icon,
.zn-field-trigger:focus-visible .zn-edit-icon {
  opacity: 1;
}

.zn-edit-dialog-content {
  min-width: min(320px, 70vw);
}
</style>
