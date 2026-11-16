# @zn-apps/ui-data-richtext — user manual

Rich text editing with a Markdown value: users see formatted content, the app stores plain Markdown.

- Package: `@zn-apps/ui-data-richtext` · Folder: `shared/ui-data-richtext/`
- Spanish: [Leer en español](../es/README.md)

## Usage

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

| Prop | Default | Description |
|---|---|---|
| `modelValue` | `''` | Markdown document |
| `label` / `hint` / `error` | `''` | MD3 field shell texts |
| `placeholder` | `'Escribe aquí…'` | empty-state text |
| `disabled` / `readonly` / `required` | `false` | field states |
| `variant` | `outlined` | `outlined` or `filled` |
| `size` | `medium` | `small` (48px), `medium` (56px), `large` (64px) |
| `toolbarLabel` | `'Formato de texto'` | toolbar `aria-label` |
| `markdownLabel` / `viewLabel` | `'Markdown'` / `'Vista'` | source-toggle labels |

Emits `update:modelValue` (Markdown) on every document, source-mode or formatting change. Methods: `focus()`, `toggleSource()`.

**Toolbar**: bold, italic, underline, strikethrough, headings 1–3, paragraph, alignment, plus table, image and link dialogs.
- Table: rows and columns with numeric inputs (1–20).
- Image: reads the file, shows its natural size, lets you set width/height in pixels and, with **Preserve aspect ratio** enabled, changing one dimension updates the other. The size is stored in the Markdown.
- Link: if the cursor or selection is inside a link, the dialog pre-fills its values so you can edit or remove it. URLs without a protocol get `https://` and are validated before applying.

## `ZnRichTextView`

Props: `modelValue` (Markdown), `emptyText` (`'—'`), `size` (`small`/`medium`/`large`).

## Supported Markdown

Paragraphs, headings `h1`–`h6`, bold, italic, underline (`<u>`), strikethrough, inline code, code blocks, quotes, ordered/unordered lists, horizontal rules, links, images (`![alt](src)` and sized `![alt](src =300x200)`), GFM tables with column alignment, and block alignment via minimal HTML (`<p style="text-align:center">`).

Converters are exported for reuse:

```js
import { htmlToMarkdown, markdownToHtml } from '@zn-apps/ui-data-richtext'
```

## Use as a data field

`type: 'richtext'` in a `ui-data-*` schema renders this editor in forms and the editor dialog, and the rendered view in read-only presentations. The value stays a Markdown string.

```json
{ "path": "profile.notes", "type": "richtext", "label": "Notas", "span": 2 }
```

## Demo and tests

Kitchensink `/data/richtext`; the same field appears in `/data/form`, `/data/view` and `/data/editor`. Tests: `npx vitest run --project ui-data-richtext`.
