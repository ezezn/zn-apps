# @zn-apps/ui-data-charts — AI context

Declarative SVG charts: bars (single, grouped, stacked), lines (single/multi), areas (overlapping/stacked), pie and donut, with a click-to-pin popup and a MD3 palette. Vue-only: the library imports nothing from `shared/*` (no `ui-core` edge), so it renders inside any container and inherits `--md-*` tokens through CSS.

Location: `shared/ui-data-charts/`. Apps import `@zn-apps/ui-data-charts` and, when using the built package, `@zn-apps/ui-data-charts/dist/ui-data-charts.css`.

## Exports

| Export | Purpose |
|---|---|
| `ZnChart` | Orchestrator: measures its container, builds the model, dispatches to a renderer, renders legend + popup |
| `ZnChartCartesian` | `<g>` renderer: axes, grid, bars/lines/areas, interactive marks |
| `ZnChartPie` | `<g>` renderer: pie/donut slices, donut center total |
| `ZnChartLegend` | Swatch list |
| `ZnChartTooltip` | Positioned popup |
| `ZnChartShape` | Static miniature: same `data`/`config`, no axes, labels, legend, popup or interaction |
| `ChartTypes` | `bar \| bar-grouped \| bar-stacked \| line \| line-multi \| area \| area-stacked \| pie \| donut` |
| `DEFAULT_CHART_COLORS` | Eight MD3 baseline tones; first entry is `var(--md-primary, #6750A4)` |
| utils | `normalizeChartData`, `readChartPath`, `toChartNumber`, `getChartPalette`, `isCircularType`, `isStackedType`, `cartesianDomain`, `niceTicks`, `createValueFormatter`, `createPercentFormatter`, `buildSlices`, `stackSeries`, `createScale`, `polarToCartesian`, `linePath`, `areaPath`, `bandPath`, `arcPath`, `roundedBarPath` |

## `ZnChart` props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | Array | `[]` | Objects, numbers or numeric strings |
| `config` | Object | `{}` | Data mapping + presentation (table below) |
| `emptyText` | String | `'No data'` | Empty state text; app translates it |
| `ariaLabel` | String | `''` | SVG accessible name; falls back to `config.ariaLabel` → `"<type> chart"` |

Emits `point-click`:

```js
{
  type, category, categoryIndex,
  series, seriesLabel, seriesIndex,   // null on pie/donut
  value, seriesValues,                // seriesValues = every series at that category
  percent                             // only pie/donut
}
```

## `config` contract

| Key | Default | Notes |
|---|---|---|
| `type` | `'bar'` | `ChartTypes` value |
| `category` | `'label'` | Category/label key (supports `a.b` paths) |
| `value` | `'value'` | Numeric key for single series and circular charts |
| `series` | — | `'column'` → extract series from a long-format column; `['a','b']` or `[{ key, label, color }]` → wide columns |
| `categories` | — | Optional labels overriding the category values by index |
| `seriesLabels` / `seriesColors` | — | Objects keyed by series key (long format or wide strings) |
| `colors` | MD3 palette | Array of CSS colors; assigned per series (cartesian) or per category (circular) |
| `stacked` | type-derived | `true` implies cumulative bars/areas |
| `height` | `280` | Plot height in px (legend is additional) |
| `legend` | auto | Auto = on with >1 series or circular; `true`/`false` forces |
| `tooltip` | `true` | `false` keeps `point-click` but never renders the popup |
| `curve` | `'linear'` | `'smooth'` uses Catmull-Rom cubic segments (stacked areas are always straight) |
| `points` | line only | Visible dots; hit targets are always rendered |
| `valueFormat` | Intl | Function `(value) => string` or a locale string |
| `maximumFractionDigits` | `2` | Applies to generated formatters (`1` for percentages) |
| `valueLabel` / `percentLabel` | `'Value'` / `'Share'` | Popup row labels (circular); translate in the app |
| `xAxis` | `{}` | `title`, `hide`, `rotateLabels`, `format(label)` |
| `yAxis` | `{}` | `title`, `hide`, `grid` (`false` hides dashed grid), `min`, `max`, `ticks` (array or count), `tickCount`, `format(value)` |
| `donut` | `{}` | `innerRadius` (0.62), `totalLabel`, `showTotal` |

