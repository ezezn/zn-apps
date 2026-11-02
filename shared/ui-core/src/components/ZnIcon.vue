<template>
  <svg
    class="zn-icon"
    :class="`zn-icon--${familyName}`"
    :width="sizeValue"
    :height="sizeValue"
    viewBox="0 0 24 24"
    focusable="false"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    :aria-hidden="label ? undefined : 'true'"
  >
    <use :href="href" />
  </svg>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import {
  DEFAULT_ICON_FAMILY,
  ICON_FAMILIES,
  iconSymbolId,
  loadIconFamily,
  normalizeFamily,
} from '../icons/index.js'

const props = defineProps({
  /** Nombre del icono Material Design, ej. `'home'`, `'play_arrow'`. */
  name: {
    type: String,
    required: true
  },
  /** Familia/estilo del set Material Icons. */
  family: {
    type: String,
    default: DEFAULT_ICON_FAMILY,
    validator: (value) => ICON_FAMILIES.includes(value)
  },
  /** Tamaño en px (número) o cualquier unidad CSS (string). */
  size: {
    type: [Number, String],
    default: 24
  },
  /** Etiqueta accesible. Sin ella el icono es decorativo (`aria-hidden`). */
  label: {
    type: String,
    default: ''
  }
})

const familyName = computed(() => normalizeFamily(props.family))
const href = computed(() => `#${iconSymbolId(familyName.value, props.name)}`)
const sizeValue = computed(() => (typeof props.size === 'number' ? `${props.size}px` : props.size))

function ensureFamily() {
  loadIconFamily(familyName.value)
    .then((names) => {
      if (import.meta.env?.DEV && !names.has(props.name)) {
        console.warn(
          `[ZnIcon] El icono "${props.name}" no existe en la familia "${familyName.value}".`
        )
      }
    })
    .catch((error) => {
      if (import.meta.env?.DEV) {
        console.warn('[ZnIcon] No se pudo cargar el sprite de iconos:', error)
      }
    })
}

onMounted(ensureFamily)
watch(familyName, ensureFamily)
</script>

<style scoped>
.zn-icon {
  display: inline-block;
  flex: none;
  vertical-align: middle;
  /* Hereda el color del texto para respetar el contraste del contenedor. */
  fill: currentColor;
  color: inherit;
}
</style>
