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
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Escala de presentación: ajusta el tamaño de etiqueta y valor. Se resuelve como `field.size` → `section.size` → `schema.size` → prop `size`. |

Cada campo puede sobrescribir la posición con `field.labelPosition` y la escala
con `field.size`; cada sección, con `section.size`.

`field.span` permite que un campo ocupe varias columnas del grid de la sección
(`zn-span-N`, limitado a `section.layout`). Un campo con `span: 2` en una
sección de 2 columnas ocupa todo el ancho.

---

## 4. Formato de valores

`formatFieldValue` de `@zn-apps/ui-data-core` resuelve:

| Tipo | Presentación |
|---|---|
| `select` | Etiqueta de la opción seleccionada. |
| `multi-select` | Chips MD3 (`ZnChip`) con la etiqueta de cada opción. |
| `list` | Chips MD3 (`ZnChip`) con cada valor de la lista. |
| `richtext` | `ZnRichTextView`: Markdown convertido a HTML5 (encabezados, formato inline, listas y tablas). |
| `range` (array) | `min – max`. |
| `switch` / `checkbox` / boolean | `trueText` / `falseText`. |
| Objeto | JSON serializado. |
| Vacío | `emptyText`. |

La descripción del campo (`field.description`) se muestra bajo el valor.

Los valores array (`multi-select`, `list` o cualquier array) se presentan como un
grupo de chips `ZnChip variant="input"` que heredan el `size` del campo. Si el
array está vacío se muestra `emptyText`.

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
        options: [{ value: 'admin', label: 'Administrador' }] },
      { path: 'bio', type: 'textarea', label: 'Biografía', span: 2 }
    ]
  }]
}

const value = { name: 'Ada', role: 'admin' }
</script>

<template>
  <ZnDataView :model-value="value" :schema="schema" label-position="top" />
</template>
```

---

## 7. Pruebas

```bash
npx vitest run --project ui-data-view
```

Los tests viven en `src/components/__tests__/ZnDataView.spec.js` y cubren formato de valores, `hidden`, `emptyText`, layout de columnas, colapsado y etiquetas `top`/`inline`.
