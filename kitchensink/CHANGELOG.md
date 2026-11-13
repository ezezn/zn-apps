# Changelog

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