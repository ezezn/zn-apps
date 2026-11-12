<template>
  <div
    :class="[
      'zn-field',
      {
        'zn-field--floating': floating,
        'zn-field--has-label': Boolean(label),
        'zn-field--has-leading': Boolean($slots.leading),
        'zn-field--focused': focused,
        'zn-field--error': Boolean(error),
        'zn-field--disabled': disabled,
        'zn-field--multiline': multiline,
        'zn-field--outlined': variant === 'outlined',
        'zn-field--filled': variant === 'filled'
      }
    ]"
  >
    <div class="zn-field__body">
      <div v-if="variant === 'outlined'" class="zn-field__outline" aria-hidden="true">
        <span class="zn-field__outline-edge zn-field__outline-edge--leading" />
        <span class="zn-field__outline-notch">
          <span class="zn-field__outline-notch-label">{{ label }}</span>
        </span>
        <span class="zn-field__outline-edge zn-field__outline-edge--trailing" />
      </div>

      <div class="zn-field__content">
        <span v-if="$slots.leading" class="zn-field__affix">
          <slot name="leading" />
        </span>

        <div class="zn-field__control">
          <slot />
        </div>

        <span v-if="$slots.trailing" class="zn-field__affix">
          <slot name="trailing" />
        </span>
      </div>

      <label v-if="label" class="zn-field__label" :for="forId || undefined">
        {{ label }}<span v-if="required" class="zn-field__required" aria-hidden="true">*</span>
      </label>
    </div>

    <p
      v-if="error || hint"
      :id="supportingId"
      :class="['zn-field__supporting', { 'zn-field__supporting--error': Boolean(error) }]"
    >
      {{ error || hint }}
    </p>
  </div>
</template>

<script setup>
import { computed, useId } from 'vue'

/**
 * Estructura visual compartida por todos los campos de entrada MD3
 * (variantes outlined y filled): contorno con muesca, etiqueta flotante,
 * adornos laterales y texto de asistencia / error.
 *
 * Es un componente interno de la categoría `input/`; no se exporta en el
 * barrel porque su API puede cambiar sin previo aviso.
 */
const props = defineProps({
  label: { type: String, default: '' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  focused: { type: Boolean, default: false },
  filled: { type: Boolean, default: false },
  /** Mantiene la etiqueta flotante aunque el campo esté vacío y sin foco. */
  floatLabel: { type: Boolean, default: false },
  required: { type: Boolean, default: false },
  multiline: { type: Boolean, default: false },
  forId: { type: String, default: '' },
  /** Variante MD3 del campo: `outlined` (contorno) o `filled` (relleno). */
  variant: {
    type: String,
    default: 'outlined',
    validator: (value) => ['outlined', 'filled'].includes(value)
  }
})

const uid = useId()
const floating = computed(() => props.focused || props.filled || props.floatLabel)
const supportingId = computed(() => (props.error || props.hint ? `${props.forId || uid}-supporting` : undefined))
</script>

<style scoped>
.zn-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  min-width: 0;
  font-family: 'Roboto', sans-serif;
  color: var(--md-on-background);
}

.zn-field__body {
  position: relative;
  min-width: 0;
  border-radius: 4px;
  /* MD3: el contenedor del campo se separa de la superficie de la tarjeta. */
  background-color: var(--md-surface-container-highest, var(--md-surface));
}

/* --------------------------------------------------------------------------
   Contorno de tres paneles (MD3 Outlined Text Field)
   El panel central reserva el ancho de la etiqueta y su borde superior se
   oculta cuando la etiqueta flota, generando la muesca sin `fieldset`.
   -------------------------------------------------------------------------- */
.zn-field__outline {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: stretch;
  pointer-events: none;
}

.zn-field__outline-edge {
  border: 1px solid var(--md-outline);
  transition: border-color 0.15s ease;
}

.zn-field__outline-edge--leading {
  flex: 0 0 12px;
  border-right: 0;
  border-radius: 4px 0 0 4px;
}

