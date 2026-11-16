# @zn-apps/ui-about — user manual

Standard, accessible "About" panel for any PWA: app identity plus Credits and Changelog tabs. Built on `@zn-apps/ui-core`.

- Package: `@zn-apps/ui-about` · Folder: `shared/ui-about/`
- Spanish: [Leer en español](../es/README.md)

## Usage

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

| Prop | Type | Default | Notes |
|---|---|---|---|
| `name` | String | required | visible app name |
| `version` | String | required | raw semver; `v` prefix added by the component |
| `description` | String | required | short purpose |
| `author` | String | required | author or organization |
| `image` | String | `''` | avatar/logo URL; wins over `icon` |
| `imageAlt` | String | `''` | falls back to `name` |
| `icon` | String | `''` | Material icon when there is no image (`info`) |
| `changelogUrl` | String | `''` | fetched the first time the Changelog tab opens |
| `changelog` | String | `''` | already-loaded text; skips the fetch |
| `creditsLabel` | String | `'Créditos'` | Credits tab label |
| `changelogLabel` | String | `'Changelog'` | Changelog tab label |
| `loadingText` | String | `'Cargando changelog…'` | while downloading |
| `emptyText` | String | `'No hay changelog disponible.'` | no URL and no text |
| `errorText` | String | `'No se pudo cargar el changelog.'` | download failure |

## Behavior

- Image when provided, otherwise a Material icon.
- `getAppMetadata(pkg)` accepts `author` as a string (`"Name <email>"`) or as an npm object.
- The changelog is fetched lazily, once, aborted on unmount or URL change; failures show `errorText` without breaking the Credits tab.
- The changelog renders as plain text inside a scroll box (max height `min(50vh, 320px)`).
- Designed to be embedded: drop it in a `ZnCard`, `ZnSection`, `ZnDialog` or a dedicated `/about` route.

## Serving the changelog

Apps use `changelogPlugin()` (`scripts/vite-changelog-plugin.mjs`) in `vite.config.js` to serve `<base>/CHANGELOG.md` in development and copy it to `dist/`. Alternatively import the Markdown with `?raw` and pass `changelog`.

## Demo and tests

Kitchensink `/about`. Tests: `npx vitest run --project ui-about`.
