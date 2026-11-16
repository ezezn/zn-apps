# @zn-apps/ui-data-form — AI context

`ZnDataForm`: sectioned, schema-driven form editing a JSON object, with draft/confirm or live binding.
Consumes `ui-core` inputs and the `ui-data-core` contract; `richtext` fields render `ZnRichTextEditor` from `ui-data-richtext`.

## Components

| Component | Role |
|---|---|
| `ZnDataForm` | Root: draft, action buttons, events |
| `ZnDataSection` | Section wrapper: `ZnSection` + icon/title |
| `ZnDataField` | Renders the `ui-core` input for `field.type` (all `FieldTypes`) |
| `ZnDataListInput` | Internal: `FieldTypes.LIST` as editable MD3 input chips (add with Enter/comma, remove with × or Backspace) |

## `ZnDataForm` props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `modelValue` | Object | `{}` | initial value and Reset/Cancel target |
| `schema` | Object | required | sections + fields |
| `live` | Boolean | `false` | `true` → every change emits `update:modelValue`; `false` → only Save confirms |
| `showActions` | Boolean | `true` | footer with Save/Cancel/Reset/Clear |
| `saveLabel`/`cancelLabel`/`resetLabel`/`clearLabel` | String | `Save`/`Cancel`/`Reset`/`Clear` | |
| `variant` | `outlined \| filled` | `outlined` | default for inputs; `schema.variant` wins |
| `size` | `small \| medium \| large` | `medium` | default for inputs; `schema.size` wins |

Events: `update:modelValue(value)` (save, live change, reset/clear with live), `change(value, path, fieldValue)`, `save(value)`, `cancel(initialValue)`, `reset(value)`, `clear({})`.
Exposed methods: `save()`, `cancel()`, `reset()`, `clear()`, `value`.

## Rules

1. Mount applies `withDefaults(schema, modelValue)`; the received value wins.
2. `live=false` keeps changes in the draft until Save; Cancel restores the initial snapshot.
3. Reset restores the initial snapshot (+ defaults); Clear sets `{}`. Both emit their event and, with `live`, `update:modelValue`.
4. Nested paths: `path: 'contact.email'` writes `{ contact: { email } }` without mutating the input object.
5. `hidden` fields are not rendered but keep their value.
6. Sections support `title`, `icon`, `collapsible`, `expanded`, `layout` (1–4 columns); the grid collapses to one column on small screens.
7. Variant/size precedence: `field` → `section` → `schema` → prop. Only fields with an MD3 container apply it (text, textarea, email, phone, number, date/time/datetime, select, multi-select, list, richtext). `switch`, `checkbox` and `range` have no container but keep the section row height (48/56/64).
8. `multi-select` → `ZnSelect multiple` with chips; `list` → free scalar array with chips. Chips inherit `size`.
9. `field.span` expands the field within the section grid (clamped to `section.layout`).
10. `richtext` renders `ZnRichTextEditor`; the value stays a Markdown string.
11. **Contract parity**: any new prop/state/type must also exist in `ZnDataViewField` and the `ZnDataEditorField` dialog.

## Example

```vue
<script setup>
import { ref } from 'vue'
import { ZnDataForm } from '@zn-apps/ui-data-form'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'

const value = ref({ name: 'Ada' })
const schema = { sections: [{ title: 'Perfil', icon: 'person', collapsible: true, expanded: true, layout: 2, fields: [
  { path: 'name', type: 'text', label: 'Nombre', required: true },
  { path: 'contact.email', type: 'email', label: 'Correo' },
  { path: 'bio', type: 'textarea', label: 'Biografía', rows: 3, span: 2 },
  { path: 'role', type: 'select', label: 'Rol', options: [{ value: 'admin', label: 'Administrador' }, { value: 'user', label: 'Usuario' }] }
] }] }
</script>

<template>
  <ZnDataForm v-model="value" :schema="schema" @save="persist" />
</template>
```

Demo: `/data/form`. Tests: `src/components/__tests__/ZnDataForm.spec.js` → `npx vitest run --project ui-data-form`.
