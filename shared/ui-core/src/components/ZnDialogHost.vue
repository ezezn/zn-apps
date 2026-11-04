<template>
  <ZnDialog
    :key="current?.id"
    :model-value="Boolean(current?.open)"
    :title="current?.title ?? ''"
    :variant="current?.kind === 'alert' ? 'alert' : 'basic'"
    @close="handleClose"
  >
    <template v-if="current">
      <p class="zn-dialog-host__message">{{ current.message }}</p>
      <label v-if="current.kind === 'prompt'" class="zn-dialog-host__label" for="zn-dialog-prompt">
        Respuesta
      </label>
      <input
        v-if="current.kind === 'prompt'"
        id="zn-dialog-prompt"
        v-model="current.inputValue"
        class="zn-dialog-host__input"
        :type="current.inputType"
        :placeholder="current.placeholder"
        :required="current.required"
        autocomplete="off"
        autofocus
        @keydown.enter.prevent="submit"
      />
    </template>

    <template #actions>
      <ZnButton
        v-if="current?.kind !== 'alert'"
        variant="text"
        @click="dismissCurrentDialog"
      >
        {{ current?.cancelText }}
      </ZnButton>
      <ZnButton variant="filled" @click="submit">
        {{ current?.confirmText }}
      </ZnButton>
    </template>
  </ZnDialog>
</template>

<script setup>
import { computed } from 'vue'
import ZnButton from './ZnButton.vue'
import ZnDialog from './ZnDialog.vue'
import {
  dialogState,
  dismissCurrentDialog,
  finishCurrentDialog,
  settleCurrentDialog
} from '../composables/useDialogs.js'

const current = computed(() => dialogState.current)

function handleClose() {
  if (dialogState.current?.open) dismissCurrentDialog()
  finishCurrentDialog()
}

function submit() {
  const dialog = dialogState.current
  if (!dialog) return

  if (dialog.kind === 'prompt') {
    if (dialog.required && !dialog.inputValue.trim()) return
    settleCurrentDialog(dialog.inputValue)
  } else if (dialog.kind === 'confirm') {
    settleCurrentDialog(true)
  } else {
    settleCurrentDialog(undefined)
  }
}
</script>

<style scoped>
.zn-dialog-host__message {
  margin: 0;
  white-space: pre-line;
}

.zn-dialog-host__label {
  display: block;
  margin: 20px 0 8px;
  color: var(--md-on-surface);
  font-size: 0.875rem;
  font-weight: 500;
}

.zn-dialog-host__input {
  box-sizing: border-box;
  width: 100%;
  min-height: 56px;
  padding: 12px 16px;
  border: 1px solid var(--md-outline);
  border-radius: 4px;
  outline: none;
  background: var(--md-surface);
  color: var(--md-on-surface);
  font: inherit;
}

.zn-dialog-host__input:focus {
  border: 2px solid var(--md-primary);
  padding: 11px 15px;
}
</style>
