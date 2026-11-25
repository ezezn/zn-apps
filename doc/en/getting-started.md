# Getting started

## Requirements

- **Node.js** 24.x recommended (20+ supported).
- **npm** 10+ (native workspace support).

## Install

Everything resolves from the root in one step thanks to npm workspaces:

```bash
git clone https://github.com/<user>/zn-apps.git
cd zn-apps
npm install
```

## Local development

```bash
# Applications
npm run dev --workspace=kitchensink
npm run dev --workspace=daily-task-report
npm run dev --workspace=zound-box

# Shared library watch builds (run while changing shared/ui-*/src)
npm run dev --workspace=@zn-apps/ui-core
```

You can also `cd` into a project and run `npm run dev`. For shared-library work, use the watch build so the app picks up recompiled output.

## Tests

Vitest + `@vue/test-utils` + happy-dom, orchestrated from the root:

```bash
npm test                    # watch
npm run test:run            # full suite once (CI mode)
npm run test:coverage       # V8 coverage
npm run test:shared         # all shared libraries
npm run test:zound-box
npm run test:kitchensink
npm run test:daily-task-report
npx vitest run --project ui-core              # one library
npx vitest run path/to/file.spec.js           # one file
```

Pick the narrowest scope that covers your change. The full suite is for cross-project, shared or release-level verification. Documentation-only changes need no tests or builds. CI always runs `npm run test:run` before deploying.

## Builds

```bash
npm run build:shared       # all shared libraries
npm run build:zound-box
npm run build:kitchensink
npm run build:daily-task-report
npm run build:production   # full monorepo -> dist/
npm run build:changed      # only workspaces changed in BASE_SHA..HEAD_SHA
npm run validate:pwa       # manifest + 192/512 PNG validation
```

`build:production` (alias `build:all`) cleans `dist/`, copies the landing page and root service worker, builds shared libraries then apps, moves each `dist/` to `dist/<app>/` and validates the PWA manifests.

Icons are **not** regenerated during production builds:

```bash
npm run scan:icons         # scan <ZnIcon name="..."> into icon-profile.json
npm run generate:icons     # regenerate public/icons/sprite-<family>.svg
npm run build:icons        # both; commit profiles + sprites afterwards
```

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main`: install → `npm run test:run` → restore the previous Pages artifact → `npm run build:changed` → `validate:pwa` → inject `404.html` fallbacks → publish to GitHub Pages under `/zn-apps/`.

`build:changed` (`scripts/build-changed.mjs`) compares `github.event.before..github.sha` and rebuilds only the apps and libraries whose files changed, keeping the rest of the site from the previous deployment. It automatically falls back to a full `build:production` when there is no previous artifact or when the change touches global files (`package.json`, lockfile, `vitest*.js`, `index.html`, `sw.js`, `scripts/`). Since apps bundle shared libraries from source, an app that uses a changed library is not rebuilt automatically — the script lists those apps, so rebuild them in the same push or set `FULL_BUILD=1`.

## Where to go next

- [Architecture](./architecture.md) — stack, layout and principles.
- [App types](./app-types.md) — choose an archetype and allowed overrides.
- [Conventions](./conventions.md) — design system, icons, PWA, i18n, versioning.
- Per-project manuals: [projects table](./README.md#projects).
