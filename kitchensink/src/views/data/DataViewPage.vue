<template>
  <DemoView view="data-view">
    <ZnSection title="1. Presentación de sólo lectura" collapsible :columns="1">
      <p class="section-desc">
        <code>ZnDataView</code> comparte el esquema de <code>ZnDataForm</code>,
        pero muestra etiquetas y valores formateados. Las secciones respetan
        título, icono, modo colapsable y layout de columnas.
      </p>

      <div class="view-toolbar">
        <ZnSwitch
          v-model="inlineLabels"
          label-right="Etiquetas en línea"
        />
        <span class="state-chip">{{ inlineLabels ? 'labelPosition = inline' : 'labelPosition = top' }}</span>
      </div>

      <ZnDataView
        :model-value="dataDemoValue"
        :schema="dataDemoSchema"
        :label-position="inlineLabels ? 'inline' : 'top'"
      />
    </ZnSection>

    <ZnSection title="2. Valor de origen" collapsible :expanded="false" :columns="1">
      <ZnBox variant="outlined">
        <span class="showcase-label">Objeto presentado</span>
        <pre class="json-dump">{{ dataJson }}</pre>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnBox, ZnSection, ZnSwitch } from '@zn-apps/ui-core'
import { ZnDataView } from '@zn-apps/ui-data-view'
import DemoView from '../../components/DemoView.vue'
import { dataDemoSchema, dataDemoValue } from '../../data/data-demo.js'

const inlineLabels = ref(false)
const dataJson = computed(() => JSON.stringify(dataDemoValue, null, 2))
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.view-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  margin-bottom: 8px;
}

.state-chip {
  padding: 4px 12px;
  border-radius: 8px;
  background: var(--md-surface-container-highest);
  color: var(--md-on-surface-variant);
  font-family: monospace;
  font-size: 0.8125rem;
}

.showcase-label {
  display: block;
  margin-bottom: 8px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.json-dump {
  overflow-x: auto;
  max-height: 320px;
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: var(--md-surface-container-low);
  color: var(--md-on-background);
  font-family: monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
}
</style>
