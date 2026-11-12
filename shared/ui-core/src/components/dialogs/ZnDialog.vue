<template>
  <dialog
    ref="dialogElement"
    class="zn-dialog"
    :class="`zn-dialog--${variant}`"
    :aria-label="title || ariaLabel"
    :style="{ '--zn-dialog-max-width': maxWidth }"
    @cancel="handleCancel"
    @close="handleClose"
    @click="handleDialogClick"
  >
    <header v-if="title || $slots.title" class="zn-dialog__header">
      <slot name="title">
        <h2 class="zn-dialog__title">{{ title }}</h2>
      </slot>
    </header>

    <div class="zn-dialog__content">
      <slot />
    </div>

    <footer v-if="$slots.actions" class="zn-dialog__actions">
      <slot name="actions" />
    </footer>
  </dialog>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Dialog' },
  variant: {
    type: String,
    default: 'basic',
    validator: (value) => ['basic', 'alert'].includes(value)
  },
  maxWidth: { type: String, default: '560px' },
  closeOnEscape: { type: Boolean, default: true },
  closeOnBackdrop: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'close', 'cancel'])
const dialogElement = ref(null)

function syncDialog(isOpen) {
  const dialog = dialogElement.value
  if (!dialog) return

  if (isOpen && !dialog.open) {
    dialog.showModal()
  } else if (!isOpen && dialog.open) {
    dialog.close()
  }
}

watch(() => props.modelValue, syncDialog, { flush: 'post' })
onMounted(() => syncDialog(props.modelValue))

onBeforeUnmount(() => {
  if (dialogElement.value?.open) dialogElement.value.close()
})

function handleCancel(event) {
  emit('cancel')
  if (!props.closeOnEscape) event.preventDefault()
}

function handleClose(event) {
  emit('update:modelValue', false)
  emit('close', event.target.returnValue)
}

function handleDialogClick(event) {
  if (props.closeOnBackdrop && event.target === dialogElement.value) {
    dialogElement.value.close('backdrop')
  }
}
</script>

<style scoped>
.zn-dialog {
  box-sizing: border-box;
  position: fixed;
  inset: auto 0 0 0;
  top: auto;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-width: 100vw;
  max-height: calc(90dvh);
  margin: 0;
  padding: 0;
  overflow: auto;
  border: 0;
  border-radius: 28px 28px 0 0;
  background: var(--md-surface-container-high, var(--md-surface));
  color: var(--md-on-surface);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.12);
  font-family: 'Roboto', sans-serif;
  z-index: 1000;
  animation: zn-dialog-slide-in-mobile 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.zn-dialog:not([open]) {
  display: none;
}

.zn-dialog::backdrop {
  background: rgba(0, 0, 0, 0.32);
  animation: zn-dialog-backdrop-in 180ms ease-out;
}

.zn-dialog__header {
  padding: 24px 24px 0;
}

.zn-dialog__title {
  margin: 0;
  color: var(--md-on-surface);
  font-size: 1.5rem;
  font-weight: 400;
  line-height: 1.3;
}

.zn-dialog__content {
  padding: 16px 24px 24px;
  color: var(--md-on-surface-variant);
  font-size: 0.95rem;
  line-height: 1.5;
}

.zn-dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 24px 24px;
}

.zn-dialog--alert .zn-dialog__header {
  padding-top: 28px;
}

@keyframes zn-dialog-slide-in-mobile {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes zn-dialog-slide-in-desktop {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes zn-dialog-backdrop-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .zn-dialog {
    animation: none;
  }
  .zn-dialog::backdrop {
    animation: none;
  }
}

@media (min-width: 640px) {
  .zn-dialog {
    inset: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: min(var(--zn-dialog-max-width, 560px), calc(100vw - 32px));
    max-width: var(--zn-dialog-max-width, 560px);
    max-height: min(720px, calc(100dvh - 48px));
    border-radius: 28px;
    animation: zn-dialog-slide-in-desktop 200ms cubic-bezier(0, 0, 0.2, 1);
  }
}
</style>
