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
      <p class="section-desc">
        <strong>Biografía</strong> y <strong>Notas</strong> declaran
        <code>span: 2</code>: ocupan las dos columnas de la sección
        <code>Cuenta</code>. El campo <code>richtext</code> se edita en el diálogo
        con el editor enriquecido y se presenta como HTML5.
      </p>

      <ZnRow class="editor-toolbar" padding="0" gap="8px" wrap>
        <ZnButton variant="tonal" @click="editorRef?.reset()">Reset</ZnButton>
        <ZnButton variant="text" @click="editorRef?.clear()">Clear</ZnButton>
        <ZnSelect
          v-model="editorVariant"
          label="Variante"
          :options="variantOptions"
          class="editor-option"
        />
        <ZnSelect
          v-model="editorSize"
          label="Tamaño"
          :options="sizeOptions"
          class="editor-option"
        />
      </ZnRow>

      <ZnDataEditor
        ref="editorRef"
        v-model="value"
        :schema="dataDemoSchema"
        :variant="editorVariant"
        :size="editorSize"
      />
    </ZnSection>

    <ZnSection title="2. Edición de multi-select y listas" collapsible :columns="1">
      <p class="section-desc">
        Los valores array se muestran como chips y se editan en el diálogo: un
        <code>multi-select</code> abre <code>ZnSelect multiple</code> y una
        <code>list</code> abre el editor de chips (Enter o coma para añadir).
      </p>

      <ZnDataEditor
        ref="multiEditorRef"
        v-model="multiValue"
        :schema="multiSchema"
      />

      <ZnBox variant="outlined" class="editor-output">
        <span class="showcase-label">Valor de multi-select / lista</span>
        <pre class="json-dump">{{ multiJson }}</pre>
      </ZnBox>

      <ZnRow class="editor-toolbar" padding="0" gap="8px" wrap>
        <ZnButton variant="tonal" @click="multiEditorRef?.reset()">Reset</ZnButton>
        <ZnButton variant="text" @click="multiEditorRef?.clear()">Clear</ZnButton>
      </ZnRow>
    </ZnSection>

    <ZnSection title="3. Valor actualizado" collapsible :columns="1">
      <ZnBox variant="outlined">
        <span class="showcase-label">Objeto del editor</span>
        <pre class="json-dump">{{ valueJson }}</pre>
      </ZnBox>
    </ZnSection>

    <ZnSection title="4. Esquema (schema)" collapsible :expanded="false" :columns="1">
      <p class="section-desc">
        JSON del esquema que recibe el editor. Es el mismo contrato del formulario
        y de la vista.
      </p>

      <ZnBox variant="outlined">
        <span class="showcase-label">schema</span>
        <pre class="json-dump">{{ schemaJson }}</pre>
      </ZnBox>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ZnBox, ZnButton, ZnRow, ZnSection, ZnSelect } from '@zn-apps/ui-core'
import { clone } from '@zn-apps/ui-data-core'
import { ZnDataEditor } from '@zn-apps/ui-data-editor'
import DemoView from '../../components/DemoView.vue'
import { dataDemoSchema, dataDemoValue } from '../../data/data-demo.js'

const editorRef = ref(null)
const multiEditorRef = ref(null)
const value = ref(clone(dataDemoValue))
const multiValue = ref({
  tags: ['design', 'code'],
  keywords: ['Material 3', 'chips']
})

const multiSchema = {
  sections: [
    {
      title: 'Etiquetas y palabras clave',
      layout: 1,
      fields: [
        {
          path: 'tags',
          type: 'multi-select',
          label: 'Etiquetas',
          options: [
            { value: 'design', label: 'Diseño' },
            { value: 'code', label: 'Código' },
            { value: 'research', label: 'Investigación' }
          ]
        },
        {
          path: 'keywords',
          type: 'list',
          label: 'Palabras clave',
          description: 'Escribe un valor y pulsa Enter para añadirlo.'
        }
      ]
    }
  ]
}

const multiJson = computed(() => JSON.stringify(multiValue.value, null, 2))
const schemaJson = computed(() => JSON.stringify(dataDemoSchema, null, 2))
const editorVariant = ref('filled')
const editorSize = ref('medium')
const variantOptions = [
  { value: 'outlined', label: 'Outlined' },
  { value: 'filled', label: 'Filled' }
]
const sizeOptions = [
  { value: 'small', label: 'Small · 48px' },
  { value: 'medium', label: 'Medium · 56px' },
  { value: 'large', label: 'Large · 64px' }
]
const valueJson = computed(() => JSON.stringify(value.value, null, 2))
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
}

.editor-toolbar {
  margin-bottom: 8px;
}

.editor-output {
  margin-top: 16px;
}

.editor-option {
  max-width: 200px;
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
