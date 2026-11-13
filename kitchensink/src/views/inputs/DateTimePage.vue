<template>
  <DemoView view="input-datetime">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Selector nativo <code>datetime-local</code>: combina fecha y hora en un solo valor
        (<code>YYYY-MM-DDTHH:mm</code>).
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnDateTimeInput v-model="outlined" label="Inicio del evento" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnDateTimeInput v-model="filled" label="Inicio del evento" variant="filled" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Límites y estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con min / max</span>
        <ZnDateTimeInput
          v-model="conLimites"
          label="Reserva"
          min="2026-11-01T09:00"
          max="2026-11-30T18:00"
          hint="Noviembre de 2026, 9:00–18:00"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con error</span>
        <ZnDateTimeInput v-model="conError" label="Inicio" error="El evento ya finalizó" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta / deshabilitado</span>
        <ZnDateTimeInput v-model="sinEtiqueta" aria-label="Inicio sin etiqueta" />
        <ZnDateTimeInput model-value="2026-11-12T10:00" label="Bloqueado" disabled />
      </ZnBox>
    </ZnSection>
    <ZnSection title="3. Tamaños MD3" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>size</code> ajusta la altura del contenedor: <code>small</code> 48px,
        <code>medium</code> 56px (por defecto) y <code>large</code> 64px.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">small · 48px</span>
        <ZnDateTimeInput v-model="small" label="Inicio" variant="filled" size="small" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">medium · 56px</span>
        <ZnDateTimeInput v-model="medium" label="Inicio" variant="filled" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">large · 64px</span>
        <ZnDateTimeInput v-model="large" label="Inicio" variant="filled" size="large" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnDateTimeInput } from '@zn-apps/ui-core'

const outlined = ref('')
const filled = ref('2026-11-12T10:00')
const conLimites = ref('')
const conError = ref('')
const sinEtiqueta = ref('')
const small = ref('')
const medium = ref('')
const large = ref('')
</script>
