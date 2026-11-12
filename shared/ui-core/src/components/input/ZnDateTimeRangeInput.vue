<template>
  <ZnTemporalRange
    type="datetime-local"
    :model-value="modelValue"
    :start-label="startLabel"
    :end-label="endLabel"
    :start-name="startName"
    :end-name="endName"
    :hint="hint"
    :error="error"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :required="required"
    :invalid-message="invalidMessage"
    v-bind="$attrs"
    @update:model-value="$emit('update:modelValue', $event)"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
  />
</template>

<script setup>
import ZnTemporalRange from './ZnTemporalRange.vue'

defineOptions({ inheritAttrs: false })

defineProps({
  /** `[inicio, fin]` en formato `YYYY-MM-DDTHH:mm` (o con segundos). */
  modelValue: { type: Array, default: () => ['', ''] },
  startLabel: { type: String, default: 'Desde' },
  endLabel: { type: String, default: 'Hasta' },
  startName: { type: String, default: '' },
  endName: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  min: { type: String, default: undefined },
  max: { type: String, default: undefined },
  step: { type: [String, Number], default: undefined },
  disabled: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  invalidMessage: { type: String, default: '' }
})

defineEmits(['update:modelValue', 'change', 'focus', 'blur'])
</script>
