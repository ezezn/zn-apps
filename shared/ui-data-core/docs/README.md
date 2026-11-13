# @zn-apps/ui-data-core — Documentación de Librería

> Ubicación: `shared/ui-data-core/`
> Paquete npm: `@zn-apps/ui-data-core`
> Responsabilidad: contrato del esquema, utilidades de objetos JSON y formato de valores compartidos por `ui-data-form`, `ui-data-view` y `ui-data-editor`.

---

## 1. Propósito y Alcance

`@zn-apps/ui-data-core` es la base común de la familia `ui-data-*`. No depende de
Vue ni del DOM: expone funciones puras para leer/escribir rutas anidadas, aplicar
valores por defecto y convertir un valor en texto de presentación.

Las tres librerías de UI comparten el mismo `schema` y el mismo `value` (un objeto
JSON), de modo que una aplicación puede alternar entre formulario, vista y editor
sin transformar los datos.

---

## 2. Modelo del esquema

```js
const schema = {
  sections: [
    {
      title: 'Perfil',          // opcional
      icon: 'person',           // nombre de icono Material (opcional)
      collapsible: true,        // opcional
      expanded: false,          // estado inicial si es colapsable
      layout: 2,                // 1 | 2 | 3 | 4 columnas (por defecto 1)
      variant: 'filled',        // opcional: outlined | filled
      size: 'small',            // opcional: small | medium | large
      fields: [
        {
          path: 'contact.email', // ruta dentro del objeto value
          type: 'email',         // FieldTypes
          label: 'Correo',
          variant: 'outlined',   // override por campo
          size: 'large',         // override por campo
          span: 2,               // ocupa 2 columnas de la sección (1..columnas)
          description: 'Solo laboral',
          placeholder: 'nombre@empresa.com',
          required: true,
          hidden: false,
          disabled: false,
          readonly: false,
          error: 'Mensaje de error',
          default: 'sin-correo@example.com',
          // según el tipo:
          options: [{ value: 'a', label: 'A' }], // select / multi-select
          min: 0, max: 100, step: 1,             // number / range / date / time
          // list: array de valores escalares, sin `options`
          rows: 4, maxlength: 500,               // textarea
          labelPosition: 'inline'                // override de presentación
        }
      ]
    }
  ]
}
```

### `FieldTypes`

| Constante | Valor | Componente en `ui-data-form` |
|---|---|---|
| `TEXT` | `text` | `ZnSingleLineText` |
| `TEXTAREA` | `textarea` | `ZnMultilineText` |
| `EMAIL` | `email` | `ZnEmailInput` |
| `PHONE` | `phone` | `ZnPhoneInput` |
| `NUMBER` | `number` | `ZnSingleLineText type="number"` |
| `DATE` | `date` | `ZnDateInput` |
| `TIME` | `time` | `ZnTimeInput` |
| `DATETIME` | `datetime` | `ZnDateTimeInput` |
| `SELECT` | `select` | `ZnSelect` |
| `MULTI_SELECT` | `multi-select` | `ZnSelect multiple` (chips MD3) |
| `LIST` | `list` | Lista libre de valores con chips editables (interna `ZnDataListInput`) |
| `RICHTEXT` | `richtext` | `ZnRichTextEditor` (valor Markdown, vista HTML5) |
| `SWITCH` | `switch` | `ZnSwitch` |
| `CHECKBOX` | `checkbox` | `ZnSwitch` |
| `RANGE` | `range` | `ZnRangeInput` |

### `LayoutColumns`

`ONE`, `TWO`, `THREE`, `FOUR` (`1..4`). `sectionColumns(section)` normaliza
cualquier valor fuera de rango.

`fieldSpan(field, columns)` resuelve `field.span` (por defecto `1`) y lo limita
a las columnas efectivas de la sección. Los tres renderizadores aplican la clase
`zn-span-N` de `ui-core`, de modo que un `textarea` con `span: 2` ocupa las dos
columnas de una sección `layout: 2`.

### `LabelPositions`

`TOP` (`label` encima del valor) e `INLINE` (misma línea). Aplicable por vista,
sección o campo (`field.labelPosition`).

### `InputVariants` e `InputSizes`

`InputVariants` (`OUTLINED`, `FILLED`) e `InputSizes` (`SMALL`, `MEDIUM`,
`LARGE`) describen las opciones MD3 de los campos. `normalizeInputVariant(value,
fallback)` y `normalizeInputSize(value, fallback)` devuelven el fallback cuando
el valor no es válido.

La precedencia es **campo → sección → contenedor** (`ZnDataForm`,
`ZnDataView`, `ZnDataEditor`) y, en form/editor, el `schema` raíz puede fijar
`variant`/`size` como valor por defecto del documento.

---

## 3. API de utilidades

### Objetos

| Función | Descripción |
|---|---|
| `isObject(value)` | `true` para objetos planos (no arrays ni `null`). |
| `clone(value)` | Copia profunda de objetos y arrays. |
| `merge(base, override)` | Mezcla profunda; `override` gana. |
| `pathParts(path)` | Normaliza `'a.b.0'` o `['a', 'b']` a un array de partes. |
| `readAt(object, path)` | Lee una ruta anidada (`undefined` si no existe). |
| `writeAt(object, path, value)` | Devuelve una copia con el valor escrito; crea objetos intermedios; nunca muta la entrada. |

### Esquema

| Función | Descripción |
|---|---|
| `schemaSections(schema)` | Secciones válidas del esquema. |
| `schemaFields(schema)` | Lista plana de todos los campos. |
| `sectionColumns(section)` | Columnas efectivas (1..4). |
| `fieldSpan(field, columns)` | Columnas que ocupa un campo, limitadas a la sección. |
| `collectDefaults(schema)` | Objeto con los `default` declarados por los campos. |
| `withDefaults(schema, value)` | `merge(collectDefaults(schema), value)`: el valor recibido tiene prioridad. |

### Formato

| Función | Descripción |
|---|---|
| `normalizeOptions(options)` | Normaliza opciones primitivas u `{ value, label }`. |
| `optionLabel(options, value)` | Etiqueta de una opción. |
| `formatFieldValue(field, value, options)` | Texto de presentación. `options`: `emptyText` (`'—'`), `trueText` (`'Yes'`), `falseText` (`'No'`), `separator` (`', '`). Para `richtext` devuelve texto plano sin sintaxis Markdown (la presentación rica usa `ZnRichTextView`). |

---

## 4. Ejemplo

```js
import {
  FieldTypes,
  withDefaults,
  writeAt,
  readAt,
  formatFieldValue
} from '@zn-apps/ui-data-core'

const schema = {
  sections: [{
    layout: 2,
    fields: [
      { path: 'name', type: FieldTypes.TEXT, default: 'Anónimo' },
      { path: 'tags', type: FieldTypes.MULTI_SELECT, options: ['a', 'b'] }
    ]
  }]
}

const initial = withDefaults(schema, { name: 'Ada' })
const next = writeAt(initial, 'tags', ['a'])

readAt(next, 'tags') // ['a']
formatFieldValue({ type: 'text' }, null) // '—'
```

---

## 5. Demo

Ruta en kitchensink: **`/data/core`** (`src/views/data/DataCorePage.vue`).

## 6. Pruebas

```bash
npx vitest run --project ui-data-core
```

Los tests viven en `src/__tests__/index.spec.js`.
