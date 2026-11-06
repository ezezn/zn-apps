# @zn-apps/ui-about — Documentación de Librería

> Ubicación: `shared/ui-about/`  
> Paquete npm: `@zn-apps/ui-about`  
> Responsabilidad: Componente neutral de "Acerca de / Info" y utilidades para extraer metadatos de aplicación (`package.json`).

---

## 1. Propósito y Alcance

`@zn-apps/ui-about` proporciona un panel estandarizado y accesible para presentar la información institucional de una PWA (nombre, versión, descripción, autoría y avatar/icono).
Evita duplicar la pantalla o diálogo de "Acerca de" en cada una de las aplicaciones del monorepo, asegurando coherencia visual y de datos.

---

## 2. Arquitectura y Dependencias

- **Dependencia de `@zn-apps/ui-core`**: A diferencia de `storage`, `ui-about` es una librería compuesta que consume `@zn-apps/ui-core` (específicamente `ZnIcon`).
- **Composición Desacoplada**: No fuerza una vista completa de pantalla; se diseña como un bloque de 2 filas (`zn-about__primary` y `zn-about__secondary`) que puede incrustarse dentro de un `ZnCard`, `ZnSection`, `ZnDialog` o vista dedicada de Vue Router.
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

---

## 4. Reglas de Negocio

1. **Prioridad Visual Icono vs Imagen**: Si se proporciona `image`, se renderiza la etiqueta `<img>` y se omite `ZnIcon`. Si `image` está vacío, se renderiza `ZnIcon` con el valor de `icon` o fallback a `'info'`.
2. **Formato de Versión**: El componente prepende automáticamente el prefijo `v` al valor de `version` en la UI (`v${version}`).
3. **Mapeo de Autoría**: `getAppMetadata` soporta tanto strings (`author: "Nombre <email>"`) como objetos de npm (`author: { name: "Nombre", email: "..." }`).

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
  />
</template>
```

---

## 6. Testing

Tests en `shared/ui-about/src/components/__tests__/ZnAbout.spec.js` y `shared/ui-about/src/utils/__tests__/packageMetadata.spec.js`.
Ejecución:
```bash
npx vitest run --project ui-about
```
