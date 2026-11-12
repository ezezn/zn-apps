<template>
  <ZnSingleLineText
    v-bind="$attrs"
    type="email"
    inputmode="email"
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

// Validación deliberadamente laxa: solo descarta errores evidentes de formato.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  autocomplete: { type: String, default: 'email' },
  maxlength: { type: [String, Number], default: undefined },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  validate: { type: Boolean, default: true },
  invalidMessage: { type: String, default: 'Introduce un correo electrónico válido' }
})

const emit = defineEmits(['update:modelValue', 'update:valid', 'validation', 'focus', 'blur', 'enter'])

const touched = ref(false)

const isValid = computed(() => {
  const value = props.modelValue.trim()
  return value.length === 0 || EMAIL_RE.test(value)
})

const internalError = computed(() =>
  props.validate && touched.value && !isValid.value ? props.invalidMessage : ''
)

watch(isValid, (value) => emit('update:valid', value), { immediate: true })

function onInput(value) {
  emit('update:modelValue', value)
}

function onBlur(event) {
  touched.value = true
  emit('validation', isValid.value)
  emit('blur', event)
}
</script>
