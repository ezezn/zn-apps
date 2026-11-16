# @zn-apps/settings-core — user manual

Persistent application settings: a JSON document stored in Web Storage and exposed as a deep proxy. No Vue, no DOM dependencies.

- Package: `@zn-apps/settings-core` · Folder: `shared/settings-core/`
- Spanish: [Leer en español](../es/README.md)

## Usage

```js
import { createSettings } from '@zn-apps/settings-core'

const settings = createSettings({ namespace: 'my-app' })

settings.define('pwa', { installDismissed: false })

settings.pwa.installDismissed        // stored value or default
settings.pwa.installDismissed = true // saved immediately
```

Defaults fill missing values and never overwrite stored ones. A whole structure can be declared at once:

```js
settings.define({
  audio: { volume: 1, muted: false },
  ui: { theme: { mode: 'system' } }
})
```

## API

| Member | Description |
|---|---|
| `createSettings({ namespace, key, storage, defaults })` | creates the instance; default storage key `zn-apps:settings` |
| `settings.define(path, definition)` / `define(definitions)` | registers defaults and persists the result |
| `settings.a.b` / `settings.a.b = v` | deep read / write |
| `settings.get(path, fallback)`, `set(path, value)`, `has(path)` | explicit dot-path access |
| `settings.toJSON()` | independent copy of the whole document |
| `settings.reset(path?)` | removes a branch or restores defaults |

`storage` accepts any Web Storage compatible object (`sessionStorage`, a test double…).

## Rules

- Every app uses its own namespace; a settings document is never shared between apps.
- `i18n.locale` (`'en'`, `'es'` or `null`) is the locale preference apps read on startup.
- Defaults are additive: renaming a path leaves the previous value orphaned, so migrate explicitly.

## Demo and tests

Kitchensink `/settings` shows deep reactive persistence. Tests: `npx vitest run --project settings-core`.
