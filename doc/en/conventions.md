# Conventions and guidelines

## Design system

- Components use the `Zn` prefix and live in `shared/ui-core/src/components/`, imported from the `@zn-apps/ui-core` barrel.
- Use `--md-*` tokens; never hard-code palette colors.
- Never duplicate a button, card, switch or theme logic inside an app when a `Zn*` component covers it.
- Theme switching is handled exclusively by `<ZnApp>`; every app is wrapped in it.
- Verify a component/list before building a layout variant.

## Icons

- Reference icons with `<ZnIcon name="..." family="..." />` (`name` in snake_case).
- After adding or renaming icon usages run `npm run build:icons` and commit `icon-profile.json` plus the sprites in `public/icons/`.
- Production builds never scan or generate icons; they consume the committed sprites.
- Kitchensink declares the whole catalog; product apps only ship what they use.

## PWA

Any new app must be independently installable:

1. `public/pwa-icon.svg` plus 192×192 and 512×512 PNG exports inside the maskable safe area.
2. Both PNGs declared in `VitePWA({ manifest: { icons } })` with exact sizes, `type: "image/png"`, `purpose: "any maskable"` and app-relative paths.
3. Valid `name`/`short_name`, `start_url`, `scope` and `display: "standalone"` for `/zn-apps/<app>/`.
4. Include the app in the production build so `npm run validate:pwa` checks it.
5. `initPwaInstallListener()`, `initPwaUpdateListener()` and `initPwaThemeSync()` in `src/main.js`.
6. `ZnPwaInstallPrompt` and `ZnPwaUpdatePrompt` as **direct children of `ZnApp`**, never inside `ZnScreen` or a container with `transform`/`overflow`/`isolation`.
7. Alias `@zn-apps/pwa-integration` to its source in `vite.config.js` (its CSS is emitted separately; `dist/` would render the popups unstyled and out of viewport).
8. `theme_color` and `background_color` = `#FEF7FF` and `<meta name="theme-color" content="#FEF7FF">` in `index.html`.
9. i18n keys `install*`, `update*`, `pwa.*` in `en` and `es`.

Updates use `registerType: 'prompt'`: the new worker waits, the app polls every 30 minutes and on foreground, and applying an update sends `SKIP_WAITING` and reloads.

## Internationalization

- `vue-i18n` with `en` and `es` messages in every app.
- Initial locale: `settings.i18n.locale` → base of `navigator.language` → `en`.
- Each app registers its own `settings-core` namespace; settings are never shared across apps.

## Data fields (`ui-data-*`)

- The family shares one schema and one JSON value; an app can switch between form, view and editor without transforming data.
- **Parity is mandatory**: a field feature (prop, state, variant, size, adornment, `span`, chips…) must exist in `ZnDataField`, `ZnDataViewField` and the `ZnDataEditorField` dialog in the same change.
- A new `FieldTypes` value requires: declaration/formatting in `ui-data-core`, input in the form, read-only rendering in the view, verification of the editor dialog, documentation and tests.
- `field.span` is clamped to the section columns and honored by all three renderers.
- Every new type or feature needs a Kitchensink demo covering form, view and editor.

## Versioning and changelog

CHANGELOGs and version bumps are generated **only when requested**, stating the change nature:

| Request | SemVer |
|---|---|
| Application redesign / breaking change | major |
| New feature | minor |
| Bugfix | patch |

```bash
node scripts/bump-version.mjs <project-dir> <major|minor|patch>
```

Each project keeps `<project>/CHANGELOG.md` with bilingual (ES/EN) entries, newest first.

## Documentation

Two trees, two audiences:

| Tree | Audience | Language |
|---|---|---|
| `doc/` + `<project>/doc/{en,es}/` | Users and developers | **English and Spanish, always both** |
| `ai/` + `<project>/ai/` | AI agents | English only, compact |

Update documentation in the same change as a new feature or decision — only the parts that changed:

- component/token/composable → that library's docs;
- field type or schema key → `ui-data-core` docs plus the affected `ui-data-*` libraries;
- app domain rule or override → that app's docs;
- global architecture, workflow, testing or archetypes → `doc/` and `ai/` root files.

Never add implementation notes to user docs; `ai/` holds the technical detail, `doc/` holds usage and behavior.

Validate every link and anchor with `npm run check:docs` after editing documentation.

## Related

- [Getting started](./getting-started.md) · [Architecture](./architecture.md) · [App types](./app-types.md)
- [pwa-integration manual](../../shared/pwa-integration/doc/en/README.md) · [ui-data-core manual](../../shared/ui-data-core/doc/en/README.md)
