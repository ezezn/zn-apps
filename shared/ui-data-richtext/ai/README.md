# @zn-apps/ui-data-richtext — AI context

Rich text editor and read-only view whose persisted value is a **Markdown string**. The user edits a `contenteditable` that renders HTML5; `v-model` speaks Markdown, so content is stored in JSON/APIs without HTML. Consumes `ui-core` only.
Location: `shared/ui-data-richtext/`. Exports `ZnRichTextEditor`, `ZnRichTextView`, `htmlToMarkdown`, `markdownToHtml`.

## `ZnRichTextEditor` props

| Prop | Default |
|---|---|
| `modelValue` | `''` (Markdown) |
| `label` / `hint` / `error` | `''` (`ZnFieldShell`) |
| `placeholder` | `'Escribe aquí…'` |
| `disabled` / `readonly` / `required` | `false` |
| `variant` | `'outlined'` (`outlined \| filled`) |
| `size` | `'medium'` (`small \| medium \| large`) |
| `toolbarLabel` | `'Formato de texto'` |
| `markdownLabel` / `viewLabel` | `'Markdown'` / `'Vista'` |

Events: `update:modelValue` (Markdown) on document, source-mode or toolbar changes. Exposed: `focus()`, `toggleSource()`, `editorRef`.

Toolbar (`document.execCommand`): bold, italic, underline, strikethrough, `h1`–`h3`, paragraph, align left/center/right, plus dialogs for:

- **Table** — rows/columns with two `ZnNumberInput` (`min 1`, `max 20`, `step 1`, `size="small"`).
- **Image** — reads the file, probes natural size with `Image()`, pre-fills width/height `ZnNumberInput`s and shows `W × H px`. `ZnSwitch` "Preservar aspecto" (on by default) keeps the ratio with `flush: 'sync'` watchers and a sync flag so editing width recomputes height and vice versa; switching it on syncs height from the current width. Inserted `<img>` gets `width`/`height`; unmeasurable images are inserted without dimensions.
- **Link** — normalizes the URL (adds `https://` when the scheme is missing), validates it before applying, and pre-fills the existing values when the caret/selection is inside a link so it can be edited instead of duplicated.

The Markdown/Vista button swaps the visual area for a `<textarea>` with the raw string.

## `ZnRichTextView` props

`modelValue` (`''`), `emptyText` (`'—'`), `size` (`'medium'`).

## Supported Markdown

Paragraphs and line breaks; `h1`–`h6`; bold `**`, italic `*`, underline `<u>`, strikethrough `~~`; inline code and code blocks; quotes; ordered/unordered lists; horizontal rules; links; images `![alt](src)` and `![alt](src =300x200)`; GFM tables with per-column alignment (`:---`, `:---:`, `---:`); block alignment through minimal HTML `<p style="text-align:center">…</p>`.

```js
import { htmlToMarkdown, markdownToHtml } from '@zn-apps/ui-data-richtext'
markdownToHtml('## Hola\n\n**Mundo**')
htmlToMarkdown('<h2>Hola</h2><p><strong>Mundo</strong></p>')
```

## `ui-data-*` integration (`FieldTypes.RICHTEXT` = `'richtext'`)

| Library | Implementation |
|---|---|
| `ui-data-form` | `ZnRichTextEditor` with `v-model` on `field.path` |
| `ui-data-view` | `ZnRichTextView` (HTML5) instead of plain text |
| `ui-data-editor` | `ZnRichTextView` trigger + `ZnRichTextEditor` dialog |

Accepts `label`, `hint`/`description`, `placeholder`, `error`, `required`, `disabled`, `readonly`, `variant`, `size`, `span` like any other field.

## Tests

`src/__tests__/markdown.spec.js` (converters and round-trip, including image size) and `src/components/__tests__/ZnRichText.spec.js` (editor, source mode, toolbar, read-only view) → `npx vitest run --project ui-data-richtext`.
Demo: Kitchensink `/data/richtext`; `profile.notes` also appears in `/data/form`, `/data/view`, `/data/editor`.
