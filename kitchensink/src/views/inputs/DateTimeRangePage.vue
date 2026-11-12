<template>
  <DemoView view="input-datetime-range">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Dos campos <code>datetime-local</code> enlazados. Los valores usan
        <code>YYYY-MM-DDTHH:mm</code> y la comparación es lexicográfica, por lo que el orden
        cronológico se respeta.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnDateTimeRangeInput v-model="outlined" start-label="Inicio" end-label="Fin" />
        <span class="helper-text">{{ outlined[0] || '—' }} → {{ outlined[1] || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnDateTimeRangeInput v-model="filled" variant="filled" start-label="Inicio" end-label="Fin" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Límites y estados" collapsible :columns="2">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con min / max global</span>
        <ZnDateTimeRangeInput
          v-model="conLimites"
          start-label="Inicio"
          end-label="Fin"
          min="2026-11-01T09:00"
          max="2026-11-30T18:00"
          hint="Noviembre de 2026"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Rango invertido (error)</span>
        <ZnDateTimeRangeInput v-model="invertido" start-label="Inicio" end-label="Fin" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnDateTimeRangeInput } from '@zn-apps/ui-core'

const outlined = ref(['', ''])
const filled = ref(['2026-11-12T09:00', '2026-11-12T18:00'])
const conLimites = ref(['', ''])
const invertido = ref(['2026-11-12T18:00', '2026-11-12T09:00'])
</script>
