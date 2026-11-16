# @zn-apps/ui-data-core — user manual

The shared contract behind the `ui-data-*` family: schema shape, nested JSON helpers, defaults and value formatting. Pure functions — no Vue, no DOM.

- Package: `@zn-apps/ui-data-core` · Folder: `shared/ui-data-core/`
- Spanish: [Leer en español](../es/README.md)

## Schema

```js
{
  sections: [{
    title: 'Perfil', icon: 'person', collapsible: true, expanded: false,
    layout: 2,              // 1–4 columns
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

## Field types

`text`, `textarea`, `email`, `phone`, `number`, `date`, `time`, `datetime`, `select`, `multi-select`, `list` (free scalar array), `richtext` (Markdown), `switch`, `checkbox`, `range`.

Each one has an implementation in the form (`ZnDataField`), the view (`ZnDataViewField`) and the editor dialog. Adding a type means implementing all three.

## Rules

- Columns: `layout` 1–4; `field.span` (default 1) is clamped to the section columns.
- Labels: `labelPosition` `top` or `inline`, per view, section or field.
- Variants/sizes: `variant` `outlined`/`filled`, `size` `small`/`medium`/`large`; precedence **field → section → container** (`schema` may set the document default).
- Defaults come from `field.default` and never override a received value.

## Utilities

| Group | Functions |
|---|---|
| Objects | `isObject`, `clone`, `merge`, `pathParts`, `readAt(obj, path)`, `writeAt(obj, path, value)` (copy-on-write) |
| Schema | `schemaSections`, `schemaFields`, `sectionColumns`, `fieldSpan`, `collectDefaults`, `withDefaults(schema, value)` |
| Format | `normalizeOptions`, `optionLabel`, `formatFieldValue(field, value, options)` with `emptyText` `'—'`, `trueText` `'Yes'`, `falseText` `'No'`, `separator` `', '` |

```js
import { FieldTypes, withDefaults, writeAt, readAt, formatFieldValue } from '@zn-apps/ui-data-core'
```

## Demo and tests

Kitchensink `/data/core`. Tests: `npx vitest run --project ui-data-core`.
