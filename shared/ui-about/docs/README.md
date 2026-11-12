# @zn-apps/ui-about — Documentación de Librería

> Ubicación: `shared/ui-about/`  
> Paquete npm: `@zn-apps/ui-about`  
> Responsabilidad: Componente neutral de "Acerca de / Info" y utilidades para extraer metadatos de aplicación (`package.json`).

---

## 1. Propósito y Alcance

`@zn-apps/ui-about` proporciona un panel estandarizado y accesible para presentar la información institucional de una PWA (nombre, versión, descripción, autoría y avatar/icono) y su historial de cambios.
Evita duplicar la pantalla o diálogo de "Acerca de" en cada una de las aplicaciones del monorepo, asegurando coherencia visual y de datos.

---

## 2. Arquitectura y Dependencias

- **Dependencia de `@zn-apps/ui-core`**: A diferencia de `storage`, `ui-about` es una librería compuesta que consume `@zn-apps/ui-core` (`ZnIcon` y `ZnTabs`).
- **Composición Desacoplada**: No fuerza una vista completa de pantalla; se diseña como un bloque con dos pestañas (`Credits` y `Changelog`) que puede incrustarse dentro de un `ZnCard`, `ZnSection`, `ZnDialog` o vista dedicada de Vue Router.
- **Carga diferida del changelog**: el texto se descarga con `fetch` la primera vez que se abre la pestaña `Changelog` y se cachea en memoria. Si la app ya tiene el texto, puede pasarse con la prop `changelog`.
- **Extracción Segura de Metadatos**: Ofrece la función utilitaria `getAppMetadata()` para procesar de forma segura objetos `package.json` importados en tiempo de compilación por Vite.

---

## 3. Modelo de Dominio y DTOs

### `AppMetadata`
```typescript
interface AppMetadata {
  name: string
  version: string
  description: string
  author: string
}
```

### Props de `ZnAbout`
| Prop | Tipo | Requerido | Valor por defecto | Descripción |
|---|---|---|---|---|
| `name` | String | Sí | — | Nombre visible de la app |
| `version` | String | Sí | — | Versión semántica (ej. `1.0.0`) |
| `description` | String | Sí | — | Descripción concisa del propósito |
| `author` | String | Sí | — | Nombre del autor u organización |
| `image` | String | No | `''` | URL relativa de avatar/logo (tiene prioridad sobre `icon`) |
| `imageAlt` | String | No | `''` | Texto alternativo de la imagen (fallback: `name`) |
| `icon` | String | No | `''` | Nombre de icono Material (fallback: `'info'`) |
| `changelogUrl` | String | No | `''` | URL del `CHANGELOG.md`; se descarga al abrir la pestaña Changelog |
| `changelog` | String | No | `''` | Texto del changelog ya cargado; tiene prioridad y evita el `fetch` |
| `creditsLabel` | String | No | `'Créditos'` | Etiqueta de la pestaña de créditos |
| `changelogLabel` | String | No | `'Changelog'` | Etiqueta de la pestaña de changelog |
| `loadingText` | String | No | `'Cargando changelog…'` | Texto mientras se descarga |
| `emptyText` | String | No | `'No hay changelog disponible.'` | Texto cuando no hay URL ni texto |
| `errorText` | String | No | `'No se pudo cargar el changelog.'` | Texto si la descarga falla |

---

## 4. Reglas de Negocio

1. **Prioridad Visual Icono vs Imagen**: Si se proporciona `image`, se renderiza la etiqueta `<img>` y se omite `ZnIcon`. Si `image` está vacío, se renderiza `ZnIcon` con el valor de `icon` o fallback a `'info'`.
2. **Formato de Versión**: El componente prepende automáticamente el prefijo `v` al valor de `version` en la UI (`v${version}`).
3. **Mapeo de Autoría**: `getAppMetadata` soporta tanto strings (`author: "Nombre <email>"`) como objetos de npm (`author: { name: "Nombre", email: "..." }`).
4. **Carga única del Changelog**: la descarga se dispara solo al abrir la pestaña (no al montar), no se repite al volver a ella y se cancela con `AbortController` al desmontar o cambiar la URL. Un fallo HTTP o de red muestra `errorText`, sin romper la pestaña de créditos.
5. **Contenedor con scrollbar**: el texto se muestra como texto plano con `white-space: pre-wrap` dentro de un contenedor de altura máxima `min(50vh, 320px)` y desplazamiento vertical.

---

## 5. Ejemplo de Integración en una App

```vue
<script setup>
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import '@zn-apps/ui-about/dist/ui-about.css'
import pkg from '../package.json'

const appInfo = getAppMetadata(pkg)
</script>

<template>
  <ZnAbout
    :name="appInfo.name"
    :version="appInfo.version"
    :description="appInfo.description"
    :author="appInfo.author"
    image="/pwa-icon.svg"
    :changelog-url="`${import.meta.env.BASE_URL}CHANGELOG.md`"
  />
</template>
```

### Exponer el `CHANGELOG.md` (Vite)

Las apps usan `changelogPlugin()` (`scripts/vite-changelog-plugin.mjs`) en su `vite.config.js` para servir el archivo en desarrollo y copiarlo a `dist/` en el build, sin duplicarlo:

```javascript
import { changelogPlugin } from '../scripts/vite-changelog-plugin.mjs'

export default defineConfig({
  plugins: [vue(), changelogPlugin({ root: __dirname })]
})
```

El plugin responde en `<base>/CHANGELOG.md` durante el desarrollo y emite `dist/CHANGELOG.md` en producción. Si la app prefiere no hacer `fetch`, puede importar el Markdown con `?raw` y pasarlo por la prop `changelog`.

---

## 6. Testing

Tests en `shared/ui-about/src/components/__tests__/ZnAbout.spec.js` y `shared/ui-about/src/utils/__tests__/packageMetadata.spec.js`.
Ejecución:
```bash
npx vitest run --project ui-about
```
