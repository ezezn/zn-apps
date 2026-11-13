<script setup>
import { computed, ref, watch } from 'vue'
import {
  LabelPositions,
  clone,
  schemaSections,
  withDefaults,
  writeAt
} from '@zn-apps/ui-data-core'
import ZnDataEditorSection from './ZnDataEditorSection.vue'

const props = defineProps({
  /** Objeto JSON con los datos. */
  modelValue: {
    type: Object,
    default: () => ({})
  },
  /** Misma definición de secciones/campos que `ZnDataForm`. */
  schema: {
    type: Object,
    required: true
  },
  /**
   * Con `true` (por defecto) cada edición confirma el valor y emite
   * `update:modelValue`. Con `false` sólo se emite `change` y el consumidor
   * puede confirmar/descartar usando los métodos expuestos.
   */
  live: {
    type: Boolean,
    default: true
  },
  labelPosition: {
    type: String,
    default: LabelPositions.TOP,
    validator: (value) => Object.values(LabelPositions).includes(value)
  },
  emptyText: { type: String, default: '—' },
  trueText: { type: String, default: 'Yes' },
  falseText: { type: String, default: 'No' }
})

const emit = defineEmits(['update:modelValue', 'change', 'save', 'cancel', 'reset', 'clear'])

const initialData = ref(withDefaults(props.schema, props.modelValue))
const localData = ref(clone(initialData.value))

const sections = computed(() => schemaSections(props.schema))

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
  <div class="zn-data-editor">
    <ZnDataEditorSection
      v-for="(section, index) in sections"
      :key="index"
      :section="section"
      :model-value="localData"
      :label-position="labelPosition"
      :empty-text="emptyText"
      :true-text="trueText"
      :false-text="falseText"
      @change="handleFieldChange"
    />
  </div>
</template>

<style scoped>
.zn-data-editor {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
}
</style>
