<script setup>
import { computed } from 'vue'
import { ZnIcon, ZnRow, ZnSection } from '@zn-apps/ui-core'
import {
  normalizeInputSize,
  normalizeInputVariant,
  readAt,
  sectionColumns
} from '@zn-apps/ui-data-core'
import ZnDataField from './ZnDataField.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  /** Variante heredada del formulario; `section.variant` tiene prioridad. */
  variant: { type: String, default: '' },
  /** Tamaño heredado del formulario; `section.size` tiene prioridad. */
  size: { type: String, default: '' }
})

const emit = defineEmits(['change'])

const columns = computed(() => sectionColumns(props.section))
const expanded = computed(() => props.section.expanded !== false)
const fields = computed(() => (Array.isArray(props.section.fields) ? props.section.fields : []))
const sectionVariant = computed(() => normalizeInputVariant(props.section.variant ?? props.variant))
const sectionSize = computed(() => normalizeInputSize(props.section.size ?? props.size))

function updateFieldValue(path, value) {
  emit('change', path, value)
}
</script>

<template>
  <ZnSection
    :collapsible="Boolean(section.collapsible)"
    :expanded="expanded"
    :columns="columns"
  >
    <template v-if="section.title || section.icon" #title>
      <ZnRow class="zn-data-section-title" padding="0" gap="8px">
        <ZnIcon v-if="section.icon" :name="section.icon" :size="20" class="zn-data-section-icon" />
        <span v-if="section.title">{{ section.title }}</span>
      </ZnRow>
    </template>

    <ZnDataField
      v-for="field in fields"
      :key="field.path"
      :field="field"
      :model-value="readAt(modelValue, field.path)"
      :variant="sectionVariant"
      :size="sectionSize"
      :columns="columns"
      @update:model-value="(value) => updateFieldValue(field.path, value)"
    />
  </ZnSection>
</template>

<style scoped>
.zn-data-section-title {
  color: var(--md-on-background);
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 28px;
}

.zn-data-section-icon {
  flex: 0 0 auto;
  color: var(--md-primary);
}
</style>
