<template>
  <ZnSingleLineText
    v-bind="$attrs"
    type="datetime-local"
    float-label
    :model-value="modelValue"
    :label="label"
    :hint="hint"
    :error="error"
    :placeholder="placeholder"
    :name="name"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :min="min"
    :max="max"
    :step="step"
    :variant="variant"
    :size="size"
    @update:model-value="$emit('update:modelValue', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @change="$emit('change', $event.target.value)"
  >
    <template v-if="$slots.leading" #leading>
      <slot name="leading" />
    </template>

    <template v-if="$slots.trailing" #trailing>
      <slot name="trailing" />
    </template>
  </ZnSingleLineText>
</template>

<script setup>
import ZnSingleLineText from './ZnSingleLineText.vue'

defineOptions({ inheritAttrs: false })

defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  min: { type: String, default: undefined },
  max: { type: String, default: undefined },
  step: { type: [String, Number], default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

defineEmits(['update:modelValue', 'change', 'focus', 'blur'])
</script>
