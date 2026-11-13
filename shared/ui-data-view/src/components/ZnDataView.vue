<script setup>
import { computed } from 'vue'
import { LabelPositions, schemaSections } from '@zn-apps/ui-data-core'
import ZnDataViewSection from './ZnDataViewSection.vue'

const props = defineProps({
  /** Objeto JSON con los datos a presentar. */
  modelValue: {
    type: Object,
    default: () => ({})
  },
  /** Definición de las secciones y campos. */
  schema: {
    type: Object,
    required: true
  },
  /** `top` (etiqueta encima) o `inline` (etiqueta y valor en la misma línea). */
  labelPosition: {
    type: String,
    default: LabelPositions.TOP,
    validator: (value) => Object.values(LabelPositions).includes(value)
  },
  emptyText: { type: String, default: '—' },
  trueText: { type: String, default: 'Yes' },
  falseText: { type: String, default: 'No' }
})

const sections = computed(() => schemaSections(props.schema))
</script>

<template>
  <div class="zn-data-view">
    <ZnDataViewSection
      v-for="(section, index) in sections"
      :key="index"
      :section="section"
      :model-value="modelValue"
      :label-position="labelPosition"
      :empty-text="emptyText"
      :true-text="trueText"
      :false-text="falseText"
    />
  </div>
</template>

<style scoped>
.zn-data-view {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
}
</style>
