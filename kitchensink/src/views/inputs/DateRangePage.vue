<template>
  <DemoView view="input-date-range">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Dos campos <code>date</code> enlazados: el <code>max</code> del inicio es el fin y el
        <code>min</code> del fin es el inicio. Muestra error si el fin es anterior.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnDateRangeInput v-model="outlined" start-label="Llegada" end-label="Salida" />
        <span class="helper-text">{{ outlined[0] || '—' }} → {{ outlined[1] || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnDateRangeInput v-model="filled" variant="filled" start-label="Llegada" end-label="Salida" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Límites y estados" collapsible :columns="2">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con min / max global</span>
        <ZnDateRangeInput
          v-model="conLimites"
          start-label="Desde"
          end-label="Hasta"
          min="2026-11-01"
          max="2026-11-30"
          hint="Solo noviembre de 2026"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Rango invertido (error)</span>
        <ZnDateRangeInput v-model="invertido" start-label="Llegada" end-label="Salida" />
        <span class="helper-text">El campo final queda marcado en rojo.</span>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnDateRangeInput } from '@zn-apps/ui-core'

const outlined = ref(['', ''])
const filled = ref(['2026-11-10', '2026-11-14'])
const conLimites = ref(['', ''])
const invertido = ref(['2026-11-20', '2026-11-10'])
</script>
