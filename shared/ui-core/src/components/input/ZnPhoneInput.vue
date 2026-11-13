<template>
  <ZnSingleLineText
    ref="textField"
    v-bind="$attrs"
    type="tel"
    inputmode="tel"
    :autocomplete="autocomplete"
    :model-value="modelValue"
    :label="label"
    :hint="hint"
    :error="error || internalError"
    :placeholder="placeholder"
    :name="name"
    :maxlength="maxlength"
    :disabled="disabled"
    :readonly="readonly"
    :required="required"
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
import { computed, nextTick, ref, watch } from 'vue'
import ZnSingleLineText from './ZnSingleLineText.vue'

defineOptions({ inheritAttrs: false })

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  autocomplete: { type: String, default: 'tel' },
  maxlength: { type: [String, Number], default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  validate: { type: Boolean, default: true },
  minDigits: { type: Number, default: 6 },
  maxDigits: { type: Number, default: 15 },
  invalidMessage: { type: String, default: 'Introduce un número de teléfono válido' },
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

const emit = defineEmits(['update:modelValue', 'update:valid', 'validation', 'focus', 'blur', 'enter'])

const touched = ref(false)
const textField = ref(null)

/** Solo admite dígitos y los separadores habituales de un teléfono. */
function sanitize(value) {
  return String(value ?? '').replace(/[^\d+()\s-]/g, '')
}

const digitCount = computed(() => (props.modelValue.match(/\d/g) || []).length)

const isValid = computed(() => {
  if (digitCount.value === 0) return true
  return digitCount.value >= props.minDigits && digitCount.value <= props.maxDigits
})

const internalError = computed(() =>
  props.validate && touched.value && !isValid.value ? props.invalidMessage : ''
)

watch(isValid, (value) => emit('update:valid', value), { immediate: true })

function onInput(value) {
  const clean = sanitize(value)
  emit('update:modelValue', clean)

  // Si el valor saneado no cambia la prop, Vue no vuelve a pintar el input:
  // forzamos el DOM para que los caracteres descartados no queden visibles.
  if (clean !== value) {
    nextTick(() => {
      const element = textField.value?.inputRef
      if (element && element.value !== clean) element.value = clean
    })
  }
}

function onBlur(event) {
  touched.value = true
  emit('validation', isValid.value)
  emit('blur', event)
}
</script>
