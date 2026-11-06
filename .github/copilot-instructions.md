# GitHub Copilot Instructions for zn-apps

## Context & Architecture
This is a Vue 3 + Vite monorepo using npm workspaces for multiple PWAs deployed to GitHub Pages.

Always consult the documentation inside `docs/`:
- `docs/00-overview.md` — Monorepo design, build pipeline and conventions
- `docs/01-shared.md` — `@zn-apps/ui-core` component library API and MD3 tokens
- `docs/02-app-zound-box.md` — Zound Box application architecture
- `docs/03-app-kitchensink.md` — Kitchensink showroom & blueprint for new apps
- `docs/05-testing.md` — Vitest unit testing architecture
- `README.md` — Human guide for local development and build scripts

## Coding Conventions
1. **Shared Libraries**: `shared/` contains isolated workspaces — `shared/ui-core/` (`@zn-apps/ui-core`) and `shared/storage/` (`@zn-apps/storage`). Do not import one library from the other.
2. **Component Design**: Components in `@zn-apps/ui-core` use the `Zn` prefix and Material Design 3 tokens (`--md-*`). Use Vue 3 Composition API with `<script setup>`.
3. **App Isolation**: Every app in subfolders is independent. Do not share Pinia stores between different apps.
4. **Quality**: Write unit tests for new shared components under `shared/ui-core/src/**/__tests__/` and for storage helpers under `shared/storage/src/__tests__/`. Select verification based on the change; the full `npm run test:run` suite is for cross-project, shared, or broad regression checks, not an automatic requirement for every code change. CI runs the full suite before deployment.
