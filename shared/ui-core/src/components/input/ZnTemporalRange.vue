<template>
  <div class="zn-temporal-range">
    <div class="zn-temporal-range__fields">
      <div class="zn-temporal-range__field">
        <ZnSingleLineText
          float-label
          :model-value="startValue"
          :type="type"
          :label="startLabel"
          :min="min"
          :max="endValue || max"
          :step="step"
          :disabled="disabled"
          :required="required"
          :variant="variant"
          :name="startName"
          @update:model-value="updateStart"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @change="$emit('change', [caseValue($event), endValue])"
        />
      </div>

      <div class="zn-temporal-range__field">
        <ZnSingleLineText
          float-label
          :model-value="endValue"
          :type="type"
          :label="endLabel"
          :min="startValue || min"
          :max="max"
          :step="step"
          :disabled="disabled"
          :required="required"
          :variant="variant"
          :name="endName"
          :error="rangeError"
          @update:model-value="updateEnd"
          @focus="$emit('focus', $event)"
          @blur="$emit('blur', $event)"
          @change="$emit('change', [startValue, caseValue($event)])"
        />
      </div>
    </div>

    <p
      v-if="hint || error"
      :class="['zn-temporal-range__supporting', { 'zn-temporal-range__supporting--error': Boolean(error) }]"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ZnSingleLineText from './ZnSingleLineText.vue'

/**
 * Rango temporal compartido por `ZnDateRangeInput`, `ZnTimeRangeInput` y
 * `ZnDateTimeRangeInput`. Es interno: las apps usan los wrappers con el tipo
 * nativo fijado.
 */
const props = defineProps({
  /** `[inicio, fin]` en el formato del input nativo (`YYYY-MM-DD`, `HH:mm`, etc.). */
  modelValue: { type: Array, default: () => ['', ''] },
  type: { type: String, default: 'date' },
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
  invalidMessage: { type: String, default: '' },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur'])

const startValue = computed(() => (Array.isArray(props.modelValue) ? props.modelValue[0] ?? '' : ''))
const endValue = computed(() =>
  Array.isArray(props.modelValue) ? props.modelValue[1] ?? '' : ''
)

const invalidMessage = computed(() => {
  if (props.invalidMessage) return props.invalidMessage
  return props.type === 'date'
    ? 'La fecha final no puede ser anterior a la inicial'
    : 'El valor final no puede ser anterior al inicial'
})

const rangeError = computed(() =>
  startValue.value && endValue.value && endValue.value < startValue.value
    ? invalidMessage.value
    : ''
)

function caseValue(event) {
  return event?.target?.value ?? ''
}

function commit(nextStart, nextEnd) {
  emit('update:modelValue', [nextStart, nextEnd])
  emit('change', [nextStart, nextEnd])
}

function updateStart(value) {
  commit(value, endValue.value)
}

function updateEnd(value) {
  commit(startValue.value, value)
}
</script>

<style scoped>
.zn-temporal-range {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
  font-family: 'Roboto', sans-serif;
}

.zn-temporal-range__fields {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
  min-width: 0;
}

.zn-temporal-range__field {
  flex: 1 1 160px;
  min-width: 0;
}

.zn-temporal-range__supporting {
  margin: 0;
  padding: 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  line-height: 16px;
}

.zn-temporal-range__supporting--error {
  color: var(--md-error, #B3261E);
}
</style>
