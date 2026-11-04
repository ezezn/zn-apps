<template>
  <section class="zn-screen">
    <ZnScrollArea class="zn-screen__scroll-area" :label="title || 'Contenido de pantalla'">
      <div ref="sentinelRef" class="zn-screen__sentinel"></div>

      <header
        v-if="title || subtitle || $slots.title || $slots.icon || $slots.actions || showBackButton"
        :class="[
          'zn-screen__header',
          { 'zn-screen__header--scrolled': isScrolled }
        ]"
      >
        <div class="zn-screen__branding">
          <button
            v-if="showBackButton"
            type="button"
            class="zn-screen__back"
            aria-label="Volver a la navegación"
            @click="navigation.goBack"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
          </button>
          <div v-if="$slots.icon" class="zn-screen__icon">
            <slot name="icon" />
          </div>

          <div class="zn-screen__heading">
            <h1 v-if="$slots.title || title" class="zn-screen__title">
              <slot name="title">{{ title }}</slot>
            </h1>
            <p v-if="subtitle" class="zn-screen__subtitle">{{ subtitle }}</p>
          </div>
        </div>

        <div v-if="$slots.actions" class="zn-screen__actions">
          <slot name="actions" />
        </div>
      </header>

      <div class="zn-screen__content">
        <slot />
      </div>
    </ZnScrollArea>
  </section>
</template>

<script setup>
import { computed, inject, ref, onMounted, onUnmounted } from 'vue'
import { screenNavigationKey } from './screenNavigation.js'
import ZnScrollArea from './ZnScrollArea.vue'

defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const isScrolled = ref(false)
const sentinelRef = ref(null)
const navigation = inject(screenNavigationKey, null)
const showBackButton = computed(() => Boolean(
  navigation?.isMobile.value && navigation?.isSlaveVisible.value
))
let observer = null

onMounted(() => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    // Configuramos el observador óptimo de rendimiento
    observer = new IntersectionObserver(([entry]) => {
      // Si el centinela NO está intersectando el viewport, significa que se ocultó por scroll down
      isScrolled.value = !entry.isIntersecting
    }, {
      root: null, // Evalúa de forma inteligente el contenedor de scroll más cercano
      threshold: [1.0] // Dispara exactamente cuando entra o sale por completo el píxel
    })

    if (sentinelRef.value) {
      observer.observe(sentinelRef.value)
    }
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style scoped>
.zn-screen {
  position: relative;
  width: 100%;
  height: 100dvh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  background-color: var(--md-background);
  color: var(--md-on-background);
}

.zn-screen__scroll-area {
  flex: 1 1 auto;
  min-height: 0;
}

/* ==========================================================================
   ESTILOS DEL CENTINELA
   ========================================================================== */
.zn-screen__sentinel {
  flex: 0 0 1px;
  width: 100%;
  height: 1px;
  margin-bottom: -1px;
  pointer-events: none;
  visibility: hidden;
}

/* ==========================================================================
   TOP APP BAR - ESTADO EN REPOSO (Mimetizado con el fondo)
   ========================================================================== */
.zn-screen__header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  height: 72px; 
  padding: 0 24px;
  
  /* En reposo absoluto toma el color de fondo exacto de la app */
  background-color: var(--md-background);
  border-bottom: 1px solid transparent;
  box-shadow: 0 0 0 transparent;
  box-sizing: border-box;
  
  /* Animación fluida de interpolación MD3 */
  transition: 
    background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    height 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    padding 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.zn-screen__branding {
  display: flex;
  align-items: center;
  gap: 16px;
}

.zn-screen__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--md-on-surface);
  cursor: pointer;
}

.zn-screen__back:hover {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}

.zn-screen__back:focus-visible {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.zn-screen__back svg {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.zn-screen__heading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  gap: 2px;
}

.zn-screen__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: var(--md-primary);
}

.zn-screen__icon :deep(svg) {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.zn-screen__title {
  font-family: 'Roboto', sans-serif;
  font-size: 1.4rem; 
  font-weight: 400;
  margin: 0;
  color: var(--md-on-background);
  transition: font-size 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.zn-screen__subtitle {
  margin: 0;
  color: var(--md-on-surface-variant);
  font-family: 'Roboto', sans-serif;
  font-size: 0.8rem;
  line-height: 1.25;
}

.zn-screen__actions {
  display: flex;
  align-items: center;
}

/* ==========================================================================
   TOP APP BAR - ESTADO SCROLLED (Elevado y contenedor MD3)
   ========================================================================== */
.zn-screen__header--scrolled {
  height: 60px; /* Se condensa */
  padding: 0 16px; /* Se compacta horizontalmente */
  
  /* Pasa a usar la tonalidad 'surface' del tema actual */
  background-color: var(--md-surface); 
  
  /* Línea sutil de separación y elevación MD3 */
  border-color: var(--md-surface-variant);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.04);
}

/* Variación tipográfica al condensarse */
.zn-screen__header--scrolled .zn-screen__title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--md-on-surface);
}

/* ==========================================================================
   ÁREA DE CONTENIDO
   ========================================================================== */
.zn-screen__content {
  flex: 1 0 auto;
  padding: 24px;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .zn-screen__header {
    height: 64px;
    padding: 0 16px;
  }
  .zn-screen__content {
    padding: 16px;
  }
}
</style>
