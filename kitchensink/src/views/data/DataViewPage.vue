<template>
  <DemoView view="data-view">
    <ZnSection title="1. Presentación de sólo lectura" collapsible :columns="1">
      <p class="section-desc">
        <code>ZnDataView</code> comparte el esquema de <code>ZnDataForm</code>,
        pero muestra etiquetas y valores formateados. Las secciones respetan
        título, icono, modo colapsable y layout de columnas.
      </p>
      <p class="section-desc">
        En la sección <strong>Cuenta</strong> (2 columnas), <strong>Biografía</strong>
        y <strong>Notas</strong> usan <code>span: 2</code> y por eso ocupan todo el
        ancho; <strong>Notas</strong> se presenta como HTML5 enriquecido.
      </p>

      <ZnRow class="view-toolbar" padding="0" gap="16px" wrap>
        <ZnSwitch
          v-model="inlineLabels"
          label-right="Etiquetas en línea"
        />
        <ZnSelect
          v-model="viewSize"
          label="Tamaño"
          :options="sizeOptions"
          class="view-size"
        />
        <span class="state-chip">{{ inlineLabels ? 'labelPosition = inline' : 'labelPosition = top' }}</span>
      </ZnRow>

      <ZnDataView
        :model-value="dataDemoValue"
        :schema="dataDemoSchema"
        :label-position="inlineLabels ? 'inline' : 'top'"
        :size="viewSize"
      />
    </ZnSection>

    <ZnSection title="2. Multi-select y listas de valores" collapsible :columns="1">
      <p class="section-desc">
        Los campos <code>multi-select</code> y <code>list</code> se presentan como
        chips MD3 en lugar de texto unido. El chip es el mismo componente
        <code>ZnChip</code> que usa el select múltiple, con la variante
        <code>input</code> y el tamaño heredado del campo.
      </p>

      <ZnDataView
        :model-value="multiValue"
        :schema="multiSchema"
        size="small"
      />
    </ZnSection>

    <ZnSection title="3. Valor de origen" collapsible :expanded="false" :columns="1">
      <ZnBox variant="outlined">
        <span class="showcase-label">Objeto presentado</span>
        <pre class="json-dump">{{ dataJson }}</pre>
      </ZnBox>
    </ZnSection>

    <ZnSection title="4. Esquema (schema)" collapsible :expanded="false" :columns="1">
      <p class="section-desc">
        Este es el JSON que recibe la vista. El mismo objeto alimenta el formulario
        y el editor de las otras demos.
      </p>

      <ZnBox variant="outlined">
        <span class="showcase-label">schema</span>
        <pre class="json-dump">{{ schemaJson }}</pre>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnBox, ZnRow, ZnSection, ZnSelect, ZnSwitch } from '@zn-apps/ui-core'
import { ZnDataView } from '@zn-apps/ui-data-view'
import DemoView from '../../components/DemoView.vue'
import { dataDemoSchema, dataDemoValue } from '../../data/data-demo.js'

const inlineLabels = ref(false)
const viewSize = ref('medium')

const multiSchema = {
  sections: [
    {
      title: 'Etiquetas y palabras clave',
      layout: 2,
      fields: [
        {
          path: 'tags',
          type: 'multi-select',
          label: 'Etiquetas',
          options: [
            { value: 'design', label: 'Diseño' },
            { value: 'code', label: 'Código' },
            { value: 'research', label: 'Investigación' },
            { value: 'team', label: 'Equipo' }
          ]
        },
        {
          path: 'keywords',
          type: 'list',
          label: 'Palabras clave'
        }
      ]
    }
  ]
}

const multiValue = {
  tags: ['design', 'code'],
  keywords: ['Material 3', 'chips', 'density']
}

const schemaJson = computed(() => JSON.stringify(dataDemoSchema, null, 2))
const sizeOptions = [
  { value: 'small', label: 'Small · 48px' },
  { value: 'medium', label: 'Medium · 56px' },
  { value: 'large', label: 'Large · 64px' }
]
const dataJson = computed(() => JSON.stringify(dataDemoValue, null, 2))
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.view-toolbar {
  margin-bottom: 8px;
}

.view-size {
  max-width: 200px;
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
