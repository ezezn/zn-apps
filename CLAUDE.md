# Instructions for Claude Code

Start with [`ai/README.md`](./ai/README.md), which routes tasks to the minimum context needed. Load a project's context only when the change touches it.

- Global: [`ai/architecture.md`](./ai/architecture.md), [`ai/workflow.md`](./ai/workflow.md), [`ai/testing.md`](./ai/testing.md), [`ai/app-types.md`](./ai/app-types.md), [`ai/versioning.md`](./ai/versioning.md), [`ai/docs-maintenance.md`](./ai/docs-maintenance.md).
- Per project: `shared/<lib>/ai/README.md`, `zound-box/ai/README.md`, `kitchensink/ai/README.md`, `daily-task-report/ai/README.md`.
- User documentation (EN + ES): [`doc/en/README.md`](./doc/en/README.md) and [`doc/es/README.md`](./doc/es/README.md).

Key rules:
- Vue 3 `<script setup>`; shared components in `shared/ui-core/src/components/` with the `Zn` prefix and `--md-*` tokens.
- Independent apps: no shared Pinia state, base `/zn-apps/<app>/`.
- Isolated libraries: no imports between libraries beyond the documented composition edges.
- Field parity across form, view and editor.
- Verify with the narrowest useful command; full suite/build only for cross-project or release-level changes. Markdown-only changes run no tests or builds.
- Update `ai/` and `doc/{en,es}` in the same change as any feature or decision.
