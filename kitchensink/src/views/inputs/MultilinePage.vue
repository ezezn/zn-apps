<template>
  <DemoView view="input-multiline">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        El área de texto mantiene las dos variantes MD3 y crece verticalmente según
        <code>rows</code>; el usuario puede redimensionarla con el tirador nativo.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">variant="outlined"</span>
        <ZnMultilineText v-model="outlined" label="Comentarios" :rows="4" hint="Máximo 200 caracteres" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">variant="filled"</span>
        <ZnMultilineText v-model="filled" label="Comentarios" variant="filled" :rows="4" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con error</span>
        <ZnMultilineText v-model="conError" label="Descripción" :rows="3" error="Mínimo 20 caracteres" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado</span>
        <ZnMultilineText model-value="Contenido bloqueado" label="Bloqueado" :rows="3" disabled />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta</span>
        <ZnMultilineText v-model="sinEtiqueta" placeholder="Escribe una nota…" aria-label="Nota" :rows="3" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnMultilineText } from '@zn-apps/ui-core'

const outlined = ref('')
const filled = ref('Texto de ejemplo')
const conError = ref('')
const sinEtiqueta = ref('')
</script>
