<template>
  <DemoView view="tabs">
    <ZnSection title="Pestañas principales" collapsible>
      <p class="section-desc">
        Las pestañas principales agrupan destinos relacionados al nivel de la pantalla. Usa las flechas izquierda y derecha para cambiar de pestaña.
      </p>
      <ZnTabs v-model="activePrimary" :tabs="primaryTabs" aria-label="Secciones del catálogo">
        <template #panel="{ tab }">
          <p class="tab-copy">{{ tab.content }}</p>
        </template>
      </ZnTabs>
    </ZnSection>

    <ZnSection title="Pestañas secundarias" collapsible>
      <p class="section-desc">
        Las pestañas secundarias separan contenido relacionado dentro de una sección y usan un indicador más sutil.
      </p>
      <ZnTabs v-model="activeSecondary" variant="secondary" :tabs="secondaryTabs" aria-label="Detalles del producto">
        <template #panel="{ tab }">
          <p class="tab-copy">{{ tab.content }}</p>
        </template>
      </ZnTabs>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import { ZnSection, ZnTabs } from '@zn-apps/ui-core'
import DemoView from '../components/DemoView.vue'

const activePrimary = ref('overview')
const activeSecondary = ref('specs')
const primaryTabs = [
  { value: 'overview', label: 'Resumen', content: 'Información general del catálogo.' },
  { value: 'components', label: 'Componentes', content: 'Componentes disponibles en ui-core.' },
  { value: 'disabled', label: 'Próximamente', disabled: true, content: 'Esta sección está deshabilitada.' }
]
const secondaryTabs = [
  { value: 'specs', label: 'Detalles', content: 'Características y especificaciones.' },
  { value: 'reviews', label: 'Reseñas', badge: '3', content: 'Opiniones de otros usuarios.' }
]
</script>

<style scoped>
.tab-copy {
  margin: 0;
  color: var(--md-on-background);
  line-height: 1.5;
}
</style>
