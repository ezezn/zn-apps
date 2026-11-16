# @zn-apps/ui-data-editor — manual de usuario

`ZnDataEditor` se ve como la vista de sólo lectura, pero cada valor es editable: al hacer click (o Enter/Espacio) se abre un diálogo con el input correspondiente.

- Paquete: `@zn-apps/ui-data-editor` · Carpeta: `shared/ui-data-editor/`
- English: [Read in English](../en/README.md)

## Uso

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

El editor no importa los estilos del formulario ni de la vista: importa los tres archivos CSS.

## Props

| Prop | Default | Descripción |
|---|---|---|
| `modelValue` | `{}` | datos a mostrar y editar |
| `schema` | requerido | secciones y campos |
| `live` | `true` | cada edición confirmada emite `update:modelValue`; `false` mantiene un borrador hasta `save()` |
| `labelPosition` | `top` | `top` o `inline` |
| `emptyText` | `'—'` | valores vacíos |
| `trueText` / `falseText` | `'Yes'` / `'No'` | booleanos |
| `variant` | `outlined` | variante del input del diálogo; `schema.variant` tiene prioridad |
| `size` | `medium` | tamaño del input del diálogo; `schema.size` tiene prioridad |

Eventos: `update:modelValue`, `change(value, path, fieldValue)`, `save`, `cancel`, `reset`, `clear`.
Métodos: `save()`, `cancel()`, `reset()`, `clear()` y `value`.

## Comportamiento

1. El hover resalta el campo y muestra el icono de edición; los campos `disabled`/`readonly` no abren el diálogo.
2. Guardar escribe el valor en su `path`. Precedencia de variante/tamaño: campo → sección → schema → props del editor.
3. Los arrays se muestran como chips y se editan en el diálogo (`multi-select` con selección múltiple, `list` con lista de chips editable).
4. El texto enriquecido se muestra renderizado y se edita con el editor de texto enriquecido; el valor guardado es Markdown.
5. `field.span` se aplica al trigger en el grid de la sección.
6. Toda capacidad de un campo debe funcionar tanto en el trigger (vista) como en el diálogo (formulario).

## Demo y tests

Kitchensink `/data/editor` (Reset/Clear y el JSON resultante). Tests: `npx vitest run --project ui-data-editor`.
