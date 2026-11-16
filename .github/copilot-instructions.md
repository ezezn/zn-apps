# GitHub Copilot Instructions for zn-apps

## Context & architecture

Vue 3 + Vite monorepo of independent PWAs using npm workspaces, deployed to GitHub Pages.

Start with [`ai/README.md`](../ai/README.md) — it routes the task to the minimum context:

- [`ai/architecture.md`](../ai/architecture.md) — monorepo design, isolation rules, MD3, i18n, icon pipeline
- [`ai/workflow.md`](../ai/workflow.md) — commands, builds, icons, PWA checklist, CI
- [`ai/testing.md`](../ai/testing.md) — Vitest projects and mocks
- [`ai/app-types.md`](../ai/app-types.md) — archetypes, overrides, blueprint
- Per project: `shared/<lib>/ai/README.md`, `zound-box/ai/README.md`, `kitchensink/ai/README.md`

## Coding conventions

1. **Shared libraries**: `shared/` holds isolated workspaces (`ui-core`, `settings-core`, `ui-about`, `pwa-integration`, `ui-data-*`). Never import one library from another except the documented composition edges.
2. **Components**: `Zn` prefix, Material Design 3 tokens (`--md-*`), Vue 3 Composition API with `<script setup>`, imported from the `@zn-apps/ui-core` barrel.
3. **App isolation**: every app in subfolders is independent; never share Pinia stores between apps; base `/zn-apps/<app>/`.
4. **Field parity**: a `ui-data-*` field feature must exist in form, view and editor.
5. **Quality**: add or update specs for new shared components; choose verification proportional to the change (full `npm run test:run` only for cross-project or broad regression checks). Documentation-only changes run no tests or builds.
6. **Docs**: keep `ai/` (English, compact) and `doc/{en,es}/` (bilingual user docs) updated with every feature or decision.
