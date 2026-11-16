# @zn-apps/ui-about — AI context

Neutral two-tab "About" block (`Credits`, `Changelog`) plus `package.json` metadata extraction. Composes `@zn-apps/ui-core` (`ZnIcon`, `ZnTabs`) — the only allowed library→library edge.
Location: `shared/ui-about/`. App imports `@zn-apps/ui-about` and `@zn-apps/ui-about/dist/ui-about.css`.

## `ZnAbout` props

| Prop | Type | Req | Default |
|---|---|---|---|
| `name` | String | ✅ | — |
| `version` | String | ✅ | — (rendered as `v{version}`) |
| `description` | String | ✅ | — |
| `author` | String | ✅ | — |
| `image` | String | | `''` (wins over `icon`) |
| `imageAlt` | String | | `''` (fallback `name`) |
| `icon` | String | | `''` (fallback `info`) |
| `changelogUrl` | String | | `''` |
| `changelog` | String | | `''` (inline text wins, no fetch) |
| `creditsLabel` | String | | `'Créditos'` |
| `changelogLabel` | String | | `'Changelog'` |
| `loadingText` | String | | `'Cargando changelog…'` |
| `emptyText` | String | | `'No hay changelog disponible.'` |
| `errorText` | String | | `'No se pudo cargar el changelog.'` |

## Behavior rules

1. `image` → `<img>`; otherwise `ZnIcon` with `icon` (or `info`).
2. Version prefix `v` is added by the component; pass raw semver.
3. `getAppMetadata(pkg)` accepts `author` as string (`"Name <email>"`) or npm object.
4. Changelog `fetch` runs only when the tab is first opened, once, aborted on unmount/URL change; failure shows `errorText` and never breaks the credits tab.
5. Changelog renders as plain text (`white-space: pre-wrap`) in a scroll box of max height `min(50vh, 320px)`.

## Integration

```vue
<script setup>
import { ZnAbout, getAppMetadata } from '@zn-apps/ui-about'
import '@zn-apps/ui-about/dist/ui-about.css'
import pkg from '../package.json'
const appInfo = getAppMetadata(pkg)
</script>

<template>
  <ZnAbout :name="appInfo.name" :version="appInfo.version" :description="appInfo.description"
           :author="appInfo.author" image="/pwa-icon.svg"
           :changelog-url="`${import.meta.env.BASE_URL}CHANGELOG.md`" />
</template>
```

Serve the changelog with `changelogPlugin()` (`scripts/vite-changelog-plugin.mjs`) in `vite.config.js`: it answers `<base>/CHANGELOG.md` in dev and emits `dist/CHANGELOG.md` in build. Alternative: import the Markdown with `?raw` and pass `changelog`.

## Tests

`src/components/__tests__/ZnAbout.spec.js`, `src/utils/__tests__/packageMetadata.spec.js` → `npx vitest run --project ui-about`.
