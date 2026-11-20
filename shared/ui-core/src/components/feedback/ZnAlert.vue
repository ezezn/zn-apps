<template>
  <div
    v-if="modelValue"
    class="zn-alert"
    :class="[`zn-alert--${variant}`, `zn-alert--size-${size}`]"
    :role="role"
  >
    <span class="zn-alert__icon" aria-hidden="true">
      <slot name="icon">
        <ZnIcon :name="iconName" :size="iconSize" />
      </slot>
    </span>

    <div class="zn-alert__content">
      <slot />
    </div>

    <div v-if="$slots.actions" class="zn-alert__actions">
      <slot name="actions" />
    </div>

    <button
      v-if="dismissible"
      type="button"
      class="zn-alert__dismiss zn-no-drag"
      :aria-label="dismissLabel"
      :title="dismissLabel"
      @click="dismiss"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12 5.7 16.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4Z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ZnIcon from '../media/ZnIcon.vue'

const props = defineProps({
  /** v-model visibility; the X emits `false` after dismissing. */
  modelValue: { type: Boolean, default: true },
  variant: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'info', 'warning', 'error'].includes(value)
  },
  /** MD3 banner scale: compact, standard, or roomy. */
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  dismissible: { type: Boolean, default: true },
  dismissLabel: { type: String, default: 'Dismiss' }
})

const emit = defineEmits(['update:modelValue', 'dismiss'])

const ICONS = {
  success: 'check_circle',
  info: 'info',
  warning: 'warning',
  error: 'error'
}

const iconName = computed(() => ICONS[props.variant] ?? ICONS.info)
const ICON_SIZES = { small: 18, medium: 20, large: 24 }
const iconSize = computed(() => ICON_SIZES[props.size] ?? ICON_SIZES.medium)
// Errors and warnings interrupt; success/info announce politely.
const role = computed(() =>
  props.variant === 'error' || props.variant === 'warning' ? 'alert' : 'status'
)

function dismiss() {
  emit('update:modelValue', false)
  emit('dismiss')
}
</script>

<style scoped>
.zn-alert {
  --zn-alert-accent: var(--md-primary);
  --zn-alert-pad-block: 8px;
  --zn-alert-pad-inline: 10px;
  --zn-alert-gap: 12px;
  --zn-alert-icon-size: 20px;
  --zn-alert-dismiss-size: 32px;
  --zn-alert-dismiss-icon: 20px;
  --zn-alert-action-height: 32px;
  --zn-alert-action-padding: 0 8px;
  --zn-alert-font-size: 0.875rem;
  --zn-alert-radius: 12px;
  --zn-alert-min-height: 52px;

  display: flex;
  align-items: center;
  gap: var(--zn-alert-gap);
  box-sizing: border-box;
  width: 100%;
  min-height: var(--zn-alert-min-height);
  padding: var(--zn-alert-pad-block) var(--zn-alert-pad-inline);
  border: 1px solid color-mix(in srgb, var(--zn-alert-accent) 36%, transparent);
  border-radius: var(--zn-alert-radius);
  background: color-mix(in srgb, var(--zn-alert-accent) 10%, var(--md-surface));
  color: var(--md-on-surface);
  font-family: 'Roboto', sans-serif;
  font-size: var(--zn-alert-font-size);
  line-height: 1.4;
}

/* MD3 banner scales: compact, standard and roomy. */
.zn-alert--size-small {
  --zn-alert-pad-block: 6px;
  --zn-alert-pad-inline: 8px;
  --zn-alert-gap: 10px;
  --zn-alert-icon-size: 18px;
  --zn-alert-dismiss-size: 28px;
  --zn-alert-dismiss-icon: 18px;
  --zn-alert-action-height: 28px;
  --zn-alert-action-padding: 0 6px;
  --zn-alert-font-size: 0.8125rem;
  --zn-alert-radius: 8px;
  --zn-alert-min-height: 44px;
}

.zn-alert--size-large {
  --zn-alert-pad-block: 12px;
  --zn-alert-pad-inline: 14px;
  --zn-alert-gap: 14px;
  --zn-alert-icon-size: 24px;
  --zn-alert-dismiss-size: 36px;
  --zn-alert-dismiss-icon: 24px;
  --zn-alert-action-height: 36px;
  --zn-alert-action-padding: 0 10px;
  --zn-alert-font-size: 0.9375rem;
  --zn-alert-radius: 16px;
  --zn-alert-min-height: 64px;
}

.zn-alert--success {
  --zn-alert-accent: #386a20;
}

.zn-alert--info {
  --zn-alert-accent: var(--md-primary);
}

.zn-alert--warning {
  --zn-alert-accent: #8a5300;
}

.zn-alert--error {
  --zn-alert-accent: var(--md-error);
}

:global(.zn-theme-dark) .zn-alert--success {
  --zn-alert-accent: #9cd67d;
}

:global(.zn-theme-dark) .zn-alert--warning {
  --zn-alert-accent: #ffb95c;
}

.zn-alert__icon {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--zn-alert-icon-size);
  height: var(--zn-alert-icon-size);
  color: var(--zn-alert-accent);
}

.zn-alert__icon :deep(svg) {
  width: var(--zn-alert-icon-size);
  height: var(--zn-alert-icon-size);
  fill: currentColor;
}

.zn-alert__content {
  flex: 1 1 auto;
  min-width: 0;
  overflow-wrap: anywhere;
}

.zn-alert__actions {
  display: flex;
  flex: 0 0 auto;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

/* Compact action buttons keep the banner single-line and vertically centered. */
.zn-alert__actions :deep(.zn-button) {
  height: var(--zn-alert-action-height);
  min-height: var(--zn-alert-action-height);
  padding: var(--zn-alert-action-padding);
  font-size: var(--zn-alert-font-size);
}

/* Los ZnButton del slot heredan el color del acento, sin tapar el texto. */
.zn-alert__actions :deep(.zn-button--text) {
  color: var(--zn-alert-accent);
}

.zn-alert__dismiss {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: var(--zn-alert-dismiss-size);
  height: var(--zn-alert-dismiss-size);
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--md-on-surface-variant);
  cursor: pointer;
}

.zn-alert__dismiss:hover {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}

.zn-alert__dismiss:focus-visible {
  outline: 2px solid var(--zn-alert-accent);
  outline-offset: 2px;
}

.zn-alert__dismiss svg {
  width: var(--zn-alert-dismiss-icon);
  height: var(--zn-alert-dismiss-icon);
  fill: currentColor;
}

@media (max-width: 600px) {
  .zn-alert {
    flex-wrap: wrap;
  }

  .zn-alert__content {
    flex-basis: calc(100% - (var(--zn-alert-icon-size) + var(--zn-alert-dismiss-size) + var(--zn-alert-gap) * 2));
  }

  .zn-alert__actions {
    order: 3;
    flex-basis: 100%;
    padding-left: calc(var(--zn-alert-icon-size) + var(--zn-alert-gap));
  }
}
</style>
