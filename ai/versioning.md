# Versioning & CHANGELOG

## Trigger

`CHANGELOG.md` files and `package.json` version bumps are produced **only when the user explicitly asks**, stating the change nature: application redesign/major, new feature/minor, or bugfix/patch.

## SemVer

Each app (`zound-box`, `kitchensink`) and library (`ui-core`, `settings-core`, `ui-about`, `pwa-integration`, `ui-data-*`) owns its version in its `package.json` (`MAJOR.MINOR.PATCH`).

| Request | Bump | `0.0.0` → | `1.2.3` → |
|---|---|---|---|
| Redesign / breaking | major | `1.0.0` | `2.0.0` |
| New feature | minor | `0.1.0` | `1.3.0` |
| Bugfix | patch | `0.0.1` | `1.2.4` |

## CHANGELOG location and format

One file per project root (`<project>/CHANGELOG.md`), newest version first, bilingual summary:

```md
# Changelog

## [1.0.0] - 2026-11-10

### Español
#### Tipo de cambio: Rediseño de aplicación
- **Resumen**: …
- **Detalles**:
  - …

### English
#### Change type: Application redesign
- **Summary**: …
- **Details**:
  - …
```

## Version bump script

```bash
node scripts/bump-version.mjs <project-dir> <major|minor|patch>
node scripts/bump-version.mjs zound-box major
node scripts/bump-version.mjs shared/ui-core minor
```

Apps serve their changelog through `changelogPlugin()` (`scripts/vite-changelog-plugin.mjs`) at `<base>/CHANGELOG.md`; `ZnAbout` fetches it lazily in its Changelog tab.
