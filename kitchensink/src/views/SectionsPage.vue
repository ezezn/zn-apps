<template>
  <DemoView view="sections">

    <ZnSection title="1. Sección Simple (Sin colapsar)">
      <p class="section-desc">
        Por defecto <code>ZnSection</code> renderiza un <code>&lt;section&gt;</code> con cabecera y contenido. La prop <code>title</code> alimenta el encabezado H2.
      </p>
      <ZnBox variant="filled">
        <p class="helper-text">Contenido de la sección: cualquier componente compartido o markup propio.</p>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Sección Colapsable (collapsible)" collapsible>
      <p class="section-desc">
        Con <code>collapsible</code> se usa un <code>&lt;details&gt;</code> nativo. La prop <code>expanded</code> define el estado inicial y el chevron gira al abrir.
      </p>
      <ZnRow padding="0" gap="8px">
        <span class="state-chip">expanded = true por defecto</span>
        <span class="helper-text">Haz clic en la cabecera para cerrar.</span>
      </ZnRow>
    </ZnSection>

    <ZnSection title="3. Sección Colapsada al Iniciar (Prop: expanded=false)" collapsible :expanded="false">
      <p class="section-desc">
        Al montar, esta sección permanece cerrada. El contenido solo se muestra al expandirla.
      </p>
      <ZnBox variant="outlined">Contenido oculto hasta expandir.</ZnBox>
    </ZnSection>

    <ZnSection
      title="4. Evento de Apertura (Evento: toggle)"
      collapsible
      @toggle="handleToggle"
    >
      <p class="section-desc">
        El componente emite <code>toggle</code> con el nuevo estado booleano. Úsalo para analítica o para sincronizar estado externo.
      </p>
      <ZnRow padding="0" gap="12px">
        <span class="showcase-label">Último evento</span>
        <span class="state-chip">{{ lastToggle === null ? 'sin eventos' : lastToggle ? 'abierta' : 'cerrada' }}</span>
        <span class="state-chip">total: {{ toggleCount }}</span>
      </ZnRow>
    </ZnSection>

    <ZnSection title="5. Grilla de 3 Columnas (Prop: columns)" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>columns</code> convierte el contenido en una grilla CSS. En pantallas menores a 600px colapsa automáticamente a una columna.
      </p>
      <ZnBox variant="filled">Columna 1</ZnBox>
      <ZnBox variant="outlined">Columna 2</ZnBox>
      <ZnBox variant="elevated">Columna 3</ZnBox>
    </ZnSection>

    <ZnSection title="6. Slot de Título Personalizado (Slot: title)" collapsible :expanded="false">
      <template #title>
        <div class="showcase-inline">
          <h2 class="custom-section-title">Título con HTML</h2>
          <span class="state-chip">CUSTOM</span>
        </div>
      </template>
      <p class="section-desc">
        El slot <code>#title</code> reemplaza el texto plano del encabezado y admite badges, iconos o cualquier markup.
      </p>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import DemoView from '../components/DemoView.vue'
import { ref } from 'vue'
import { ZnSection, ZnBox, ZnRow } from '@zn-apps/ui-core'

const lastToggle = ref(null)
const toggleCount = ref(0)

function handleToggle(isOpen) {
  lastToggle.value = isOpen
  toggleCount.value += 1
}
</script>

<style scoped>
.custom-section-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--md-on-background);
}
</style>
