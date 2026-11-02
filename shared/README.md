# Shared libraries

`shared/` no longer contains a single package. It is a container for isolated,
independently built libraries consumed by the apps in this monorepo.

| Library | Package | Purpose |
|---|---|---|
| [`ui-core/`](./ui-core) | `@zn-apps/ui-core` | Vue 3 UI components (MD3), composables, helpers and global CSS tokens. |
| [`storage/`](./storage) | `@zn-apps/storage` | Framework-agnostic persistence helpers over Web Storage. |

## Rules

- Each library has its own `package.json`, `vite.config.js` and `vitest.config.js`.
- Libraries must not import from each other; they are isolated.
- Apps depend on a library by workspace name (`"@zn-apps/ui-core": "*"`).
- Build all shared libraries from the repo root with `npm run build:shared`.

## Usage

```js
// UI components + composables + helpers
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnButton, useOnlineStatus, formatDate } from '@zn-apps/ui-core'

// Persistence
import { createStorage } from '@zn-apps/storage'

const storage = createStorage({ namespace: 'mi-app' })
```

The apps' Vitest configs alias `@zn-apps/ui-core` to `shared/ui-core/src/index.js`,
so tests run without a prior build of the library.
