# @zn-apps/ui-data-editor — user manual

`ZnDataEditor` looks like the read-only view but every value is editable: click (or Enter/Space) opens a dialog with the matching input.

- Package: `@zn-apps/ui-data-editor` · Folder: `shared/ui-data-editor/`
- Spanish: [Leer en español](../es/README.md)

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { ZnDataEditor } from '@zn-apps/ui-data-editor'
import '@zn-apps/ui-data-editor/dist/ui-data-editor.css'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'

const value = ref({ name: 'Ada', role: 'admin' })
const schema = { sections: [{ title: 'Cuenta', layout: 2, fields: [
  { path: 'name', type: 'text', label: 'Nombre' },
  { path: 'role', type: 'select', label: 'Rol', options: [{ value: 'admin', label: 'Administrador' }] },
  { path: 'bio', type: 'textarea', label: 'Biografía', span: 2 }
] }] }
</script>

<template>
  <ZnDataEditor v-model="value" :schema="schema" />
</template>
```

The editor imports neither the form nor the view stylesheet: import all three CSS files.

## Props

| Prop | Default | Description |
|---|---|---|
| `modelValue` | `{}` | data to show and edit |
| `schema` | required | sections and fields |
| `live` | `true` | each confirmed edit emits `update:modelValue`; `false` keeps a draft until `save()` |
| `labelPosition` | `top` | `top` or `inline` |
| `emptyText` | `'—'` | empty values |
| `trueText` / `falseText` | `'Yes'` / `'No'` | booleans |
| `variant` | `outlined` | dialog input variant; `schema.variant` wins |
| `size` | `medium` | dialog input size; `schema.size` wins |

Events: `update:modelValue`, `change(value, path, fieldValue)`, `save`, `cancel`, `reset`, `clear`.
Methods: `save()`, `cancel()`, `reset()`, `clear()`, and `value`.

## Behavior

1. Hover highlights the field and shows the edit icon; `disabled`/`readonly` fields do not open the dialog.
2. Saving writes the value to its `path`. Variant/size precedence: field → section → schema → editor props.
3. Arrays appear as chips and are edited in the dialog (`multi-select` with a multiple select, `list` with an editable chip list).
4. Rich text shows the rendered Markdown and edits it in the rich text editor; the stored value is Markdown.
5. `field.span` applies to the trigger in the section grid.
6. Every field capability must work both in the trigger (view) and in the dialog (form).

## Demo and tests

Kitchensink `/data/editor` (Reset/Clear plus the resulting JSON). Tests: `npx vitest run --project ui-data-editor`.
