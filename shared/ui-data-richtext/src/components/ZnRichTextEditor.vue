<template>
  <ZnFieldShell
    class="zn-richtext"
    :label="label"
    :hint="hint"
    :error="error"
    :disabled="disabled"
    :focused="focused"
    :filled="hasContent"
    :required="required"
    :variant="variant"
    :size="size"
    float-label
  >
    <div class="zn-richtext__inner">
      <ZnRow
        v-if="!readonly && !disabled"
        class="zn-richtext__toolbar"
        padding="0"
        gap="0"
        wrap
        role="toolbar"
        :aria-label="toolbarLabel"
      >
        <ZnButton
          v-for="action in inlineActions"
          :key="action.command"
          variant="text"
          icon-only
          :aria-label="action.label"
          :title="action.label"
          @mousedown.prevent="exec(action.command)"
        >
          <span class="zn-richtext__glyph">{{ action.glyph }}</span>
        </ZnButton>

        <span class="zn-richtext__separator" aria-hidden="true" />

        <ZnButton
          v-for="action in headingActions"
          :key="action.tag"
          variant="text"
          icon-only
          :aria-label="action.label"
          :title="action.label"
          @mousedown.prevent="formatBlock(action.tag)"
        >
          <span class="zn-richtext__glyph">{{ action.glyph }}</span>
        </ZnButton>

        <span class="zn-richtext__separator" aria-hidden="true" />

        <ZnButton
          v-for="action in alignActions"
          :key="action.command"
          variant="text"
          icon-only
          :aria-label="action.label"
          :title="action.label"
          @mousedown.prevent="exec(action.command)"
        >
          <span class="zn-richtext__glyph">{{ action.glyph }}</span>
        </ZnButton>

        <span class="zn-richtext__separator" aria-hidden="true" />

        <ZnButton
          variant="text"
          icon-only
          aria-label="Insertar tabla"
          title="Insertar tabla 2×2"
          @mousedown.prevent="insertTable"
        >
          <span class="zn-richtext__glyph">▦</span>
        </ZnButton>

        <ZnButton variant="tonal" class="zn-richtext__source-toggle" @click="toggleSource">
          {{ sourceMode ? viewLabel : markdownLabel }}
        </ZnButton>
      </ZnRow>

      <textarea
        v-if="sourceMode"
        v-model="source"
        class="zn-richtext__source"
        :disabled="disabled"
        :readonly="readonly"
        :aria-label="markdownLabel"
        spellcheck="false"
        style="min-height: 148px"
      />

      <div
        v-else
        ref="editorRef"
        class="zn-richtext__canvas"
        role="textbox"
        aria-multiline="true"
        :aria-label="label || 'Editor de texto enriquecido'"
        :aria-invalid="error ? 'true' : 'false'"
        :data-placeholder="placeholder"
        :aria-readonly="readonly ? 'true' : undefined"
        :contenteditable="readonly ? 'false' : 'true'"
        @input="syncFromDom"
        @focusin="focused = true"
        @focusout="focused = false"
      />
    </div>
  </ZnFieldShell>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ZnButton, ZnFieldShell, ZnRow } from '@zn-apps/ui-core'
import { htmlToMarkdown, markdownToHtml } from '../markdown.js'

const props = defineProps({
  /** Valor en Markdown. El contenido visual se deriva de este string. */
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: 'Escribe aquí…' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  toolbarLabel: { type: String, default: 'Formato de texto' },
  markdownLabel: { type: String, default: 'Markdown' },
  viewLabel: { type: String, default: 'Vista' }
})

const emit = defineEmits(['update:modelValue'])

const editorRef = ref(null)
const focused = ref(false)
const sourceMode = ref(false)
const source = ref(props.modelValue || '')
const lastEmitted = ref('')

const inlineActions = [
  { command: 'bold', glyph: 'B', label: 'Negrita' },
  { command: 'italic', glyph: 'I', label: 'Cursiva' },
  { command: 'underline', glyph: 'U', label: 'Subrayado' },
  { command: 'strikeThrough', glyph: 'S', label: 'Tachado' }
]

const headingActions = [
  { tag: 'h1', glyph: 'H1', label: 'Encabezado 1' },
  { tag: 'h2', glyph: 'H2', label: 'Encabezado 2' },
  { tag: 'h3', glyph: 'H3', label: 'Encabezado 3' },
  { tag: 'p', glyph: '¶', label: 'Párrafo' }
]

const alignActions = [
  { command: 'justifyLeft', glyph: 'L', label: 'Alinear a la izquierda' },
  { command: 'justifyCenter', glyph: 'C', label: 'Centrar' },
  { command: 'justifyRight', glyph: 'R', label: 'Alinear a la derecha' }
]

const TABLE_HTML = [
  '<table><thead><tr><th>Encabezado</th><th>Encabezado</th></tr></thead>',
  '<tbody><tr><td>Celda</td><td>Celda</td></tr>',
  '<tr><td>Celda</td><td>Celda</td></tr></tbody></table><p><br></p>'
].join('')