## `ZnChartShape` props

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | Array | `[]` | Same rows accepted by `ZnChart` |
| `config` | Object | `{}` | Same mapping; `height`, axis, legend and popup keys are ignored |
| `width` / `height` | Number | `64` / `40` | Pixel `viewBox`; the SVG scales with CSS |
| `ariaLabel` | String | `''` | With a label → `role="img"`; without it the shape is `aria-hidden` (decorative) |

It renders marks only (bars, line/area paths, slices), sized from the config palette, with no text, focus targets, `data-chart-mark` attributes or placeholder text. Empty data draws a dashed baseline (cartesian) or circle (circular). Tests: `src/components/__tests__/ZnChartShape.spec.js`.

## Data rules

1. **Single series** — one row per category; values read from `config.value`. Primitive rows are accepted (`[3, '7', 5]`), labelled `1..n`.
2. **Long format** — `series` names a column; categories and series are collected in first-seen order. Repeated category+series pairs are **summed**; missing pairs are `null` (gaps in lines, omitted bars).
3. **Wide format** — `series` lists columns. Entries may be strings or `{ key, label, color }`.
4. A missing category label falls back to the 1-based index; `config.categories` wins over the raw value.
5. Circular types ignore `series` and read `category` + `value` only.
6. `cartesianDomain` always includes 0; `yAxis.min/max` clamp it. Stacked domains use the positive/negative totals per category.
7. Non-numeric and non-finite values become `null`; bars skip them, lines break, stacked series treat them as gaps (flat cumulative segment).

## Behavior rules

1. `ZnChart` measures its own width with `ResizeObserver` (fallback 600px, then `window.resize`) and renders with a pixel `viewBox`, so text and the popup stay 1:1 at any size.
2. Marks are focusable (`role="button"`, `tabindex="0"`, `aria-label` with the formatted value). Enter/Space activate, Esc or a click on the background clears, clicking the active mark toggles the popup.
3. Hover/focus previews the popup; the popup pins until toggled off, so it never closes while the pointer travels to it (`pointer-events: none`). Popup lists every series at the category with the clicked one in medium weight.
4. Axes: the left gutter is sized from the formatted tick labels (max 120px), category labels rotate when they do not fit the band, and long labels truncate with `…`.
5. Bars round only the value end; grouped bars share the band with 14% of inner padding; stacks accumulate positives up and negatives down.
6. Lines/areas use band centers; nulls split the path. Stacked areas draw the band between cumulative top and bottom.
7. Pie slices start at 12 o'clock clockwise; non-positive values render no slice; a donut shows the total formatted with `valueFormat`.
8. No animations on mark geometry, so data updates never leave the chart mid-transition; only the popup fades in and bar/slice fills animate their opacity.
9. Styling uses `--md-primary`, `--md-surface`, `--md-surface-container-highest`, `--md-surface-container-low`, `--md-on-background`, `--md-on-surface-variant`, `--md-outline` with light fallbacks. No icons, no icon profile, no `ui-core` import.
10. `data`/`config` reference changes clear the pinned popup.

## Integration

```vue
<script setup>
import { ZnChart } from '@zn-apps/ui-data-charts'
import '@zn-apps/ui-data-charts/dist/ui-data-charts.css'

const rows = [
  { month: 'Jan', online: 22, store: 14 },
  { month: 'Feb', online: 28, store: 17 },
]
const config = {
  type: 'bar-stacked',
  category: 'month',
  series: [{ key: 'online', label: 'Online' }, { key: 'store', label: 'Store' }],
  yAxis: { title: 'Orders' },
  valueFormat: (value) => `${value} u`,
}
</script>

<template>
  <ZnChart :data="rows" :config="config" @point-click="console.log" />
</template>
```

Source builds: alias `@zn-apps/ui-data-charts` to `shared/ui-data-charts/src/index.js` (Kitchensink does this in `vite.config.js` and `vitest.config.js`); the built package needs the CSS import. The library build externalizes only `vue`.

## Tests

`src/utils/__tests__/{chart-data,chart-geometry}.spec.js`, `src/components/__tests__/{ZnChart,ZnChartShape}.spec.js` → `npx vitest run --project ui-data-charts`.
Kitchensink demos: `/data/charts` (`src/views/data/ChartsPage.vue`, incl. the shape gallery) and `/data/charts-data` (`ChartsDataPage.vue`, prints the `data`/`config` payloads), both fed by `src/data/charts-demo.js` (`chartExamples`, `shapeExamples`).
