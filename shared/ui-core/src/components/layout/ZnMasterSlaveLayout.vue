<template>
  <div
    class="zn-master-slave-layout"
    :class="{
      'zn-master-slave-layout--mobile': isMobile,
      'zn-master-slave-layout--mobile-detail': isMobile && isSlaveVisible
    }"
  >
    <!-- Escritorio: navegación acoplada al costado (MD3 standard drawer). -->
    <aside
      v-if="!isMobile"
      class="zn-master-slave-layout__master zn-master-slave-layout__master--pane"
      @click.capture="handleMasterClick"
    >
      <slot name="master" />
    </aside>

    <main
      ref="slaveRef"
      class="zn-master-slave-layout__slave"
      :aria-hidden="isMobile && !isSlaveVisible ? 'true' : undefined"
      :inert="isMobile && !isSlaveVisible"
    >
      <slot />
    </main>

    <template v-if="isMobile">
      <!--
        Patrón mobile "navegación primero": la app arranca sin contenido
        seleccionado, así que el master ocupa la pantalla.
      -->
      <aside
        v-if="!isSlaveVisible"
        class="zn-master-slave-layout__master zn-master-slave-layout__master--screen"
        @click.capture="handleMasterClick"
      >
        <slot name="master" />
      </aside>

      <!--
        Patrón mobile "contenido primero": hay una página activa, que ocupa la
        pantalla; la navegación vive en un drawer modal que abre el botón
        hamburguesa del ZnScreen activo.
      -->
      <ZnDrawer
        v-else
        v-model="isDrawerOpen"
        variant="modal"
        label="Navegación"
        @close="handleDrawerClose"
      >
        <div
          class="zn-master-slave-layout__master zn-master-slave-layout__master--drawer"
          @click.capture="handleMasterClick"
        >
          <slot name="master" />
        </div>
      </ZnDrawer>
    </template>
  </div>
</template>

<script setup>
import { provide, ref, watch, onMounted, onUnmounted } from 'vue'
import { screenNavigationKey } from './screenNavigation.js'
import ZnDrawer from '../navigation/ZnDrawer.vue'

const props = defineProps({
  /** Bind to the active route (for example, `$route.fullPath`). */
  viewKey: {
    type: [String, Number],
    default: null
  },
  breakpoint: {
    type: Number,
    default: 768
  }
})

// El breakpoint se resuelve en `setup`, antes del primer render: así el layout
// nace ya con la clase de móvil o de escritorio y no necesita reglas CSS de
// respaldo que luego compitan con el estado real.
const mediaQuery = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia(`(max-width: ${props.breakpoint}px)`)
  : null

const isMobile = ref(mediaQuery ? mediaQuery.matches : false)
const isSlaveVisible = ref(false)
const isDrawerOpen = ref(false)
const slaveRef = ref(null)

/**
 * Solo hay contenido real cuando el router ya resolvió la ruta; con él aún en
 * `START_LOCATION` el slot está vacío y darle el foco dejaría la pantalla en
 * blanco en móvil.
 */
function slaveHasContent() {
  if (!slaveRef.value) return false
  return Array.from(slaveRef.value.childNodes).some((node) => node.nodeType === 1)
}

function goBack() {
  isSlaveVisible.value = false
  isDrawerOpen.value = false
}

function openDrawer() {
  if (isMobile.value && isSlaveVisible.value) isDrawerOpen.value = true
}

function closeDrawer() {
  isDrawerOpen.value = false
}

function handleDrawerClose() {
  isDrawerOpen.value = false
}

function handleMasterClick(event) {
  if (event.target instanceof Element && event.target.closest('a, [role="link"]')) {
    isSlaveVisible.value = true
    isDrawerOpen.value = false
  }
}

watch(() => props.viewKey, (next, previous) => {
  if (next !== previous && next !== null && isMobile.value) {
    isSlaveVisible.value = true
    isDrawerOpen.value = false
  }
})

provide(screenNavigationKey, {
  isMobile,
  isSlaveVisible,
  isDrawerOpen,
  openDrawer,
  closeDrawer,
  goBack
})

onMounted(() => {
  if (!mediaQuery) return

  isMobile.value = mediaQuery.matches
  // Si el router ya resolvió una ruta y el slot pintó contenido, la app usa el
  // patrón "contenido primero" y ese contenido arranca con el foco; la
  // navegación queda detrás del drawer. Sin ruta (o con el router aún
  // resolviendo), arranca el master para no mostrar una pantalla vacía.
  if (mediaQuery.matches && props.viewKey !== null && slaveHasContent()) {
    isSlaveVisible.value = true
  }
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handleBreakpointChange)
  } else {
    mediaQuery.addListener?.(handleBreakpointChange)
  }
})

