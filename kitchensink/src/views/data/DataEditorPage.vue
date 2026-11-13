<template>
  <DemoView view="data-editor">
    <ZnSection title="1. Edición por campo" collapsible :columns="1">
      <p class="section-desc">
        Pasa el ratón sobre un valor (o enfócalo con el teclado) para ver el
        resaltado y el icono de edición. Al hacer click se abre un
        <code>ZnDialog</code> con el input correspondiente al
        <code>field.type</code>. Los campos <code>disabled</code> o
        <code>readonly</code> no abren el diálogo.
      </p>

      <div class="editor-toolbar">
        <ZnButton variant="tonal" @click="editorRef?.reset()">Reset</ZnButton>
        <ZnButton variant="text" @click="editorRef?.clear()">Clear</ZnButton>
      </div>

      <ZnDataEditor
        ref="editorRef"
        v-model="value"
        :schema="dataDemoSchema"
      />
    </ZnSection>

    <ZnSection title="2. Valor actualizado" collapsible :columns="1">
      <ZnBox variant="outlined">
        <span class="showcase-label">Objeto del editor</span>
        <pre class="json-dump">{{ valueJson }}</pre>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnBox, ZnButton, ZnSection } from '@zn-apps/ui-core'
import { clone } from '@zn-apps/ui-data-core'
import { ZnDataEditor } from '@zn-apps/ui-data-editor'
import DemoView from '../../components/DemoView.vue'
import { dataDemoSchema, dataDemoValue } from '../../data/data-demo.js'

const editorRef = ref(null)
const value = ref(clone(dataDemoValue))
const valueJson = computed(() => JSON.stringify(value.value, null, 2))
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.editor-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.showcase-label {
  display: block;
  margin-bottom: 8px;
  color: var(--md-on-surface-variant);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.json-dump {
  overflow-x: auto;
  max-height: 320px;
  margin: 0;
  padding: 12px;
  border-radius: 8px;
  background: var(--md-surface-container-low);
  color: var(--md-on-background);
  font-family: monospace;
  font-size: 0.8125rem;
  line-height: 1.5;
}
</style>
