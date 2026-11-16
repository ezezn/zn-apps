# Changelog

## [0.2.0] - 2026-11-16

### Español
#### Tipo de cambio: Nueva feature
- **Resumen**: Nuevo input numérico MD3 y tipo de campo `number` en la familia `ui-data-*`, mejoras del editor de texto enriquecido (imágenes con tamaño, enlaces editables, inserción de imágenes y tabla) y correcciones en las demos de datos.

- **Detalles**:
  - Nuevo `ZnNumberInput` en `@zn-apps/ui-core`: variantes `outlined`/`filled`, tamaños `small`/`medium`/`large`, `min`/`max`/`step`, valor emitido como `Number` o `null` y validación de rango al perder el foco
  - Nuevo tipo `number` en `ui-data-form`, `ui-data-view` y `ui-data-editor`, y campo de demo `preferences.weeklyHours`
  - Nueva página de demostración `/inputs/number` con variantes, estados y tamaños, enlazada en la navegación e i18n
  - Editor de texto enriquecido: corregido el solapamiento de la etiqueta con la toolbar en variante `filled`
  - Editor de texto enriquecido: restaurada la inserción de imágenes (el diálogo volvía a insertar el `<img>` en el documento) y los diálogos de tabla usan `ZnNumberInput` para filas y columnas
  - Imágenes con tamaño: ancho y alto en píxeles precargados con el tamaño natural de la imagen y switch "Preservar aspecto" que recalcula la dimensión opuesta; el tamaño se guarda en Markdown (`![alt](src =300x200)`)
  - Enlaces: `https://` agregado automáticamente cuando falta el protocolo, validación de la URL antes de aplicarla y edición de los valores del enlace bajo el cursor o la selección
  - Corregida la selección de variante `outlined`/`filled` y de tamaño en las páginas de prueba de datos, incluido el campo `richtext`
  - Documentación reorganizada en `doc/{en,es}` (usuario) y `ai/` (agentes), con verificador de enlaces `npm run check:docs`
  - Tests unitarios en `ui-core`, `ui-data-form`, `ui-data-view`, `ui-data-editor` y `ui-data-richtext` (308 tests passing)
  - Build de `kitchensink` exitoso con la nueva página

### English
#### Change type: New feature
- **Summary**: New MD3 number input and `number` field type across `ui-data-*`, rich text editor improvements (sized images, editable links, image and table insertion) and fixes in the data demos.

- **Details**:
  - New `ZnNumberInput` in `@zn-apps/ui-core`: `outlined`/`filled` variants, `small`/`medium`/`large` sizes, `min`/`max`/`step`, value emitted as `Number` or `null`, range validation on blur
  - New `number` type in `ui-data-form`, `ui-data-view` and `ui-data-editor`, with the `preferences.weeklyHours` demo field
  - New `/inputs/number` demo page covering variants, states and sizes, wired into navigation and i18n
  - Rich text editor: fixed the label overlapping the toolbar in the `filled` variant
  - Rich text editor: restored image insertion (the dialog now adds the `<img>` to the document) and table dialogs use `ZnNumberInput` for rows and columns
  - Sized images: width and height in pixels pre-filled with the image's natural size, plus a "Preserve aspect ratio" switch that recomputes the opposite dimension; the size is persisted in Markdown (`![alt](src =300x200)`)
  - Links: `https://` added when the protocol is missing, URL validation before applying, and editing of the link values under the cursor or selection
  - Fixed `outlined`/`filled` variant and size selection on the data demo pages, including the `richtext` field
  - Documentation reorganized into `doc/{en,es}` (users) and `ai/` (agents), with a link checker available as `npm run check:docs`
  - Unit tests in `ui-core`, `ui-data-form`, `ui-data-view`, `ui-data-editor` and `ui-data-richtext` (308 tests passing)
  - Successful `kitchensink` build with the new page

## [0.1.0] - 2026-11-13

### Español
#### Tipo de cambio: Nueva feature
- **Resumen**: Integración de librería `ui-data-richtext` con editor Markdown y vista HTML5, soporte para `field.span` entre columnas en formularios, vistas y editores, y nuevos campos de demostración en kitchensink.

- **Detalles**:
  - Nueva librería `shared/ui-data-richtext` con `ZnRichTextEditor` y `ZnRichTextView`
  - Conversores Markdown ↔ HTML con encabezados, formato inline, tablas GFM y alineación de columnas
  - Soporte `field.span` (zn-span-N) en `ZnDataField`, `ZnDataViewField` y `ZnDataEditorField`, limitado a columnas de sección y con reset responsivo en móvil
  - Campos `richtext` con `span: 2` en demos de formulario, vista y editor (sección Cuenta, 2 columnas)
  - Actualización de documentación: `docs/00-overview.md`, `docs/01-shared.md`, `AGENTS.md` y READMEs de todas las librerías
  - Tests unitarios en `ui-data-core`, `ui-data-richtext`, `ui-data-form`, `ui-data-view`, `ui-data-editor` (47 tests passing)
  - Build de producción exitoso

### English
#### Change type: New feature
- **Summary**: `ui-data-richtext` library integration with Markdown editor and HTML5 view, `field.span` column support across form/view/editor, and new kitchensink demos.

- **Details**:
  - New `shared/ui-data-richtext` library with `ZnRichTextEditor` and `ZnRichTextView`
  - Markdown ↔ HTML converters with headers, inline formatting, GFM tables and column alignment
  - `field.span` support (zn-span-N) in `ZnDataField`, `ZnDataViewField` and `ZnDataEditorField`, limited to section columns with responsive mobile reset
  - `richtext` fields with `span: 2` in form, view and editor demos (Account section, 2 columns)
  - Documentation updates: `docs/00-overview.md`, `docs/01-shared.md`, `AGENTS.md` and all library READMEs
  - Unit tests in `ui-data-core`, `ui-data-richtext`, `ui-data-form`, `ui-data-view`, `ui-data-editor` (47 tests passing)
  - Successful production build