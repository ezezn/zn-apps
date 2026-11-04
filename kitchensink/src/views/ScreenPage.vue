<template>
  <DemoView view="screen">

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
        Las props <code>title</code> y <code>subtitle</code> componen el encabezado común. El slot <code>#icon</code> añade un <code>ZnIcon</code>, <code>#title</code> permite contenido personalizado y <code>#actions</code> coloca controles a la derecha.
      </p>

      <ZnBox variant="outlined" class="preview">
        <ZnScreen title="Zound Box" subtitle="Un reproductor de sonidos">
          <template #icon>
            <ZnIcon name="music_note" label="Música" />
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
      <pre class="code-block">&lt;ZnScreen title="Mi Pantalla" subtitle="Descripción breve"&gt;
  &lt;template #icon&gt;&lt;ZnIcon name="music_note" /&gt;&lt;/template&gt;
  &lt;template #actions&gt;&lt;ZnSwitch v-model="activo" /&gt;&lt;/template&gt;

  &lt;ZnSection title="Contenido" collapsible&gt;
    ...
  &lt;/ZnSection&gt;
&lt;/ZnScreen&gt;</pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ref } from 'vue'
import { ZnScreen, ZnSection, ZnBox, ZnRow, ZnButton, ZnSwitch, ZnIcon } from '@zn-apps/ui-core'

const screenSwitch = ref(true)
</script>

<style scoped>
.preview :deep(.zn-screen) {
  height: 320px;
  min-height: auto;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--md-surface-variant);
}

.preview :deep(.zn-scroll-area) {
  height: 100%;
}

.preview :deep(.zn-screen__content) {
  padding: 16px;
}

</style>
