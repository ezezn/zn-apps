<template>
  <ZnSingleLineText
    ref="textField"
    v-bind="$attrs"
    type="number"
    inputmode="decimal"
    :model-value="text"
    :label="label"
    :hint="hint"
    :error="error || internalError"
    :placeholder="placeholder"
    :name="name"
    :min="min"
    :max="max"
    :step="step"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
    :float-label="floatLabel"
    :variant="variant"
    :size="size"
    @update:model-value="onInput"
    @focus="$emit('focus', $event)"
    @blur="onBlur"
    @enter="$emit('enter', $event)"
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
import { computed, ref, watch } from 'vue'
import ZnSingleLineText from './ZnSingleLineText.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  /** Número actual; `null` o `''` cuando el campo está vacío. */
  modelValue: { type: [Number, String], default: null },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  min: { type: [Number, String], default: undefined },
  max: { type: [Number, String], default: undefined },
  /** Paso nativo; `any` (por defecto) permite decimales. */
  step: { type: [Number, String], default: 'any' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  /** Mantiene la etiqueta arriba aunque el campo esté vacío. */
  floatLabel: { type: Boolean, default: false },
  validate: { type: Boolean, default: true },
  invalidMessage: { type: String, default: 'Introduce un valor numérico válido' },
  /** `outlined` (contorno) o `filled` (relleno), las dos variantes MD3. */
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

const emit = defineEmits(['update:modelValue', 'update:valid', 'validation', 'focus', 'blur', 'enter'])

const textField = ref(null)
const touched = ref(false)

/** Texto que se pinta en el input para no perder estados intermedios (p. ej. `1.`). */
const text = ref(toText(props.modelValue))

function toText(value) {
  return value === null || value === undefined ? '' : String(value)
}

function parseNumber(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return null
  const parsed = Number(raw)
  return Number.isFinite(parsed) ? parsed : null
}

const numericValue = computed(() => parseNumber(text.value))

// Mantiene el texto sincronizado cuando el padre cambia el valor, sin pisar
// lo que el usuario está escribiendo si el número resultante es el mismo.
watch(
  () => props.modelValue,
  (value) => {
    const next = toText(value)
    if (parseNumber(next) !== numericValue.value) text.value = next
  }
)

function boundary(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const minValue = computed(() => boundary(props.min))
const maxValue = computed(() => boundary(props.max))

const isValid = computed(() => {
  const value = numericValue.value
  if (value === null) return true
  if (minValue.value !== null && value < minValue.value) return false
  if (maxValue.value !== null && value > maxValue.value) return false
  return true
})

const internalError = computed(() =>
  props.validate && touched.value && !isValid.value ? props.invalidMessage : ''
)

watch(isValid, (value) => emit('update:valid', value), { immediate: true })

function onInput(value) {
  text.value = value
  emit('update:modelValue', parseNumber(value))
}

function onBlur(event) {
  touched.value = true
  // Normaliza lo que el navegador haya dejado en el control (por ejemplo `1.`)
  text.value = toText(parseNumber(text.value))
  emit('validation', isValid.value)
  emit('blur', event)
}

defineExpose({ focus: () => textField.value?.focus() })
</script>
