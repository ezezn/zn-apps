<template>
  <ZnScreen title="Navegación (ZnNavigationLayout)">
    <template #title>
      <div>
        <h1 class="screen-heading">Navegación (ZnNavigationLayout)</h1>
        <span class="screen-subtitle">Navigation Drawer de 280px + área de contenido para apps con router</span>
      </div>
    </template>

    <ZnSection title="1. Previsualización del Layout" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        El layout compone un <code>aside</code> fijo a la izquierda y el contenido principal a la derecha. En pantallas de 768px o menos el drawer pasa a la parte superior.
      </p>

      <div class="preview">
        <ZnNavigationLayout>
          <template #aside-header>
            <span class="demo-logo">🎧 Demo App</span>
          </template>

          <template #aside>
            <span class="demo-nav-item demo-nav-item--active">Inicio</span>
            <span class="demo-nav-item">Biblioteca</span>
            <span class="demo-nav-item">Ajustes</span>
          </template>

          <div class="demo-content">
            <h2 class="demo-content__title">Contenido principal</h2>
            <p class="helper-text">
              Aquí se renderiza el <code>&lt;router-view /&gt;</code> de la aplicación. El drawer solo aporta la estructura, no gestiona las rutas.
            </p>
            <ZnRow padding="0" gap="8px" style="margin-top: 16px;">
              <ZnButton variant="filled">Acción primaria</ZnButton>
              <ZnButton variant="outlined">Secundaria</ZnButton>
            </ZnRow>
          </div>
        </ZnNavigationLayout>
      </div>
    </ZnSection>

    <ZnSection title="2. Slots Disponibles" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        El componente es puramente estructural: recibe tres slots y no conoce el router.
      </p>

      <ZnBox variant="filled" class="showcase-stack">
        <span class="showcase-label">#aside-header</span>
        <p class="helper-text">Cabecera del drawer: logo, nombre de la app o menú de cuenta.</p>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">#aside</span>
        <p class="helper-text">Lista de navegación. Normalmente contiene <code>&lt;router-link&gt;</code> con la clase <code>nav-item</code>.</p>
      </ZnBox>

      <ZnBox variant="elevated" class="showcase-stack">
        <span class="showcase-label">default</span>
        <p class="helper-text">Área principal de contenido, habitualmente un <code>&lt;router-view /&gt;</code>.</p>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Integración con vue-router" collapsible :expanded="false" :columns="1">
      <pre class="code-block">&lt;ZnNavigationLayout&gt;
  &lt;template #aside-header&gt;Mi App&lt;/template&gt;

  &lt;template #aside&gt;
    &lt;router-link to="/home" class="nav-item"&gt;Inicio&lt;/router-link&gt;
    &lt;router-link to="/settings" class="nav-item"&gt;Ajustes&lt;/router-link&gt;
  &lt;/template&gt;

  &lt;router-view /&gt;
&lt;/ZnNavigationLayout&gt;</pre>
    </ZnSection>
  </ZnScreen>
</template>

<script setup>
import { ZnScreen, ZnSection, ZnBox, ZnRow, ZnButton, ZnNavigationLayout } from '@zn-apps/ui-core'
</script>

<style scoped>
.preview {
  height: 380px;
  overflow: hidden;
  border: 1px solid var(--md-surface-variant);
  border-radius: 16px;
}

.preview :deep(.zn-nav-layout) {
  height: 100%;
  min-height: 0;
}

.preview :deep(.zn-nav-layout__aside) {
  height: 100%;
  position: relative;
}

.preview :deep(.zn-nav-layout__content) {
  overflow-y: auto;
}

.demo-logo {
  font-weight: 700;
  font-size: 1rem;
  color: var(--md-primary);
}

.demo-nav-item {
  display: block;
  padding: 10px 16px;
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--md-on-surface-variant);
}

.demo-nav-item--active {
  background-color: var(--md-primary);
  color: var(--md-on-primary);
}

.demo-content {
  padding: 24px;
}

.demo-content__title {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--md-on-background);
}
</style>
