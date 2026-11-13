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
    <ZnSection title="3. Tamaños MD3" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>size</code> ajusta el contenedor del campo: <code>small</code> 48px,
        <code>medium</code> 56px (por defecto) y <code>large</code> 64px. La altura
        total del textarea sigue dependiendo de <code>rows</code>.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">small · 48px</span>
        <ZnMultilineText v-model="small" label="Compacto" variant="filled" size="small" :rows="3" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">medium · 56px</span>
        <ZnMultilineText v-model="medium" label="Estándar" variant="filled" :rows="3" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">large · 64px</span>
        <ZnMultilineText v-model="large" label="Amplio" variant="filled" size="large" :rows="3" />
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
const small = ref('')
const medium = ref('')
const large = ref('')
</script>
