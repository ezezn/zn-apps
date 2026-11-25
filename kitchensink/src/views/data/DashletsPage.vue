<template>
  <DemoView view="dashlets">
    <ZnSection title="1. Contador" collapsible :columns="2">
      <p class="section-desc section-desc--full">Card de contador con ícono grande a la izquierda, número grande a la derecha y subtítulo opcional debajo.</p>

      <ZnDashletCounter
        :value="128"
        :label="'Usuarios'"
        :subtitle="'Activos'"
        :icon="'people'"
        variant="primary"
        :filled="true"
      />

      <p class="chart-value chart-value--full">Selección: 128 usuarios activos</p>
    </ZnSection>

    <ZnSection title="2. Resumen" collapsible :columns="2">
      <p class="section-desc section-desc--full">Card de resumen con dos filas: una grande con número y subtítulo, y otra inferior con número de menor importancia.</p>

      <ZnDashletSummary
        :value="250"
        :subtitle="'Objetivo'"
        :secondaryValue="75"
        :secondaryLabel="'Avance'"
        secondarySubtitle="Progreso"
        variant="success"
        :filled="true"
      />
    </ZnSection>

    <ZnSection title="3. Modo apilado" collapsible :columns="2">
      <p class="section-desc section-desc--full">Layout side-by-side con dos cards uno al lado del otro.</p>

      <ZnDashletSummary
        :value="150"
        :subtitle="'Ventas'"
        :secondaryValue="80"
        secondaryLabel="Meta"
        secondarySubtitle="Meta trimestral"
        variant="info"
        :filled="true"
        layout="side-by-side"
      />
    </ZnSection>

    <ZnSection title="4. Variantes de color" collapsible>
      <p class="section-desc">Prueba las diferentes variantes de color: primary, warning, info, success, error y neutral.</p>

      <div class="chart-shapes">
        <ZnDashletCounter
          v-for="variant in variants"
          :key="variant"
          :value="100"
          :label="variant"
          :icon="'trending_up'"
          :variant="variant"
          :filled="true"
          :height="100"
        />
      </div>
    </ZnSection>

    <ZnSection title="5. Modo contorneado" collapsible>
      <p class="section-desc">Cards con borde y sin relleno (filled=false).</p>

      <div class="chart-shapes">
        <ZnDashletCounter
          v-for="variant in variants"
          :key="`outline-${variant}`"
          :value="50"
          :label="variant"
          :icon="'trending_up'"
          :variant="variant"
          :filled="false"
          :height="80"
        />
        <ZnDashletSparkline
          v-for="variant in variants"
          :key="`sparkline-${variant}`"
          :data="[10, 15, 12, 20, 18]"
          :variant="variant"
          :filled="false"
          :height="40"
          :width="120"
        />
        <ZnDashletProgress
          v-for="variant in variants"
          :key="`progress-${variant}`"
          :value="75"
          :variant="variant"
          :filled="false"
          :height="10"
        />
      </div>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection } from '@zn-apps/ui-core'
import {
  ZnDashletCounter,
  ZnDashletSummary,
  ZnDashletSparkline,
  ZnDashletProgress
} from '@zn-apps/ui-data-dashlet'

const variants = ref(['primary', 'warning', 'info', 'success', 'error', 'neutral'])
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.chart-value {
  margin: 12px 0 0;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}

.chart-value--full {
  grid-column: 1 / -1;
  margin-top: 0;
}

.chart-shapes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
</style>
