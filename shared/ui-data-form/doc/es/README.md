# @zn-apps/ui-data-form — manual de usuario

`ZnDataForm` construye un formulario por secciones a partir de un esquema declarativo y edita un objeto JSON, en vivo o con confirmación explícita.

- Paquete: `@zn-apps/ui-data-form` · Carpeta: `shared/ui-data-form/`
- English: [Read in English](../en/README.md)

## Uso

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

| Prop | Default | Descripción |
|---|---|---|
| `modelValue` | `{}` | valor inicial; destino de Reset/Cancel |
| `schema` | requerido | secciones y campos (ver [ui-data-core](../../../ui-data-core/doc/es/README.md)) |
| `live` | `false` | `true` = cada cambio emite `update:modelValue`; `false` = sólo Save confirma |
| `showActions` | `true` | muestra el footer Save/Cancel/Reset/Clear |
| `saveLabel` / `cancelLabel` / `resetLabel` / `clearLabel` | `Save` / `Cancel` / `Reset` / `Clear` | textos de los botones |
| `variant` | `outlined` | variante por defecto de los inputs; `schema.variant` tiene prioridad |
| `size` | `medium` | tamaño por defecto (48/56/64px); `schema.size` tiene prioridad |

Eventos: `update:modelValue`, `change(value, path, fieldValue)`, `save(value)`, `cancel(initialValue)`, `reset(value)`, `clear`.
Métodos: `save()`, `cancel()`, `reset()`, `clear()` y `value` (borrador actual).

## Comportamiento

1. Al montar aplica `withDefaults(schema, modelValue)`; el valor recibido tiene prioridad.
2. Con `live=false`, los cambios quedan en un borrador hasta Save; Cancel restaura la instantánea inicial.
3. Reset restaura la instantánea inicial (+ defaults); Clear deja `{}`.
4. Las rutas anidadas (`contact.email`) se escriben sin mutar el objeto original.
5. Los campos `hidden` conservan su valor pero no se renderizan.
6. Las secciones aceptan `title`, `icon`, `collapsible`, `expanded` y `layout` (1–4 columnas), y pasan a una columna en pantallas pequeñas.
7. Precedencia de variante/tamaño: campo → sección → schema → prop. Los campos sin contenedor MD3 (`switch`, `checkbox`, `range`) conservan la altura de la fila.
8. `multi-select` y `list` editan valores con chips MD3; los chips heredan `size`.
9. `richtext` renderiza el editor de texto enriquecido; el valor guardado sigue siendo un string Markdown.
10. Toda capacidad nueva de un campo debe existir también en la vista y en el editor.

## Demo y tests

Kitchensink `/data/form`. Tests: `npx vitest run --project ui-data-form`.
