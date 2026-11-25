# @zn-apps/ui-data-dashlet — AI context

Dashboard KPI cards: `ZnDashlet` (container), `ZnDashletCounter`, `ZnDashletSummary`, `ZnDashletSparkline`, `ZnDashletProgress`. Location: `shared/ui-data-dashlet/`.
Composes `@zn-apps/ui-core` (`ZnCard` for the card surface, `ZnIcon` for the counter icon); the dependency is declared in `package.json` and externalized in `vite.config.js`.

## Components

| Component | Key props | Renders |
|---|---|---|
| `ZnDashlet` | `variant`, `filled`, `height` | `ZnCard variant="filled"` + variant CSS vars (`--zn-dashlet-bg`/`--zn-dashlet-fg`) and fixed height; slot fills the card content |
| `ZnDashletCounter` | `value`, `label`, `subtitle`, `icon` (M3 name, default `trending_up`), `variant`, `filled`, `height` | `ZnIcon :size="40"` + value/label/subtitle, icon left and data right (`space-between`) |
| `ZnDashletSummary` | `value`, `subtitle`, `secondaryValue`, `secondaryLabel`, `secondarySubtitle`, `layout` (`double-row` \| `side-by-side`), `variant`, `filled`, `height` | Two blocks; `side-by-side` splits the width with `flex: 1 1 0` + 16px gap |
| `ZnDashletSparkline` | `data`, `width`, `height`, `variant`, `filled` | `ZnDashlet` with an inline `<svg>` path (needs ≥ 2 points) |
| `ZnDashletProgress` | `value`, `max`, `showValue`, `height`, `variant`, `filled` | `ZnDashlet` with track + fill; card height = bar height + 16 when the label shows |

## Rules

1. `ZnDashlet` is the only place that owns the card surface: new dashlet types must nest inside it, never re-create the card or its padding.
2. Card padding lives in `ZnCard`'s `.zn-card__content`; override it with `:deep(.zn-card__content)` in the dashlet that needs it (sparkline: `padding: 0`; progress: `padding: 0 12px`).
3. `variant` values: `primary | warning | info | success | error | neutral`; `filled=false` renders a transparent card with an outline border.
4. Icons are Material Design names resolved by `ZnIcon` from `<BASE_URL>icons/sprite-<family>.svg`; the name must exist in the consuming app's `icon-profile.json`.
5. In `ZnSection`, use `:columns="n"` so each dashlet takes one grid column instead of the full width.

## Tests

`src/components/__tests__/*.spec.js` → `npx vitest run --project ui-data-dashlet` (registered in the root `vitest.config.js`).
