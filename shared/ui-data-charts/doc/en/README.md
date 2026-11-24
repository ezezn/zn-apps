# @zn-apps/ui-data-charts — user manual

SVG charts driven by your data plus one configuration object: vertical bars (single, grouped, stacked), lines (single or multiple), areas (overlapping or stacked), pie and donut. Clicking a bar, line point or slice opens a pinned detail popup; the default palette follows the Material Design 3 colors and can be replaced.

- Package: `@zn-apps/ui-data-charts` · Folder: `shared/ui-data-charts/`
- Spanish: [Leer en español](../es/README.md)

## Installation

```js
import { ZnChart } from '@zn-apps/ui-data-charts'
import '@zn-apps/ui-data-charts/dist/ui-data-charts.css'
```

The library has no dependency on `ui-core`; it only reads the `--md-*` CSS variables when present, so it also works with a custom theme. If your build aliases shared sources, alias `@zn-apps/ui-data-charts` to `shared/ui-data-charts/src/index.js` in `vite.config.js` and `vitest.config.js`.

## Quick start

```vue
<script setup>
import { ZnChart } from '@zn-apps/ui-data-charts'

const sales = [
  { month: 'Jan', online: 22, store: 14 },
  { month: 'Feb', online: 28, store: 17 },
  { month: 'Mar', online: 24, store: 19 },
]

const config = {
  type: 'bar-stacked',
  category: 'month',
  series: [
    { key: 'online', label: 'Online' },
    { key: 'store', label: 'Store' }
  ],
  yAxis: { title: 'Orders' },
  height: 280
}
</script>

<template>
  <ZnChart :data="sales" :config="config" @point-click="console.log" />
</template>
```

## Chart types

| `config.type` | What it draws |
|---|---|
| `bar` | One vertical bar per category |
| `bar-grouped` | One bar per series, side by side (also the behavior of `bar` with several series) |
| `bar-stacked` | Series accumulated in one bar |
| `line` | One line with points |
| `line-multi` | One line per series |
| `area` | Filled area under each line |
| `area-stacked` | Areas accumulated per category |
| `pie` | Slices of the total |
| `donut` | Pie with an inner radius and optional center total |

`line` and `area` accept several series too: they automatically behave like `line-multi` and overlapping areas. The grouped/stacked types exist so the intent stays explicit in the configuration.

## Telling the chart where the data is

The `config` maps your rows onto categories and series. The same `data` array can be read in three ways:

```js
// 1. One value per row
{ category: 'month', value: 'sales' }

// 2. One column per series
{ category: 'month', series: ['online', 'store'] }
{ category: 'month', series: [{ key: 'online', label: 'Online', color: '#6750A4' }] }

// 3. One row per category + series (long format)
{ category: 'month', value: 'visits', series: 'channel' }
```

Rows can also be plain numbers (`[3, 7, 5]`). With the long format, repeated category+series pairs are summed, and series appear in the order they are first found. `config.categories` can relabel the categories by index, and `config.seriesLabels` / `config.seriesColors` rename or recolor series by key.

## Configuration reference

| Key | Default | Notes |
|---|---|---|
| `type` | `'bar'` | Any type from the table above |
| `category` | `'label'` | Property used as the X axis / slice label (nested `a.b` allowed) |
| `value` | `'value'` | Numeric property for one series and circular charts |
| `series` | — | Column name (extract), array of column names, or `{ key, label, color }` objects |
| `categories` | — | Array of labels replacing the category values |
| `colors` | MD3 palette | Any CSS colors; one per series (cartesian) or per slice (pie/donut) |
| `seriesLabels` / `seriesColors` | — | Objects keyed by series name |
| `stacked` | from `type` | Forces stacking |
| `height` | `280` | Plot height in pixels; the legend sits above it |
| `legend` | automatic | Off unless several series, a pie or a donut; `true`/`false` forces it |
| `tooltip` | `true` | `false` keeps the `point-click` event but disables the popup |
| `curve` | `'linear'` | `'smooth'` draws curved lines |
| `points` | lines only | Show visible dots |
| `valueFormat` | Intl number | Function or locale string used for values and axis ticks |
| `valueLabel` / `percentLabel` | English | Popup labels for pie/donut (`Value`, `Share`); pass translations |
| `xAxis` | `{}` | `title`, `hide`, `rotateLabels`, `format(label)` |
| `yAxis` | `{}` | `title`, `hide`, `grid: false`, `min`, `max`, `ticks` (array or count), `tickCount`, `format(value)` |
| `donut` | `{}` | `innerRadius` (0.62), `totalLabel`, `showTotal: false` |

Values that are not numbers (or are empty) become gaps: lines break, bars disappear and stacked series stay flat at that point. Stacked charts keep positive values above zero and negative values below it.

## Interaction

- Click a bar, a line point or a slice to pin its popup; click it again, click the background or press <kbd>Esc</kbd> to close it.
- Hovering or focusing a mark previews the popup without pinning it. The popup lists every series for that category, with the clicked one highlighted, plus the value and, for pie/donut, the percentage.
- Marks are keyboard reachable: <kbd>Tab</kbd> moves through them, <kbd>Enter</kbd> or <kbd>Space</kbd> opens the popup.
- `@point-click` reports the selection so the app can react (open a detail view, filter a table, etc.):

```js
{
  type: 'bar-stacked',
  category: 'Jan',
  categoryIndex: 0,
  series: 'online',
  seriesLabel: 'Online',
  seriesIndex: 0,
  value: 22,
  seriesValues: [22, 14], // every series in that category
  percent: null            // pie/donut only
}
```

## Customization

- Colors: `colors` accepts hex, `rgb()`, `oklch()` and CSS variables. The default first color is `var(--md-primary, #6750A4)`, so series inherit the app theme automatically.
- Accessibility: pass `aria-label` to name the chart, and `empty-text` to translate the empty state. The component renders no text of its own other than the `Value`/`Share` popup labels, which you can replace through `valueLabel` and `percentLabel`.
- Layout: the chart fills the width of its container and re-renders on resize. Put it inside `ZnCard` or `ZnSection` for the MD3 surface.

## Miniatures with `ZnChartShape`

`ZnChartShape` takes the same `data` and `config` and draws a reduced version with no axes, labels, legend, popup or interaction, ideal as an icon or as the preview inside a summary card.

```vue
<script setup>
import { ZnChartShape } from '@zn-apps/ui-data-charts'

const visits = [
  { channel: 'Email', visits: 420 },
  { channel: 'Search', visits: 610 },
  { channel: 'Social', visits: 340 }
]
</script>

<template>
  <!-- Decorative: hidden from screen readers -->
  <ZnChartShape :data="visits" :config="{ type: 'donut' }" :width="32" :height="32" />

  <!-- With a name: exposed as an image -->
  <ZnChartShape
    :data="visits"
    :config="{ type: 'bar', category: 'channel', value: 'visits' }"
    :aria-label="'Visits by channel'"
  />
</template>
```

`width` and `height` (default `64×40`) define the pixel `viewBox`; the SVG scales with CSS if the container is bigger. `config.height`, axis, legend and tooltip settings are ignored, and empty data draws a dashed placeholder so the slot never collapses.

## Demo and tests

Kitchensink: `/data/charts` covers every type, the shape gallery, the three data shapes and live toggles for stacking, curves, points, legends and the MD3/custom palette; `/data/charts-data` prints the exact `data` and `config` object of each example so you can copy them. Tests: `npx vitest run --project ui-data-charts`.
