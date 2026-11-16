# @zn-apps/settings-core — AI context

Deep JSON settings document persisted in Web Storage and exposed as a proxy. No Vue, no DOM, no other shared library.

```js
import { createSettings } from '@zn-apps/settings-core'
const settings = createSettings({ namespace: 'my-app' })

settings.define('pwa', { installDismissed: false })
settings.pwa.installDismissed        // stored value or default
settings.pwa.installDismissed = true // persists
```

`define` fills missing values and never overwrites stored ones. Whole-structure form is allowed:

```js
settings.define({ audio: { volume: 1, muted: false }, ui: { theme: { mode: 'system' } } })
```

## API

| Member | Behavior |
|---|---|
| `createSettings({ namespace, key, storage, defaults })` | instance; default key is `zn-apps:settings` |
| `settings.define(path, definition)` / `define(definitions)` | registers defaults, persists resulting structure |
| `settings.a.b` | deep read from current document |
| `settings.a.b = v` | deep write |
| `settings.get(path, fallback)` / `set(path, value)` / `has(path)` | explicit dot-path access |
| `settings.toJSON()` | independent copy of the whole document |
| `settings.reset(path?)` | drops a branch or restores defaults |

`storage` accepts anything Web Storage compatible (e.g. `sessionStorage`, test doubles).

## Rules

- One namespace per app; never share a settings document across apps.
- `i18n.locale` (`'en' | 'es' | null`) is the only locale preference consumed by apps.
- `define` is additive: renaming a path leaves the old value orphaned — migrate explicitly when renaming.

## Tests

```bash
npx vitest run --project settings-core
```
