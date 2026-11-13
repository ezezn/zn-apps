<template>
  <ZnFieldShell
    :label="label"
    :hint="hint"
    :error="error"
    :disabled="disabled"
    :focused="isFocused"
    :filled="items.length > 0 || draft.length > 0"
    :required="required"
    :for-id="inputId"
    :variant="variant"
    :size="size"
  >
    <ZnRow padding="0" gap="4px" wrap align="center" class="zn-list-input__content">
      <ZnChip
        v-for="(item, index) in items"
        :key="`${item}-${index}`"
        variant="input"
        :label="String(item)"
        :size="size"
        :disabled="disabled || readonly"
        removable
        :remove-label="`Quitar ${item}`"
        @remove="removeAt(index)"
      />

      <span class="zn-list-input__entry">
        <input
          :id="inputId"
          ref="inputRef"
          type="text"
          :value="draft"
          :placeholder="items.length ? '' : placeholder"
          :disabled="disabled"
          :readonly="readonly"
          :aria-describedby="error || hint ? `${inputId}-supporting` : undefined"
          @input="draft = $event.target.value"
          @focus="isFocused = true"
          @blur="onBlur"
          @keydown="onKeydown"
        />
      </span>
    </ZnRow>
  </ZnFieldShell>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import { ZnChip, ZnFieldShell, ZnRow } from '@zn-apps/ui-core'

/**
 * Editor de listas libres de valores escalares, basado en chips de entrada MD3.
 * Es interno de `ui-data-form`: `ZnDataField` lo usa para `FieldTypes.LIST`.
 */
const props = defineProps({
  modelValue: { type: Array, default: () => [] },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: 'Añadir valor y pulsar Enter' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  variant: { type: String, default: 'outlined' },
  size: { type: String, default: 'medium' }
})

const emit = defineEmits(['update:modelValue'])

const uid = useId()
const inputId = `zn-list-input-${uid}`
const inputRef = ref(null)
const draft = ref('')
const isFocused = ref(false)

const items = computed(() => (Array.isArray(props.modelValue) ? props.modelValue : []))

function commit() {
  const value = draft.value.trim()
  if (!value || props.disabled || props.readonly) return

  if (!items.value.some((item) => String(item) === value)) {
    emit('update:modelValue', [...items.value, value])
  }
  draft.value = ''
}

function removeAt(index) {
  if (props.disabled || props.readonly) return
  emit(
    'update:modelValue',
    items.value.filter((_, itemIndex) => itemIndex !== index)
  )
}

function onKeydown(event) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    commit()
    return
  }

  if (event.key === 'Backspace' && !draft.value && items.value.length) {
    removeAt(items.value.length - 1)
  }
}

function onBlur() {
  isFocused.value = false
  commit()
}

defineExpose({ focus: () => inputRef.value?.focus(), inputRef })
</script>

<style scoped>
.zn-list-input__content {
  min-width: 0;
}

.zn-list-input__entry {
  display: flex;
  flex: 1 1 80px;
  min-width: 80px;
}
</style>
