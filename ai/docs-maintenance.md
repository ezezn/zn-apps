# Documentation maintenance

## Two trees, two audiences

| Tree | Audience | Language | Content |
|---|---|---|---|
| `ai/` (root) + `<project>/ai/README.md` | AI agents | **English only** | Compact architecture, contracts, APIs, decisions, commands, invariants |
| `doc/` (root) + `<project>/doc/{en,es}/README.md` | Users / developers | **English and Spanish, always both** | Architecture and guidelines (root), brief project overview + per-project manual |

Rules:
- Never duplicate a full API list in both trees. `ai/` holds the detail; `doc/` holds the user-facing overview, usage and links.
- `ai/` must stay compact: tables and bullet points, no prose padding, no changelogs.
- Every new project must ship `ai/README.md`, `doc/en/README.md` and `doc/es/README.md`, and be listed in `ai/README.md` and `doc/{en,es}/README.md`.
- Every link in `ai/` and `doc/` is relative and must resolve; the entry pointer for agents is always `ai/README.md`.

## When to update

Update **in the same change** as the code, and only the parts that changed:

| Change | Update |
|---|---|
| New/changed `Zn*` component, token, composable, icon rule | `shared/ui-core/ai/README.md` + `shared/ui-core/doc/{en,es}/README.md` |
| New `FieldTypes` value, schema key, formatting rule | `shared/ui-data-core/ai/README.md` + its user docs, plus the affected `ui-data-*` projects and the contract in `ai/architecture.md` if the rule itself changes |
| New/changed library prop, event, method, behavior | That library's `ai/README.md` + `doc/{en,es}/README.md` |
| App domain, DTO, business rule, override | `<app>/ai/README.md` + `<app>/doc/{en,es}/README.md` |
| Global architecture, tooling, CI, testing policy, archetype | `ai/architecture.md` / `workflow.md` / `testing.md` / `app-types.md` + `doc/{en,es}/…` |
| New demo route in Kitchensink | `kitchensink/ai/README.md` (+ user docs if user-visible) |
| Version bump / changelog | `<project>/CHANGELOG.md` only, on request |

Do **not** touch docs for unrelated edits. Do **not** add a `TODO`/`pendiente` note in user docs; either document the current behavior or leave it out.

## Checklist before finishing a feature

1. Does the contract change (props/types/parity)? → `ai/architecture.md` + `ui-data-core` docs.
2. Is there a new user-visible capability? → project user docs in **both** languages.
3. Is there a new demo? → `kitchensink/ai/README.md`.
4. Do the links still resolve? → `npm run check:docs` (relative paths and anchors across `doc/` and `ai/`).
5. Markdown-only changes: never run tests or builds.
