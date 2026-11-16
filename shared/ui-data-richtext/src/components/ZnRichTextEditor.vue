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
      <div
        v-if="!readonly && !disabled"
        class="zn-richtext__toolbar"
        role="toolbar"
        :aria-label="toolbarLabel"
      >
        <!-- Grupo de formato inline -->
        <ZnButtonGroup density="small" variant="outlined">
          <ZnButton
            v-for="action in inlineActions"
            :key="action.command"
            icon-only
            :aria-label="action.label"
            :title="action.label"
            @mousedown.prevent="exec(action.command)"
          >
            <ZnIcon :name="action.icon" :size="18" />
          </ZnButton>
        </ZnButtonGroup>

        <!-- Grupo de encabezados / párrafo -->
        <ZnButtonGroup density="small" variant="outlined">
          <ZnButton
            v-for="action in headingActions"
            :key="action.tag"
            icon-only
            :aria-label="action.label"
            :title="action.label"
            @mousedown.prevent="formatBlock(action.tag)"
          >
            <span class="zn-richtext__heading-glyph">{{ action.glyph }}</span>
          </ZnButton>
        </ZnButtonGroup>

        <!-- Grupo de alineación -->
        <ZnButtonGroup density="small" variant="outlined">
          <ZnButton
            v-for="action in alignActions"
            :key="action.command"
            icon-only
            :aria-label="action.label"
            :title="action.label"
            @mousedown.prevent="exec(action.command)"
          >
            <ZnIcon :name="action.icon" :size="18" />
          </ZnButton>
        </ZnButtonGroup>

        <!-- Grupo de inserciones especiales (Tabla, Imagen, Enlace) -->
        <ZnButtonGroup density="small" variant="outlined">
          <!-- Botón de Tabla -->
          <ZnButton
            icon-only
            aria-label="Insertar o modificar tabla"
            title="Tabla"
            :class="{ 'zn-richtext__active-btn': isInsideTable }"
            @mousedown.prevent="openTableDialog"
          >
            <ZnIcon name="table_view" :size="18" />
          </ZnButton>

          <!-- Botón de Imagen -->
          <ZnButton
            icon-only
            aria-label="Insertar imagen"
            title="Insertar imagen"
            @mousedown.prevent="openImageDialog"
          >
            <ZnIcon name="image" :size="18" />
          </ZnButton>

          <!-- Botón de Enlace -->
          <ZnButton
            icon-only
            aria-label="Insertar enlace"
            title="Insertar enlace"
            @mousedown.prevent="openLinkDialog"
          >
            <ZnIcon name="link" :size="18" />
          </ZnButton>
        </ZnButtonGroup>

        <!-- Alternar Vista / Markdown -->
        <ZnButton
          variant="tonal"
          class="zn-richtext__source-toggle"
          @click="toggleSource"
        >
          <template #icon>
            <ZnIcon :name="sourceMode ? 'visibility' : 'code'" :size="18" />
          </template>
          {{ sourceMode ? viewLabel : markdownLabel }}
        </ZnButton>
      </div>

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
        @focusout="onEditorFocusOut"
        @keyup="checkTableContext"
        @mouseup="checkTableContext"
      />
    </div>

    <!-- Diálogo de Tabla -->
    <ZnDialog
      v-model="showTableDialog"
      :title="isInsideTable ? 'Editar tabla' : 'Insertar tabla'"
      max-width="440px"
      @close="closeTableDialog"
    >
      <div v-if="!isInsideTable" class="zn-dialog-form">
        <p class="zn-dialog-description">Especifica el número de filas y columnas para la nueva tabla.</p>
        <div class="zn-dialog-row">
          <label class="zn-dialog-field">
            <span>Filas:</span>
            <input v-model.number="tableRows" type="number" min="1" max="20" class="zn-dialog-input" />
          </label>
          <label class="zn-dialog-field">
            <span>Columnas:</span>
            <input v-model.number="tableCols" type="number" min="1" max="20" class="zn-dialog-input" />
          </label>
        </div>
      </div>
      <div v-else class="zn-table-operations">
        <p class="zn-dialog-description">Acciones disponibles para la tabla actual:</p>
        <div class="zn-table-operations__grid">
          <ZnButton variant="outlined" @click="insertTableRowAbove">
            <template #icon><ZnIcon name="add" :size="18" /></template>
            Fila arriba
          </ZnButton>
          <ZnButton variant="outlined" @click="insertTableRowBelow">
            <template #icon><ZnIcon name="add" :size="18" /></template>
            Fila abajo
          </ZnButton>
          <ZnButton variant="outlined" @click="insertTableColBefore">
            <template #icon><ZnIcon name="add" :size="18" /></template>
            Columna antes
          </ZnButton>
          <ZnButton variant="outlined" @click="insertTableColAfter">
            <template #icon><ZnIcon name="add" :size="18" /></template>
            Columna después
          </ZnButton>
          <ZnButton variant="tonal" class="zn-btn--danger" @click="deleteTableCol">
            <template #icon><ZnIcon name="delete" :size="18" /></template>
            Eliminar columna
          </ZnButton>
        </div>
      </div>
      <template #actions>
        <ZnButton variant="text" @click="closeTableDialog">Cancelar</ZnButton>
        <ZnButton v-if="!isInsideTable" variant="filled" @click="insertCustomTable">Insertar</ZnButton>
      </template>
    </ZnDialog>

    <!-- Diálogo de Imagen -->
    <ZnDialog
      v-model="showImageDialog"
      title="Insertar imagen"
      max-width="460px"
      @close="closeImageDialog"
    >
      <div class="zn-dialog-form">
        <p class="zn-dialog-description">Elige un archivo de imagen o arrástralo directamente a esta área.</p>
        <div
          class="zn-richtext__dropzone"
          :class="{ 'zn-richtext__dropzone--active': isDraggingFile }"
          @dragover.prevent="isDraggingFile = true"
          @dragleave.prevent="isDraggingFile = false"
          @drop.prevent="onImageDrop"
          @click="triggerImageSelect"
        >
          <ZnIcon name="upload_file" :size="36" />
          <span class="zn-richtext__dropzone-text">Arrastra una imagen o haz clic para seleccionarla</span>
          <span v-if="selectedImageName" class="zn-richtext__dropzone-file">
            {{ selectedImageName }}
          </span>
          <input
            ref="imageInputRef"
            type="file"
            accept="image/*"
            class="zn-hidden-file-input"
            @change="onImageSelected"
          />
        </div>
      </div>
      <template #actions>
        <ZnButton variant="text" @click="closeImageDialog">Cancelar</ZnButton>
        <ZnButton variant="filled" :disabled="!pendingImageData" @click="confirmImageInsert">
          Insertar
        </ZnButton>
      </template>
    </ZnDialog>

    <!-- Diálogo de Enlace -->
    <ZnDialog
      v-model="showLinkDialog"
      :title="editingAnchor ? 'Editar enlace' : 'Crear enlace'"
      max-width="440px"
      @close="closeLinkDialog"
    >
      <div class="zn-dialog-form">
        <label class="zn-dialog-field">
          <span>Texto del enlace:</span>
          <input
            v-model="linkText"
            type="text"
            placeholder="Texto a mostrar"
            class="zn-dialog-input"
          />
        </label>
        <label class="zn-dialog-field">
          <span>URL:</span>
          <input
            v-model="linkUrl"
            type="text"
            placeholder="https://ejemplo.com"
            class="zn-dialog-input"
            @blur="normalizeLinkUrlField"
          />
          <span v-if="linkUrlError" class="zn-dialog-error">{{ linkUrlError }}</span>
        </label>
      </div>
      <template #actions>
        <ZnButton variant="text" @click="closeLinkDialog">Cancelar</ZnButton>
        <ZnButton variant="filled" :disabled="!canInsertLink" @click="confirmLinkInsert">
          {{ editingAnchor ? 'Guardar' : 'Insertar' }}
        </ZnButton>
      </template>
    </ZnDialog>
  </ZnFieldShell>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ZnButton, ZnButtonGroup, ZnDialog, ZnFieldShell, ZnIcon } from '@zn-apps/ui-core'
