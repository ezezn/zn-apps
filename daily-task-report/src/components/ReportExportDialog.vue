<template>
  <ZnDialog
    :model-value="modelValue"
    :title="t('reports.exportTitle')"
    max-width="720px"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <div class="report-export">
      <ZnSelect
        :model-value="templateId"
        :label="t('reports.exportTemplate')"
        :options="templateOptions"
        @update:model-value="templateId = $event"
      />

      <label class="report-export__label" for="report-export-preview">
        {{ t('reports.exportPreview') }}
      </label>
      <textarea
        id="report-export-preview"
        class="report-export__preview"
        :value="output"
        rows="14"
        readonly
        spellcheck="false"
      ></textarea>

      <p
        v-if="feedback"
        class="report-export__feedback"
        :class="`report-export__feedback--${feedback.type}`"
        :role="feedback.type === 'error' ? 'alert' : 'status'"
      >
        {{ feedback.message }}
      </p>
    </div>

    <template #actions>
      <ZnButton variant="text" @click="close">{{ t('common.cancel') }}</ZnButton>
      <ZnButton variant="outlined" @click="copyText">
        <template #icon>
          <ZnIcon name="content_copy" :size="18" />
        </template>
        {{ t('reports.exportCopy') }}
      </ZnButton>
      <ZnButton variant="filled" @click="download">
        <template #icon>
          <ZnIcon name="download" :size="18" />
        </template>
        {{ t('reports.exportDownload') }}
      </ZnButton>
    </template>
  </ZnDialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ZnButton, ZnDialog, ZnIcon, ZnSelect } from '@zn-apps/ui-core'
import { i18n } from '../i18n.js'
import {
  DEFAULT_TEMPLATE_ID,
  rememberedReportTemplateId,
  setLastReportTemplateId,
  useReportTemplates
} from '../composables/useReportTemplates.js'
import { renderReportTemplate, reportExportFileName } from '../helpers/report-export.js'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  report: { type: Object, default: null },
  tasks: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:modelValue'])

const t = (...args) => i18n.global.t(...args)
const { templates, templateById } = useReportTemplates()

const templateId = ref(DEFAULT_TEMPLATE_ID)
const feedback = ref(null)

const templateOptions = computed(() =>
  templates.value.map((template) => ({ value: template.id, label: template.name }))
)

const selectedTemplate = computed(() => templateById(templateId.value))

const output = computed(() =>
  renderReportTemplate(selectedTemplate.value?.body ?? '', {
    report: props.report ?? {},
    tasks: props.tasks
  })
)

watch(
  () => [props.modelValue, props.report],
  ([open]) => {
    if (!open) return
    templateId.value = rememberedReportTemplateId()
    feedback.value = null
  },
  { immediate: true }
)

// Remember the selection so the next export starts with the same template.
watch(templateId, (value) => setLastReportTemplateId(value))

function close() {
  emit('update:modelValue', false)
}

async function copyText() {
  feedback.value = null
  try {
    const copied = await writeToClipboard(output.value)
    if (!copied) throw new Error('clipboard')
    feedback.value = { type: 'success', message: t('reports.exportCopied') }
  } catch {
    feedback.value = { type: 'error', message: t('reports.exportCopyError') }
  }
}

async function writeToClipboard(value) {
  const clipboard = globalThis.navigator?.clipboard
  if (clipboard?.writeText) {
    await clipboard.writeText(value)
    return true
  }

  // Older browsers / insecure contexts: fall back to a temporary textarea.
  if (typeof document === 'undefined') return false
  const area = document.createElement('textarea')
  area.value = value
  area.setAttribute('readonly', '')
  area.style.position = 'fixed'
  area.style.opacity = '0'
  document.body.appendChild(area)
  area.select()
  const copied = Boolean(document.execCommand?.('copy'))
  area.remove()
  return copied
}

function download() {
  feedback.value = null
  try {
    const blob = new Blob([output.value], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = reportExportFileName(props.report ?? {})
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    feedback.value = { type: 'success', message: t('reports.exportDone') }
  } catch {
    feedback.value = { type: 'error', message: t('reports.exportError') }
  }
}
</script>

<style scoped>
.report-export {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.report-export__label {
  color: var(--md-on-surface-variant);
  font-size: 0.8125rem;
  font-weight: 500;
}

.report-export__preview {
  box-sizing: border-box;
  width: 100%;
  min-height: 220px;
  padding: 12px 14px;
  border: 1px solid var(--md-outline);
  border-radius: 12px;
  background: var(--md-surface-container-low, var(--md-surface-variant));
  color: var(--md-on-surface);
  font-family: 'Roboto Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.8125rem;
  line-height: 1.55;
  resize: vertical;
}

.report-export__feedback {
  margin: 0;
  font-size: 0.875rem;
}

.report-export__feedback--success {
  color: var(--md-primary);
}

.report-export__feedback--error {
  color: var(--md-error);
}
</style>
