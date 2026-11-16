# @zn-apps/ui-data-richtext — manual de usuario

Edición de texto enriquecido con valor Markdown: el usuario ve contenido formateado y la app guarda Markdown plano.

- Paquete: `@zn-apps/ui-data-richtext` · Carpeta: `shared/ui-data-richtext/`
- English: [Read in English](../en/README.md)

## Uso

```vue
<script setup>
import { ref } from 'vue'
import { ZnRichTextEditor, ZnRichTextView } from '@zn-apps/ui-data-richtext'
import '@zn-apps/ui-data-richtext/dist/ui-data-richtext.css'

const notes = ref('## Hola\n\n**Mundo**')
</script>

<template>
  <ZnRichTextEditor v-model="notes" label="Notas" variant="filled" size="medium" />
  <ZnRichTextView :model-value="notes" />
</template>
```

## `ZnRichTextEditor`

| Prop | Default | Descripción |
|---|---|---|
| `modelValue` | `''` | documento en Markdown |
| `label` / `hint` / `error` | `''` | textos del contenedor MD3 |
| `placeholder` | `'Escribe aquí…'` | texto cuando está vacío |
| `disabled` / `readonly` / `required` | `false` | estados del campo |
| `variant` | `outlined` | `outlined` o `filled` |
| `size` | `medium` | `small` (48px), `medium` (56px), `large` (64px) |
| `toolbarLabel` | `'Formato de texto'` | `aria-label` de la toolbar |
| `markdownLabel` / `viewLabel` | `'Markdown'` / `'Vista'` | etiquetas del cambio de modo |

Emite `update:modelValue` (Markdown) en cada cambio del documento, del modo fuente o del formato. Métodos: `focus()`, `toggleSource()`.

**Toolbar**: negrita, cursiva, subrayado, tachado, encabezados 1–3, párrafo, alineación, y diálogos de tabla, imagen y enlace.
- Tabla: filas y columnas con inputs numéricos (1–20).
- Imagen: lee el archivo, muestra su tamaño natural y permite fijar ancho/alto en píxeles; con **Preservar aspecto** activado, cambiar una dimensión recalcula la otra. El tamaño se guarda en el Markdown.
- Enlace: si el cursor o la selección están dentro de un enlace, el diálogo precarga sus valores para editarlo o quitarlo. Las URL sin protocolo reciben `https://` y se validan antes de aplicarse.

## `ZnRichTextView`

Props: `modelValue` (Markdown), `emptyText` (`'—'`), `size` (`small`/`medium`/`large`).

## Markdown soportado

Párrafos, encabezados `h1`–`h6`, negrita, cursiva, subrayado (`<u>`), tachado, código en línea, bloques de código, citas, listas ordenadas y desordenadas, separadores, enlaces, imágenes (`![alt](src)` y con tamaño `![alt](src =300x200)`), tablas GFM con alineación por columna y alineación de bloques con HTML mínimo (`<p style="text-align:center">`).

Los conversores se exportan para reutilizarlos:

```js
import { htmlToMarkdown, markdownToHtml } from '@zn-apps/ui-data-richtext'
```

## Uso como campo de datos

`type: 'richtext'` en un esquema `ui-data-*` renderiza este editor en formularios y en el diálogo del editor, y la vista renderizada en presentaciones de sólo lectura. El valor sigue siendo un string Markdown.

```json
{ "path": "profile.notes", "type": "richtext", "label": "Notas", "span": 2 }
```

## Demo y tests

Kitchensink `/data/richtext`; el mismo campo aparece en `/data/form`, `/data/view` y `/data/editor`. Tests: `npx vitest run --project ui-data-richtext`.