import { htmlToMarkdown, markdownToHtml } from '../markdown.js'

const props = defineProps({
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

// Formatting actions
const inlineActions = [
  { command: 'bold', icon: 'format_bold', label: 'Negrita' },
  { command: 'italic', icon: 'format_italic', label: 'Cursiva' },
  { command: 'underline', icon: 'format_underlined', label: 'Subrayado' },
  { command: 'strikeThrough', icon: 'format_strikethrough', label: 'Tachado' }
]

const headingActions = [
  { tag: 'h1', glyph: 'H1', label: 'Encabezado 1' },
  { tag: 'h2', glyph: 'H2', label: 'Encabezado 2' },
  { tag: 'h3', glyph: 'H3', label: 'Encabezado 3' },
  { tag: 'p', glyph: '¶', label: 'Párrafo' }
]

const alignActions = [
  { command: 'justifyLeft', icon: 'format_align_left', label: 'Alinear a la izquierda' },
  { command: 'justifyCenter', icon: 'format_align_center', label: 'Centrar' },
  { command: 'justifyRight', icon: 'format_align_right', label: 'Alinear a la derecha' }
]

// Table Dialog State
const showTableDialog = ref(false)
const isInsideTable = ref(false)
const currentCell = ref(null)
const tableRows = ref(2)
const tableCols = ref(2)

// Image Dialog State
const showImageDialog = ref(false)
const isDraggingFile = ref(false)
const imageInputRef = ref(null)
const selectedImageName = ref('')
const pendingImageData = ref('')

// Link Dialog State
const showLinkDialog = ref(false)
const linkText = ref('')
const linkUrl = ref('')
const savedRange = ref(null)
/** Enlace existente bajo el cursor/selección que se está editando. */
const editingAnchor = ref(null)

const hasContent = computed(() => String(props.modelValue || '').trim().length > 0)
const normalizedLinkUrl = computed(() => normalizeUrl(linkUrl.value))
const linkUrlError = computed(() => {
  if (!linkUrl.value.trim()) return ''
  return isValidUrl(normalizedLinkUrl.value) ? '' : 'Introduce una URL válida'
})
const canInsertLink = computed(
  () => Boolean(linkText.value.trim()) && isValidUrl(normalizedLinkUrl.value)
)

function renderHtml(value = props.modelValue || '') {
  if (!editorRef.value) return
  editorRef.value.innerHTML = markdownToHtml(value)
}

onMounted(() => {
  renderHtml()
})

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

function onEditorFocusOut() {
  focused.value = false
  saveSelection()
}

function saveSelection() {
  const sel = window.getSelection()
  if (!sel || sel.rangeCount === 0 || !editorRef.value) return
  const range = sel.getRangeAt(0)
  // Sólo guardamos selecciones dentro del editor: al abrir un diálogo el foco
  // pasa a sus inputs y no queremos perder el caret del documento.
  if (!editorRef.value.contains(range.commonAncestorContainer)) return
  savedRange.value = range.cloneRange()
}

function restoreSelection() {
  const range = savedRange.value
  if (!range || !editorRef.value) return
  if (!editorRef.value.contains(range.commonAncestorContainer)) return
  const sel = window.getSelection()
  if (!sel) return
  sel.removeAllRanges()
  sel.addRange(range)
}

function exec(command, value = null) {
  if (props.disabled || props.readonly) return
  editorRef.value?.focus()
  restoreSelection()
  document.execCommand(command, false, value)
  syncFromDom()
  checkTableContext()
}

function formatBlock(tag) {
  exec('formatBlock', `<${tag}>`)
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

/* ---------------- Table Management ---------------- */
function checkTableContext() {
  const sel = window.getSelection()
  if (!sel || !sel.anchorNode) {
    isInsideTable.value = false
    currentCell.value = null
    return
  }
  let node = sel.anchorNode
  if (node.nodeType === 3) node = node.parentElement
  const cell = node?.closest('td, th')
  if (cell && editorRef.value?.contains(cell)) {
    isInsideTable.value = true
    currentCell.value = cell
  } else {
    isInsideTable.value = false
    currentCell.value = null
  }
}

function openTableDialog() {
  saveSelection()
  checkTableContext()
  showTableDialog.value = true
}

function closeTableDialog() {
  showTableDialog.value = false
}

async function insertCustomTable() {
  const r = Math.max(1, tableRows.value || 2)
  const c = Math.max(1, tableCols.value || 2)

  let head = '<thead><tr>'
  for (let j = 0; j < c; j++) head += '<th>Encabezado</th>'
  head += '</tr></thead>'

  let body = '<tbody>'
  for (let i = 0; i < r; i++) {
    body += '<tr>'
    for (let j = 0; j < c; j++) body += '<td>Celda</td>'
    body += '</tr>'
  }
  body += '</tbody>'

  const tableHtml = `<table>${head}${body}</table><p><br></p>`
  // El diálogo es modal: el editor queda inerte hasta que se cierra. Por eso
  // se cierra primero y se inserta en el siguiente tick, con el caret guardado.
  showTableDialog.value = false
  await nextTick()
  restoreSelection()
  exec('insertHTML', tableHtml)
}

function insertTableRowAbove() {
  if (!currentCell.value) return
  const row = currentCell.value.closest('tr')
  if (!row) return
  const colsCount = row.children.length
  const newRow = document.createElement('tr')
  for (let i = 0; i < colsCount; i++) {
    const td = document.createElement('td')
    td.textContent = 'Celda'
    newRow.appendChild(td)
  }
  row.parentElement.insertBefore(newRow, row)
  syncFromDom()
  showTableDialog.value = false
}

function insertTableRowBelow() {
  if (!currentCell.value) return
  const row = currentCell.value.closest('tr')
  if (!row) return
  const colsCount = row.children.length
  const newRow = document.createElement('tr')
  for (let i = 0; i < colsCount; i++) {
    const td = document.createElement('td')
    td.textContent = 'Celda'
    newRow.appendChild(td)
  }
  row.parentElement.insertBefore(newRow, row.nextSibling)
  syncFromDom()
  showTableDialog.value = false
}

function insertTableColBefore() {
  if (!currentCell.value) return
  const cell = currentCell.value
  const colIndex = Array.from(cell.parentElement.children).indexOf(cell)
  const table = cell.closest('table')
  if (!table || colIndex < 0) return

  for (const tr of table.querySelectorAll('tr')) {
    const isHead = tr.parentElement.tagName === 'THEAD'
    const newCell = document.createElement(isHead ? 'th' : 'td')
    newCell.textContent = isHead ? 'Encabezado' : 'Celda'
    const targetCell = tr.children[colIndex]
    if (targetCell) tr.insertBefore(newCell, targetCell)
    else tr.appendChild(newCell)
  }
  syncFromDom()
  showTableDialog.value = false
}

function insertTableColAfter() {
  if (!currentCell.value) return
  const cell = currentCell.value
  const colIndex = Array.from(cell.parentElement.children).indexOf(cell)
  const table = cell.closest('table')
  if (!table || colIndex < 0) return

  for (const tr of table.querySelectorAll('tr')) {
    const isHead = tr.parentElement.tagName === 'THEAD'
    const newCell = document.createElement(isHead ? 'th' : 'td')
    newCell.textContent = isHead ? 'Encabezado' : 'Celda'
    const targetCell = tr.children[colIndex]
    if (targetCell) tr.insertBefore(newCell, targetCell.nextSibling)
    else tr.appendChild(newCell)
  }
  syncFromDom()
  showTableDialog.value = false
}

function deleteTableCol() {
  if (!currentCell.value) return
  const cell = currentCell.value
  const colIndex = Array.from(cell.parentElement.children).indexOf(cell)
  const table = cell.closest('table')
  if (!table || colIndex < 0) return

  for (const tr of table.querySelectorAll('tr')) {
    if (tr.children[colIndex]) {
      tr.removeChild(tr.children[colIndex])
    }
  }
  syncFromDom()
  showTableDialog.value = false
  checkTableContext()
}

/* ---------------- Image Handling ---------------- */
function openImageDialog() {
  saveSelection()
  selectedImageName.value = ''
  pendingImageData.value = ''
  showImageDialog.value = true
}

function closeImageDialog() {
  showImageDialog.value = false
}

function triggerImageSelect() {
  imageInputRef.value?.click()
}

function onImageSelected(e) {
  const file = e.target.files?.[0]
  if (file) handleImageFile(file)
}

function onImageDrop(e) {
  isDraggingFile.value = false
  const file = e.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    handleImageFile(file)
  }
}

function handleImageFile(file) {
  selectedImageName.value = file.name
  const reader = new FileReader()
  reader.onload = () => {
    pendingImageData.value = reader.result
  }
  reader.readAsDataURL(file)
}

async function confirmImageInsert() {
  if (!pendingImageData.value) return
  const imgHtml = `<img src="${pendingImageData.value}" alt="${escapeHtml(selectedImageName.value || 'image')}" />`
  // Cerramos el diálogo modal antes de insertar para que el editor recupere
  // la interacción y el caret guardado siga siendo válido.
  showImageDialog.value = false
  await nextTick()
  restoreSelection()
  exec('insertHTML', imgHtml)
  pendingImageData.value = ''
  selectedImageName.value = ''
}

/* ---------------- Link Handling ---------------- */

/** Antepone `https://` cuando la URL no declara un protocolo. */
function normalizeUrl(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  return /^[a-zA-Z][a-zA-Z\d+.-]*:/.test(raw) ? raw : `https://${raw}`
}

function isValidUrl(value) {
  if (!value) return false
  try {
    const url = new URL(value)
    return Boolean(url.protocol && url.hostname)
  } catch {
    return false
  }
}

/** Heurística para prellenar la URL al seleccionar texto que parece un dominio. */
function looksLikeUrl(value) {
  return /^(https?:\/\/|mailto:|tel:)/i.test(value) || /\.[a-z]{2,}(?:[/?#]|$)/i.test(value)
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Devuelve el elemento `<a>` bajo el cursor o que envuelve la selección. */
function findAnchorInSelection() {
  const sel = window.getSelection()
  if (!sel || !sel.rangeCount || !editorRef.value) return null

  const range = sel.getRangeAt(0)
  let node = range.startContainer
  if (node.nodeType === 3) node = node.parentElement

  const direct = node?.closest?.('a')
  if (direct && editorRef.value.contains(direct)) return direct

  // La selección abarca un enlace completo: buscamos el ancla común.
  const common = range.commonAncestorContainer
  const container = common.nodeType === 1 ? common : common.parentElement
  const anchors = container?.querySelectorAll?.('a') || []
  if (anchors.length === 1 && editorRef.value.contains(anchors[0])) return anchors[0]

  return null
}

function normalizeLinkUrlField() {
  if (linkUrl.value.trim()) linkUrl.value = normalizeUrl(linkUrl.value)
}

function openLinkDialog() {
  saveSelection()
  const anchor = findAnchorInSelection()

  if (anchor) {
    editingAnchor.value = anchor
    linkText.value = anchor.textContent.trim()
    linkUrl.value = anchor.getAttribute('href') || ''
    showLinkDialog.value = true
    return
  }

  editingAnchor.value = null
  const selected = savedRange.value ? savedRange.value.toString().trim() : ''
  if (selected) {
    linkText.value = selected
    linkUrl.value = looksLikeUrl(selected) ? normalizeUrl(selected) : ''
  } else {
    linkText.value = ''
    linkUrl.value = ''
  }
  showLinkDialog.value = true
}

function closeLinkDialog() {
  showLinkDialog.value = false
  editingAnchor.value = null
}

async function confirmLinkInsert() {
  if (!canInsertLink.value) return

  const href = normalizedLinkUrl.value
  const text = linkText.value.trim()
  const anchor = editingAnchor.value && editorRef.value?.contains(editingAnchor.value)
    ? editingAnchor.value
    : null

  showLinkDialog.value = false
  await nextTick()

  if (anchor) {
    anchor.setAttribute('href', href)
    anchor.textContent = text
    syncFromDom()
  } else {
    restoreSelection()
    exec('insertHTML', `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`)
  }

  editingAnchor.value = null
}

defineExpose({
  focus: () => editorRef.value?.focus(),
  editorRef,
  toggleSource
})
</script>

<style scoped>
/* Asegura espacio suficiente para que el label flotante no se superponga
   con la toolbar en ninguna de las variantes MD3. */
.zn-richtext :deep(.zn-field__content) {
  align-items: stretch;
  padding-top: 14px;
  padding-bottom: 8px;
}

/* En `filled` la etiqueta flota dentro del contenedor (top: 8px), así que el
   contenido debe reservar su altura completa antes de la toolbar. */
.zn-richtext.zn-field--filled :deep(.zn-field__content) {
  padding-top: 22px;
}

.zn-richtext.zn-field--filled.zn-field--small :deep(.zn-field__content) {
  padding-top: 20px;
}

.zn-richtext.zn-field--filled.zn-field--large :deep(.zn-field__content) {
  padding-top: 26px;
}

.zn-richtext__inner {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  min-width: 0;
}

.zn-richtext__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--md-outline);
}

.zn-richtext__source-toggle {
  margin-left: auto;
}

.zn-richtext__heading-glyph {
  font-size: 0.8125rem;
  font-weight: 700;
  line-height: 1;
}

.zn-richtext__active-btn {
  background-color: var(--md-secondary-container, var(--md-surface-variant));
  color: var(--md-primary);
}

/* Diálogos y editores especiales */
.zn-dialog-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.zn-dialog-description {
  margin: 0;
  font-size: 0.875rem;
  color: var(--md-on-surface-variant);
  line-height: 1.4;
}

.zn-dialog-row {
  display: flex;
  gap: 16px;
}

.zn-dialog-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1 1 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.zn-dialog-input {
  box-sizing: border-box;
  width: 100%;
  padding: 8px 12px;
  font-size: 0.9375rem;
  border: 1px solid var(--md-outline);
  border-radius: 4px;
  background-color: var(--md-surface);
  color: var(--md-on-surface);
  outline: none;
  transition: border-color 0.2s;
}

.zn-dialog-input:focus {
  border-color: var(--md-primary);
  border-width: 2px;
  padding: 7px 11px;
}

.zn-dialog-error {
  color: var(--md-error, #ba1a1a);
  font-size: 0.75rem;
  font-weight: 400;
}

.zn-table-operations {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.zn-table-operations__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}

.zn-btn--danger {
  color: var(--md-error, #ba1a1a) !important;
}

/* Dropzone de imagen dentro del diálogo */
.zn-richtext__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border: 2px dashed var(--md-outline);
  border-radius: 12px;
  cursor: pointer;
  text-align: center;
  gap: 10px;
  background-color: var(--md-surface-container-low, var(--md-surface));
  transition: border-color 0.2s, background-color 0.2s;
}

.zn-richtext__dropzone:hover,
.zn-richtext__dropzone--active {
  border-color: var(--md-primary);
  background-color: var(--md-surface-variant);
}

.zn-richtext__dropzone-text {
  font-size: 0.875rem;
  color: var(--md-on-surface-variant);
}

.zn-richtext__dropzone-file {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--md-primary);
  word-break: break-all;
}

.zn-hidden-file-input {
  display: none;
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

/* Tipografía del documento */
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

.zn-richtext__canvas :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 8px 0;
}
</style>