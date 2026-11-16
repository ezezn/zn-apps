# @zn-apps/ui-data-core — AI context

Shared contract for the `ui-data-*` family: schema shape, nested JSON helpers, defaults and value formatting. Pure functions — no Vue, no DOM.
Location: `shared/ui-data-core/`.

Form, view and editor consume the same `schema` and the same JSON `value`, so an app can switch presentation without transforming data.

## Schema

```js
{
  sections: [{
    title: 'Perfil',        // optional
    icon: 'person',         // optional Material icon
    collapsible: true,      // optional
    expanded: false,        // initial state when collapsible
    layout: 2,              // 1|2|3|4 columns (default 1)
    variant: 'filled',      // optional outlined|filled
    size: 'small',          // optional small|medium|large
    fields: [{
      path: 'contact.email', // path inside value
      type: 'email',         // FieldTypes
      label: 'Correo',
      variant: 'outlined',   // per-field override
      size: 'large',         // per-field override
      span: 2,               // columns occupied (1..section columns)
      description: '...', placeholder: '...',
      required: true, hidden: false, disabled: false, readonly: false,
      error: '...', default: '...',
      options: [{ value: 'a', label: 'A' }],  // select / multi-select
      min: 0, max: 100, step: 1,              // number / range / date / time
      rows: 4, maxlength: 500,                // textarea
      labelPosition: 'inline'                 // presentation override
    }]
  }]
}
```

`list` is an array of scalars and has no `options`. Document-level defaults: `schema.variant` / `schema.size`.

## `FieldTypes`

| Const | Value | Form implementation | View implementation |
|---|---|---|---|
| `TEXT` | `text` | `ZnSingleLineText` | formatted text |
| `TEXTAREA` | `textarea` | `ZnMultilineText` | formatted text |
| `EMAIL` | `email` | `ZnEmailInput` | text |
| `PHONE` | `phone` | `ZnPhoneInput` | text |
| `NUMBER` | `number` | `ZnNumberInput` (`Number \| null`, `min`/`max`/`step`) | numeric string |
| `DATE` | `date` | `ZnDateInput` | text |
| `TIME` | `time` | `ZnTimeInput` | text |
| `DATETIME` | `datetime` | `ZnDateTimeInput` | text |
| `SELECT` | `select` | `ZnSelect` | option label |
| `MULTI_SELECT` | `multi-select` | `ZnSelect multiple` (MD3 chips) | chips |
| `LIST` | `list` | internal `ZnDataListInput` (editable chips) | chips |
| `RICHTEXT` | `richtext` | `ZnRichTextEditor` (Markdown value) | `ZnRichTextView` (HTML5) |
| `SWITCH` | `switch` | `ZnSwitch` | `trueText`/`falseText` |
| `CHECKBOX` | `checkbox` | `ZnSwitch` | `trueText`/`falseText` |
| `RANGE` | `range` | `ZnRangeInput` | `min – max` |

Adding a value here requires implementations in `ZnDataField`, `ZnDataViewField` and the `ZnDataEditorField` dialog, plus tests in the three libraries.

## Constants & resolvers

- `LayoutColumns` = `ONE|TWO|THREE|FOUR` (1..4); `sectionColumns(section)` normalizes out-of-range values.
- `fieldSpan(field, columns)` → `field.span` (default 1) clamped to the section's effective columns; renderers apply `zn-span-N`.
- `LabelPositions` = `TOP` (label above value) | `INLINE`; settable per view, section or field.
- `InputVariants` = `OUTLINED|FILLED`, `InputSizes` = `SMALL|MEDIUM|LARGE`; `normalizeInputVariant(v, fallback)` / `normalizeInputSize(v, fallback)`.
- Precedence: **field → section → container** (`ZnDataForm`, `ZnDataView`, `ZnDataEditor`); in form/editor the root schema may set the document default.

## Utilities

| Group | Functions |
|---|---|
| Objects | `isObject`, `clone`, `merge(base, override)` (override wins), `pathParts`, `readAt(obj, path)`, `writeAt(obj, path, value)` (copy-on-write, creates intermediates, never mutates) |
| Schema | `schemaSections`, `schemaFields`, `sectionColumns`, `fieldSpan`, `collectDefaults`, `withDefaults(schema, value)` (received value wins) |
| Format | `normalizeOptions`, `optionLabel`, `formatFieldValue(field, value, options)` — `options`: `emptyText` (`'—'`), `trueText` (`'Yes'`), `falseText` (`'No'`), `separator` (`', '`); `richtext` yields plain text without Markdown syntax |

## Example

```js
import { FieldTypes, withDefaults, writeAt, readAt, formatFieldValue } from '@zn-apps/ui-data-core'

const schema = { sections: [{ layout: 2, fields: [
  { path: 'name', type: FieldTypes.TEXT, default: 'Anónimo' },
  { path: 'tags', type: FieldTypes.MULTI_SELECT, options: ['a', 'b'] }
] }] }

const initial = withDefaults(schema, { name: 'Ada' })
const next = writeAt(initial, 'tags', ['a'])
readAt(next, 'tags')                      // ['a']
formatFieldValue({ type: 'text' }, null)  // '—'
```

Demo: Kitchensink `/data/core`. Tests: `src/__tests__/index.spec.js` → `npx vitest run --project ui-data-core`.