const hasContent = computed(() => String(props.modelValue || '').trim().length > 0)

function renderHtml(value = props.modelValue || '') {
  if (!editorRef.value) return
  editorRef.value.innerHTML = markdownToHtml(value)
}

onMounted(() => renderHtml())

watch(
  () => props.modelValue,
  (value) => {
    const next = value || ''
    if (sourceMode.value) {
      source.value = next
      return
    }
    if (next === lastEmitted.value) return
    lastEmitted.value = next
    renderHtml(next)
  }
)

watch(source, (value) => {
  if (!sourceMode.value) return
  lastEmitted.value = value
  emit('update:modelValue', value)
})

function exec(command, value = null) {
  if (props.disabled || props.readonly) return
  editorRef.value?.focus()
  document.execCommand(command, false, value)
  syncFromDom()
}

function formatBlock(tag) {
  exec('formatBlock', `<${tag}>`)
}

function insertTable() {
  exec('insertHTML', TABLE_HTML)
}

function syncFromDom() {
  if (!editorRef.value) return
  const markdown = htmlToMarkdown(editorRef.value.innerHTML)
  lastEmitted.value = markdown
  emit('update:modelValue', markdown)
}

function toggleSource() {
  if (sourceMode.value) {
    sourceMode.value = false
    lastEmitted.value = source.value
    nextTick(() => renderHtml(source.value))
    return
  }

  source.value = props.modelValue || ''
  sourceMode.value = true
}

defineExpose({
  focus: () => editorRef.value?.focus(),
  editorRef,
  toggleSource
})
</script>

<style scoped>
.zn-richtext :deep(.zn-field__content) {
  align-items: stretch;
  padding-top: 8px;
  padding-bottom: 8px;
}

.zn-richtext__inner {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
}

.zn-richtext__toolbar {
  align-items: center;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--md-outline);
}

.zn-richtext__toolbar :deep(.zn-button) {
  min-height: 32px;
  height: 32px;
  color: var(--md-on-surface-variant);
}

.zn-richtext__toolbar :deep(.zn-button--icon-only) {
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
}

.zn-richtext__source-toggle {
  margin-left: auto;
}

.zn-richtext__glyph {
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
}

.zn-richtext__separator {
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background-color: var(--md-outline);
}

.zn-richtext__canvas {
  min-height: 148px;
  padding: 4px 0;
  outline: none;
  color: var(--md-on-background);
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.zn-richtext__canvas:empty::before {
  content: attr(data-placeholder);
  color: var(--md-on-surface-variant);
  opacity: 0.7;
  pointer-events: none;
}

.zn-richtext :deep(textarea.zn-richtext__source) {
  min-height: 148px;
  padding: 4px 0;
  font-family: monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  resize: vertical;
}

/* Tipografía del documento (el HTML lo genera el conversor Markdown). */
.zn-richtext__canvas :deep(h1) {
  margin: 12px 0 8px;
  font-size: 1.75rem;
  font-weight: 500;
  line-height: 1.25;
}

.zn-richtext__canvas :deep(h2) {
  margin: 12px 0 8px;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.3;
}

.zn-richtext__canvas :deep(h3) {
  margin: 12px 0 8px;
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.35;
}

.zn-richtext__canvas :deep(h4),
.zn-richtext__canvas :deep(h5),
.zn-richtext__canvas :deep(h6) {
  margin: 12px 0 8px;
  font-size: 1rem;
  font-weight: 500;
}

.zn-richtext__canvas :deep(p) {
  margin: 0 0 8px;
}

.zn-richtext__canvas :deep(ul),
.zn-richtext__canvas :deep(ol) {
  margin: 0 0 8px;
  padding-left: 24px;
}

.zn-richtext__canvas :deep(blockquote) {
  margin: 8px 0;
  padding-left: 12px;
  border-left: 3px solid var(--md-outline);
  color: var(--md-on-surface-variant);
}

.zn-richtext__canvas :deep(code) {
  padding: 1px 4px;
  border-radius: 4px;
  background-color: var(--md-surface-variant);
  font-family: monospace;
  font-size: 0.875em;
}

.zn-richtext__canvas :deep(pre) {
  margin: 8px 0;
  padding: 12px;
  overflow-x: auto;
  border-radius: 8px;
  background-color: var(--md-surface-container-low);
}

.zn-richtext__canvas :deep(pre code) {
  padding: 0;
  background: transparent;
}

.zn-richtext__canvas :deep(table) {
  width: 100%;
  margin: 8px 0;
  border-collapse: collapse;
}

.zn-richtext__canvas :deep(th),
.zn-richtext__canvas :deep(td) {
  padding: 6px 8px;
  border: 1px solid var(--md-outline);
  text-align: left;
  vertical-align: top;
}

.zn-richtext__canvas :deep(th) {
  background-color: var(--md-surface-variant);
  font-weight: 500;
}

.zn-richtext__canvas :deep(a) {
  color: var(--md-primary);
}
</style>
