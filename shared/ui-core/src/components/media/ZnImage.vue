<template>
  <img
    class="zn-image"
    :class="imageClasses"
    :style="imageStyle"
    :src="src"
    :alt="alt || undefined"
    :width="width"
    :height="height"
    :decoding="decode ? 'async' : undefined"
    @load="onLoad"
    @error="onError"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  /**
   * Ruta o URL de la imagen (ruta de assets, URL absoluta o data URL). El
   * componente no redimensiona el archivo: se usa `object-fit` sobre un bloque
   * con anchura y altura explícitas, igual que hace `ZnCard` con
   * `background-image`.
   */
  src: {
    type: String,
    default: ''
  },
  /**
   * Texto alternativo para lectores de pantalla. Si no se da, la imagen no
   * tiene nombre accesible.
   */
  alt: {
    type: String,
    default: ''
  },
  /**
   * Ancho final en px (número) o cualquier unidad CSS (string).
   * Por defecto: 100% del contenedor.
   */
  width: {
    type: [Number, String],
    default: '100%'
  },
  /**
   * Alto final en px (número) o cualquier unidad CSS (string).
   * Por defecto: `100%` (se respeta el ratio de la imagen).
   */
  height: {
    type: [Number, String],
    default: '100%'
  },
  /**
   * Relleno de la imagen dentro del contenedor.
   * `cover`: recorta centrada (Material Device Design, cabeceras).
   * `contain`: mantiene el ratio completo sin recorte.
   * @values contain | cover
   */
  fit: {
    type: String,
    default: 'cover',
    validator: (value) => ['contain', 'cover'].includes(value)
  },
  /**
   * Si `true`, la imagen se recorta al contenedor con `object-fit: cover`, sin
   * dejar hueco alrededor. Útil para cabeceras y márgenes redondeados.
   */
  crop: {
    type: Boolean,
    default: false
  },
  /**
   * Desbloquea la decodificación asíncrona de la imagen para no bloquear el
   * hilo principal y dejar responder el resto de la UI mientras se carga.
   */
  decode: {
    type: Boolean,
    default: true
  },
  /**
   * Aplica un scrim semitransparente detrás de la imagen. El componente no
   * gestiona el contraste del texto: el consumidor aplica el scrim si lo
   * necesita.
   */
  scrim: {
    type: Boolean,
    default: false
  },
  /**
   * Color del scrim opcional.
   * @default 'rgba(0, 0, 0, 0.35)'
   */
  scrimColor: {
    type: String,
    default: 'rgba(0, 0, 0, 0.35)'
  },
  /**
   * Si `true`, la imagen no se muestra hasta que está lista; se renderiza el
   * slot `empty` en su lugar.
   */
  lazy: {
    type: Boolean,
    default: false
  }
})

const imageClasses = computed(() => ({
  'zn-image--cover': props.fit === 'cover',
  'zn-image--contain': props.fit === 'contain',
  'zn-image--crop': props.crop,
  'zn-image--with-scrim': props.scrim,
  'zn-image--loading': isLoading.value,
  'zn-image--loaded': isLoaded.value
}))

const imageStyle = computed(() => ({
  width: props.width,
  height: props.height,
  objectFit: props.fit,
  objectPosition: 'center',
  backgroundColor: props.scrim ? props.scrimColor : 'transparent'
}))

const isLoading = ref(true)
const isLoaded = ref(false)

function onLoad() {
  isLoading.value = false
  isLoaded.value = true
}

function onError() {
  isLoading.value = false
  isLoaded.value = false
}

onMounted(() => {
  if (!props.lazy && props.src) {
    const img = new Image()
    img.src = props.src
    img.onload = onLoad
    img.onerror = onError
  }
})
</script>

<style scoped>
.zn-image {
  display: block;
  max-width: 100%;
  /* width/height vienen por props para mantener el ratio y el crop controlado. */
  height: auto;
  vertical-align: middle;
  /* Revertir el reset global de img; ZnImage controla su propio box. */
  user-select: none;
}

/* Contenedor que fuerza el size declarado y el relleno. */
.zn-image__wrapper {
  display: block;
  width: 100%;
}

.zn-image--cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zn-image--contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.zn-image--crop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.zn-image--with-scrim::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--md-scrim, rgba(0, 0, 0, 0.35));
  border-radius: inherit;
  pointer-events: none;
}

/* Estado de carga: opacidad suave mientras se decodifica. */
.zn-image--loading {
  opacity: 0.6;
  transition: opacity 180ms ease;
}

.zn-image--loaded {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .zn-image--loading {
    transition: none;
  }
}
</style>
