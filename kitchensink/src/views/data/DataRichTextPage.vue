<template>
  <DemoView view="data-richtext">
    <ZnSection title="1. Editor de texto enriquecido" collapsible :columns="1">
      <p class="section-desc">
        El contenido se edita como markup HTML5, pero <code>v-model</code> expone un
        string Markdown. La toolbar permite negrita, cursiva, subrayado, tachado,
        encabezados, párrafos, alineación y tablas. El botón
        <strong>Markdown</strong> abre el texto crudo para editarlo directamente.
      </p>

      <ZnRichTextEditor
        v-model="markdown"
        label="Descripción"
        hint="El valor almacenado es Markdown; la vista es HTML5."
        placeholder="Escribe y aplica formato…"
      />
    </ZnSection>

    <ZnSection title="2. Valor Markdown" collapsible :columns="1">
      <p class="section-desc">
        Este es el string que recibiría un formulario, una base de datos o una API.
        Puede editarse aquí y el editor se vuelve a renderizar.
      </p>

      <ZnBox variant="outlined">
        <span class="showcase-label">v-model</span>
        <pre class="json-dump">{{ markdown }}</pre>
      </ZnBox>
    </ZnSection>

    <ZnSection title="3. Presentación de sólo lectura" collapsible :columns="1">
      <p class="section-desc">
        <code>ZnRichTextView</code> convierte el mismo Markdown a HTML para
        presentación: encabezados, formato inline, listas, citas y tablas.
      </p>

      <ZnBox variant="outlined">
        <span class="showcase-label">ZnRichTextView</span>
        <ZnRichTextView :model-value="markdown" />
      </ZnBox>
    </ZnSection>

    <ZnSection title="4. Campo richtext en form / view / editor" collapsible :columns="1">
      <p class="section-desc">
        El tipo <code>richtext</code> de <code>UiDataCore.FieldTypes</code> usa este
        editor en formularios y diálogos de edición, y <code>ZnRichTextView</code>
        en la presentación. Las demos <code>/data/form</code>, <code>/data/view</code>
        y <code>/data/editor</code> incluyen el campo <code>profile.notes</code>.
      </p>
    </ZnSection>
  </DemoView>
</template>

<script setup>
import { ref } from 'vue'
import { ZnBox, ZnSection } from '@zn-apps/ui-core'
import { ZnRichTextEditor, ZnRichTextView } from '@zn-apps/ui-data-richtext'
import DemoView from '../../components/DemoView.vue'

const markdown = ref(`## Material 3

Este editor guarda **Markdown** y muestra *HTML5*.

- Negrita, cursiva, <u>subrayado</u> y ~~tachado~~
- Encabezados, párrafos y alineación
- Tablas con alineación por columna

| Formato | Atajo |
| --- | :---: |
| Negrita | B |
| Tabla | ▦ |`)
</script>

<style scoped>
.section-desc {
  margin: 0 0 16px;
  color: var(--md-on-surface-variant);
  line-height: 1.5;
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
  white-space: pre-wrap;
}
</style>
