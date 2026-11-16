# Shared libraries

`shared/` is a container of isolated, independently built libraries consumed by the apps in this monorepo. Each one has its own `package.json`, `vite.config.js`, `vitest.config.js`, agent context (`ai/`) and user manual (`doc/{en,es}/`).

| Library | Package | Purpose | User docs | AI context |
|---|---|---|---|---|
| [`ui-core/`](./ui-core) | `@zn-apps/ui-core` | MD3 components, composables, helpers, global CSS tokens, icon chunks | [EN](./ui-core/doc/en/README.md) · [ES](./ui-core/doc/es/README.md) | [`ai/`](./ui-core/ai/README.md) |
| [`settings-core/`](./settings-core) | `@zn-apps/settings-core` | Deep JSON settings proxy with localStorage persistence and defaults | [EN](./settings-core/doc/en/README.md) · [ES](./settings-core/doc/es/README.md) | [`ai/`](./settings-core/ai/README.md) |
| [`ui-about/`](./ui-about) | `@zn-apps/ui-about` | Neutral About panel composed with `ui-core` | [EN](./ui-about/doc/en/README.md) · [ES](./ui-about/doc/es/README.md) | [`ai/`](./ui-about/ai/README.md) |
| [`pwa-integration/`](./pwa-integration) | `@zn-apps/pwa-integration` | PWA state, system color scheme, bar styling, install/update popups | [EN](./pwa-integration/doc/en/README.md) · [ES](./pwa-integration/doc/es/README.md) | [`ai/`](./pwa-integration/ai/README.md) |
| [`ui-data-core/`](./ui-data-core) | `@zn-apps/ui-data-core` | Schema contract, nested JSON helpers, defaults, value formatting | [EN](./ui-data-core/doc/en/README.md) · [ES](./ui-data-core/doc/es/README.md) | [`ai/`](./ui-data-core/ai/README.md) |
| [`ui-data-form/`](./ui-data-form) | `@zn-apps/ui-data-form` | Schema-driven forms with draft/live binding | [EN](./ui-data-form/doc/en/README.md) · [ES](./ui-data-form/doc/es/README.md) | [`ai/`](./ui-data-form/ai/README.md) |
| [`ui-data-view/`](./ui-data-view) | `@zn-apps/ui-data-view` | Read-only presentation with top/inline labels | [EN](./ui-data-view/doc/en/README.md) · [ES](./ui-data-view/doc/es/README.md) | [`ai/`](./ui-data-view/ai/README.md) |
| [`ui-data-editor/`](./ui-data-editor) | `@zn-apps/ui-data-editor` | View-like presentation with per-field dialog editing | [EN](./ui-data-editor/doc/en/README.md) · [ES](./ui-data-editor/doc/es/README.md) | [`ai/`](./ui-data-editor/ai/README.md) |
| [`ui-data-richtext/`](./ui-data-richtext) | `@zn-apps/ui-data-richtext` | Markdown-backed rich text editor and view | [EN](./ui-data-richtext/doc/en/README.md) · [ES](./ui-data-richtext/doc/es/README.md) | [`ai/`](./ui-data-richtext/ai/README.md) |

## Rules

- Libraries are isolated except for explicit composition: `ui-about → ui-core`, `ui-data-form/view/editor → ui-core + ui-data-core`, `ui-data-editor → ui-data-form + ui-data-view`, `ui-data-richtext → ui-core`.
- Apps depend on a library by workspace name (`"@zn-apps/ui-core": "*"`).
- Build all shared libraries from the root with `npm run build:shared`.
- A field feature must exist in form, view and editor in the same change.

Global rules: [`ai/architecture.md`](../ai/architecture.md).
