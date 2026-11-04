<template>
  <DemoView view="navigation-layout">

    <ZnSection title="1. Previsualización del Layout" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        El layout compone un <code>aside</code> fijo a la izquierda y el contenido principal a la derecha. En pantallas de 768px o menos el drawer pasa a la parte superior.
      </p>

      <div class="preview">
        <ZnMasterSlaveLayout>
          <template #master>
            <ZnScreen title="Demo App" subtitle="Navegación principal">
              <nav class="demo-nav" aria-label="Navegación de ejemplo">
                <a href="#" @click.prevent class="demo-nav-item demo-nav-item--active">Inicio</a>
                <a href="#" @click.prevent class="demo-nav-item">Biblioteca</a>
                <a href="#" @click.prevent class="demo-nav-item">Ajustes</a>
              </nav>
            </ZnScreen>
          </template>

          <ZnScreen title="Contenido principal" subtitle="Vista seleccionada">
            <p class="helper-text">
              En escritorio, el contenido comparte el espacio con la pantalla maestra. En móvil, aparece al seleccionar una opción y ofrece una flecha para volver.
            </p>
            <ZnRow padding="0" gap="8px" style="margin-top: 16px;">
              <ZnButton variant="filled">Acción primaria</ZnButton>
              <ZnButton variant="outlined">Secundaria</ZnButton>
            </ZnRow>
          </ZnScreen>
        </ZnMasterSlaveLayout>
      </div>
    </ZnSection>

    <ZnSection title="2. Slots Disponibles" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        El slot <code>#master</code> contiene la navegación y el slot por defecto muestra la vista seleccionada. La prop <code>viewKey</code> puede enlazarse con la ruta actual para activar la vista de contenido en móvil.
      </p>

      <ZnBox variant="filled" class="showcase-stack">
        <span class="showcase-label">#master</span>
        <p class="helper-text">Pantalla maestra con navegación, visible junto al contenido en escritorio.</p>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">default</span>
        <p class="helper-text">Pantalla de contenido. Puede ser un <code>&lt;router-view /&gt;</code> cuyas vistas definan su propio <code>ZnScreen</code>.</p>
      </ZnBox>

      <ZnBox variant="elevated" class="showcase-stack">
        <span class="showcase-label">viewKey</span>
        <p class="helper-text">Al cambiar, muestra el contenido en móvil. La flecha de la barra superior permite volver al master.</p>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Integración con vue-router" collapsible :expanded="false" :columns="1">
      <pre class="code-block">&lt;ZnMasterSlaveLayout :view-key="$route.fullPath"&gt;
  &lt;template #master&gt;
    &lt;ZnScreen title="Mi App"&gt;
      &lt;router-link to="/home"&gt;Inicio&lt;/router-link&gt;
      &lt;router-link to="/settings"&gt;Ajustes&lt;/router-link&gt;
    &lt;/ZnScreen&gt;
  &lt;/template&gt;
  &lt;router-view /&gt;
&lt;/ZnMasterSlaveLayout&gt;</pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ZnSection, ZnBox, ZnRow, ZnButton, ZnScreen, ZnMasterSlaveLayout } from '@zn-apps/ui-core'
</script>

<style scoped>
.preview {
  height: 380px;
  overflow: hidden;
  border: 1px solid var(--md-surface-variant);
  border-radius: 16px;
}

.preview :deep(.zn-master-slave-layout) {
  height: 100%;
  min-height: 0;
}

.preview :deep(.zn-master-slave-layout__master) {
  height: 100%;
  min-height: 0;
  position: relative;
}

.preview :deep(.zn-master-slave-layout__slave) {
  height: 100%;
  min-height: 0;
  overflow-y: auto;
}

.preview :deep(.zn-screen) {
  height: 100%;
  min-height: 0;
}

.preview :deep(.zn-scroll-area) {
  height: 100%;
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
  text-decoration: none;
}

.demo-nav-item--active {
  background-color: var(--md-primary);
  color: var(--md-on-primary);
}

.demo-content {
  padding: 24px;
}

</style>
