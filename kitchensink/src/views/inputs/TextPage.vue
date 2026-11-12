<template>
  <DemoView view="input-text">
    <ZnSection title="1. Variantes MD3" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        MD3 define dos variantes de campo de texto: <code>outlined</code> (contorno con
        muesca) y <code>filled</code> (contenedor tonal con indicador inferior).
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">variant="outlined"</span>
        <ZnSingleLineText v-model="outlined" label="Nombre" hint="Contorno con muesca" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">variant="filled"</span>
        <ZnSingleLineText v-model="filled" label="Nombre" variant="filled" hint="Contenedor con indicador" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="2. Estados" collapsible :columns="3">
      <p class="section-desc section-desc--full">
        <code>error</code> y <code>hint</code> se excluyen (el error tiene prioridad) y se
        anuncian con <code>aria-invalid</code> y <code>aria-describedby</code>.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con error</span>
        <ZnSingleLineText v-model="conError" label="Correo" error="El campo es obligatorio" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Deshabilitado</span>
        <ZnSingleLineText model-value="Texto bloqueado" label="Bloqueado" disabled />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Obligatorio + adornos</span>
        <ZnSingleLineText v-model="conAdornos" label="Buscar" required>
          <template #leading>
            <ZnIcon name="search" :size="20" />
          </template>
          <template #trailing>
            <ZnIcon name="close" :size="20" />
          </template>
        </ZnSingleLineText>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Contenido" collapsible :columns="2">
      <p class="section-desc section-desc--full">
        La etiqueta es opcional: sin <code>label</code> no hay muesca y el
        <code>placeholder</code> queda visible. Aporta <code>aria-label</code> en ese caso.
      </p>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Con etiqueta y placeholder</span>
        <ZnSingleLineText v-model="conPlaceholder" label="Ciudad" placeholder="Madrid" />
      </ZnBox>

      <ZnBox variant="outlined" class="showcase-stack">
        <span class="showcase-label">Sin etiqueta</span>
        <ZnSingleLineText v-model="sinEtiqueta" placeholder="Buscar…" aria-label="Buscar" />
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import DemoView from '../../components/DemoView.vue'
import { ZnSection, ZnBox, ZnSingleLineText, ZnIcon } from '@zn-apps/ui-core'

const outlined = ref('Ada Lovelace')
const filled = ref('Grace Hopper')
const conError = ref('')
const conAdornos = ref('')
const conPlaceholder = ref('')
const sinEtiqueta = ref('')
</script>
