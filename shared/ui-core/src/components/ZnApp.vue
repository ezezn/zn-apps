<template>
  <div :class="['zn-app-root', computedMode]">
    <slot />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue' // <-- Importamos watch

const props = defineProps({
  mode: {
    type: String,
    default: 'system', // Opciones: 'light' | 'dark' | 'system'
    validator: (value) => ['light', 'dark', 'system'].includes(value)
  }
})

// Estado reactivo para la preferencia del sistema operativo
const systemIsDark = ref(false)
let mediaQuery = null

const updateSystemTheme = (e) => {
  systemIsDark.value = e.matches
}

// Determina el tema final basándose en la prop o en el sistema
const computedMode = computed(() => {
  if (props.mode === 'system') {
    return systemIsDark.value ? 'zn-theme-dark' : 'zn-theme-light'
  }
  return props.mode === 'dark' ? 'zn-theme-dark' : 'zn-theme-light'
})

// ==========================================================================
// OPERACIÓN TRANSPARENTE: Sincronización automática con el body del navegador
// ==========================================================================
watch(computedMode, (newClass, oldClass) => {
  if (typeof document !== 'undefined') {
    // Limpiamos la clase anterior si existía para evitar duplicados
    if (oldClass) document.body.classList.remove(oldClass)
    // Inyectamos la nueva clase evaluada directamente en la raíz física del DOM
    document.body.classList.add(newClass)
  }
}, { immediate: true })

onMounted(() => {
  if (typeof window !== 'undefined') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    systemIsDark.value = mediaQuery.matches
    mediaQuery.addEventListener('change', updateSystemTheme)
  }
})

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', updateSystemTheme)
  }
  // Limpieza preventiva al destruir el componente raíz
  if (typeof document !== 'undefined') {
    document.body.classList.remove('zn-theme-light', 'zn-theme-dark')
  }
})
</script>

<style>
/* ==========================================================================
   ESTILOS DE COBERTURA TOTAL PARA EL BODY NATIVO
   ========================================================================== */
body {
  margin: 0;
  padding: 0;
  /* Al estar la clase zn-theme-* en el body, estas variables se resolverán inmediatamente */
  background-color: var(--md-background);
  color: var(--md-on-background);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.zn-app-root {
  min-height: 100dvh;
  width: 100%;
  background-color: var(--md-background);
  color: var(--md-on-background);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Variables del Tema Claro */
.zn-theme-light {
  --md-primary: #6750A4;
  --md-on-primary: #FFFFFF;
  --md-surface: #F3EDF7;
  --md-on-surface: #1D1B20;
  --md-surface-variant: #E7E0EC;
  --md-on-surface-variant: #49454F;
  --md-background: #FEF7FF;
  --md-on-background: #1D1B20;
  --md-outline: #79747E;
}

/* Variables del Tema Oscuro */
.zn-theme-dark {
  --md-primary: #D0BCFF;
  --md-on-primary: #381E72;
  --md-surface: #211F26;
  --md-on-surface: #E6E1E5;
  --md-surface-variant: #49454F;
  --md-on-surface-variant: #CAC4D0;
  --md-background: #141218;
  --md-on-background: #E6E1E5;
  --md-outline: #938F99;
}
</style>