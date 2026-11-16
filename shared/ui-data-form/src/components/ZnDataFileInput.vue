<template>
  <ZnFieldShell
    class="zn-file-input"
    :label="label"
    :hint="hint"
    :error="error"
    :disabled="disabled"
    :focused="focused"
    :filled="Boolean(modelValue)"
    :required="required"
    :variant="variant"
    :size="size"
    :float-label="true"
  >
    <div
      class="zn-file-input__inner"
      tabindex="0"
      role="button"
      :aria-label="label || 'Seleccionar archivo'"
      :aria-disabled="disabled ? 'true' : undefined"
      @click="triggerSelect"
      @keydown.enter.prevent="triggerSelect"
      @keydown.space.prevent="triggerSelect"
      @focus="focused = true"
      @blur="focused = false"
    >
      <input
        ref="fileInputRef"
        type="file"
        class="zn-file-input__native"
        :accept="accept"
        :disabled="disabled"
        tabindex="-1"
        @change="onFileChange"
      />

      <div class="zn-file-input__content">
        <ZnIcon name="insert_drive_file" :size="20" class="zn-file-input__icon" />
        <span v-if="fileName" class="zn-file-input__name" :title="fileName">
          {{ fileName }}
        </span>
        <span v-else class="zn-file-input__placeholder">
          {{ placeholder }}
        </span>
      </div>

      <div v-if="fileName && !disabled" class="zn-file-input__actions">
        <ZnButton
          variant="text"
          icon-only
          aria-label="Eliminar archivo"
          title="Eliminar archivo"
          @click.stop="clearFile"
        >
          <ZnIcon name="close" :size="18" />
        </ZnButton>
      </div>
    </div>
  </ZnFieldShell>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnButton, ZnFieldShell, ZnIcon } from '@zn-apps/ui-core'

const props = defineProps({
  modelValue: {
    type: [Object, String],
    default: null
  },
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  placeholder: { type: String, default: 'Elegir archivo…' },
  disabled: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  accept: { type: String, default: '' },
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const focused = ref(false)
const fileInputRef = ref(null)

const fileName = computed(() => {
  if (!props.modelValue) return ''
  if (typeof props.modelValue === 'object') {
    return props.modelValue.name || ''
  }
  return String(props.modelValue)
})

function triggerSelect() {
  if (props.disabled || props.readonly) return
  fileInputRef.value?.click()
}

function onFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const fileData = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  }

  const reader = new FileReader()
  reader.onload = () => {
    fileData.url = reader.result
    emit('update:modelValue', fileData)
    emit('change', fileData)
  }
  reader.readAsDataURL(file)
}

function clearFile() {
  if (props.disabled || props.readonly) return
  if (fileInputRef.value) fileInputRef.value.value = ''
  emit('update:modelValue', null)
  emit('change', null)
}
</script>

<style scoped>
.zn-file-input__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 24px;
  cursor: pointer;
  outline: none;
}

.zn-file-input__inner:focus-visible {
  outline: none;
}

.zn-file-input__native {
  display: none;
}

.zn-file-input__content {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1 1 auto;
}

.zn-file-input__icon {
  color: var(--md-on-surface-variant);
  flex-shrink: 0;
}

.zn-file-input__name {
  color: var(--md-on-background);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.zn-file-input__placeholder {
  color: var(--md-on-surface-variant);
  opacity: 0.7;
  font-size: 0.875rem;
}

.zn-file-input__actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}
</style>