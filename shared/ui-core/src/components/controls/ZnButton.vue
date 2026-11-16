<template>
  <component
    :is="tag"
    :class="[
      'zn-button',
      `zn-button--${effectiveVariant}`,
      {
        'zn-button--icon-only': iconOnly,
        'zn-button--toggle': toggle,
        'zn-button--selected': isSelected
      }
    ]"
    :disabled="tag === 'button' ? disabled : undefined"
    :role="buttonRole"
    :aria-pressed="ariaPressed"
    @click="handleClick"
  >
    <span v-if="($slots.icon || isSelected) && !iconOnly" class="zn-button__icon-slot">
      <slot name="icon" />
    </span>

    <span v-if="!iconOnly" class="zn-button__text">
      <slot />
    </span>

    <slot v-else />
  </component>
</template>

<script setup>
import { computed, inject } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: undefined,
    validator: (value) => value === undefined || ['filled', 'tonal', 'elevated', 'outlined', 'text'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  iconOnly: {
    type: Boolean,
    default: false
  },
  tag: {
    type: String,
    default: 'button'
  },
  /** Habilita modo toggle (seleccionable/conmutable). */
  toggle: {
    type: Boolean,
    default: false
  },
  /** Estado de selección en modo v-model o standalone toggle. */
  selected: {
    type: Boolean,
    default: false
  },
  /** Valor identificador del botón cuando está dentro de un ZnButtonGroup. */
  value: {
    type: [String, Number, Boolean, Object],
    default: undefined
  }
})

const emit = defineEmits(['click', 'update:selected'])

const buttonGroup = inject('znButtonGroup', null)

const isSelected = computed(() => {
  if (buttonGroup && props.value !== undefined) {
    return buttonGroup.isValueSelected(props.value)
  }
  return props.selected
})

const isToggleMode = computed(() => {
  return props.toggle || (buttonGroup && buttonGroup.isToggleGroup)
})

const effectiveVariant = computed(() => {
  if (props.variant) return props.variant
  if (buttonGroup && buttonGroup.variant) return buttonGroup.variant
  return 'filled'
})

const buttonRole = computed(() => {
  if (isToggleMode.value) return 'button'
  return props.tag !== 'button' ? 'button' : undefined
})

const ariaPressed = computed(() => {
  if (isToggleMode.value) {
    return isSelected.value ? 'true' : 'false'
  }
  return undefined
})

function handleClick(event) {
  if (props.disabled) return

  if (buttonGroup && props.value !== undefined) {
    buttonGroup.selectValue(props.value)
  } else if (props.toggle) {
    emit('update:selected', !props.selected)
  }

  emit('click', event)
}
</script>

<style scoped>
/* ==========================================================================
   DISEÑO BASE DE BOTÓN (MATERIAL DESIGN 3)
   ========================================================================== */
.zn-button {
  display: inline-flex;
  box-sizing: border-box;
  min-width: 0;
  max-width: 100%;
  min-height: 40px;
  height: auto;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 500; /* Medium */
  letter-spacing: 0.1px;
  line-height: 20px;
  padding: 8px 24px;
  border-radius: 20px; /* Completamente redondeado (Pill) */
  border: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
              box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1),
              color 0.2s cubic-bezier(0.2, 0, 0, 1),
              border-color 0.2s cubic-bezier(0.2, 0, 0, 1);
  text-decoration: none;
  text-align: center;
  white-space: normal;
  overflow-wrap: anywhere;
}

.zn-button__text {
  min-width: 0;
  overflow-wrap: anywhere;
}

/* Ajustes estructurales para Botón de Icono Puro */
.zn-button--icon-only {
  width: 40px;
  height: 40px;
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  border-radius: 50%; /* Círculo perfecto */
}

/* ==========================================================================
   HERENCIA DE COLOR DE ICONOS (MD3: el icono sigue el color del label)
   ========================================================================== */
.zn-button__icon-slot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
  color: inherit;
  flex: 0 0 auto;
}

.zn-button__icon-slot :deep(svg),
.zn-button--icon-only :deep(svg) {
  width: 18px;
  height: 18px;
  color: inherit;
}

.zn-button__icon-slot :deep(svg:not([fill="none"])),
.zn-button--icon-only :deep(svg:not([fill="none"])),
.zn-button__icon-slot :deep(svg:not([fill="none"]) path:not([fill="none"])),
.zn-button--icon-only :deep(svg:not([fill="none"]) path:not([fill="none"])) {
  fill: currentColor;
}

/* ==========================================================================
   VARIANTES CROMÁTICAS DE MD3
   ========================================================================== */

/* 1. FILLED (Énfasis Máximo) */
.zn-button--filled {
  background-color: var(--md-primary);
  color: var(--md-on-primary);
}
.zn-button--filled:hover {
  color: var(--md-on-primary);
  background-color: var(--md-primary);
  background-image: linear-gradient(rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.08));
  box-shadow: 0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24);
}
.zn-button--filled.zn-button--selected {
  background-color: var(--md-primary-container, #EADDFF);
  color: var(--md-on-primary-container, #21005D);
}

/* 2. TONAL (Énfasis Medio-Alto) */
.zn-button--tonal {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
}
.zn-button--tonal:hover {
  background-color: color-mix(in srgb, var(--md-on-surface-variant) 8%, var(--md-surface-variant));
  box-shadow: 0px 1px 2px rgba(0,0,0,0.1);
}
.zn-button--tonal.zn-button--selected {
  background-color: var(--md-secondary-container, #E8DEF8);
  color: var(--md-on-secondary-container, #1D192B);
}

/* 3. ELEVATED (Énfasis Medio con Sombra Flotante) */
.zn-button--elevated {
  background-color: var(--md-surface);
  color: var(--md-primary);
  box-shadow: 0px 1px 3px rgba(0,0,0,0.15);
}
.zn-button--elevated:hover {
  background-color: color-mix(in srgb, var(--md-primary) 8%, var(--md-surface));
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
}
.zn-button--elevated.zn-button--selected {
  background-color: var(--md-surface-variant);
  color: var(--md-primary);
}

/* 4. OUTLINED (Énfasis Medio-Bajo / Segmented buttons default) */
.zn-button--outlined {
  background-color: transparent;
  color: var(--md-primary);
  border: 1px solid var(--md-outline);
}
.zn-button--outlined:hover {
  background-color: color-mix(in srgb, var(--md-primary) 8%, transparent);
}
.zn-button--outlined.zn-button--selected {
  background-color: var(--md-secondary-container, var(--md-surface-variant));
  color: var(--md-on-secondary-container, var(--md-primary));
}

/* 5. TEXT (Énfasis Bajo / Botón Plano) */
.zn-button--text {
  background-color: transparent;
  color: var(--md-primary);
  padding: 0 12px;
}
.zn-button--text.zn-button--icon-only {
  padding: 0;
  color: var(--md-outline); /* El indicador del colapsable usa este tono */
}
.zn-button--text:hover {
  background-color: color-mix(in srgb, var(--md-primary) 8%, transparent);
}
.zn-button--text.zn-button--selected {
  background-color: color-mix(in srgb, var(--md-primary) 12%, transparent);
  color: var(--md-primary);
}

/* ==========================================================================
   ESTADO DESHABILITADO (MD3 SPEC)
   ========================================================================== */
.zn-button:disabled,
.zn-button[disabled] {
  background-color: rgba(29, 27, 32, 0.12) !important;
  color: rgba(29, 27, 32, 0.38) !important;
  border-color: transparent !important;
  box-shadow: none !important;
  cursor: not-allowed;
  pointer-events: none;
}
</style>