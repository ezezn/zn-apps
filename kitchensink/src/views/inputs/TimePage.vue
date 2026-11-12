<template>
  <DemoView view="input-time">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Selector nativo <code>time</code>. Admite <code>min</code>, <code>max</code> y
        <code>step</code> (en segundos) para restringir el rango y la precisión.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnTimeInput v-model="outlined" label="Hora de entrega" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnTimeInput v-model="filled" label="Hora de entrega" variant="filled" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Precisión y estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Intervalos de 15 minutos</span>
        <ZnTimeInput v-model="porIntervalos" label="Hora" :step="900" hint="Paso: 15 min" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con min / max</span>
        <ZnTimeInput v-model="conLimites" label="Horario de oficina" min="09:00" max="18:00" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Error / deshabilitado</span>
        <ZnTimeInput v-model="conError" label="Hora" error="Fuera del horario permitido" />
        <ZnTimeInput model-value="12:00" label="Bloqueada" disabled />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnTimeInput } from '@zn-apps/ui-core'

const outlined = ref('')
const filled = ref('12:30')
const porIntervalos = ref('')
const conLimites = ref('')
const conError = ref('')
</script>
