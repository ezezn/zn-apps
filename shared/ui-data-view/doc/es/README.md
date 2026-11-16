# @zn-apps/ui-data-view — manual de usuario

`ZnDataView` presenta de sólo lectura un objeto JSON descrito por el mismo esquema que el formulario, con etiquetas y valores formateados.

- Paquete: `@zn-apps/ui-data-view` · Carpeta: `shared/ui-data-view/`
- English: [Read in English](../en/README.md)

## Uso

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

| Prop | Default | Descripción |
|---|---|---|
| `modelValue` | `{}` | datos a presentar |
| `schema` | requerido | secciones y campos |
| `labelPosition` | `top` | etiqueta encima del valor, o `inline` |
| `emptyText` | `'—'` | texto para valores vacíos |
| `trueText` / `falseText` | `'Yes'` / `'No'` | booleanos |
| `size` | `medium` | escala de etiqueta/valor: `small`, `medium`, `large` |

Cada campo puede sobrescribir `labelPosition`, `size` y `span`; cada sección puede fijar `size`. `field.description` se muestra bajo el valor.

## Presentación de valores

| Tipo | Presentación |
|---|---|
| `select` | etiqueta de la opción seleccionada |
| `multi-select`, `list`, cualquier array | chips MD3 que heredan `size` (`emptyText` si está vacío) |
| `richtext` | HTML renderizado (encabezados, formato inline, listas, tablas) |
| `range` (array) | `min – max` |
| `switch` / `checkbox` / boolean | `trueText` / `falseText` |
| objeto | JSON serializado |
| vacío | `emptyText` |

## Demo y tests

Kitchensink `/data/view` (con selector de `labelPosition`). Tests: `npx vitest run --project ui-data-view`.