onUnmounted(() => {
  if (mediaQuery?.removeEventListener) {
    mediaQuery.removeEventListener('change', handleBreakpointChange)
  } else {
    mediaQuery?.removeListener?.(handleBreakpointChange)
  }
})

function handleBreakpointChange(event) {
  isMobile.value = event.matches
  if (!event.matches) {
    isSlaveVisible.value = false
    isDrawerOpen.value = false
  }
}
</script>

<style scoped>
.zn-master-slave-layout {
  display: grid;
  grid-template-columns: minmax(280px, 320px) minmax(0, 1fr);
  width: 100%;
  min-height: 100dvh;
  background: var(--md-background);
}

.zn-master-slave-layout__master,
.zn-master-slave-layout__slave {
  min-width: 0;
  min-height: 100dvh;
}

.zn-master-slave-layout__master--pane {
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow: auto;
  border-right: 1px solid var(--md-surface-variant);
  background: var(--md-surface);
}

/* La navegación se comporta como Navigation Drawer MD3 en ambos layouts. */
.zn-master-slave-layout__master :deep(.zn-screen) {
  min-height: 100%;
  background: var(--md-surface);
  color: var(--md-on-surface);
}

.zn-master-slave-layout__master :deep(.zn-screen__header),
.zn-master-slave-layout__master :deep(.zn-screen__header--scrolled) {
  position: sticky;
  height: auto;
  min-height: 72px;
  padding: 16px;
  background: var(--md-surface);
  border-color: transparent;
  box-shadow: none;
}

.zn-master-slave-layout__master :deep(.zn-screen__subtitle) {
  color: var(--md-on-surface-variant);
}

.zn-master-slave-layout__master :deep(.zn-screen__content) {
  display: flex;
  flex-direction: column;
  padding: 8px 12px 16px;
}

.zn-master-slave-layout__master :deep(nav) {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.zn-master-slave-layout__master :deep(.zn-screen__menu) {
  display: none;
}

.zn-master-slave-layout__master :deep(a),
.zn-master-slave-layout__master :deep([role='link']) {
  display: flex;
  align-items: center;
  min-height: 56px;
  padding: 0 16px;
  border-radius: 100px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.zn-master-slave-layout__master :deep(a:hover),
.zn-master-slave-layout__master :deep([role='link']:hover) {
  background: color-mix(in srgb, var(--md-on-surface) 8%, transparent);
}

.zn-master-slave-layout__master :deep(a:focus-visible),
.zn-master-slave-layout__master :deep([role='link']:focus-visible) {
  outline: 2px solid var(--md-primary);
  outline-offset: 2px;
}

.zn-master-slave-layout__master :deep(a.router-link-active),
.zn-master-slave-layout__master :deep(a[aria-current='page']),
.zn-master-slave-layout__master :deep([role='link'][aria-current='page']) {
  background: var(--md-primary-container);
  color: var(--md-on-primary-container);
}

.zn-master-slave-layout__slave {
  height: 100dvh;
  overflow: auto;
  background: var(--md-background);
}

/* ==========================================================================
   Mobile: una sola pantalla a la vez
   ========================================================================== */
.zn-master-slave-layout--mobile {
  display: block;
  position: relative;
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  isolation: isolate;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master--screen,
.zn-master-slave-layout--mobile .zn-master-slave-layout__slave {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  min-height: 100dvh;
  border: 0;
  overflow: hidden;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__slave {
  z-index: 1;
  transform: translateX(100%);
  pointer-events: none;
  transition: transform 320ms cubic-bezier(0.2, 0, 0, 1);
  will-change: transform;
}

.zn-master-slave-layout--mobile-detail .zn-master-slave-layout__slave {
  z-index: 3;
  transform: translateX(0);
  pointer-events: auto;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master--screen {
  z-index: 2;
  background: var(--md-background);
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master--screen :deep(.zn-screen) {
  background: var(--md-background);
  color: var(--md-on-background);
}

.zn-master-slave-layout__master--drawer {
  min-height: 100%;
}

/* El drawer modal ya aporta su propio header con cierre. */
.zn-master-slave-layout__master--drawer :deep(.zn-screen__header),
.zn-master-slave-layout__master--drawer :deep(.zn-screen__header--scrolled) {
  background: var(--md-surface-container-low, var(--md-surface));
  min-height: 56px;
  padding: 8px 16px;
}

.zn-master-slave-layout__master--drawer :deep(.zn-screen__content) {
  padding: 8px 12px 16px;
  background: var(--md-surface-container-low, var(--md-surface));
}

.zn-master-slave-layout__master--drawer :deep(a),
.zn-master-slave-layout__master--drawer :deep([role='link']) {
  min-height: 48px;
}

@media (prefers-reduced-motion: reduce) {
  .zn-master-slave-layout--mobile .zn-master-slave-layout__slave {
    transition: none;
  }
}
</style>
