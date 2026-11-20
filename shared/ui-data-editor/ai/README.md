# @zn-apps/ui-data-editor — AI context

`ZnDataEditor`: view-like presentation where each value is a trigger that opens a `ZnDialog` with the matching input. Reuses `ZnDataViewField` for the trigger and `ZnDataField` from `ui-data-form` inside the dialog, so every `FieldTypes` value is covered by composition.

## Components

| Component | Role |
|---|---|
| `ZnDataEditor` | Root: draft, sections, events |
| `ZnDataEditorSection` | Section wrapper: `ZnSection` + title/icon |
| `ZnDataEditorField` | Read-only value + trigger + edit dialog |

## `ZnDataEditor` props

| Prop | Type | Default |
|---|---|---|
| `modelValue` | Object | `{}` |
| `schema` | Object | required |
| `live` | Boolean | `true` — each confirmed edit emits `update:modelValue`; `false` only emits `change` until `save()` |
| `labelPosition` | `top \| inline` | `top` |
| `emptyText` | String | `'—'` |
| `trueText` / `falseText` | String | `'Yes'` / `'No'` |
| `variant` | `outlined \| filled` | `outlined` (dialog input; `schema.variant` wins) |
| `size` | `xsmall \| small \| medium \| large` | `medium` (dialog input; `schema.size` wins) |

Events: `update:modelValue(value)` (confirmed edit with `live`, plus save/reset/clear), `change(value, path, fieldValue)`, `save`/`cancel`/`reset`/`clear`.
Exposed: `save()`, `cancel()`, `reset()`, `clear()`, `value`.

## Rules

1. Hover highlights the field and shows the `edit` icon; click/Enter/Space opens the dialog. `disabled`/`readonly` fields do not open it.
2. Store on confirm emits `update:modelValue` with the updated path. Variant/size precedence: `field` → `section` → `schema` → editor props.
3. Arrays render as chips in the trigger and are edited in the dialog (`ZnSelect multiple` for `multi-select`, editable chip list for `list`).
4. `richtext` shows `ZnRichTextView` and edits with `ZnRichTextEditor`; the confirmed value is Markdown.
5. `field.span` applies to the trigger in the section grid.
6. Parity: trigger = `ZnDataViewField`, dialog = `ZnDataField`; a field feature must work in both.
7. `live=false` keeps a draft; consumer calls `save()`, `cancel()` or `reset()`.
8. Applies `withDefaults(schema, modelValue)` on mount.

## Example

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

`ui-data-editor` does not import the form/view CSS: the app imports all three stylesheets.

Demo: `/data/editor` (Reset/Clear + resulting JSON). Tests: `src/components/__tests__/ZnDataEditor.spec.js` → `npx vitest run --project ui-data-editor`.
