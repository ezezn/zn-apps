# @zn-apps/ui-data-view — AI context

`ZnDataView`: read-only presentation of a JSON object described by the same schema as `ui-data-form`. Also the visual base of `ui-data-editor`.
Consumes `ui-core` (`ZnSection`, `ZnChip`) and `ui-data-core` (`formatFieldValue`, `fieldSpan`).

## Components

| Component | Role |
|---|---|
| `ZnDataView` | Root: iterates schema sections |
| `ZnDataViewSection` | Section wrapper: `ZnSection` + title/icon |
| `ZnDataViewField` | Label + formatted value (hidden when `field.hidden`) |

## `ZnDataView` props

| Prop | Type | Default |
|---|---|---|
| `modelValue` | Object | `{}` |
| `schema` | Object | required |
| `labelPosition` | `top \| inline` | `top` |
| `emptyText` | String | `'—'` |
| `trueText` | String | `'Yes'` |
| `falseText` | String | `'No'` |
| `size` | `small \| medium \| large` | `medium` (label/value scale; `field.size` → `section.size` → `schema.size` → prop) |

Per-field: `labelPosition`, `size`, `span` (`zn-span-N`, clamped to `section.layout`). `field.description` renders under the value.

## Value formatting

`formatFieldValue` from `ui-data-core` drives:

| Type | Presentation |
|---|---|
| `select` | selected option label |
| `multi-select` / `list` / any array | MD3 `ZnChip variant="input"` group inheriting `size`; `emptyText` when empty |
| `richtext` | `ZnRichTextView` (Markdown → HTML5: headings, inline marks, lists, tables) |
| `number` | numeric value as-is |
| `range` (array) | `min – max` |
| `switch` / `checkbox` / boolean | `trueText` / `falseText` |
| object | serialized JSON |
| empty | `emptyText` |

## Example

```vue
<script setup>
import { ZnDataView } from '@zn-apps/ui-data-view'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'

const schema = { sections: [{ title: 'Cuenta', collapsible: true, expanded: true, layout: 2, fields: [
  { path: 'name', type: 'text', label: 'Nombre' },
  { path: 'role', type: 'select', label: 'Rol', labelPosition: 'inline', options: [{ value: 'admin', label: 'Administrador' }] },
  { path: 'bio', type: 'textarea', label: 'Biografía', span: 2 }
] }] }
const value = { name: 'Ada', role: 'admin' }
</script>

<template>
  <ZnDataView :model-value="value" :schema="schema" label-position="top" />
</template>
```

Demo: `/data/view` (with a `labelPosition` toggle). Tests: `src/components/__tests__/ZnDataView.spec.js` → `npx vitest run --project ui-data-view`.
