# Shared libraries

`shared/` no longer contains a single package. It is a container for isolated,
independently built libraries consumed by the apps in this monorepo.

| Library | Package | Purpose | Docs |
|---|---|---|---|
| [`ui-core/`](./ui-core) | `@zn-apps/ui-core` | Vue 3 UI components (MD3), composables, helpers and global CSS tokens. | [`ui-core/docs/`](./ui-core/docs/README.md) |
| [`storage/`](./storage) | `@zn-apps/storage` | Framework-agnostic persistence helpers over Web Storage. | [`storage/docs/`](./storage/docs/README.md) |
| [`ui-about/`](./ui-about) | `@zn-apps/ui-about` | Neutral two-row About component composed with `@zn-apps/ui-core` icons. | [`ui-about/docs/`](./ui-about/docs/README.md) |
| [`pwa-integration/`](./pwa-integration) | `@zn-apps/pwa-integration` | PWA state detection, system color scheme, dynamic bar styling & install popup. | [`pwa-integration/docs/`](./pwa-integration/docs/README.md) |

## Rules

- Each library has its own `package.json`, `vite.config.js` and `vitest.config.js`.
- Libraries are isolated except for explicit composition dependencies such as `ui-about` consuming `ui-core`.
- Apps depend on a library by workspace name (`"@zn-apps/ui-core": "*"`).
- Build all shared libraries from the repo root with `npm run build:shared`.

## Usage

```js
// UI components + composables + helpers
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnButton, useOnlineStatus, formatDate } from '@zn-apps/ui-core'

// Persistence
import { createStorage } from '@zn-apps/storage'
import { ZnAbout } from '@zn-apps/ui-about'
import '@zn-apps/ui-about/dist/ui-about.css'

const storage = createStorage({ namespace: 'mi-app' })

// Pass the app's package.json metadata into the component.
// Puede recibir icon="widgets" o image="/app-icon.png" (image tiene prioridad).
// <ZnAbout name="Mi app" version="1.0.0" description="..." author="..." image="/app-icon.png" />
```

The apps' Vitest configs alias `@zn-apps/ui-core` to `shared/ui-core/src/index.js`,
so tests run without a prior build of the library.
