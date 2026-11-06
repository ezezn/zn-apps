# Instructions for Claude Code

Before making changes, consult documentation organized in two tiers:

1. Root Monorepo Guidelines:
   - `docs/README.md` (Master index)
   - `docs/00-overview.md` (Monorepo architecture and conventions)
   - `docs/01-app-types.md` (App typology & override criteria)
   - `docs/02-workflow.md` (Workflow, scripts, icons & PWA)
   - `docs/05-testing.md` (Testing architecture and mocks)
   - `README.md` (Setup, scripts, and local development)

2. Subproject-Specific Documentation:
   - `shared/ui-core/docs/README.md` (API reference for @zn-apps/ui-core)
   - `shared/storage/docs/README.md` (API reference for @zn-apps/storage)
   - `shared/ui-about/docs/README.md` (API reference for @zn-apps/ui-about)
   - `zound-box/docs/README.md` (Zound Box audio architecture, DTOs & overrides)
   - `kitchensink/docs/README.md` (Kitchensink showroom, icon catalog & blueprint)

Key Rules:
- Vue 3 `<script setup>` syntax.
- `shared/` holds isolated libraries: `shared/ui-core/` (`@zn-apps/ui-core`) and `shared/storage/` (`@zn-apps/storage`). Never import one library from the other.
- All shared components belong in `shared/ui-core/src/components/` with `Zn` prefix.
- Never share Pinia store state across separate applications.
- Run `npm run test:run` and `npm run build:all` ONLY when there are code-related changes (Vue SFCs, JS/TS, CSS, configs). Do NOT run them for documentation-only changes (.md files).
