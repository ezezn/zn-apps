# @zn-apps/ui-about — manual de usuario

Panel "Acerca de" estándar y accesible para cualquier PWA: identidad de la app más pestañas de Créditos y Changelog. Construido sobre `@zn-apps/ui-core`.

- Paquete: `@zn-apps/ui-about` · Carpeta: `shared/ui-about/`
- English: [Read in English](../en/README.md)

## Uso

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

## Props

| Prop | Tipo | Default | Notas |
|---|---|---|---|
| `name` | String | requerido | nombre visible de la app |
| `version` | String | requerido | semver crudo; el componente agrega `v` |
| `description` | String | requerido | propósito breve |
| `author` | String | requerido | autor u organización |
| `image` | String | `''` | URL de avatar/logo; tiene prioridad sobre `icon` |
| `imageAlt` | String | `''` | fallback: `name` |
| `icon` | String | `''` | icono Material cuando no hay imagen (`info`) |
| `changelogUrl` | String | `''` | se descarga al abrir la pestaña Changelog |
| `changelog` | String | `''` | texto ya cargado; evita el `fetch` |
| `creditsLabel` | String | `'Créditos'` | etiqueta de la pestaña de créditos |
| `changelogLabel` | String | `'Changelog'` | etiqueta de la pestaña de changelog |
| `loadingText` | String | `'Cargando changelog…'` | mientras descarga |
| `emptyText` | String | `'No hay changelog disponible.'` | sin URL ni texto |
| `errorText` | String | `'No se pudo cargar el changelog.'` | fallo de descarga |

## Comportamiento

- Imagen cuando se proporciona; si no, un icono Material.
- `getAppMetadata(pkg)` acepta `author` como string (`"Nombre <email>"`) o como objeto npm.
- El changelog se descarga de forma diferida, una sola vez, y se cancela al desmontar o cambiar la URL; un fallo muestra `errorText` sin romper la pestaña de créditos.
- El changelog se muestra como texto plano en un contenedor con scroll (altura máxima `min(50vh, 320px)`).
- Pensado para incrustarse: úsalo en un `ZnCard`, `ZnSection`, `ZnDialog` o una vista `/about` dedicada.

## Servir el changelog

Las apps usan `changelogPlugin()` (`scripts/vite-changelog-plugin.mjs`) en `vite.config.js` para servir `<base>/CHANGELOG.md` en desarrollo y copiarlo a `dist/`. Como alternativa, importa el Markdown con `?raw` y pásalo por `changelog`.

## Demo y tests

Kitchensink `/about`. Tests: `npx vitest run --project ui-about`.
