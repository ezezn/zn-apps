# @zn-apps/ui-data-form — Documentación de Librería

> Ubicación: `shared/ui-data-form/`
> Paquete npm: `@zn-apps/ui-data-form`
> Responsabilidad: construir formularios seccionados a partir de un `schema` y editar un objeto `value` con doble binding o confirmación explícita.

---

## 1. Propósito y Alcance

`ZnDataForm` recibe un objeto JSON (`modelValue`) y un esquema declarativo, y
renderiza secciones con campos basados en los componentes de entrada de
`@zn-apps/ui-core`. Cada campo escribe en la ruta `field.path` del objeto.

La librería no valida reglas de negocio: muestra el `error` declarado en el
campo, el `required` visual y delega la lógica de guardado al consumidor.

---

## 2. Componentes

| Componente | Rol |
|---|---|
| `ZnDataForm` | Contenedor raíz, borrador, botones y eventos. |
| `ZnDataSection` | Envoltorio de sección: reutiliza `ZnSection` de `@zn-apps/ui-core` y le añade el título con icono. |
| `ZnDataField` | Renderiza el input de `ui-core` correspondiente al `field.type`. |
| `ZnDataListInput` | Interno: edita `FieldTypes.LIST` como una lista de chips de entrada MD3 (añadir con Enter/coma, quitar con × o Backspace). |

---

## 3. Props de `ZnDataForm`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `modelValue` | Object | `{}` | Valor inicial y destino de Reset/Cancel. |
| `schema` | Object | — (requerido) | Secciones y campos. |
| `live` | Boolean | `false` | Si es `true`, cada cambio emite `update:modelValue`; si es `false`, el valor sólo se confirma con Save. |
| `showActions` | Boolean | `true` | Muestra u oculta el footer de acciones. |
| `saveLabel` | String | `'Save'` | Texto del botón Save. |
| `cancelLabel` | String | `'Cancel'` | Texto del botón Cancel. |
| `resetLabel` | String | `'Reset'` | Texto del botón Reset. |
| `clearLabel` | String | `'Clear'` | Texto del botón Clear. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Variante MD3 por defecto de los inputs. `schema.variant` tiene prioridad. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Tamaño MD3 por defecto (`small` = 48px, densidad -2). `schema.size` tiene prioridad. |

### Eventos

| Evento | Payload | Cuándo |
|---|---|---|
| `update:modelValue` | `value` | Save, `live` activo, Reset o Clear con `live`. |
| `change` | `(value, path, fieldValue)` | Cada cambio de un campo. |
| `save` | `value` | Click en Save / submit del form. |
| `cancel` | `initialValue` | Click en Cancel: descarta el borrador. |
| `reset` | `value` | Click en Reset: restaura el valor inicial + defaults. |
| `clear` | `{}` | Click en Clear: vacía todo el objeto. |

### Métodos expuestos

`save()`, `cancel()`, `reset()`, `clear()` y `value` (borrador actual), útiles
desde un ref del componente.

---

## 4. Reglas de Negocio

1. **Valor inicial con defaults**: al montar se aplica
   `withDefaults(schema, modelValue)`; el valor recibido tiene prioridad.
2. **Borrador**: con `live=false` los cambios no salen del componente hasta
   pulsar Save. `Cancel` restaura la instantánea inicial.
3. **Reset** restaura la instantánea inicial (valor recibido + defaults). **Clear**
   deja `{}`; ambos emiten su evento y, con `live`, también `update:modelValue`.
4. **Rutas anidadas**: `path: 'contact.email'` produce
   `{ contact: { email: '…' } }` sin mutar el objeto original.
5. **Campos ocultos** (`hidden`) no se renderizan pero conservan su valor.
6. **Secciones**: `title`, `icon`, `collapsible`, `expanded` y `layout` (1–4
   columnas). En pantallas pequeñas el grid pasa a una columna.
7. **Variante y tamaño**: la precedencia es `field.variant` → `section.variant`
   → `schema.variant` → prop `variant` (igual con `size`). Sólo se aplican a los
   campos con contenedor MD3: texto, textarea, email, teléfono, número, fecha,
   hora, fecha-hora, select, multi-select, listas y texto enriquecido. `switch`,
   `checkbox` y `range` no tienen contenedor, pero el layout de la sección
   conserva su altura (`small` 48px, `medium` 56px, `large` 64px).
8. **Listas y multi-select**: `type: 'multi-select'` usa `ZnSelect multiple` y
   muestra los valores como chips; `type: 'list'` edita un array libre de valores
   escalares con chips y un campo de entrada. Los chips heredan `size`.
9. **Span entre columnas**: `field.span` (1..columnas de la sección) expande el
   campo en el grid. Por ejemplo, un `textarea` con `span: 2` ocupa las dos
   columnas de una sección con `layout: 2`.
10. **Texto enriquecido**: `type: 'richtext'` renderiza `ZnRichTextEditor` de
    `@zn-apps/ui-data-richtext`; el valor sigue siendo un string Markdown.
11. **Paridad del contrato**: cualquier prop, estado o tipo nuevo debe existir
    también en `ZnDataViewField` y en el diálogo de `ZnDataEditorField`.

---

## 5. Ejemplo de integración

```vue
<script setup>
import { ref } from 'vue'
import { ZnDataForm } from '@zn-apps/ui-data-form'
import '@zn-apps/ui-data-form/dist/ui-data-form.css'

const value = ref({ name: 'Ada' })

const schema = {
  sections: [
    {
      title: 'Perfil',
      icon: 'person',
      collapsible: true,
      expanded: true,
      layout: 2,
      fields: [
        { path: 'name', type: 'text', label: 'Nombre', required: true },
        { path: 'contact.email', type: 'email', label: 'Correo' },
        { path: 'bio', type: 'textarea', label: 'Biografía', rows: 3, span: 2 },
        {
          path: 'role',
          type: 'select',
          label: 'Rol',
          options: [
            { value: 'admin', label: 'Administrador' },
            { value: 'user', label: 'Usuario' }
          ]
        }
      ]
    }
  ]
}
</script>

<template>
  <ZnDataForm v-model="value" :schema="schema" @save="persist" />
</template>
```

Con `live` el componente se comporta como un grupo de inputs con doble binding.

---

## 6. Demo

Ruta en kitchensink: **`/data/form`** (`src/views/data/DataFormPage.vue`).

## 7. Pruebas

```bash
npx vitest run --project ui-data-form
```

Los tests viven en `src/components/__tests__/ZnDataForm.spec.js`.
