<script setup>
import { computed } from 'vue'
import {
  ZnSingleLineText,
  ZnMultilineText,
  ZnEmailInput,
  ZnPhoneInput,
  ZnDateInput,
  ZnTimeInput,
  ZnDateTimeInput,
  ZnSelect,
  ZnSwitch,
  ZnRangeInput
} from '@zn-apps/ui-core'
import { FieldTypes } from '@zn-apps/ui-data-core'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  },
  field: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const type = computed(() => props.field.type || FieldTypes.TEXT)

const componentType = computed(() => {
  switch (type.value) {
    case FieldTypes.TEXTAREA:
      return ZnMultilineText
    case FieldTypes.EMAIL:
      return ZnEmailInput
    case FieldTypes.PHONE:
      return ZnPhoneInput
    case FieldTypes.DATE:
      return ZnDateInput
    case FieldTypes.TIME:
      return ZnTimeInput
    case FieldTypes.DATETIME:
      return ZnDateTimeInput
    case FieldTypes.SELECT:
    case FieldTypes.MULTI_SELECT:
      return ZnSelect
    case FieldTypes.SWITCH:
    case FieldTypes.CHECKBOX:
      return ZnSwitch
    case FieldTypes.RANGE:
      return ZnRangeInput
    case FieldTypes.TEXT:
    case FieldTypes.NUMBER:
    default:
      return ZnSingleLineText
  }
})

const isSwitch = computed(
  () => type.value === FieldTypes.SWITCH || type.value === FieldTypes.CHECKBOX
)

/** Etiqueta/descripción comunes de los componentes de entrada de ui-core. */
const commonProps = computed(() => {
  const field = props.field
  return {
    label: field.label,
    hint: field.hint ?? field.description,
    error: field.error,
    placeholder: field.placeholder,
    required: Boolean(field.required),
    disabled: Boolean(field.disabled),
    readonly: Boolean(field.readonly)
  }
})

const componentProps = computed(() => {
  const field = props.field

  if (isSwitch.value) {
    return {
      labelRight: field.label,
      disabled: Boolean(field.disabled)
    }
  }

  const base = commonProps.value

  switch (type.value) {
    case FieldTypes.SELECT:
      return { ...base, options: field.options ?? [] }
    case FieldTypes.MULTI_SELECT:
      return { ...base, options: field.options ?? [], multiple: true }
    case FieldTypes.NUMBER:
      return { ...base, type: 'number', min: field.min, max: field.max, step: field.step }
    case FieldTypes.RANGE:
      return {
        label: field.label,
        hint: field.hint ?? field.description,
        error: field.error,
        min: field.min ?? 0,
        max: field.max ?? 100,
        step: field.step ?? 1,
        disabled: Boolean(field.disabled),
        showValue: field.showValue ?? true,
        showTicks: Boolean(field.showTicks),
        centered: Boolean(field.centered)
      }
    case FieldTypes.TEXTAREA:
      return { ...base, rows: field.rows, maxlength: field.maxlength }
    case FieldTypes.DATE:
    case FieldTypes.TIME:
    case FieldTypes.DATETIME:
      return { ...base, min: field.min, max: field.max, step: field.step }
    default:
      return { ...base, maxlength: field.maxlength, autocomplete: field.autocomplete }
  }
})

const TEXT_TYPES = new Set([
  FieldTypes.TEXT,
  FieldTypes.TEXTAREA,
  FieldTypes.EMAIL,
  FieldTypes.PHONE,
  FieldTypes.NUMBER,
  FieldTypes.DATE,
  FieldTypes.TIME,
  FieldTypes.DATETIME
])

const value = computed({
  get: () => {
    if (TEXT_TYPES.has(type.value)) return props.modelValue ?? ''
    if (type.value === FieldTypes.SWITCH || type.value === FieldTypes.CHECKBOX) {
      return Boolean(props.modelValue)
    }
    if (type.value === FieldTypes.MULTI_SELECT && !Array.isArray(props.modelValue)) {
      return props.modelValue == null ? [] : [props.modelValue]
    }
    if (type.value === FieldTypes.RANGE && props.modelValue == null) return 0
    return props.modelValue
  },
  set: (next) => {
    if (type.value === FieldTypes.NUMBER) {
      if (next === '' || next === null || next === undefined) {
        emit('update:modelValue', null)
        return
      }
      const parsed = Number(next)
      emit('update:modelValue', Number.isNaN(parsed) ? next : parsed)
      return
    }
    emit('update:modelValue', next)
  }
})
</script>

<template>
  <div v-if="!field.hidden" class="zn-data-field" :class="{ 'zn-data-field--switch': isSwitch }">
    <component :is="componentType" v-model="value" v-bind="componentProps" />
  </div>
</template>

<style scoped>
.zn-data-field {
  width: 100%;
  min-width: 0;
}

.zn-data-field--switch {
  display: flex;
  align-items: center;
  min-height: 56px;
}
</style>
