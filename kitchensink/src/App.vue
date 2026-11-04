<template>
  <ZnApp :mode="isDarkMode ? 'dark' : 'light'">

    <ZnMasterSlaveLayout :view-key="$route.fullPath">
      <template #master>
        <ZnScreen title="ZnComponents Hub" subtitle="Catálogo de componentes">
          <nav aria-label="Navegación principal">
        <span class="nav-section-label">Componentes</span>
        <router-link to="/buttons">Botones (ZnButton)</router-link>
        <router-link to="/cards">Tarjetas (ZnCard)</router-link>
        <router-link to="/switches">Selectores (ZnSwitch)</router-link>
        <router-link to="/dialogs">Diálogos (ZnDialog)</router-link>
        <router-link to="/icons">Iconos (ZnIcon)</router-link>

        <span class="nav-section-label">Layout & Contenedores</span>
        <router-link to="/layout">Layout (ZnBox / ZnRow)</router-link>
        <router-link to="/sections">Secciones (ZnSection)</router-link>
        <router-link to="/screen">Pantallas (ZnScreen)</router-link>
        <router-link to="/tabs">Pestañas (ZnTabs)</router-link>
        <router-link to="/navigation-layout">Navegación (ZnMasterSlaveLayout)</router-link>

        <span class="nav-section-label">Otros</span>
        <router-link to="/legacy">Utilidades</router-link>
        <router-link to="/about">Acerca de la app (ZnAbout)</router-link>

        <div class="nav-footer">
          <ZnSwitch v-model="isDarkMode" labelRight="Modo oscuro" />
        </div>
          </nav>
        </ZnScreen>
      </template>

      <router-view />
    </ZnMasterSlaveLayout>

    <ZnDialogHost />

  </ZnApp>
</template>

<script setup>
import { ref } from 'vue'
import '../../shared/ui-core/src/assets/css/global.css'
import { ZnApp, ZnScreen, ZnMasterSlaveLayout, ZnSwitch, ZnDialogHost } from '@zn-apps/ui-core'

const isDarkMode = ref(false)
</script>

<style>
/* Estilos sencillos para tus links del menú estilo MD3 Navigation Drawer */
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

.nav-footer {
  margin-top: auto;
  padding: 16px;
  border-top: 1px solid var(--md-surface-variant);
}
</style>
