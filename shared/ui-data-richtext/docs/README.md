# @zn-apps/ui-data-richtext — Documentación de Librería

> Ubicación: `shared/ui-data-richtext/`
> Paquete npm: `@zn-apps/ui-data-richtext`
> Responsabilidad: editor y vista de texto enriquecido cuyo valor persistido es un string Markdown.

---

## 1. Propósito y Alcance

`ui-data-richtext` separa el documento del formato de almacenamiento: el usuario
edita sobre un área `contenteditable` que se ve como markup HTML5, pero
`v-model` expone y recibe **Markdown**. Esto permite guardar el contenido en un
JSON, una API o una base de datos sin almacenar HTML.

La librería no valida reglas de negocio. El campo `richtext` de la familia
`ui-data-*` la consume para formularios y diálogos de edición.

---

## 2. Componentes

| Componente | Rol |
|---|---|
| `ZnRichTextEditor` | Área editable + toolbar MD3 + vista/edición del Markdown crudo. |
| `ZnRichTextView` | Presentación de sólo lectura: convierte Markdown a HTML5. |

### `ZnRichTextEditor`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `modelValue` | String | `''` | Documento en Markdown. |
| `label` | String | `''` | Etiqueta del campo (`ZnFieldShell`). |
| `hint` | String | `''` | Texto de asistencia. |
| `error` | String | `''` | Mensaje de error; activa `aria-invalid`. |
| `placeholder` | String | `'Escribe aquí…'` | Texto cuando el documento está vacío. |
| `disabled` | Boolean | `false` | Deshabilita toolbar y edición. |
| `readonly` | Boolean | `false` | Oculta la toolbar y deja el contenido no editable. |
| `required` | Boolean | `false` | Marca visual de obligatorio. |
| `variant` | `'outlined' \| 'filled'` | `'outlined'` | Variante MD3 del contenedor. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Escala MD3 del contenedor. |
| `toolbarLabel` | String | `'Formato de texto'` | `aria-label` de la toolbar. |
| `markdownLabel` / `viewLabel` | String | `'Markdown'` / `'Vista'` | Texto del botón de cambio de modo. |

**Eventos**: `update:modelValue` (string Markdown) en cada cambio del documento,
del modo fuente o al aplicar formato.

**Métodos expuestos**: `focus()`, `toggleSource()` y `editorRef`.

La toolbar usa `document.execCommand` para negrita, cursiva, subrayado, tachado,
encabezados `h1`–`h3`, párrafo, alineación izquierda/centro/derecha e inserción
de una tabla 2×2. El botón Markdown/Vista alterna entre el área visual y un
`<textarea>` con el string crudo.

### `ZnRichTextView`

| Prop | Tipo | Default | Descripción |
|---|---|---|---|
| `modelValue` | String | `''` | Documento en Markdown. |
| `emptyText` | String | `'—'` | Texto cuando no hay contenido. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Escala tipográfica. |

---

## 3. Markdown soportado

- Párrafos y saltos de línea.
- Encabezados `h1`–`h6`.
- Negrita (`**`), cursiva (`*`), subrayado (`<u>`) y tachado (`~~`).
- Código en línea y en bloque, citas, listas ordenadas/desordenadas y separadores.
- Enlaces.
- Tablas GFM con alineación por columna (`:---`, `:---:`, `---:`).
- Alineación de bloques mediante HTML mínimo: `<p style="text-align:center">…</p>`
  (también válido dentro de Markdown).

Los conversores se exportan para reutilizarlos fuera de los componentes:

```js
import { htmlToMarkdown, markdownToHtml } from '@zn-apps/ui-data-richtext'

markdownToHtml('## Hola\n\n**Mundo**')
htmlToMarkdown('<h2>Hola</h2><p><strong>Mundo</strong></p>')
```

---

## 4. Integración con `ui-data-*`

`FieldTypes.RICHTEXT` (`'richtext'`) se renderiza así:

| Librería | Implementación |
|---|---|
| `ui-data-form` | `ZnRichTextEditor` con `v-model` sobre la ruta `field.path`. |
| `ui-data-view` | `ZnRichTextView` (HTML5) en lugar de texto plano. |
| `ui-data-editor` | Trigger con `ZnRichTextView` y diálogo con `ZnRichTextEditor`. |

El campo acepta `label`, `hint`/`description`, `placeholder`, `error`, `required`,
`disabled`, `readonly`, `variant`, `size` y `span`, igual que el resto de campos.

```json
{
  "path": "profile.notes",
  "type": "richtext",
  "label": "Notas",
  "span": 2
}
```

---

## 5. Demo

Ruta en kitchensink: **`/data/richtext`** (`src/views/data/DataRichTextPage.vue`).
El campo `profile.notes` también aparece en las demos `/data/form`,
`/data/view` y `/data/editor`.

## 6. Pruebas

```bash
npx vitest run --project ui-data-richtext
npm run build --workspace=@zn-apps/ui-data-richtext
```

Los tests viven en `src/__tests__/markdown.spec.js` (conversores y round-trip) y
`src/components/__tests__/ZnRichText.spec.js` (editor, modo Markdown, toolbar y
vista de sólo lectura).
