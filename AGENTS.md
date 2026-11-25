# AGENTS.md — Instructions for AI coding agents

> Automatically loaded by Antigravity, Codex, Cursor, Copilot, Claude Code and similar agents.

## Start here

[`ai/README.md`](./ai/README.md) is the entry point: it routes each task to the smallest set of files to read. **Load a project's context only when the change touches it.**

| Need | Read |
|---|---|
| Monorepo architecture, isolation, MD3, i18n, icon pipeline | [`ai/architecture.md`](./ai/architecture.md) |
| Commands, builds, icons, PWA checklist, CI | [`ai/workflow.md`](./ai/workflow.md) |
| Tests | [`ai/testing.md`](./ai/testing.md) |
| New app / archetypes / overrides | [`ai/app-types.md`](./ai/app-types.md) |
| CHANGELOG and version bumps | [`ai/versioning.md`](./ai/versioning.md) |
| Where and when to update docs | [`ai/docs-maintenance.md`](./ai/docs-maintenance.md) |
| Project detail | `<project>/ai/README.md` |

Every app and library also ships `<project>/ai/README.md` (agent context, English) and `<project>/doc/{en,es}/README.md` (user manuals, bilingual).

## Hard rules

1. **Read before writing** — inspect the `ai/` files of the projects involved; they record architecture and decisions already taken.
2. **Independent PWAs** — each app has its own `package.json`, `vite.config.js`, service worker, base `/zn-apps/<app>/`. Never share Pinia state between apps.
3. **Libraries build independently and reuse, not duplicate** — `shared/*` keeps its own `package.json`/`vite.config.js`/`vitest.config.js`, and composes lower-level libraries for UI instead of reimplementing it (`ui-core` is the visual base: `ZnCard`, `ZnIcon`, `ZnButton`…; `ui-data-*` may also compose `ui-data-core`). Edges are one-way and acyclic — a library never imports a library that imports it, never imports an app — and must be declared in its `package.json` + `vite.config.js` `external`.
4. **MD3** — components live in `shared/ui-core/src/components/`, use the `Zn` prefix, consume `--md-*` tokens and are imported from the package barrel. Theme switching only through `<ZnApp>`.
5. **Field parity** — any field feature must exist in form, view and editor in the same change; a new `FieldTypes` value needs implementations in all three.
6. **i18n** — every app ships `en` and `es`; resolve locale as `settings.i18n.locale` → system base → `en`.
7. **Verification is scoped** — narrowest useful test/build; full `npm run test:run` + `build:all` only for cross-project or release-level changes. Documentation-only changes: no tests, no builds. CI runs the full suite.
8. **Never weaken checks** — no skipped tests, loosened assertions or silenced errors to pass verification.

## Documentation duties

Two trees with different audiences; keep both accurate in the same change as the code:

| Tree | Audience | Language |
|---|---|---|
| `doc/` + `<project>/doc/{en,es}/` | Users and developers | English **and** Spanish |
| `ai/` + `<project>/ai/` | AI agents | English only, compact |

- New/changed component, token, composable → that library's `ai/` + user docs (EN and ES).
- New `FieldTypes` value or schema key → `ui-data-core` docs plus the affected `ui-data-*` projects.
- App domain rule or override → that app's docs.
- Global architecture, workflow, testing, archetype → root `ai/` and `doc/` files.
- Do not document unfinished work in user docs; `ai/` holds technical detail, `doc/` holds usage.
- CHANGELOGs and version bumps only on explicit request (see [`ai/versioning.md`](./ai/versioning.md)).

Details and checklist: [`ai/docs-maintenance.md`](./ai/docs-maintenance.md).

## Quick commands

```bash
npm install
npm run dev --workspace=<app>
npm run test:run | test:<app> | npx vitest run --project <name>
npm run build:production | build:<app> | build:shared
npm run build:icons      # after adding/renaming <ZnIcon> usages
npm run validate:pwa
```
