<template>
  <DemoView view="input-range">
    <ZnSection title="1. Slider continuo" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Variante continua de MD3: el indicador se extiende desde el mínimo hasta el valor.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Valor simple</span>
        <ZnRangeInput v-model="volumen" label="Volumen" :min="0" :max="100" :step="5" :value-format="(v) => `${v} %`" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin texto de valor</span>
        <ZnRangeInput v-model="sinValor" label="Brillo" :show-value="false" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Slider discreto (marcas)" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Con <code>show-ticks</code> se dibuja una marca por cada <code>step</code>, como en
        el slider discreto de MD3 (hasta 50 marcas).
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">show-ticks</span>
        <ZnRangeInput v-model="discreto" label="Nivel" :min="0" :max="10" :step="1" show-ticks />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Discreto + formato</span>
        <ZnRangeInput
          v-model="discretoFormato"
          label="Temperatura"
          :min="16"
          :max="30"
          :step="2"
          show-ticks
          :value-format="(v) => `${v} °C`"
        />
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Slider centrado y de rango" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        <code>centered</code> hace crecer el indicador desde el punto medio; con un array
        <code>[mínimo, máximo]</code> el slider pasa a tener dos actuadores que no se cruzan.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">centered</span>
        <ZnRangeInput v-model="centrado" label="Balance" :min="-50" :max="50" :step="5" centered />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Doble actuador</span>
        <ZnRangeInput
          v-model="rango"
          label="Precio"
          :min="0"
          :max="500"
          :step="10"
          :value-format="(v) => `${v} €`"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con error / deshabilitado</span>
        <ZnRangeInput v-model="conError" label="Nivel" :min="0" :max="100" error="Valor fuera de rango" />
        <ZnRangeInput :model-value="30" label="Bloqueado" disabled />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnRangeInput } from '@zn-apps/ui-core'

const volumen = ref(45)
const sinValor = ref(70)
const discreto = ref(6)
const discretoFormato = ref(22)
const centrado = ref(10)
const rango = ref([100, 350])
const conError = ref(80)
</script>
