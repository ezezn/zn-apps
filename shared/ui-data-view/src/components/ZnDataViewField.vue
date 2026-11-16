<script setup>
import { computed } from 'vue'
import { ZnButton, ZnChip, ZnIcon, ZnRow } from '@zn-apps/ui-core'
import { ZnRichTextView } from '@zn-apps/ui-data-richtext'
import {
  FieldTypes,
  LabelPositions,
  fieldSpan,
  formatFieldValue,
  normalizeInputSize,
  optionLabel
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
  labelPosition: {
    type: String,
    default: LabelPositions.TOP
  },
  emptyText: { type: String, default: '—' },
  trueText: { type: String, default: 'Yes' },
  falseText: { type: String, default: 'No' },
  /** Escala heredada; `field.size` tiene prioridad. */
  size: { type: String, default: '' },
  /** Columnas efectivas de la sección para limitar `field.span`. */
  columns: { type: [Number, String], default: 1 }
})

const inline = computed(() => props.labelPosition === LabelPositions.INLINE)
const fieldSize = computed(() => normalizeInputSize(props.field.size ?? props.size))
const sizeClass = computed(() => `zn-view-field--${fieldSize.value}`)
const span = computed(() => fieldSpan(props.field, props.columns))
const spanClass = computed(() => (span.value > 1 ? `zn-span-${span.value}` : null))

/** Multiselect y listas se presentan como un conjunto de chips MD3. */
const isList = computed(
  () =>
    props.field.type === FieldTypes.MULTI_SELECT ||
    props.field.type === FieldTypes.LIST ||
    Array.isArray(props.modelValue)
)

const chipValues = computed(() => {
  if (!Array.isArray(props.modelValue)) return []
  return props.field.type === FieldTypes.MULTI_SELECT
    ? props.modelValue.map((value) => optionLabel(props.field.options, value))
    : props.modelValue.map((value) => String(value))
})

const hasChips = computed(() => isList.value && chipValues.value.length > 0)
const isRichText = computed(
  () => props.field.type === FieldTypes.RICHTEXT && String(props.modelValue ?? '').trim().length > 0
)
const isFile = computed(
  () => props.field.type === FieldTypes.FILE && props.modelValue != null && props.modelValue !== ''
)

const fileData = computed(() => {
  if (!isFile.value) return null
  if (typeof props.modelValue === 'object') {
    return {
      name: props.modelValue.name || 'Archivo',
      url: props.modelValue.url || props.modelValue.href || ''
    }
  }
  return {
    name: String(props.modelValue),
    url: String(props.modelValue)
  }
})

function downloadFile() {
  if (!fileData.value) return
  const link = document.createElement('a')
  link.href = fileData.value.url || '#'
  link.download = fileData.value.name
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

function viewFile() {
  if (!fileData.value?.url) return
  window.open(fileData.value.url, '_blank')
}

const formattedValue = computed(() =>
  formatFieldValue(props.field, props.modelValue, {
    emptyText: props.emptyText,
    trueText: props.trueText,
    falseText: props.falseText
  })
)
</script>

<template>
  <ZnRow
    v-if="!field.hidden"
    padding="0"
    :gap="inline ? '8px' : '4px'"
    :direction="inline ? 'row' : 'column'"
    :align="inline ? 'baseline' : 'stretch'"
    :wrap="inline"
    :class="['zn-view-field', sizeClass, spanClass, { 'zn-view-field--inline': inline }]"
  >
    <span class="zn-field-label">{{ field.label }}</span>
    <ZnRichTextView
      v-if="isRichText"
      class="zn-field-rich"
      :model-value="String(modelValue)"
      :size="fieldSize"
    />
    <ZnRow
      v-else-if="isFile"
      padding="0"
      gap="8px"
      align="center"
      class="zn-field-file"
    >
      <ZnIcon name="insert_drive_file" :size="20" class="zn-file-icon" />
      <span class="zn-field-value zn-file-name" :title="fileData?.name">{{ fileData?.name }}</span>
      <ZnButton
        v-if="fileData?.url"
        variant="text"
        icon-only
        aria-label="Ver archivo"
        title="Ver archivo"
        @click.stop="viewFile"
      >
        <ZnIcon name="visibility" :size="18" />
      </ZnButton>
      <ZnButton
        v-if="fileData?.url"
        variant="text"
        icon-only
        aria-label="Descargar archivo"
        title="Descargar archivo"
        @click.stop="downloadFile"
      >
        <ZnIcon name="download" :size="18" />
      </ZnButton>
    </ZnRow>
    <span v-else-if="!hasChips" class="zn-field-value">{{ formattedValue }}</span>
    <ZnRow v-else padding="0" gap="4px" wrap class="zn-field-chips">
      <ZnChip
        v-for="(value, index) in chipValues"
        :key="`${value}-${index}`"
        variant="input"
        :label="value"
        :size="fieldSize"
      />
    </ZnRow>
    <span v-if="field.description" class="zn-field-description">{{ field.description }}</span>
  </ZnRow>
</template>

<style scoped>
.zn-view-field {
  min-width: 0;
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

.zn-field-rich {
  min-width: 0;
}

.zn-field-chips {
  min-width: 0;
}

.zn-field-description {
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  line-height: 1.4;
}

/* Escala de presentación alineada con los tamaños MD3 de los inputs. */
.zn-view-field--small .zn-field-label {
  font-size: 0.6875rem;
}

.zn-view-field--small .zn-field-value {
  font-size: 0.875rem;
}

.zn-view-field--large .zn-field-label {
  font-size: 0.8125rem;
}

.zn-view-field--large .zn-field-value {
  font-size: 1.125rem;
}

.zn-view-field--medium .zn-field-label {
  font-size: 0.75rem;
}

.zn-view-field--medium .zn-field-value {
  font-size: 1rem;
}

.zn-view-field--inline.zn-view-field--small .zn-field-label {
  font-size: 0.8125rem;
}

.zn-view-field--inline.zn-view-field--medium .zn-field-label {
  font-size: 0.875rem;
}

.zn-view-field--inline.zn-view-field--large .zn-field-label {
  font-size: 0.9375rem;
}
</style>