.zn-field__outline-edge--trailing {
  flex: 1 1 auto;
  border-left: 0;
  border-radius: 0 4px 4px 0;
}

.zn-field__outline-notch {
  position: relative;
  flex: 0 0 auto;
  max-width: calc(100% - 24px);
  overflow: hidden;
  border-top: 1px solid var(--md-outline);
  border-bottom: 1px solid var(--md-outline);
  transition: border-color 0.15s ease;
}

/* La muesca solo se abre si existe etiqueta: sin label el contorno es continuo. */
.zn-field--has-label.zn-field--floating .zn-field__outline-notch {
  border-top-color: transparent;
}

.zn-field__outline-notch-label {
  display: block;
  padding: 0 4px;
  overflow: hidden;
  visibility: hidden;
  font-size: 0.75rem;
  line-height: 1;
  white-space: nowrap;
}

/* --------------------------------------------------------------------------
   Variante FILLED (MD3): contenedor con indicador inferior
   -------------------------------------------------------------------------- */
.zn-field--filled .zn-field__body {
  border-radius: 4px 4px 0 0;
}

.zn-field--filled .zn-field__body::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 1px;
  background-color: var(--md-outline);
  transition: background-color 0.15s ease, height 0.15s ease;
}

.zn-field--filled .zn-field__body:hover::after {
  height: 1px;
  background-color: var(--md-on-background);
}

.zn-field--filled.zn-field--focused .zn-field__body::after {
  height: 2px;
  background-color: var(--md-primary);
}

