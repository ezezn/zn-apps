<template>
  <DemoView view="data-form">
    <ZnSection title="1. Formulario con confirmación (live = false)" collapsible :columns="1">
      <p class="section-desc">
        El formulario mantiene un borrador interno. <code>update:modelValue</code>
        sólo se emite al pulsar Save o al usar Reset/Clear. Cancel descarta los
        cambios y vuelve al valor inicial.
      </p>
      <p class="section-desc">
        Los campos <strong>Biografía</strong> (<code>textarea</code>) y
        <strong>Notas</strong> (<code>richtext</code>) declaran <code>span: 2</code>
        y ocupan las dos columnas de la sección <code>Cuenta</code>.
      </p>

      <ZnDataForm
        v-model="draft"
        :schema="dataDemoSchema"
        @save="onSave"
        @cancel="onEvent('cancel')"
        @reset="onEvent('reset')"
        @clear="onEvent('clear')"
      />

      <ZnBox variant="outlined" class="data-output">
        <span class="showcase-label">Valor confirmado</span>
        <pre class="json-dump">{{ confirmedJson }}</pre>
        <span class="event-line">Último evento: <strong>{{ lastEvent }}</strong></span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Doble binding (live = true)" collapsible :columns="1">
      <p class="section-desc">
        Con <code>live</code> cada cambio de un campo emite
        <code>update:modelValue</code>, igual que un conjunto de inputs con
        <code>v-model</code>.
      </p>

      <ZnDataForm v-model="liveValue" :schema="dataDemoSchema" live :show-actions="false" />

      <ZnBox variant="outlined" class="data-output">
        <span class="showcase-label">Valor reactivo</span>
        <pre class="json-dump">{{ liveJson }}</pre>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Variante y tamaño heredados" collapsible :columns="1">
      <p class="section-desc">
        <code>variant</code> y <code>size</code> del formulario se aplican a todos los
        campos. Cada sección puede sobrescribirlos con <code>section.variant</code> /
        <code>section.size</code>, y cada campo con <code>field.variant</code> /
        <code>field.size</code>. Aquí se combinan <code>filled</code> con la densidad
        compacta de MD3 (<code>small</code>, 48px).
      </p>

      <ZnDataForm
        v-model="compactValue"
        :schema="dataDemoSchema"
        variant="filled"
        size="small"
        :show-actions="false"
      />
    </ZnSection>

    <ZnSection title="4. Esquema (schema)" collapsible :expanded="false" :columns="1">
      <p class="section-desc">
        JSON del esquema que construye el formulario. La misma definición se usa en
        la vista y en el editor; incluye secciones, tipos de campo, overrides de
        variante/tamaño y <code>span</code> entre columnas.
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
import { ZnBox, ZnSection } from '@zn-apps/ui-core'
import { clone } from '@zn-apps/ui-data-core'
import { ZnDataForm } from '@zn-apps/ui-data-form'
import DemoView from '../../components/DemoView.vue'
import { dataDemoSchema, dataDemoValue } from '../../data/data-demo.js'

const draft = ref(clone(dataDemoValue))
const confirmed = ref(clone(dataDemoValue))
const liveValue = ref(clone(dataDemoValue))
const compactValue = ref(clone(dataDemoValue))
const lastEvent = ref('—')

const confirmedJson = computed(() => JSON.stringify(confirmed.value, null, 2))
const schemaJson = computed(() => JSON.stringify(dataDemoSchema, null, 2))
const liveJson = computed(() => JSON.stringify(liveValue.value, null, 2))

function onSave(value) {
  confirmed.value = value
  onEvent('save')
}

function onEvent(name) {
  lastEvent.value = name
}
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.data-output {
  margin-top: 16px;
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

.event-line {
  display: block;
  margin-top: 12px;
  color: var(--md-on-surface-variant);
  font-size: 0.875rem;
}
</style>
