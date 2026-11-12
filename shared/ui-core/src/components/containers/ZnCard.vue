<template>
  <div 
    :class="[
      'zn-card',
      `zn-card--${variant}`,
      { 'zn-card--full-image': image && imageVariant === 'full' }
    ]"
    :style="fullCardBgStyle"
  >
    <div v-if="image && imageVariant === 'full'" class="zn-card__scrim-full" />

    <header 
      v-if="title || $slots.title" 
      :class="[
        'zn-card__header',
        { 'zn-card__header--has-image': image && imageVariant === 'header' }
      ]"
      :style="headerBgStyle"
    >
      <div v-if="image && imageVariant === 'header'" class="zn-card__scrim-header" />
      
      <div class="zn-card__title-wrapper">
        <slot name="title">
          <h3 class="zn-card__title">{{ title }}</h3>
        </slot>
      </div>
    </header>

    <div class="zn-card__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'filled',
    validator: (value) => ['filled', 'elevated', 'outlined'].includes(value)
  },
  image: {
    type: String,
    default: ''
  },
  imageVariant: {
    type: String,
    default: 'header',
    validator: (value) => ['header', 'full'].includes(value)
  }
})

// Calcula el estilo si la imagen es el fondo total de la tarjeta
const fullCardBgStyle = computed(() => {
  if (props.image && props.imageVariant === 'full') {
    return { backgroundImage: `url(${props.image})` }
  }
  return {}
})

// Calcula el estilo si la imagen va exclusivamente detrás del título
const headerBgStyle = computed(() => {
  if (props.image && props.imageVariant === 'header') {
    return { backgroundImage: `url(${props.image})` }
  }
  return {}
})
</script>

<style scoped>
/* ==========================================================================
   ESTILOS BASE DE LA TARJETA (MATERIAL DESIGN 3)
   ========================================================================== */
.zn-card {
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: 16px; /* MD3 Card Radius (Large standard) */
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  background-size: cover;
  background-position: center;
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}

/* VARIANTE FILLED (Tonal sin sombra) */
.zn-card--filled {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface-variant);
  border: none;
}

/* VARIANTE ELEVATED (Superficie limpia con elevación) */
.zn-card--elevated {
  background-color: var(--md-surface);
  color: var(--md-on-background);
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.15), 
              0px 2px 6px rgba(0, 0, 0, 0.1);
}

/* VARIANTE OUTLINED (Plana con borde perimetral sutil) */
.zn-card--outlined {
  background-color: var(--md-surface);
  color: var(--md-on-background);
  border: 1px solid var(--md-outline);
}

/* ESTADO FULL-IMAGE: Forzar texto claro sobre el fondo */
.zn-card--full-image {
  color: #FFFFFF !important;
}

/* ==========================================================================
   COMPONENTES INTERNOS (HEADER & TEXT)
   ========================================================================== */
.zn-card__header {
  position: relative;
  padding: 16px 16px 8px 16px;
  background-size: cover;
  background-position: center;
}

/* Si la cabecera tiene imagen de fondo, le damos dimensiones controladas */
.zn-card__header--has-image {
  min-height: 120px;
  display: flex;
  align-items: flex-end;
  padding: 16px;
  color: #FFFFFF;
}

.zn-card__title-wrapper {
  position: relative;
  z-index: 2; /* Por encima de las capas protectoras */
  width: 100%;
}

.zn-card__title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem; /* ~20px Title Large */
  font-weight: 500;
  line-height: 26px;
  margin: 0;
}

.zn-card__content {
  position: relative;
  z-index: 2;
  padding: 16px;
  font-size: 0.95rem;
  line-height: 1.5;
}

/* ==========================================================================
   PROTECCIÓN VISUAL (SCRIMS PARA IMÁGENES)
   ========================================================================== */
/* Difuminado negro inferior para cuando la imagen ocupa TODA la tarjeta */
.zn-card__scrim-full {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%);
  z-index: 1;
}

/* Difuminado para cuando la imagen está solo en la cabecera */
.zn-card__scrim-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%);
  z-index: 1;
}
</style>