# @zn-apps/ui-data-view — user manual

`ZnDataView` presents a JSON object described by the same schema as the form, read-only, with labels and formatted values.

- Package: `@zn-apps/ui-data-view` · Folder: `shared/ui-data-view/`
- Spanish: [Leer en español](../es/README.md)

## Usage

```vue
<script setup>
import { ZnDataView } from '@zn-apps/ui-data-view'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'

const schema = { sections: [{ title: 'Cuenta', collapsible: true, layout: 2, fields: [
  { path: 'name', type: 'text', label: 'Nombre' },
  { path: 'role', type: 'select', label: 'Rol', labelPosition: 'inline',
    options: [{ value: 'admin', label: 'Administrador' }] },
  { path: 'bio', type: 'textarea', label: 'Biografía', span: 2 }
] }] }
const value = { name: 'Ada', role: 'admin' }
</script>

<template>
  <ZnDataView :model-value="value" :schema="schema" label-position="top" />
</template>
```

## Props

| Prop | Default | Description |
|---|---|---|
| `modelValue` | `{}` | data to present |
| `schema` | required | sections and fields |
| `labelPosition` | `top` | label above the value, or `inline` |
| `emptyText` | `'—'` | text for empty values |
| `trueText` / `falseText` | `'Yes'` / `'No'` | booleans |
| `size` | `medium` | label/value scale: `small`, `medium`, `large` |

Each field may override `labelPosition`, `size` and `span`; each section may set `size`. `field.description` renders under the value.

## Value presentation

| Type | Presentation |
|---|---|
| `select` | selected option label |
| `multi-select`, `list`, any array | MD3 chips inheriting `size` (`emptyText` when empty) |
| `richtext` | rendered HTML (headings, inline marks, lists, tables) |
| `range` (array) | `min – max` |
| `switch` / `checkbox` / boolean | `trueText` / `falseText` |
| object | serialized JSON |
| empty | `emptyText` |

## Demo and tests

Kitchensink `/data/view` (with a `labelPosition` toggle). Tests: `npx vitest run --project ui-data-view`.
