# @zn-apps/ui-data-form — user manual

`ZnDataForm` builds a sectioned form from a declarative schema and edits a JSON object, either live or with an explicit Save.

- Package: `@zn-apps/ui-data-form` · Folder: `shared/ui-data-form/`
- Spanish: [Leer en español](../es/README.md)

## Usage

```vue
<script setup>
import { ref } from 'vue'
import { ZnDataForm } from '@zn-apps/ui-data-form'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'

const value = ref({ name: 'Ada' })
const schema = { sections: [{ title: 'Perfil', icon: 'person', collapsible: true, layout: 2, fields: [
  { path: 'name', type: 'text', label: 'Nombre', required: true },
  { path: 'contact.email', type: 'email', label: 'Correo' },
  { path: 'bio', type: 'textarea', label: 'Biografía', rows: 3, span: 2 }
] }] }
</script>

<template>
  <ZnDataForm v-model="value" :schema="schema" @save="persist" />
</template>
```

## Props

| Prop | Default | Description |
|---|---|---|
| `modelValue` | `{}` | initial value; Reset/Cancel target |
| `schema` | required | sections and fields (see [ui-data-core](../../../ui-data-core/doc/en/README.md)) |
| `live` | `false` | `true` = every change emits `update:modelValue`; `false` = only Save confirms |
| `showActions` | `true` | show the Save/Cancel/Reset/Clear footer |
| `saveLabel` / `cancelLabel` / `resetLabel` / `clearLabel` | `Save` / `Cancel` / `Reset` / `Clear` | button texts |
| `variant` | `outlined` | default input variant; `schema.variant` wins |
| `size` | `medium` | default input size (48/56/64px); `schema.size` wins |

Events: `update:modelValue`, `change(value, path, fieldValue)`, `save(value)`, `cancel(initialValue)`, `reset(value)`, `clear`.
Methods: `save()`, `cancel()`, `reset()`, `clear()`, and `value` (current draft).

## Behavior

1. On mount it applies `withDefaults(schema, modelValue)`; received values win.
2. With `live=false`, changes stay in a draft until Save; Cancel restores the initial snapshot.
3. Reset restores the initial snapshot (+ defaults); Clear leaves `{}`.
4. Nested paths (`contact.email`) are written without mutating the original object.
5. `hidden` fields keep their value but are not rendered.
6. Sections support `title`, `icon`, `collapsible`, `expanded`, `layout` (1–4 columns) and collapse to one column on small screens.
7. Variant/size precedence: field → section → schema → prop. Fields without an MD3 container (`switch`, `checkbox`, `range`) keep the row height.
8. `multi-select` and `list` edit values with MD3 chips; chips inherit `size`.
9. `richtext` renders the Markdown rich text editor; the stored value is still a Markdown string.
10. Any new field capability must also exist in the view and the editor.

## Demo and tests

Kitchensink `/data/form`. Tests: `npx vitest run --project ui-data-form`.
