<template>
  <DemoView view="input-date">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Usa el selector nativo <code>date</code>. La etiqueta se mantiene siempre flotante
        porque el control muestra su propio texto (<code>dd/mm/aaaa</code>) cuando está vacío.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnDateInput v-model="outlined" label="Fecha de reserva" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnDateInput v-model="filled" label="Fecha de reserva" variant="filled" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Límites y estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con min / max</span>
        <ZnDateInput
          v-model="conLimites"
          label="Dentro de noviembre"
          min="2026-11-01"
          max="2026-11-30"
          hint="Solo noviembre de 2026"
        />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con error</span>
        <ZnDateInput v-model="conError" label="Fecha" error="La fecha ya pasó" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado / sin etiqueta</span>
        <ZnDateInput model-value="2026-11-12" label="Bloqueada" disabled />
        <ZnDateInput v-model="sinEtiqueta" aria-label="Fecha sin etiqueta" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnDateInput } from '@zn-apps/ui-core'

const outlined = ref('')
const filled = ref('2026-11-12')
const conLimites = ref('')
const conError = ref('')
const sinEtiqueta = ref('')
</script>
