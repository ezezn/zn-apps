# Testing

Vitest 5 + `@vue/test-utils` 2 + happy-dom, orchestrated from the root with Vitest `projects`.

```
vitest.config.js        # root: project list + coverage
vitest.setup.js         # global mocks
shared/<lib>/vitest.config.js   # one project per library
zound-box|kitchensink|daily-task-report/vitest.config.js
```

Tests live in `src/**/__tests__/*.spec.js` of each project.

## Commands

| Command | Scope |
|---|---|
| `npm test` | watch mode |
| `npm run test:run` | full suite once (CI) |
| `npm run test:coverage` | V8 coverage |
| `npm run test:shared` | all `shared/*` projects |
| `npm run test:zound-box` / `test:kitchensink` / `test:daily-task-report` | one app |
| `npx vitest run --project <name>` | one project (`ui-core`, `ui-data-form`, …) |
| `npx vitest run path/to/file.spec.js` | one file |

## Policy

- Choose the narrowest verification that covers the change; run the full suite when the change crosses projects or alters shared behavior.
- CI always runs `npm run test:run` plus the production build.
- Markdown-only changes: no tests, no builds.
- Never weaken assertions, skip tests or silence errors to make a check pass.
- New/modified `ui-core` component → add/update its spec in `shared/ui-core/src/components/__tests__/`.
- A new `FieldTypes` value → specs in `ui-data-core`, `ui-data-form`, `ui-data-view` and `ui-data-editor` where applicable.

## Global mocks (`vitest.setup.js`)

1. `window.matchMedia` — used by `ZnApp` for `prefers-color-scheme`.
2. `IntersectionObserver` — used by `ZnScreen` for the condensed header sentinel.
3. `fetch` — `ZnIcon` downloads family sprites; the mock returns an empty sprite. `ZnIcon` specs override it with a fixture.

## Aliases

App and library test configs resolve `@zn-apps/ui-core` to `../shared/ui-core/src/index.js` and `@zn-apps/ui-core/dist/ui-core.css` to `../shared/ui-core/src/assets/css/global.css`, so no prior build is required. `ui-data-editor` specs resolve form/view sources the same way.
