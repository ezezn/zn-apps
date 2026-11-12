<template>
  <DemoView view="input-phone">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Sanea la entrada a dígitos, <code>+</code>, espacios, paréntesis y guiones, y valida
        la cantidad de dígitos al perder el foco.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnPhoneInput v-model="outlined" label="Teléfono" hint="Entre 6 y 15 dígitos" />
        <span class="helper-text">Valor saneado: {{ outlined || '—' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnPhoneInput v-model="filled" label="Teléfono" variant="filled" :min-digits="9" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Demasiado corto</span>
        <ZnPhoneInput v-model="corto" label="Teléfono" :min-digits="9" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Error externo</span>
        <ZnPhoneInput v-model="conError" label="Teléfono" error="Número no disponible" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta</span>
        <ZnPhoneInput v-model="sinEtiqueta" placeholder="+34 600 000 000" aria-label="Teléfono móvil" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnPhoneInput } from '@zn-apps/ui-core'

const outlined = ref('')
const filled = ref('+34 600 123 456')
const corto = ref('123')
const conError = ref('600 000 000')
const sinEtiqueta = ref('')
</script>
