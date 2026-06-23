<template>
  <component
    :is="tag"
    :class="[
      'zn-button',
      `zn-button--${variant}`,
      { 'zn-button--icon-only': iconOnly }
    ]"
    :disabled="tag === 'button' ? disabled : undefined"
    :role="tag !== 'button' ? 'button' : undefined"
  >
    <span v-if="$slots.icon && !iconOnly" class="zn-button__icon-slot">
      <slot name="icon" />
    </span>

    <span v-if="!iconOnly" class="zn-button__text">
      <slot />
    </span>

    <slot v-else />
  </component>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'filled',
    validator: (value) => ['filled', 'tonal', 'elevated', 'outlined', 'text'].includes(value)
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
  }
})
</script>

<style scoped>
/* ==========================================================================
   DISEÑO BASE DE BOTÓN (MATERIAL DESIGN 3)
   ========================================================================== */
.zn-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.875rem; /* 14px */
  font-weight: 500; /* Medium */
  letter-spacing: 0.1px;
  line-height: 20px;
  height: 40px;
  padding: 0 24px;
  border-radius: 20px; /* Completamente redondeado (Pill) */
  border: none;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
              box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1),
              color 0.2s cubic-bezier(0.2, 0, 0, 1);
  text-decoration: none;
}

/* Ajustes estructurales para Botón de Icono Puro */
.zn-button--icon-only {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 50%; /* Círculo perfecto */
}

.zn-button__icon-slot :deep(svg),
.zn-button--icon-only :deep(svg) {
  width: 18px;
  height: 18px;
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
  background-color: linear-gradient(0deg, rgba(255,255,255,0.08), rgba(255,255,255,0.08)), var(--md-primary);
  box-shadow: 0px 1px 3px rgba(0,0,0,0.12), 0px 1px 2px rgba(0,0,0,0.24);
}

/* 2. TONAL (Énfasis Medio-Alto) */
.zn-button--tonal {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
}
.zn-button--tonal:hover {
  box-shadow: 0px 1px 2px rgba(0,0,0,0.1);
}

/* 3. ELEVATED (Énfasis Medio con Sombra Flotante) */
.zn-button--elevated {
  background-color: var(--md-surface);
  color: var(--md-primary);
  box-shadow: 0px 1px 3px rgba(0,0,0,0.15);
}
.zn-button--elevated:hover {
  box-shadow: 0px 4px 8px rgba(0,0,0,0.2);
}

/* 4. OUTLINED (Énfasis Medio-Bajo) */
.zn-button--outlined {
  background-color: transparent;
  color: var(--md-primary);
  border: 1px solid var(--md-outline);
}
.zn-button--outlined:hover {
  background-color: rgba(103, 80, 164, 0.08); /* Tinte primario suave */
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
  background-color: var(--md-surface-variant);
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