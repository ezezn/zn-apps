<script setup>
import { computed } from 'vue'

/**
 * ZnDashlet - Tarjeta dashboard para contenido flexible.
 *
 * Props:
 *  - variant: 'primary' | 'warning' | 'info' | 'success' | 'error' | 'neutral'
 *  - filled: boolean - si la card debe llenarse con el color de la variante
 *  - height: number - altura en px (opcional)
 *  - class: string - clase CSS adicional
 *
 * The component renders a `<div>` with the appropriate variant styling.
 * The default slot contains the dashboard widget content.
 */
const props = defineProps({
  /** Variant color scheme. Uses MD3 semantic colors. */
  variant: {
    type: String,
    validator: (v) =>
      ['primary', 'warning', 'info', 'success', 'error', 'neutral'].includes(v),
    default: 'neutral'
  },
  /** Whether the card should be filled with the variant color. */
  filled: {
    type: Boolean,
    default: true
  },
  /** Height in pixels (defaults to MD3 card height). */
  height: {
    type: Number,
    default: 120
  },
  /** Additional CSS class. */
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div
    class="zn-dashlet"
    :class="variant"
    style="
      height: ${props.height}px;
      background: ${props.filled ? 'var(--zn-dashlet-bg)' : 'transparent'};
      color: ${props.filled ? 'var(--zn-dashlet-fg)' : 'inherit'};
    "
  >
    <slot />
  </div>
</template>

<style scoped>
.zn-dashlet {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  font-size: 0.875rem;
}

/* Variants use MD3 color tokens via CSS custom properties */
.zn-dashlet--primary {
  --zn-dashlet-bg: var(--md-primary-container, #e8eaf6);
  --zn-dashlet-fg: var(--md-on-primary-container, #1e2131);
}
.zn-dashlet--warning {
  --zn-dashlet-bg: var(--md-error-container, #ffmdb0);
  --zn-dashlet-fg: var(--md-on-error-container, #412412);
}
.zn-dashlet--info {
  --zn-dashlet-bg: var(--md-info, #0288d1);
  --zn-dashlet-fg: var(--md-on-info, #ffffff);
}
.zn-dashlet--success {
  --zn-dashlet-bg: var(--md-success, #2e7d32);
  --zn-dashlet-fg: var(--md-on-success, #ffffff);
}
.zn-dashlet--error {
  --zn-dashlet-bg: var(--md-error, #b00020);
  --zn-dashlet-fg: var(--md-on-error, #ffffff);
}
.zn-dashlet--neutral {
  --zn-dashlet-bg: var(--md-surface, #fafafa);
  --zn-dashlet-fg: var(--md-on-surface, #1a1a1a);
}

/* Outline mode (filled=false) */
.zn-dashlet--outline {
  border: 1px solid var(--md-outline-variant, #cac4d0);
  --zn-dashlet-bg: transparent;
  --zn-dashlet-fg: inherit;
}

/* Height variants */
.zn-dashlet--short { height: 80px; }
.zn-dashlet--tall { height: 200px; }
</style>