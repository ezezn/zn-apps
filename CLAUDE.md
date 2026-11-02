# Instructions for Claude Code

Before making changes, always read:
- `docs/00-overview.md` (Monorepo architecture and conventions)
- `docs/01-shared.md` (API reference for @zn-apps/ui-core)
- `docs/02-app-zound-box.md` (Zound Box application details)
- `docs/03-app-kitchensink.md` (Kitchensink & blueprint for new apps)
- `docs/05-testing.md` (Testing architecture and mocks)
- `README.md` (Setup, scripts, and local development)

Key Rules:
- Vue 3 `<script setup>` syntax.
- `shared/` holds isolated libraries: `shared/ui-core/` (`@zn-apps/ui-core`) and `shared/storage/` (`@zn-apps/storage`). Never import one library from the other.
- All shared components belong in `shared/ui-core/src/components/` with `Zn` prefix.
- Never share Pinia store state across separate applications.
- Run `npm run test:run` after modifying code to verify zero regressions.
- Run `npm run build:all` before finishing tasks involving build or config changes.
