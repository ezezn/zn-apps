<template>
  <DemoView view="input-email">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        Valida el formato al perder el foco y emite <code>validation</code> y
        <code>update:valid</code>. Usa <code>type="email"</code>,
        <code>inputmode="email"</code> y <code>autocomplete="email"</code>.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Outlined</span>
        <ZnEmailInput
          v-model="outlined"
          label="Correo"
          hint="nombre@dominio.com"
          @update:valid="validoOutlined = $event"
        />
        <span class="helper-text">Válido: {{ validoOutlined ? 'Sí' : 'No' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Filled</span>
        <ZnEmailInput
          v-model="filled"
          label="Correo"
          variant="filled"
          @update:valid="validoFilled = $event"
        />
        <span class="helper-text">Válido: {{ validoFilled ? 'Sí' : 'No' }}</span>
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Estados" collapsible :columns="3">
      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Error de validación</span>
        <ZnEmailInput v-model="invalido" label="Correo" @update:valid="validoInvalido = $event" />
        <span class="helper-text">Válido: {{ validoInvalido ? 'Sí' : 'No' }}</span>
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Error externo</span>
        <ZnEmailInput v-model="conError" label="Correo" error="Este correo ya está registrado" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta + required</span>
        <ZnEmailInput v-model="sinEtiqueta" placeholder="tu@correo.com" aria-label="Correo de contacto" required />
      </ZnBox>
    </ZnSection>
    <ZnSection title="3. Tamaños MD3" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>size</code> ajusta la altura del contenedor: <code>small</code> 48px,
        <code>medium</code> 56px (por defecto) y <code>large</code> 64px. La validación
        y los estados no cambian.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">small · 48px</span>
        <ZnEmailInput v-model="small" label="Correo" variant="filled" size="small" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">medium · 56px</span>
        <ZnEmailInput v-model="medium" label="Correo" variant="filled" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">large · 64px</span>
        <ZnEmailInput v-model="large" label="Correo" variant="filled" size="large" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnEmailInput } from '@zn-apps/ui-core'

const outlined = ref('')
const filled = ref('')
const invalido = ref('no-es-un-correo')
const conError = ref('usuario@ejemplo.com')
const sinEtiqueta = ref('')
const validoOutlined = ref(true)
const validoFilled = ref(true)
const validoInvalido = ref(false)
const small = ref('')
const medium = ref('')
const large = ref('')
</script>
