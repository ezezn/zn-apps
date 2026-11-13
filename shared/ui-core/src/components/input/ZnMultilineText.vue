<template>
  <ZnFieldShell
    :label="label"
    :hint="hint"
    :error="error"
    :disabled="disabled"
    :focused="isFocused"
    :filled="hasValue"
    :required="required"
    :for-id="fieldId"
    :variant="variant"
    :size="size"
    multiline
  >
    <template v-if="$slots.leading" #leading>
      <slot name="leading" />
    </template>

    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>

    <textarea
      :id="fieldId"
      ref="textareaRef"
      :value="modelValue"
      :placeholder="placeholder"
      :rows="rows"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :name="name"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="describedBy"
      v-bind="$attrs"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
    />
  </ZnFieldShell>
</template>

<script setup>
import { computed, ref, useId } from 'vue'
import ZnFieldShell from './ZnFieldShell.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  rows: { type: [String, Number], default: 4 },
  maxlength: { type: [String, Number], default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  },
  /** `small` (48px, densidad -2 MD3), `medium` (56px) o `large` (64px). */
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])

const uid = useId()
const fieldId = `zn-textarea-${uid}`
const textareaRef = ref(null)
const isFocused = ref(false)

const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined && String(props.modelValue).length > 0)
const describedBy = computed(() => (props.error || props.hint ? `${fieldId}-supporting` : undefined))

function onInput(event) {
  emit('update:modelValue', event.target.value)
}

function onFocus(event) {
  isFocused.value = true
  emit('focus', event)
}

function onBlur(event) {
  isFocused.value = false
  emit('blur', event)
}

defineExpose({ focus: () => textareaRef.value?.focus(), textareaRef })
</script>
