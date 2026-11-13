# Librerías Compartidas (`shared/`) — Resumen y Enlaces

> ⚠️ **Documentación Reubicada**: La documentación detallada, API de componentes, tokens y utilidades de cada librería compartida ahora reside directamente dentro del subproyecto correspondiente:
> - **`@zn-apps/ui-core`**: [**`shared/ui-core/docs/README.md`**](../shared/ui-core/docs/README.md)
> - **`@zn-apps/settings-core`**: [**`shared/settings-core/docs/README.md`**](../shared/settings-core/docs/README.md)
> - **`@zn-apps/ui-about`**: [**`shared/ui-about/docs/README.md`**](../shared/ui-about/docs/README.md)
> - **`@zn-apps/ui-data-core`**: [**`shared/ui-data-core/docs/README.md`**](../shared/ui-data-core/docs/README.md)
> - **Familia `ui-data-*`**: [**form**](../shared/ui-data-form/docs/README.md) · [**view**](../shared/ui-data-view/docs/README.md) · [**editor**](../shared/ui-data-editor/docs/README.md) · [**richtext**](../shared/ui-data-richtext/docs/README.md)

> **Contrato de datos**: toda feature de un campo (props, variantes, tamaños,
> chips, `span`, etc.) debe existir en **formulario, vista y editor**. Un nuevo
> valor de `FieldTypes` exige implementación en `ZnDataField`,
> `ZnDataViewField` y el diálogo de `ZnDataEditorField`. Ver
> [`docs/00-overview.md`](./00-overview.md#6-contrato-de-campos-de-datos-ui-data-form--ui-data-view--ui-data-editor).

---

## Resumen de Librerías

| Librería | Paquete npm | Propósito Principal | Documentación Detallada |
|---|---|---|---|
| `shared/ui-core/` | `@zn-apps/ui-core` | Componentes Vue 3 MD3, tokens CSS, composables, pipeline de iconos SVG | [`shared/ui-core/docs/README.md`](../shared/ui-core/docs/README.md) |
| `shared/settings-core/` | `@zn-apps/settings-core` | Proxy profundo de settings JSON con definiciones por defecto y persistencia en localStorage | [`shared/settings-core/docs/README.md`](../shared/settings-core/docs/README.md) |
| `shared/ui-about/` | `@zn-apps/ui-about` | Panel estandarizado "Acerca de" (`ZnAbout`) y extracción de `package.json` | [`shared/ui-about/docs/README.md`](../shared/ui-about/docs/README.md) |
| `shared/ui-data-core/` | `@zn-apps/ui-data-core` | Contrato de esquema, rutas JSON anidadas, defaults y formato de valores | [`shared/ui-data-core/docs/README.md`](../shared/ui-data-core/docs/README.md) |
| `shared/ui-data-form/` | `@zn-apps/ui-data-form` | Formularios por secciones derivados de un esquema | [`shared/ui-data-form/docs/README.md`](../shared/ui-data-form/docs/README.md) |
| `shared/ui-data-view/` | `@zn-apps/ui-data-view` | Presentación de sólo lectura del mismo esquema | [`shared/ui-data-view/docs/README.md`](../shared/ui-data-view/docs/README.md) |
| `shared/ui-data-editor/` | `@zn-apps/ui-data-editor` | Vista con edición por campo en diálogo | [`shared/ui-data-editor/docs/README.md`](../shared/ui-data-editor/docs/README.md) |
| `shared/ui-data-richtext/` | `@zn-apps/ui-data-richtext` | Editor y vista de texto enriquecido con valor Markdown | [`shared/ui-data-richtext/docs/README.md`](../shared/ui-data-richtext/docs/README.md) |

---

## Reglas Clave de Consumo

1. **Aislamiento**: Cada librería en `shared/` se compila de forma independiente como ES module (`vite build --lib`).
2. **Dependencias Workspace**: Las apps consumen estas librerías mediante npm workspaces: `"@zn-apps/ui-core": "*"`, etc.
3. **Estilos Globales**: Las apps deben importar los estilos compilados:
   ```javascript
   import '@zn-apps/ui-core/dist/ui-core.css'
   import '@zn-apps/ui-about/dist/ui-about.css'
   ```
4. **No Importar entre sí arbitrariamente**: Las librerías de infraestructura no dependen de UI ni de Vue; solo las apps o componentes de más alto nivel componen las primitivas.
5. **Familia de datos**: `ui-data-core` no depende de Vue; `ui-data-form`, `ui-data-view` y `ui-data-editor` componen `ui-core` y comparten el contrato de campos. `ui-data-editor` reutiliza los renderizadores de form/view. `ui-data-richtext` sólo depende de `ui-core`.
