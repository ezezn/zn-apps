<template>
  <ZnFieldShell
    :label="label"
    :hint="hint"
    :error="error"
    :disabled="disabled"
    :focused="isFocused"
    :filled="hasValue"
    :float-label="floatLabel"
    :required="required"
    :for-id="fieldId"
    :variant="variant"
  >
    <template v-if="$slots.leading" #leading>
      <slot name="leading" />
    </template>

    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>

    <input
      :id="fieldId"
      ref="inputRef"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :maxlength="maxlength"
      :autocomplete="autocomplete"
      :name="name"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="describedBy"
      v-bind="$attrs"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @keydown.enter="$emit('enter', $event)"
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
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  autocomplete: { type: String, default: '' },
  maxlength: { type: [String, Number], default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  /** Mantiene la etiqueta arriba, útil cuando el control nativo ya muestra texto. */
  floatLabel: { type: Boolean, default: false },
  /** `outlined` (contorno) o `filled` (relleno), las dos variantes MD3. */
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'enter', 'focus', 'blur'])

const uid = useId()
const fieldId = `zn-input-${uid}`
const inputRef = ref(null)
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

defineExpose({ focus: () => inputRef.value?.focus(), inputRef })
</script>
