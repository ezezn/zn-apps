# @zn-apps/ui-data-dashlet — user manual

Dashboard widget cards for KPI metrics, summaries and statistics. Three main component types: `ZnDashlet` (container), `ZnDashletCounter` (icon + number + subtitle), `ZnDashletSummary` (dual-row summary), `ZnDashletSparkline` (trend mini chart) and `ZnDashletProgress` (progress bar).

- Package: `@zn-apps/ui-data-dashlet` · Folder: `shared/ui-data-dashlet/`
- Spanish: [Leer en español](../es/README.md)

## Installation

```js
import { ZnDashlet, ZnDashletCounter, ZnDashletSummary, ZnDashletSparkline, ZnDashletProgress } from '@zn-apps/ui-data-dashlet'
```

The library has no dependency on `ui-core`; it only reads the `--md-*` CSS variables when present, so it also works with a custom theme. If your build aliases shared sources, alias `@zn-apps/ui-data-dashlet` to `shared/ui-data-dashlet/src/index.js` in `vite.config.js` and `vitest.config.js`.

## ZnDashlet

A flexible container card that slots arbitrary dashboard content with MD3 color variants.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'neutral'` | Variant color scheme. Uses MD3 semantic colors via CSS custom properties. |
| `filled` | `boolean` | `true` | Whether the card should be filled with the variant color. When `false`, renders with border only (outline mode). |
| `height` | `number` | `120` | Height in pixels. The default matches MD3 card height. |
| `class` | `string` | `''` | Additional CSS class applied to the root element. |

### Usage

```vue
<script setup>
import { ZnDashlet } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Filled primary card -->
  <ZnDashlet variant="primary" filled :height="160">
    <p>Your custom content here</p>
  </ZnDashlet>

  <!-- Outline mode (no fill) -->
  <ZnDashlet variant="success" filled :height="100">
    <p>Content without background fill</p>
  </ZnDashlet>
</template>
```

## ZnDashletCounter

A counter card with large icon on the left, large number on the right, and optional subtitle below.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number \| string` | `0` | The main number to display. |
| `label` | `string` | `''` | Descriptive label (e.g. "Usuarios", "Ventas"). |
| `subtitle` | `string` | `''` | Subtitle displayed below the label. |
| `icon` | `string` | `'trending_up'` | Material Design icon name (e.g. `'people'`, `'trending_up'`). |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Variant color scheme. |
| `filled` | `boolean` | `true` | Whether the card should be filled with the variant color. |

### Usage

```vue
<script setup>
import { ZnDashletCounter } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Counter with icon, value and subtitle -->
  <ZnDashletCounter
    :value="128"
    label="Usuarios"
    subtitle="Activos"
    icon="people"
    variant="primary"
    :filled="true"
  />
</template>
```

## ZnDashletSummary

A summary card with two-row layout. Default `double-row` layout has a larger row above with the main value and subtitle, and a smaller row below with a secondary value and subtitle. The `side-by-side` layout places two items horizontally adjacent.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number \| string` | `0` | The main large value. |
| `subtitle` | `string` | `''` | Subtitle displayed above the main value. |
| `secondaryValue` | `number \| string` | `0` | The secondary smaller value. |
| `secondaryLabel` | `string` | `''` | Label for the secondary value. |
| `secondarySubtitle` | `string` | `''` | Subtitle for the secondary value. |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Variant color scheme. |
| `filled` | `boolean` | `true` | Whether the card should be filled with the variant color. |
| `layout` | `'double-row' \| 'side-by-side'` | `'double-row'` | Layout mode. `double-row` stacks vertically; `side-by-side` places items horizontally. |

### Usage - double-row (default)

```vue
<script setup>
import { ZnDashletSummary } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <ZnDashletSummary
    :value="250"
    subtitle="Objetivo"
    secondaryValue="75"
    secondaryLabel="Avance"
    secondarySubtitle="Progreso"
    variant="success"
    :filled="true"
  />
</template>
```

### Usage - side-by-side

```vue
<script setup>
import { ZnDashletSummary } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <ZnDashletSummary
    :value="150"
    subtitle="Ventas"
    secondaryValue="80"
    secondaryLabel="Meta"
    secondarySubtitle="Meta trimestral"
    variant="info"
    :filled="true"
    :layout="'side-by-side'"
  />
</template>
```

## ZnDashletSparkline

A small trend sparkline showing recent data points as a line chart. Ideal for displaying trend direction inside dashboard cards.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `data` | `Array<number>` | `[]` | Numeric data points for the sparkline trend. Must contain at least 2 points for a visible line. |
| `height` | `number` | `40` | Height in pixels. |
| `width` | `number` | `120` | Width in pixels. |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Variant color scheme. Uses MD3 semantic colors for the line. |
| `filled` | `boolean` | `true` | Whether the container background uses the variant color. |

### Usage

```vue
<script setup>
import { ZnDashletSparkline } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Sparkline with 5 data points -->
  <ZnDashletSparkline
    :data="[10, 15, 12, 20, 18]"
    variant="primary"
    :filled="true"
  />
</template>
```

## ZnDashletProgress

A horizontal progress bar showing percentage completion. Ideal for displaying task completion, resource usage, or any metric with a percentage value.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `value` | `number` | `0` | Current progress value. |
| `max` | `number` | `100` | Maximum value for percentage calculation. |
| `showValue` | `boolean` | `true` | Whether to display the numeric percentage text above the bar. |
| `height` | `number` | `8` | Bar height in pixels. |
| `variant` | `'primary' \| 'warning' \| 'info' \| 'success' \| 'error' \| 'neutral'` | `'primary'` | Variant color scheme. Uses MD3 semantic colors for the fill. |
| `filled` | `boolean` | `true` | Whether the bar uses the variant color (otherwise uses `currentColor` with low opacity). |

### Usage

```vue
<script setup>
import { ZnDashletProgress } from '@zn-apps/ui-data-dashlet'
</script>

<template>
  <!-- Progress bar showing 75% -->
  <ZnDashletProgress
    :value="75"
    max="100"
    variant="primary"
    :filled="true"
  />
</template>
```

## Customization

- **Colors**: All components use MD3 color tokens (`--md-primary`, `--md-success`, `--md-warning`, `--md-error`, `--md-info`) via CSS custom properties. The first color entry defaults to `var(--md-primary, #6750A4)`, so series inherit the app theme automatically.
- **Outline mode**: Set `filled=false` to render cards/bars with borders only and `currentColor` stroke/fill.
- **Responsive**: Components are width-fluid by height-constrained. Place inside `ZnCard` or `ZnSection` for MD3 surface styling.

## Examples

See the Kitchensink demo at `/data/dashlets` for live examples of all component types with variant toggles and layout options.