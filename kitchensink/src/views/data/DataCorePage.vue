<template>
  <DemoView view="data-core">
    <ZnSection title="1. Lectura y escritura de rutas" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        <code>writeAt</code> devuelve una copia con el valor escrito en la ruta
        indicada, creando los objetos intermedios y sin mutar el original.
        <code>readAt</code> recorre la misma ruta para leer el valor.
      </p>

      <ZnBox variant="outlined">
        <span class="showcase-label">Valor original</span>
        <pre class="json-dump">{{ originalJson }}</pre>
      </ZnBox>

      <ZnBox variant="outlined">
        <span class="showcase-label">Resultado de writeAt (copia)</span>
        <pre class="json-dump">{{ resultJson }}</pre>
      </ZnBox>

      <div class="data-actions section-desc--full">
        <ZnButton variant="tonal" @click="writeNestedPath">Escribir ruta anidada</ZnButton>
        <ZnButton variant="text" @click="restore">Restaurar</ZnButton>
      </div>
    </ZnSection>

    <ZnSection title="2. Defaults y formato de valores" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        <code>withDefaults</code> aplica los <code>default</code> declarados en el
        esquema sin pisar los valores existentes. <code>formatFieldValue</code>
        convierte el valor en texto listo para presentación.
      </p>

      <ZnBox v-for="sample in samples" :key="sample.label" variant="filled">
        <span class="showcase-label">{{ sample.label }}</span>
        <span class="sample-value">{{ sample.value }}</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Uso" collapsible :expanded="false">
      <pre class="json-dump"><code>import { withDefaults, writeAt, readAt, formatFieldValue } from '@zn-apps/ui-data-core'

const schema = {
  sections: [{
    fields: [{ path: 'contact.email', type: 'email', default: 'sin-correo@example.com' }]
  }]
}

const initial = withDefaults(schema, { name: 'Ada' })
const next = writeAt(initial, 'contact.email', 'ada@example.com')

readAt(next, 'contact') // { email: 'ada@example.com' }</code></pre>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnBox, ZnButton, ZnSection } from '@zn-apps/ui-core'
import { FieldTypes, clone, formatFieldValue, withDefaults, writeAt } from '@zn-apps/ui-data-core'
import DemoView from '../../components/DemoView.vue'
import { dataDemoSchema, dataDemoValue } from '../../data/data-demo.js'

const original = ref(withDefaults(dataDemoSchema, clone(dataDemoValue)))
const next = ref(clone(original.value))

const originalJson = computed(() => JSON.stringify(original.value, null, 2))
const resultJson = computed(() => JSON.stringify(next.value, null, 2))

const samples = computed(() => [
  {
    label: 'select · rol',
    value: formatFieldValue({ type: FieldTypes.SELECT, options: dataDemoSchema.sections[0].fields[2].options }, 'editor')
  },
  {
    label: 'multi-select · etiquetas',
    value: formatFieldValue({ type: FieldTypes.MULTI_SELECT, options: ['Diseño', 'Código'] }, ['Diseño', 'Código'])
  },
  {
    label: 'switch · notificaciones',
    value: formatFieldValue(
      { type: FieldTypes.SWITCH },
      true,
      { trueText: 'Activadas', falseText: 'Desactivadas' }
    )
  },
  {
    label: 'vacío',
    value: formatFieldValue({ type: FieldTypes.TEXT }, null, { emptyText: 'Sin dato' })
  }
])

function writeNestedPath() {
  next.value = writeAt(next.value, 'profile.address.city', 'Londres')
}

function restore() {
  next.value = clone(original.value)
}
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
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

.sample-value {
  color: var(--md-on-background);
  font-size: 1rem;
  line-height: 1.5;
}

.data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
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
