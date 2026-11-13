# @zn-apps/ui-data-editor — Documentación de Librería

> Ubicación: `shared/ui-data-editor/`
> Paquete npm: `@zn-apps/ui-data-editor`
> Responsabilidad: presentar secciones como `ui-data-view` y permitir editar cada valor en un diálogo, al hacer hover/click.

---

## 1. Propósito y Alcance

`ZnDataEditor` reutiliza la presentación de `@zn-apps/ui-data-view` y el
renderizador de inputs de `@zn-apps/ui-data-form`. Cada valor es un disparador:
al pasar el ratón se resalta y aparece un icono de edición; al hacer click (o
pulsar Enter/Espacio) se abre `ZnDialog` con el input correspondiente al
`field.type`. Guardar confirma el valor por su `path`; Cancelar descarta.

Comparte el mismo `schema` y `value` que `ZnDataForm` y `ZnDataView`.

---

## 2. Componentes

| Componente | Rol |
|---|---|
| `ZnDataEditor` | Raíz: borrador, secciones y eventos. |
| `ZnDataEditorSection` | Envoltorio de sección: reutiliza `ZnSection` de `@zn-apps/ui-core` con título e icono. |
| `ZnDataEditorField` | Valor de sólo lectura + trigger + diálogo de edición. |

---

## 3. Props de `ZnDataEditor`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `modelValue` | Object | `{}` | Datos a mostrar/editar. |
| `schema` | Object | — (requerido) | Secciones y campos. |
| `live` | Boolean | `true` | Cada edición emite `update:modelValue`. Con `false` sólo emite `change` hasta llamar a `save()`. |
| `labelPosition` | `'top' \| 'inline'` | `'top'` | Posición de las etiquetas. |
| `emptyText` | String | `'—'` | Texto para valores vacíos. |
| `trueText` / `falseText` | String | `'Yes'` / `'No'` | Textos para booleanos. |

### Eventos

| Evento | Payload | Cuándo |
|---|---|---|
| `update:modelValue` | `value` | Edición confirmada (con `live`) y en `save`/`reset`/`clear`. |
| `change` | `(value, path, fieldValue)` | Edición confirmada en el diálogo. |
| `save` / `cancel` / `reset` / `clear` | — | Métodos expuestos invocados por el consumidor. |

### Métodos expuestos

`save()`, `cancel()`, `reset()`, `clear()` y `value` (borrador actual).

---

## 4. Reglas de Negocio

1. **Hover/click**: el trigger resalta el campo y muestra el icono `edit`. Los
   campos `disabled` o `readonly` no abren el diálogo.
2. **Diálogo**: usa el `ZnDataField` de `ui-data-form`, por lo que soporta todos
   los `FieldTypes`. Guardar emite `update:modelValue` con la ruta actualizada.
3. **`live`**: por defecto cada edición se confirma al guardar el diálogo. Con
   `live=false` el componente mantiene un borrador y el consumidor decide cuándo
   llamar a `save()`, `cancel()` o `reset()`.
4. **Defaults**: igual que el formulario, aplica `withDefaults(schema, modelValue)`.

---

## 5. Ejemplo

```vue
<script setup>
import { ref } from 'vue'
import { ZnDataEditor } from '@zn-apps/ui-data-editor'
import '@zn-apps/ui-data-editor/dist/ui-data-editor.css'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'
import '@zn-apps/ui-data-view/dist/ui-data-view.css'

const value = ref({ name: 'Ada', role: 'admin' })

const schema = {
  sections: [{
    title: 'Cuenta',
    layout: 2,
    fields: [
      { path: 'name', type: 'text', label: 'Nombre' },
      { path: 'role', type: 'select', label: 'Rol',
        options: [{ value: 'admin', label: 'Administrador' }] }
    ]
  }]
}
</script>

<template>
  <ZnDataEditor v-model="value" :schema="schema" />
</template>
```

> `ui-data-editor` no importa el CSS de `ui-data-form` ni de `ui-data-view`;
> la app debe importar los tres archivos `.css` de las librerías que use.

---

## 6. Demo

Ruta en kitchensink: **`/data/editor`** (`src/views/data/DataEditorPage.vue`), con acciones Reset/Clear y el JSON resultante.

```bash
npm run build --workspace=@zn-apps/ui-data-editor
```
