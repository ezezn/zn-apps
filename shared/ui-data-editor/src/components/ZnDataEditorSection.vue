<script setup>
import { computed } from 'vue'
import { ZnIcon, ZnSection } from '@zn-apps/ui-core'
import { LabelPositions, readAt, sectionColumns } from '@zn-apps/ui-data-core'
import ZnDataEditorField from './ZnDataEditorField.vue'

const props = defineProps({
  section: {
    type: Object,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  labelPosition: {
    type: String,
    default: LabelPositions.TOP
  },
  emptyText: { type: String, default: '—' },
  trueText: { type: String, default: 'Yes' },
  falseText: { type: String, default: 'No' }
})

const emit = defineEmits(['change'])

const columns = computed(() => sectionColumns(props.section))
const expanded = computed(() => props.section.expanded !== false)
const fields = computed(() => (Array.isArray(props.section.fields) ? props.section.fields : []))

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
      <span class="zn-data-section-title">
        <ZnIcon v-if="section.icon" :name="section.icon" :size="20" class="zn-data-section-icon" />
        <span v-if="section.title">{{ section.title }}</span>
      </span>
    </template>

    <ZnDataEditorField
      v-for="field in fields"
      :key="field.path"
      :field="field"
      :model-value="readAt(modelValue, field.path)"
      :label-position="field.labelPosition || labelPosition"
      :empty-text="emptyText"
      :true-text="trueText"
      :false-text="falseText"
      @update:model-value="(value) => updateFieldValue(field.path, value)"
    />
  </ZnSection>
</template>

<style scoped>
.zn-data-section-title {
  display: flex;
  align-items: center;
  gap: 8px;
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
