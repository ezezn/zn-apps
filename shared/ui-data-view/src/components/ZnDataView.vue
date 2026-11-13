<script setup>
import { computed } from 'vue'
import { ZnRow } from '@zn-apps/ui-core'
import {
  LabelPositions,
  normalizeInputSize,
  schemaSections
} from '@zn-apps/ui-data-core'
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
  falseText: { type: String, default: 'No' },
  /** Escala de presentación MD3; `section.size` y `field.size` la sobrescriben. */
  size: {
    type: String,
    default: '',
    validator: (value) => ['', 'small', 'medium', 'large'].includes(value)
  }
})

const sections = computed(() => schemaSections(props.schema))
const viewSize = computed(() => normalizeInputSize(props.schema?.size ?? props.size))
</script>

<template>
  <ZnRow direction="column" padding="0" gap="8px" class="zn-data-view">
    <ZnDataViewSection
      v-for="(section, index) in sections"
      :key="index"
      :section="section"
      :model-value="modelValue"
      :label-position="labelPosition"
      :empty-text="emptyText"
      :true-text="trueText"
      :false-text="falseText"
      :size="viewSize"
    />
  </ZnRow>
</template>

<style scoped>
.zn-data-view {
  font-family: 'Roboto', sans-serif;
}
</style>
