<script setup>
import { computed, ref, watch } from 'vue'
import { ZnButton } from '@zn-apps/ui-core'
import { clone, schemaSections, withDefaults, writeAt } from '@zn-apps/ui-data-core'
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
  clearLabel: { type: String, default: 'Clear' }
})

const emit = defineEmits(['update:modelValue', 'save', 'cancel', 'reset', 'clear', 'change'])

/** Instantánea del valor inicial + defaults del esquema: destino de Reset/Cancel. */
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
  <form class="zn-data-form" @submit.prevent="save">
    <div class="zn-form-content">
      <ZnDataSection
        v-for="(section, index) in sections"
        :key="index"
        :section="section"
        :model-value="localData"
        @change="handleFieldChange"
      />
    </div>

    <footer v-if="showActions" class="zn-form-actions">
      <div class="zn-secondary-actions">
        <ZnButton variant="text" type="button" @click="clear">{{ clearLabel }}</ZnButton>
        <ZnButton variant="text" type="button" @click="reset">{{ resetLabel }}</ZnButton>
      </div>
      <div class="zn-primary-actions">
        <ZnButton variant="outlined" type="button" @click="cancel">{{ cancelLabel }}</ZnButton>
        <ZnButton variant="filled" type="submit">{{ saveLabel }}</ZnButton>
      </div>
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

.zn-form-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.zn-form-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid var(--md-outline);
  margin-top: 8px;
}

.zn-primary-actions,
.zn-secondary-actions {
  display: flex;
  gap: 8px;
}
</style>
