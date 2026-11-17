<template>
  <!-- Variante modal: panel flotante sobre un scrim, con foco atrapado. -->
  <div
    v-if="variant === 'modal'"
    class="zn-drawer-layer"
    :class="[`zn-drawer-layer--${side}`, { 'zn-drawer-layer--open': modelValue }]"
  >
    <div class="zn-drawer__scrim" aria-hidden="true" @click="handleScrimClick"></div>

    <aside
      ref="panelRef"
      class="zn-drawer zn-drawer--modal"
      :class="[`zn-drawer--${side}`, { 'zn-drawer--open': modelValue }]"
      role="dialog"
      aria-modal="true"
      :aria-label="label"
      :aria-hidden="modelValue ? undefined : 'true'"
      :inert="!modelValue"
      :style="{ '--zn-drawer-width': width }"
      tabindex="-1"
      @keydown="handlePanelKeydown"
    >
      <header v-if="$slots.header || closeButton" class="zn-drawer__header">
        <slot name="header" />
        <button
          v-if="closeButton"
          type="button"
          class="zn-drawer__close"
          :aria-label="closeLabel"
          @click="close('close-button')"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M17.65 6.35a1 1 0 0 0-1.41 0L12 10.59 7.76 6.35a1 1 0 1 0-1.41 1.41L10.59 12l-4.24 4.24a1 1 0 1 0 1.41 1.41L12 13.41l4.24 4.24a1 1 0 0 0 1.41-1.41L13.41 12l4.24-4.24a1 1 0 0 0 0-1.41z" />
          </svg>
        </button>
      </header>

      <div class="zn-drawer__content">
        <slot />
      </div>
    </aside>
  </div>

  <!-- Variante standard: panel acoplado al layout, sin scrim ni foco atrapado. -->
  <aside
    v-else
    class="zn-drawer zn-drawer--standard"
    :class="`zn-drawer--${side}`"
    :aria-label="label"
    :style="{ '--zn-drawer-width': width }"
  >
    <header v-if="$slots.header" class="zn-drawer__header">
      <slot name="header" />
    </header>

    <div class="zn-drawer__content">
      <slot />
    </div>
  </aside>
</template>

<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  /** `modal` (overlay con scrim) | `standard` (acoplado al layout). */
  variant: {
    type: String,
    default: 'modal',
    validator: (value) => ['modal', 'standard'].includes(value)
  },
  /** Lado desde el que entra el drawer. */
  side: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'end'].includes(value)
  },
  width: { type: String, default: '360px' },
  label: { type: String, default: 'Navegación' },
  closeButton: { type: Boolean, default: true },
  closeLabel: { type: String, default: 'Cerrar navegación' },
  closeOnEscape: { type: Boolean, default: true },
  closeOnScrim: { type: Boolean, default: true }
})

const emit = defineEmits(['update:modelValue', 'open', 'close'])
const panelRef = ref(null)
const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

let previousFocus = null
let previousBodyOverflow = ''

function close(reason = 'api') {
  if (!props.modelValue) return
  emit('update:modelValue', false)
  emit('close', reason)
}

function handleScrimClick() {
  if (props.closeOnScrim) close('scrim')
}

function handlePanelKeydown(event) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.stopPropagation()
    close('escape')
    return
  }
  if (event.key === 'Tab') trapTab(event)
}

function trapTab(event) {
  const panel = panelRef.value
  if (!panel) return
  const focusable = Array.from(panel.querySelectorAll(focusableSelector))
    .filter((element) => element.offsetParent !== null || element === document.activeElement)

  if (!focusable.length) {
    event.preventDefault()
    panel.focus()
    return
  }

  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement

  if (event.shiftKey && (active === first || active === panel)) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && active === last) {
    event.preventDefault()
    first.focus()
  }
}

function lockScroll() {
  if (typeof document === 'undefined') return
  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
}

function unlockScroll() {
  if (typeof document === 'undefined') return
  document.body.style.overflow = previousBodyOverflow
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape' && props.closeOnEscape) {
    event.stopPropagation()
    close('escape')
  }
}

async function syncOpen(isOpen) {
  if (props.variant !== 'modal' || typeof document === 'undefined') return

  if (isOpen) {
    previousFocus = document.activeElement
    lockScroll()
    document.addEventListener('keydown', onDocumentKeydown)
    emit('open')
    await nextTick()
    const panel = panelRef.value
    if (panel) {
      const target = panel.querySelector(focusableSelector) || panel
      target.focus?.()
    }
  } else {
    document.removeEventListener('keydown', onDocumentKeydown)
    unlockScroll()
    if (previousFocus?.focus) previousFocus.focus()
    previousFocus = null
  }
}

onMounted(() => { if (props.modelValue) syncOpen(true) })
watch(() => props.modelValue, syncOpen, { flush: 'post' })
watch(() => props.variant, (variant) => {
  if (variant !== 'modal' && props.modelValue) close('variant')
})

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return
  document.removeEventListener('keydown', onDocumentKeydown)
  if (props.modelValue) unlockScroll()
})
</script>

<style scoped>
/* ==========================================================================
   Capa modal (scrim + panel)
   ========================================================================== */
.zn-drawer-layer {
  position: fixed;
  inset: 0;
  z-index: 1100;
  pointer-events: none;
}

.zn-drawer__scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.zn-drawer-layer--open {
  pointer-events: auto;
}

.zn-drawer-layer--open .zn-drawer__scrim {
  opacity: 1;
}

/* ==========================================================================
   Panel (MD3 Navigation Drawer)
   ========================================================================== */
.zn-drawer {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(var(--zn-drawer-width, 360px), calc(100vw - 56px));
  height: 100%;
  padding: 12px 0;
  overflow: hidden;
  background: var(--md-surface-container-low, var(--md-surface));
  color: var(--md-on-surface);
  font-family: 'Roboto', sans-serif;
}

.zn-drawer--modal {
  position: absolute;
  top: 0;
  bottom: 0;
  outline: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), 0 2px 8px rgba(0, 0, 0, 0.12);
  transition: transform 250ms cubic-bezier(0.2, 0, 0, 1);
  visibility: hidden;
}

.zn-drawer--modal.zn-drawer--open {
  visibility: visible;
}

/* MD3: bordes redondeados en el lado interno */
.zn-drawer--modal.zn-drawer--start {
  left: 0;
  border-radius: 0 16px 16px 0;
  transform: translateX(-102%);
}

.zn-drawer--modal.zn-drawer--start.zn-drawer--open {
  transform: translateX(0);
}

.zn-drawer--modal.zn-drawer--end {
  right: 0;
  border-radius: 16px 0 0 16px;
  transform: translateX(102%);
}

.zn-drawer--modal.zn-drawer--end.zn-drawer--open {
  transform: translateX(0);
}

.zn-drawer--standard {
  border-right: 1px solid var(--md-surface-variant);
  background: var(--md-surface);
}

.zn-drawer--standard.zn-drawer--end {
  border-right: 0;
  border-left: 1px solid var(--md-surface-variant);
}

/* ==========================================================================
   Encabezado y contenido
   ========================================================================== */
.zn-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 56px;
  padding: 8px 16px 8px 24px;
  box-sizing: border-box;
}

.zn-drawer__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}

.zn-drawer__close:hover {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}

.zn-drawer__close:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.zn-drawer__close svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.zn-drawer__content {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
}

@media (prefers-reduced-motion: reduce) {
  .zn-drawer__scrim,
  .zn-drawer--modal {
    transition: none;
  }
}
</style>
