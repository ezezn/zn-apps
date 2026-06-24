<template>
  <label 
    :class="[
      'zn-switch-wrapper', 
      { 'zn-switch-wrapper--disabled': disabled }
    ]"
  >
    <span v-if="labelLeft || $slots.labelLeft" class="zn-switch__label zn-switch__label--left">
      <slot name="labelLeft">{{ labelLeft }}</slot>
    </span>

    <div 
      :class="[
        'zn-switch', 
        { 
          'zn-switch--checked': modelValue,
          'zn-switch--has-icons': $slots.iconOn || $slots.iconOff
        }
      ]"
    >
      <input
        type="checkbox"
        class="zn-switch__input"
        :checked="modelValue"
        :disabled="disabled"
        @change="handleChange"
      />
      <div class="zn-switch__track">
        <div class="zn-switch__thumb">
          <span v-if="modelValue && $slots.iconOn" class="zn-switch__icon">
            <slot name="iconOn" />
          </span>
          <span v-if="!modelValue && $slots.iconOff" class="zn-switch__icon">
            <slot name="iconOff" />
          </span>
        </div>
      </div>
    </div>

    <span v-if="labelRight || $slots.labelRight" class="zn-switch__label zn-switch__label--right">
      <slot name="labelRight">{{ labelRight }}</slot>
    </span>
  </label>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  labelLeft: {
    type: String,
    default: ''
  },
  labelRight: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

function handleChange(event) {
  const isChecked = event.target.checked
  emit('update:modelValue', isChecked)
  emit('change', isChecked)
}
</script>

<style scoped>
/* ==========================================================================
   CONTENEDOR GLOBAL (ALINEACIÓN)
   ========================================================================== */
.zn-switch-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
  font-family: 'Roboto', sans-serif;
  font-size: 0.95rem;
  color: var(--md-on-background);
}

.zn-switch__label {
  line-height: 1;
}

/* ==========================================================================
   INTERRUPTOR (DISEÑO ESPECÍFICO MD3)
   ========================================================================== */
.zn-switch {
  position: relative;
  width: 52px;
  height: 32px;
  display: inline-block;
}

/* Ocultar checkbox nativo pero mantenerlo accesible */
.zn-switch__input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  margin: 0;
  cursor: pointer;
  z-index: 3;
}

/* CARRIL (TRACK) */
.zn-switch__track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--md-surface-variant);
  border: 2px solid var(--md-outline);
  border-radius: 16px; /* Totalmente elíptico */
  transition: background-color 0.2s cubic-bezier(0.2, 0, 0, 1),
              border-color 0.2s cubic-bezier(0.2, 0, 0, 1);
  z-index: 1;
}

/* ACTUADOR (THUMB) */
.zn-switch__thumb {
  position: absolute;
  /* Centrado vertical inicial para el actuador pequeño de MD3 (16px) */
  top: 50%;
  left: 4px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background-color: var(--md-outline);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s cubic-bezier(0.2, 0, 0, 1),
              width 0.2s cubic-bezier(0.2, 0, 0, 1),
              height 0.2s cubic-bezier(0.2, 0, 0, 1),
              background-color 0.2s cubic-bezier(0.2, 0, 0, 1);
  z-index: 2;
}

/* REGLA MD3: Si tiene iconos internos, el actuador apagado es más grande (24px) */
.zn-switch--has-icons .zn-switch__thumb {
  width: 24px;
  height: 24px;
  background-color: var(--md-surface-variant);
}

/* ==========================================================================
   ESTADOS ACTIVOS (CHECKED)
   ========================================================================== */
.zn-switch--checked .zn-switch__track {
  background-color: var(--md-primary);
  border-color: var(--md-primary);
}

.zn-switch--checked .zn-switch__thumb {
  /* Se expande a 24px al encenderse y se mueve a la derecha */
  width: 24px;
  height: 24px;
  transform: translate(20px, -50%); /* 52px total - 4px margen - 24px de cuerpo = 24px libres */
  background-color: var(--md-on-primary);
}

/* Ajuste de color para el icono interno */
.zn-switch__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--md-primary);
  width: 16px;
  height: 16px;
}

/* Si está encendido, el icono toma el color contrastante del fondo activo */
.zn-switch--checked .zn-switch__icon {
  color: var(--md-on-primary-container, #21005D);
}

.zn-switch__icon :deep(svg) {
  width: 16px;
  height: 16px;
}

/* ==========================================================================
   ESTADO DESHABILITADO
   ========================================================================== */
.zn-switch-wrapper--disabled {
  cursor: not-allowed;
  opacity: 0.38; /* Opacidad estándar MD3 para controles deshabilitados */
}
.zn-switch-wrapper--disabled .zn-switch__input {
  pointer-events: none;
}
</style>