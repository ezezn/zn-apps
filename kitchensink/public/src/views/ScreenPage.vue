<template>
  <ZnScreen title="Pantallas (ZnScreen)">
    <template #title>
      <div>
        <h1 class="screen-heading">Pantallas (ZnScreen)</h1>
        <span class="screen-subtitle">Top App Bar sticky con icono, título y acciones</span>
      </div>
    </template>

    <ZnSection title="1. Uso Básico (Prop: title)">
      <p class="section-desc">
        <code>ZnScreen</code> envuelve el contenido de una pantalla y renderiza una Top App Bar MD3. Al hacer scroll, la barra se condensa de 72px a 60px usando un <code>IntersectionObserver</code> sobre un centinela interno.
      </p>

      <ZnBox variant="outlined" class="preview">
        <ZnScreen title="Pantalla de ejemplo">
          <ZnBox variant="filled">
            <p class="helper-text">Contenido de la pantalla. La barra superior se eleva al hacer scroll en la página real.</p>
          </ZnBox>
        </ZnScreen>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Slots: icon, title y actions" collapsible :columns="1">
      <p class="section-desc section-desc--full">
        El slot <code>#icon</code> añade un <code>ZnIcon</code> junto al título, <code>#title</code> reemplaza el texto (permite HTML) y <code>#actions</code> coloca controles a la derecha.
      </p>

      <ZnBox variant="outlined" class="preview">
        <ZnScreen>
          <template #icon>
            <ZnIcon name="music_note" label="Música" />
          </template>

          <template #title>
            <div>
              <span class="custom-screen-title">Zound Box</span>
              <span class="helper-text">Slot #title con subtítulo</span>
            </div>
          </template>

          <template #actions>
            <ZnSwitch v-model="screenSwitch" labelRight="Reproducir" />
          </template>

          <ZnRow padding="0" gap="12px">
            <span class="state-chip">{{ screenSwitch ? 'reproduciendo' : 'en pausa' }}</span>
            <ZnButton variant="tonal">Acción del contenido</ZnButton>
          </ZnRow>
        </ZnScreen>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Estructura de una Pantalla Completa" collapsible :expanded="false" :columns="1">
      <p class="section-desc section-desc--full">
        Patrón recomendado: una <code>ZnScreen</code> por ruta, con <code>ZnSection</code> para agrupar el contenido.
      </p>
      <pre class="code-block">&lt;ZnScreen title="Mi Pantalla"&gt;
  &lt;template #icon&gt;&lt;ZnIcon name="music_note" /&gt;&lt;/template&gt;
  &lt;template #actions&gt;&lt;ZnSwitch v-model="activo" /&gt;&lt;/template&gt;

  &lt;ZnSection title="Contenido" collapsible&gt;
    ...
  &lt;/ZnSection&gt;
&lt;/ZnScreen&gt;</pre>
    </ZnSection>
  </ZnScreen>
</template>

<script setup>
import { ref } from 'vue'
import { ZnScreen, ZnSection, ZnBox, ZnRow, ZnButton, ZnSwitch, ZnIcon } from '@zn-apps/ui-core'

const screenSwitch = ref(true)
</script>

<style scoped>
.preview :deep(.zn-screen) {
  min-height: auto;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--md-surface-variant);
}

.preview :deep(.zn-screen__content) {
  padding: 16px;
}

.custom-screen-title {
  display: block;
  font-size: 1.2rem;
  font-weight: 500;
}
</style>
