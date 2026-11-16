# @zn-apps/ui-data-core — manual de usuario

El contrato compartido de la familia `ui-data-*`: forma del esquema, utilidades para JSON anidado, defaults y formato de valores. Funciones puras — sin Vue ni DOM.

- Paquete: `@zn-apps/ui-data-core` · Carpeta: `shared/ui-data-core/`
- English: [Read in English](../en/README.md)

## Esquema

```js
{
  sections: [{
    title: 'Perfil', icon: 'person', collapsible: true, expanded: false,
    layout: 2,              // 1–4 columnas
    variant: 'filled',      // outlined | filled
    size: 'small',          // small | medium | large
    fields: [{
      path: 'contact.email', type: 'email', label: 'Correo',
      variant: 'outlined', size: 'large', span: 2, labelPosition: 'inline',
      description: 'Solo laboral', placeholder: '…', required: true,
      hidden: false, disabled: false, readonly: false, error: '', default: '',
      options: [{ value: 'a', label: 'A' }], // select / multi-select
      min: 0, max: 100, step: 1,             // number / range / date / time
      rows: 4, maxlength: 500                // textarea
    }]
  }]
}
```

## Tipos de campo

`text`, `textarea`, `email`, `phone`, `number`, `date`, `time`, `datetime`, `select`, `multi-select`, `list` (array libre de escalares), `richtext` (Markdown), `switch`, `checkbox`, `range`.

Cada uno tiene implementación en formulario (`ZnDataField`), vista (`ZnDataViewField`) y diálogo del editor. Agregar un tipo significa implementar los tres.

## Reglas

- Columnas: `layout` 1–4; `field.span` (por defecto 1) se limita a las columnas de la sección.
- Etiquetas: `labelPosition` `top` o `inline`, por vista, sección o campo.
- Variantes/tamaños: `variant` `outlined`/`filled`, `size` `small`/`medium`/`large`; precedencia **campo → sección → contenedor** (`schema` puede fijar el default del documento).
- Los defaults vienen de `field.default` y nunca sobrescriben un valor recibido.

## Utilidades

| Grupo | Funciones |
|---|---|
| Objetos | `isObject`, `clone`, `merge`, `pathParts`, `readAt(obj, path)`, `writeAt(obj, path, value)` (copy-on-write) |
| Esquema | `schemaSections`, `schemaFields`, `sectionColumns`, `fieldSpan`, `collectDefaults`, `withDefaults(schema, value)` |
| Formato | `normalizeOptions`, `optionLabel`, `formatFieldValue(field, value, options)` con `emptyText` `'—'`, `trueText` `'Yes'`, `falseText` `'No'`, `separator` `', '` |

```js
import { FieldTypes, withDefaults, writeAt, readAt, formatFieldValue } from '@zn-apps/ui-data-core'
```

## Demo y tests

Kitchensink `/data/core`. Tests: `npx vitest run --project ui-data-core`.
