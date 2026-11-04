<template>
  <div class="zn-master-slave-layout" :class="{ 'zn-master-slave-layout--mobile': isMobile, 'zn-master-slave-layout--mobile-detail': isMobile && isSlaveVisible }">
    <aside
      class="zn-master-slave-layout__master"
      :aria-hidden="isMobile && isSlaveVisible ? 'true' : undefined"
      :inert="isMobile && isSlaveVisible"
      @click.capture="handleMasterClick"
    >
      <slot name="master" />
    </aside>

    <main
      class="zn-master-slave-layout__slave"
      :aria-hidden="isMobile && !isSlaveVisible ? 'true' : undefined"
      :inert="isMobile && !isSlaveVisible"
    >
      <slot />
    </main>
  </div>
</template>

<script setup>
import { provide, ref, watch, onMounted, onUnmounted } from 'vue'
import { screenNavigationKey } from './screenNavigation.js'

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

const isMobile = ref(false)
const isSlaveVisible = ref(false)
let mediaQuery

function goBack() {
  isSlaveVisible.value = false
}

function handleMasterClick(event) {
  if (event.target instanceof Element && event.target.closest('a, [role="link"]')) {
    isSlaveVisible.value = true
  }
}

watch(() => props.viewKey, (next, previous) => {
  if (next !== previous && next !== null && isMobile.value) {
    isSlaveVisible.value = true
  }
})

provide(screenNavigationKey, { isMobile, isSlaveVisible, goBack })

onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return

  mediaQuery = window.matchMedia(`(max-width: ${props.breakpoint}px)`)
  isMobile.value = mediaQuery.matches
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
  if (!event.matches) isSlaveVisible.value = false
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

.zn-master-slave-layout__master {
  position: sticky;
  top: 0;
  height: 100dvh;
  overflow: auto;
  border-right: 1px solid var(--md-surface-variant);
  background: var(--md-surface);
}

/* En escritorio, ZnScreen dentro del master funciona como Navigation Drawer MD3. */
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

.zn-master-slave-layout--mobile {
  display: block;
  position: relative;
  height: 100dvh;
  min-height: 100dvh;
  overflow: hidden;
  isolation: isolate;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master,
.zn-master-slave-layout--mobile .zn-master-slave-layout__slave {
  width: 100%;
  position: absolute;
  inset: 0;
  height: 100%;
  min-height: 100dvh;
  border: 0;
  overflow: hidden;
  transition: transform 320ms cubic-bezier(0.2, 0, 0, 1);
  will-change: transform;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master {
  z-index: 2;
  transform: translateX(0);
  pointer-events: auto;
  background: var(--md-background);
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master :deep(.zn-screen) {
  background: var(--md-background);
  color: var(--md-on-background);
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__slave {
  z-index: 1;
  transform: translateX(100%);
  pointer-events: none;
  overflow: hidden;
}

.zn-master-slave-layout--mobile-detail .zn-master-slave-layout__master {
  transform: translateX(-100%);
  pointer-events: none;
}

.zn-master-slave-layout--mobile-detail .zn-master-slave-layout__slave {
  z-index: 3;
  transform: translateX(0);
  pointer-events: auto;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master :deep(.zn-screen__header),
.zn-master-slave-layout--mobile .zn-master-slave-layout__master :deep(.zn-screen__header--scrolled) {
  height: 64px;
  min-height: 64px;
  padding: 0 16px;
  background: var(--md-background);
  box-shadow: 0 0 0 transparent;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master :deep(.zn-screen__content) {
  padding: 16px;
}

.zn-master-slave-layout--mobile .zn-master-slave-layout__master :deep(a),
.zn-master-slave-layout--mobile .zn-master-slave-layout__master :deep([role='link']) {
  min-height: 48px;
}

/* Keep the component usable without JavaScript during the first paint. */
@media (max-width: 768px) {
  .zn-master-slave-layout {
    display: block;
    position: relative;
    height: 100dvh;
    min-height: 100dvh;
    overflow: hidden;
    isolation: isolate;
  }

  .zn-master-slave-layout__master,
  .zn-master-slave-layout__slave {
    width: 100%;
    position: absolute;
    inset: 0;
    height: 100%;
    min-height: 100dvh;
    border: 0;
    overflow: hidden;
    transition: transform 320ms cubic-bezier(0.2, 0, 0, 1);
  }

  .zn-master-slave-layout:not(.zn-master-slave-layout--mobile-detail) .zn-master-slave-layout__master {
    z-index: 2;
    transform: translateX(0);
    pointer-events: auto;
    background: var(--md-background);
  }

  .zn-master-slave-layout__master :deep(.zn-screen) {
    background: var(--md-background);
    color: var(--md-on-background);
  }

  .zn-master-slave-layout:not(.zn-master-slave-layout--mobile-detail) .zn-master-slave-layout__slave {
    z-index: 1;
    transform: translateX(100%);
    pointer-events: none;
  }

  .zn-master-slave-layout--mobile-detail .zn-master-slave-layout__master {
    transform: translateX(-100%);
    pointer-events: none;
  }

  .zn-master-slave-layout--mobile-detail .zn-master-slave-layout__slave {
    z-index: 3;
    transform: translateX(0);
    pointer-events: auto;
  }

  .zn-master-slave-layout__master :deep(.zn-screen__header),
  .zn-master-slave-layout__master :deep(.zn-screen__header--scrolled) {
    height: 64px;
    min-height: 64px;
    padding: 0 16px;
    background: var(--md-background);
  }

  .zn-master-slave-layout__master :deep(.zn-screen__content) {
    padding: 16px;
  }

  .zn-master-slave-layout__master :deep(a),
  .zn-master-slave-layout__master :deep([role='link']) {
    min-height: 48px;
  }

}

@media (prefers-reduced-motion: reduce) {
  .zn-master-slave-layout--mobile .zn-master-slave-layout__master,
  .zn-master-slave-layout--mobile .zn-master-slave-layout__slave,
  .zn-master-slave-layout__master,
  .zn-master-slave-layout__slave {
    transition: none;
  }
}
</style>
