<template>
  <ZnApp :mode="isDarkMode ? 'dark' : 'light'">
    
    <ZnNavigationLayout>
      
      <template #aside-header>
        <span class="kitchensink-logo">🧬 ZnComponents Hub</span>
      </template>

      <template #aside>
        <router-link to="/buttons" class="nav-item">Botones (ZnButton)</router-link>
        <router-link to="/cards" class="nav-item">Tarjetas (ZnCard)</router-link>
        <router-link to="/switches" class="nav-item">Selectores (ZnSwitch)</router-link>
      </template>

      <router-view />

    </ZnNavigationLayout>

  </ZnApp>
</template>

<script setup>
import { ref } from 'vue'
import '@zn-apps/shared/dist/shared.css'
import { ZnApp, ZnNavigationLayout } from '@zn-apps/shared'

const isDarkMode = ref(false)
</script>

<style>
/* Estilos sencillos para tus links del menú estilo MD3 Navigation Drawer */
.kitchensink-logo {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--md-primary);
}

.nav-item {
  display: block;
  padding: 12px 16px;
  color: var(--md-on-surface-variant);
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 100px; /* Pastillas MD3 */
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: var(--md-surface-variant);
  color: var(--md-on-surface);
}

/* Clase automática que inyecta vue-router al estar activo */
.router-link-active {
  background-color: var(--md-primary);
  color: var(--md-on-primary) !important;
}
</style>