.zn-field--filled.zn-field--error .zn-field__body::after {
  height: 2px;
  background-color: var(--md-error, #B3261E);
}

.zn-field--filled .zn-field__content {
  align-items: flex-end;
  min-height: 56px;
  padding: 20px 16px 10px;
}

.zn-field--filled.zn-field--multiline .zn-field__content {
  padding-top: 20px;
}

/* --------------------------------------------------------------------------
   Contenido y adornos
   -------------------------------------------------------------------------- */
.zn-field__content {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  min-height: 56px;
  padding: 8px 16px;
}

.zn-field--multiline .zn-field__content {
  align-items: stretch;
}

.zn-field__control {
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  min-width: 0;
}

.zn-field--multiline .zn-field__control {
  align-items: stretch;
}

.zn-field__affix {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  color: var(--md-on-surface-variant);
  line-height: 0;
}

.zn-field__affix :deep(svg) {
  width: 20px;
  height: 20px;
  fill: currentColor;
}

/* --------------------------------------------------------------------------
   Etiqueta flotante
   -------------------------------------------------------------------------- */
.zn-field__label {
  position: absolute;
  top: 50%;
  left: 16px;
  max-width: calc(100% - 32px);
  overflow: hidden;
  color: var(--md-on-surface-variant);
  font-size: 1rem;
  line-height: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  pointer-events: none;
  transform: translateY(-50%);
  transform-origin: left center;
  transition: top 0.12s cubic-bezier(0.4, 0, 0.2, 1),
              left 0.12s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.12s cubic-bezier(0.4, 0, 0.2, 1),
              color 0.15s ease;
}

/* Con icono inicial, la etiqueta en reposo empieza después del adorno. */
.zn-field--has-leading:not(.zn-field--floating) .zn-field__label {
  left: 44px;
  max-width: calc(100% - 60px);
}

.zn-field--floating .zn-field__label {
  top: 0;
  left: 16px;
  transform: translateY(-50%) scale(0.75);
}

.zn-field--filled.zn-field--floating .zn-field__label {
  top: 8px;
  left: 16px;
  font-size: 0.75rem;
  line-height: 1;
  transform: none;
}

.zn-field__required {
  margin-left: 2px;
  color: var(--md-error, #B3261E);
}

/* --------------------------------------------------------------------------
   Estados del contorno
   -------------------------------------------------------------------------- */
.zn-field__body:hover .zn-field__outline-edge,
.zn-field__body:hover .zn-field__outline-notch {
  border-color: var(--md-on-background);
}

.zn-field__body:hover .zn-field__outline-notch {
  border-top-color: var(--md-on-background);
}

.zn-field--has-label.zn-field--floating .zn-field__body:hover .zn-field__outline-notch {
  border-top-color: transparent;
}

.zn-field--focused .zn-field__body:hover .zn-field__outline-edge {
  border-color: var(--md-primary);
}

.zn-field--focused .zn-field__body:hover .zn-field__outline-notch {
  border-color: var(--md-primary);
}

.zn-field--focused.zn-field--has-label.zn-field--floating .zn-field__body:hover .zn-field__outline-notch {
  border-top-color: transparent;
}

.zn-field--focused .zn-field__outline-edge {
  border-width: 2px;
  border-color: var(--md-primary);
}

.zn-field--focused .zn-field__outline-notch {
  border-top-width: 2px;
  border-bottom-width: 2px;
  border-color: var(--md-primary);
}

.zn-field--has-label.zn-field--focused.zn-field--floating .zn-field__outline-notch {
  border-top-color: transparent;
}

.zn-field--focused .zn-field__label {
  color: var(--md-primary);
}

.zn-field--error .zn-field__outline-edge,
.zn-field--error .zn-field__outline-notch,
.zn-field--error .zn-field__body:hover .zn-field__outline-edge,
.zn-field--error .zn-field__body:hover .zn-field__outline-notch {
  border-color: var(--md-error, #B3261E);
}

.zn-field--error .zn-field__outline-notch {
  border-top-color: var(--md-error, #B3261E);
}

.zn-field--error.zn-field--has-label.zn-field--floating .zn-field__outline-notch {
  border-top-color: transparent;
}

.zn-field--error .zn-field__label,
.zn-field--error .zn-field__required {
  color: var(--md-error, #B3261E);
}

.zn-field--disabled {
  opacity: 0.38;
}

.zn-field--disabled .zn-field__body:hover .zn-field__outline-edge,
.zn-field--disabled .zn-field__body:hover .zn-field__outline-notch {
  border-color: var(--md-outline);
}

.zn-field--disabled .zn-field__body:hover .zn-field__outline-notch {
  border-top-color: var(--md-outline);
}

.zn-field--disabled.zn-field--has-label.zn-field--floating .zn-field__body:hover .zn-field__outline-notch {
  border-top-color: transparent;
}

/* --------------------------------------------------------------------------
   Texto de asistencia / error
   -------------------------------------------------------------------------- */
.zn-field__supporting {
  margin: 0;
  padding: 0 16px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  line-height: 16px;
}

.zn-field__supporting--error {
  color: var(--md-error, #B3261E);
}

/* --------------------------------------------------------------------------
   Controles nativos dentro del campo
   -------------------------------------------------------------------------- */
.zn-field :deep(input),
.zn-field :deep(textarea) {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--md-on-background);
  font-family: inherit;
  font-size: 1rem;
  line-height: 24px;
  letter-spacing: 0.15px;
  color-scheme: light;
}

.zn-field :deep(textarea) {
  min-height: 88px;
  padding: 4px 0;
  resize: vertical;
}

.zn-field :deep(input::placeholder),
.zn-field :deep(textarea::placeholder) {
  color: var(--md-on-surface-variant);
  opacity: 0.7;
}

/* MD3: con etiqueta flotante, el placeholder solo se revela cuando la
   etiqueta sube (al enfocar o cuando el campo ya tiene valor). */
.zn-field--has-label:not(.zn-field--floating) :deep(input::placeholder),
.zn-field--has-label:not(.zn-field--floating) :deep(textarea::placeholder) {
  color: transparent;
}

.zn-field :deep(input:disabled),
.zn-field :deep(textarea:disabled) {
  cursor: not-allowed;
}

:global(.zn-theme-dark) .zn-field :deep(input),
:global(.zn-theme-dark) .zn-field :deep(textarea) {
  color-scheme: dark;
}
</style>
