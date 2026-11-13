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
  ZnRangeInput,
  ZnRow
} from '@zn-apps/ui-core'
import { ZnRichTextEditor } from '@zn-apps/ui-data-richtext'
import ZnDataListInput from './ZnDataListInput.vue'
import {
  FieldTypes,
  fieldSpan,
  normalizeInputSize,
  normalizeInputVariant
} from '@zn-apps/ui-data-core'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  },
  field: {
    type: Object,
    required: true
  },
  /** Variante heredada; `field.variant` tiene prioridad. */
  variant: { type: String, default: '' },
  /** Tamaño heredado; `field.size` tiene prioridad. */
  size: { type: String, default: '' },
  /** Columnas efectivas de la sección para limitar `field.span`. */
  columns: { type: [Number, String], default: 1 }
})

const emit = defineEmits(['update:modelValue'])

const type = computed(() => props.field.type || FieldTypes.TEXT)
const fieldVariant = computed(() => normalizeInputVariant(props.field.variant ?? props.variant))
const fieldSize = computed(() => normalizeInputSize(props.field.size ?? props.size))
const span = computed(() => fieldSpan(props.field, props.columns))
const spanClass = computed(() => (span.value > 1 ? `zn-span-${span.value}` : null))

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
    case FieldTypes.LIST:
      return ZnDataListInput
    case FieldTypes.RICHTEXT:
      return ZnRichTextEditor
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

/** Sólo los campos con contenedor MD3 aceptan `variant`/`size`. */
const STYLED_TYPES = new Set([
  FieldTypes.TEXT,
  FieldTypes.TEXTAREA,
  FieldTypes.EMAIL,
  FieldTypes.PHONE,
  FieldTypes.NUMBER,
  FieldTypes.DATE,
  FieldTypes.TIME,
  FieldTypes.DATETIME,
  FieldTypes.SELECT,
  FieldTypes.MULTI_SELECT,
  FieldTypes.LIST,
  FieldTypes.RICHTEXT
])

const styleProps = computed(() =>
  STYLED_TYPES.has(type.value)
    ? { variant: fieldVariant.value, size: fieldSize.value }
    : {}
)

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
    case FieldTypes.LIST:
      return { ...base, placeholder: field.placeholder }
    case FieldTypes.RICHTEXT:
      return { ...base, placeholder: field.placeholder }
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
  FieldTypes.DATETIME,
  FieldTypes.RICHTEXT
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
    if (type.value === FieldTypes.LIST) {
      return Array.isArray(props.modelValue)
        ? props.modelValue
        : props.modelValue == null
          ? []
          : [props.modelValue]
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
  <ZnRow
    v-if="!field.hidden"
    padding="0"
    :align="isSwitch ? 'center' : 'stretch'"
    :class="[
      'zn-data-field',
      spanClass,
      { 'zn-data-field--switch': isSwitch },
      `zn-data-field--${fieldSize}`
    ]"
  >
    <component :is="componentType" v-model="value" v-bind="{ ...componentProps, ...styleProps }" />
  </ZnRow>
</template>

<style scoped>
.zn-data-field {
  width: 100%;
  min-width: 0;
}

.zn-data-field--switch {
  min-height: 56px;
}

.zn-data-field--switch.zn-data-field--small {
  min-height: 48px;
}

.zn-data-field--switch.zn-data-field--large {
  min-height: 64px;
}
</style>
