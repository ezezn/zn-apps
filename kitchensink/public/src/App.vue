<template>
  <ZnApp :mode="isDarkMode ? 'dark' : 'light'">

    <ZnNavigationLayout>

      <template #aside-header>
        <span class="kitchensink-logo">🧬 ZnComponents Hub</span>
      </template>

      <template #aside>
        <span class="nav-section-label">Componentes</span>
        <router-link to="/buttons" class="nav-item">Botones (ZnButton)</router-link>
        <router-link to="/cards" class="nav-item">Tarjetas (ZnCard)</router-link>
        <router-link to="/switches" class="nav-item">Selectores (ZnSwitch)</router-link>
        <router-link to="/icons" class="nav-item">Iconos (ZnIcon)</router-link>

        <span class="nav-section-label">Layout & Contenedores</span>
        <router-link to="/layout" class="nav-item">Layout (ZnBox / ZnRow)</router-link>
        <router-link to="/sections" class="nav-item">Secciones (ZnSection)</router-link>
        <router-link to="/screen" class="nav-item">Pantallas (ZnScreen)</router-link>
        <router-link to="/navigation-layout" class="nav-item">Navegación (ZnNavigationLayout)</router-link>

        <span class="nav-section-label">Otros</span>
        <router-link to="/legacy" class="nav-item">Legacy y utilidades</router-link>

        <div class="nav-footer">
          <ZnSwitch v-model="isDarkMode" labelRight="Modo oscuro" />
        </div>
      </template>

      <router-view />

    </ZnNavigationLayout>

  </ZnApp>
</template>

<script setup>
import { ref } from 'vue'
import '../../shared/ui-core/src/assets/css/global.css'
import { ZnApp, ZnNavigationLayout, ZnSwitch } from '@zn-apps/ui-core'

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

.nav-section-label {
  display: block;
  padding: 16px 16px 4px 16px;
  font-family: 'Roboto', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--md-outline);
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

.nav-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--md-surface-variant);
}
</style>
