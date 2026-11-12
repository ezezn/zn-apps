<template>
  <DemoView view="input-time-range">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Dos campos <code>time</code> enlazados con límites cruzados. Admite
        <code>step</code> para fijar la precisión del selector nativo.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnTimeRangeInput v-model="outlined" start-label="Apertura" end-label="Cierre" />
        <span class="helper-text">{{ outlined[0] || '—' }} → {{ outlined[1] || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnTimeRangeInput v-model="filled" variant="filled" start-label="Apertura" end-label="Cierre" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Precisión y estados" collapsible :columns="2">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Paso de 15 minutos</span>
        <ZnTimeRangeInput
          v-model="porIntervalos"
          start-label="Desde"
          end-label="Hasta"
          :step="900"
          hint="Intervalos de 15 min"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Rango invertido (error)</span>
        <ZnTimeRangeInput v-model="invertido" start-label="Entrada" end-label="Salida" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnTimeRangeInput } from '@zn-apps/ui-core'

const outlined = ref(['', ''])
const filled = ref(['09:00', '18:00'])
const porIntervalos = ref(['', ''])
const invertido = ref(['18:00', '09:00'])
</script>
