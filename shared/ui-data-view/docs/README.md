# @zn-apps/ui-data-view — Documentación de Librería

> Ubicación: `shared/ui-data-view/`
> Paquete npm: `@zn-apps/ui-data-view`
> Responsabilidad: presentar un objeto JSON descrito por un `schema` sin permitir su edición.

---

## 1. Propósito y Alcance

`ZnDataView` comparte el mismo contrato de `schema` y `value` que
`@zn-apps/ui-data-form`. Renderiza las mismas secciones (título, icono,
colapsable, layout de 1–4 columnas) pero, en lugar de inputs, muestra la
etiqueta y el valor formateado.

Es la base visual de `@zn-apps/ui-data-editor`.

---

## 2. Componentes

| Componente | Rol |
|---|---|
| `ZnDataView` | Raíz: recorre las secciones del esquema. |
| `ZnDataViewSection` | Envoltorio de sección: reutiliza `ZnSection` de `@zn-apps/ui-core` con título e icono. |
| `ZnDataViewField` | Etiqueta + valor formateado (u oculto si `field.hidden`). |

---

## 3. Props de `ZnDataView`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `modelValue` | Object | `{}` | Datos a presentar. |
| `schema` | Object | — (requerido) | Secciones y campos. |
| `labelPosition` | `'top' \| 'inline'` | `'top'` | Etiqueta encima del valor o en la misma línea. |
| `emptyText` | String | `'—'` | Texto para valores vacíos (`null`, `''`, `[]`). |
| `trueText` | String | `'Yes'` | Texto para `true`. |
| `falseText` | String | `'No'` | Texto para `false`. |

Cada campo puede sobrescribir la posición con `field.labelPosition`.

---

## 4. Formato de valores

`formatFieldValue` de `@zn-apps/ui-data-core` resuelve:

| Tipo | Presentación |
|---|---|
| `select` | Etiqueta de la opción seleccionada. |
| `multi-select` | Etiquetas separadas por `, `. |
| `range` (array) | `min – max`. |
| `switch` / `checkbox` / boolean | `trueText` / `falseText`. |
| Objeto | JSON serializado. |
| Vacío | `emptyText`. |

La descripción del campo (`field.description`) se muestra bajo el valor.

---

## 5. Demo

Ruta en kitchensink: **`/data/view`** (`src/views/data/DataViewPage.vue`), con un selector para alternar `labelPosition`.

## 6. Ejemplo

```vue
<script setup>
import { ZnDataView } from '@zn-apps/ui-data-view'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'

const schema = {
  sections: [{
    title: 'Cuenta',
    collapsible: true,
    expanded: true,
    layout: 2,
    fields: [
      { path: 'name', type: 'text', label: 'Nombre' },
      { path: 'role', type: 'select', label: 'Rol', labelPosition: 'inline',
        options: [{ value: 'admin', label: 'Administrador' }] }
    ]
  }]
}

const value = { name: 'Ada', role: 'admin' }
</script>

<template>
  <ZnDataView :model-value="value" :schema="schema" label-position="top" />
</template>
```
