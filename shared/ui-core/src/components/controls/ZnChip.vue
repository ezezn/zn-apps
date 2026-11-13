<template>
  <span
    :class="chipClasses"
    :role="role"
    :tabindex="tabindex"
    :aria-checked="ariaChecked"
    :aria-disabled="disabled ? 'true' : undefined"
    @click="onClick"
    @keydown="onKeydown"
  >
    <span v-if="showsCheck" class="zn-chip__leading" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="zn-chip__icon">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" fill="currentColor" />
      </svg>
    </span>

    <span v-else-if="$slots.icon" class="zn-chip__leading" aria-hidden="true">
      <slot name="icon" />
    </span>

    <span class="zn-chip__label"><slot>{{ label }}</slot></span>

    <span
      v-if="removable"
      class="zn-chip__remove"
      role="button"
      tabindex="-1"
      :aria-label="removeLabel || `Remove ${label}`"
      @click.stop="onRemove"
      @keydown.enter.stop.prevent="onRemove"
      @keydown.space.stop.prevent="onRemove"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="zn-chip__icon">
        <path d="M256-200l-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" fill="currentColor" />
      </svg>
    </span>
  </span>
</template>

<script setup>
import { computed, useSlots } from 'vue'

/**
 * Chip MD3. Las cuatro variantes de Material Design 3 comparten la misma
 * geometría (32dp, radio 8dp) y se diferencian por su propósito y estado:
 *
 * - `assist`: acción sugerida por la app.
 * - `filter`: filtro seleccionable (`selected` muestra el check).
 * - `input`: información introducida por la persona (normalmente con `removable`).
 * - `suggestion`: sugerencia dinámica de la app.
 *
 * `size` reutiliza la escala de densidad de MD3: `small` 24px (densidad -2),
 * `medium` 32px (por defecto) y `large` 40px. Igual que en los campos de texto,
 * el tamaño del texto no cambia con la altura del contenedor.
 */
const props = defineProps({
  label: { type: String, default: '' },
  variant: {
    type: String,
    default: 'assist',
    validator: (value) => ['assist', 'filter', 'input', 'suggestion'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  selected: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** Añade el botón de quitar (variante `input`). */
  removable: { type: Boolean, default: false },
  /** Hace el chip interactivo y alcanzable por teclado. */
  clickable: { type: Boolean, default: false },
  /** Estilo elevado de MD3 (assist, filter y suggestion). */
  elevated: { type: Boolean, default: false },
  removeLabel: { type: String, default: '' }
})

const emit = defineEmits(['click', 'remove'])
const slots = useSlots()

const showsCheck = computed(() => props.variant === 'filter' && props.selected)
const hasLeading = computed(() => showsCheck.value || Boolean(slots.icon))
const role = computed(() => {
  if (!props.clickable) return undefined
  return props.variant === 'filter' ? 'checkbox' : 'button'
})
const tabindex = computed(() => (props.clickable && !props.disabled ? 0 : undefined))
const ariaChecked = computed(() =>
  props.clickable && props.variant === 'filter' ? props.selected : undefined
)

const chipClasses = computed(() => [
  'zn-chip',
  `zn-chip--${props.variant}`,
  `zn-chip--${props.size}`,
  {
    'zn-chip--selected': props.selected,
    'zn-chip--disabled': props.disabled,
    'zn-chip--clickable': props.clickable && !props.disabled,
    'zn-chip--elevated': props.elevated && props.variant !== 'input',
    'zn-chip--removable': props.removable,
    'zn-chip--with-leading': hasLeading.value
  }
])

function onClick(event) {
  if (props.disabled) return
  emit('click', event)
}

function onKeydown(event) {
  if (!props.clickable || props.disabled) return
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  emit('click', event)
}

function onRemove() {
  if (props.disabled) return
  emit('remove')
}
</script>

<style scoped>
.zn-chip {
  display: inline-flex;
  box-sizing: border-box;
  align-items: center;
  gap: 8px;
  max-width: 100%;
  min-width: 0;
  height: 32px;
  padding: 0 16px;
  border: 1px solid var(--md-outline);
  border-radius: 8px;
  background-color: transparent;
  color: var(--md-on-surface-variant);
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.15s cubic-bezier(0.2, 0, 0, 1),
              border-color 0.15s cubic-bezier(0.2, 0, 0, 1);
}

/* Tamaños (escala de densidad MD3) */
.zn-chip--small {
  height: 24px;
  padding: 0 12px;
}

.zn-chip--large {
  height: 40px;
  padding: 0 20px;
}

/* Icono inicial */
.zn-chip--with-leading {
  padding-left: 8px;
}

.zn-chip--small.zn-chip--with-leading {
  padding-left: 6px;
}

.zn-chip--large.zn-chip--with-leading {
  padding-left: 12px;
}

/* Chip de entrada: el botón de quitar ocupa el extremo final */
.zn-chip--removable {
  padding-right: 8px;
}

.zn-chip--small.zn-chip--removable {
  padding-right: 6px;
}

.zn-chip--large.zn-chip--removable {
  padding-right: 12px;
}

.zn-chip__leading,
.zn-chip__remove {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  line-height: 0;
}

.zn-chip__icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.zn-chip__label {
  overflow: hidden;
  min-width: 0;
  text-overflow: ellipsis;
}

/* Acciones */
.zn-chip--clickable {
  cursor: pointer;
}

.zn-chip--clickable:hover {
  background-color: color-mix(in srgb, var(--md-on-surface-variant) 12%, transparent);
}

.zn-chip--clickable:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.zn-chip__remove {
  border-radius: 50%;
  cursor: pointer;
  color: var(--md-on-surface-variant);
}

.zn-chip__remove:hover {
  background-color: color-mix(in srgb, var(--md-on-surface-variant) 16%, transparent);
}

/* Variante elevada: sin contorno y con elevación de nivel 1 */
.zn-chip--elevated {
  border-color: transparent;
  background-color: var(--md-surface-container-low, var(--md-surface));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

/* Filtro seleccionado: secondary-container y check inicial */
.zn-chip--filter.zn-chip--selected {
  border-color: transparent;
  background-color: var(--md-secondary-container, var(--md-primary-container));
  color: var(--md-on-secondary-container, var(--md-on-primary-container));
}

.zn-chip--filter.zn-chip--selected.zn-chip--clickable:hover {
  background-color: color-mix(
    in srgb,
    var(--md-on-secondary-container, var(--md-on-primary-container)) 12%,
    var(--md-secondary-container, var(--md-primary-container))
  );
}

.zn-chip--disabled {
  cursor: default;
  opacity: 0.38;
  pointer-events: none;
}
</style>
