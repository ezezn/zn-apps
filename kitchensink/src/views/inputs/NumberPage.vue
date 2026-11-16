<template>
  <DemoView view="input-number">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        <code>ZnNumberInput</code> usa <code>type="number"</code> con
        <code>inputmode="decimal"</code>, admite <code>min</code>, <code>max</code> y
        <code>step</code>, y valida el rango al perder el foco emitiendo
        <code>update:valid</code> y <code>validation</code>. El valor es un
        <code>Number</code> (o <code>null</code> cuando está vacío).
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnNumberInput
          v-model="outlined"
          label="Cantidad"
          hint="Entre 1 y 100"
          :min="1"
          :max="100"
          :step="1"
          @update:valid="validoOutlined = $event"
        />
        <span class="helper-text">Valor: {{ outlined ?? '—' }} · Válido: {{ validoOutlined ? 'Sí' : 'No' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnNumberInput
          v-model="filled"
          label="Precio (€)"
          variant="filled"
          hint="Permite decimales"
          :min="0"
          @update:valid="validoFilled = $event"
        />
        <span class="helper-text">Valor: {{ filled ?? '—' }} · Válido: {{ validoFilled ? 'Sí' : 'No' }}</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Fuera de rango</span>
        <ZnNumberInput v-model="fueraDeRango" label="Cantidad" :min="1" :max="20" />
        <span class="helper-text">Prueba un valor mayor a 20 y sal del campo.</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Error externo</span>
        <ZnNumberInput v-model="conError" label="Cantidad" error="No hay stock disponible" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta</span>
        <ZnNumberInput v-model="sinEtiqueta" placeholder="0" aria-label="Cantidad de productos" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Tamaños MD3" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>size</code> ajusta la altura del contenedor: <code>small</code> 48px,
        <code>medium</code> 56px (por defecto) y <code>large</code> 64px.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">small · 48px</span>
        <ZnNumberInput v-model="small" label="Cantidad" variant="filled" size="small" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">medium · 56px</span>
        <ZnNumberInput v-model="medium" label="Cantidad" variant="filled" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">large · 64px</span>
        <ZnNumberInput v-model="large" label="Cantidad" variant="filled" size="large" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnNumberInput } from '@zn-apps/ui-core'

const outlined = ref(null)
const filled = ref(9.99)
const fueraDeRango = ref(30)
const conError = ref(5)
const sinEtiqueta = ref(null)
const small = ref(null)
const medium = ref(null)
const large = ref(null)
const validoOutlined = ref(true)
const validoFilled = ref(true)
</script>
