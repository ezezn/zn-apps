<script setup>
import { computed, ref, watch } from 'vue'
import { ZnButton, ZnRow } from '@zn-apps/ui-core'
import {
  clone,
  normalizeInputSize,
  normalizeInputVariant,
  schemaSections,
  withDefaults,
  writeAt
} from '@zn-apps/ui-data-core'
import ZnDataSection from './ZnDataSection.vue'

const props = defineProps({
  /** Valor inicial del formulario (objeto JSON). También es el destino del reset. */
  modelValue: {
    type: Object,
    default: () => ({})
  },
  /** Definición del formulario (secciones y campos). */
  schema: {
    type: Object,
    required: true
  },
  /**
   * Con `true` cada cambio de un campo emite `update:modelValue`.
   * Con `false` (por defecto) sólo cambia el borrador interno y el valor se
   * confirma al pulsar Save.
   */
  live: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  saveLabel: { type: String, default: 'Save' },
  cancelLabel: { type: String, default: 'Cancel' },
  resetLabel: { type: String, default: 'Reset' },
  clearLabel: { type: String, default: 'Clear' },
  /** Variante MD3 por defecto de los inputs; `schema.variant` tiene prioridad. */
  variant: {
    type: String,
    default: '',
    validator: (value) => ['', 'outlined', 'filled'].includes(value)
  },
  /** Tamaño MD3 por defecto de los inputs; `schema.size` tiene prioridad. */
  size: {
    type: String,
    default: '',
    validator: (value) => ['', 'small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'reset', 'clear', 'change'])

/** Instantánea del valor inicial + defaults del esquema: destino de Reset/Cancel. */
const initialData = ref(withDefaults(props.schema, props.modelValue))
const localData = ref(clone(initialData.value))

const sections = computed(() => schemaSections(props.schema))
const formVariant = computed(() => normalizeInputVariant(props.schema?.variant ?? props.variant))
const formSize = computed(() => normalizeInputSize(props.schema?.size ?? props.size))

watch(
  () => props.modelValue,
  (newValue) => {
    initialData.value = withDefaults(props.schema, newValue)
    if (!props.live) localData.value = clone(initialData.value)
  },
  { deep: true }
)

function handleFieldChange(path, value) {
  localData.value = writeAt(localData.value, path, value)
  emit('change', clone(localData.value), path, value)

  if (props.live) {
    emit('update:modelValue', clone(localData.value))
  }
}

function save() {
  const value = clone(localData.value)
  emit('update:modelValue', value)
  emit('save', value)
}

function cancel() {
  localData.value = clone(initialData.value)
  emit('cancel', clone(initialData.value))
}

function reset() {
  localData.value = clone(initialData.value)
  emit('reset', clone(localData.value))
  if (props.live) emit('update:modelValue', clone(localData.value))
}

function clear() {
  localData.value = {}
  emit('clear', {})
  if (props.live) emit('update:modelValue', {})
}

defineExpose({ save, cancel, reset, clear, value: localData })
</script>

<template>
  <form class="zn-data-form" @submit.prevent="save">
    <ZnRow direction="column" padding="0" gap="8px">
      <ZnDataSection
        v-for="(section, index) in sections"
        :key="index"
        :section="section"
        :model-value="localData"
        :variant="formVariant"
        :size="formSize"
        @change="handleFieldChange"
      />
    </ZnRow>

    <footer v-if="showActions">
      <ZnRow
        class="zn-form-actions"
        padding="16px 0"
        gap="12px"
        justify="space-between"
        align="center"
        wrap
      >
        <ZnRow padding="0" gap="8px">
          <ZnButton variant="text" type="button" @click="clear">{{ clearLabel }}</ZnButton>
          <ZnButton variant="text" type="button" @click="reset">{{ resetLabel }}</ZnButton>
        </ZnRow>
        <ZnRow padding="0" gap="8px">
          <ZnButton variant="outlined" type="button" @click="cancel">{{ cancelLabel }}</ZnButton>
          <ZnButton variant="filled" type="submit">{{ saveLabel }}</ZnButton>
        </ZnRow>
      </ZnRow>
    </footer>
  </form>
</template>

<style scoped>
.zn-data-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Roboto', sans-serif;
}

.zn-form-actions {
  border-top: 1px solid var(--md-outline);
  margin-top: 8px;
}
</style>
