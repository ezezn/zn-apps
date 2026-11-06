# Librerías Compartidas (`shared/`) — Resumen y Enlaces

> ⚠️ **Documentación Reubicada**: La documentación detallada, API de componentes, tokens y utilidades de cada librería compartida ahora reside directamente dentro del subproyecto correspondiente:
> - **`@zn-apps/ui-core`**: [**`shared/ui-core/docs/README.md`**](../shared/ui-core/docs/README.md)
> - **`@zn-apps/settings-core`**: [**`shared/settings-core/docs/README.md`**](../shared/settings-core/docs/README.md)
> - **`@zn-apps/ui-about`**: [**`shared/ui-about/docs/README.md`**](../shared/ui-about/docs/README.md)

---

## Resumen de Librerías

| Librería | Paquete npm | Propósito Principal | Documentación Detallada |
|---|---|---|---|
| `shared/ui-core/` | `@zn-apps/ui-core` | Componentes Vue 3 MD3, tokens CSS, composables, pipeline de iconos SVG | [`shared/ui-core/docs/README.md`](../shared/ui-core/docs/README.md) |
| `shared/settings-core/` | `@zn-apps/settings-core` | Proxy profundo de settings JSON con definiciones por defecto y persistencia en localStorage | [`shared/settings-core/docs/README.md`](../shared/settings-core/docs/README.md) |
| `shared/ui-about/` | `@zn-apps/ui-about` | Panel estandarizado "Acerca de" (`ZnAbout`) y extracción de `package.json` | [`shared/ui-about/docs/README.md`](../shared/ui-about/docs/README.md) |

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
