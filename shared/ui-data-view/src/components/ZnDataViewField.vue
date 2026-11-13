<script setup>
import { computed } from 'vue'
import { LabelPositions, formatFieldValue } from '@zn-apps/ui-data-core'

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object, Array],
    default: null
  },
  field: {
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

const inline = computed(() => props.labelPosition === LabelPositions.INLINE)

const formattedValue = computed(() =>
  formatFieldValue(props.field, props.modelValue, {
    emptyText: props.emptyText,
    trueText: props.trueText,
    falseText: props.falseText
  })
)
</script>

<template>
  <div
    v-if="!field.hidden"
    class="zn-view-field"
    :class="{ 'zn-view-field--inline': inline }"
  >
    <span class="zn-field-label">{{ field.label }}</span>
    <span class="zn-field-value">{{ formattedValue }}</span>
    <span v-if="field.description" class="zn-field-description">{{ field.description }}</span>
  </div>
</template>

<style scoped>
.zn-view-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.zn-view-field--inline {
  flex-direction: row;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
}

.zn-field-label {
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.4;
}

.zn-view-field--inline .zn-field-label {
  flex: 0 0 auto;
  font-size: 0.875rem;
}

.zn-field-value {
  color: var(--md-on-background);
  font-size: 1rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.zn-field-description {
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  line-height: 1.4;
}
</style>
