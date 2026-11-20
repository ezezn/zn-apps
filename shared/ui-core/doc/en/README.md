# @zn-apps/ui-core — user manual

Material Design 3 design system for every app in the monorepo: components, CSS tokens, composables, helpers and the icon chunk system.

- Package: `@zn-apps/ui-core` · Folder: `shared/ui-core/`
- Spanish: [Leer en español](../es/README.md)

## Install and use

```js
import '@zn-apps/ui-core/dist/ui-core.css'
import { ZnApp, ZnScreen, ZnSection, ZnCard, ZnButton } from '@zn-apps/ui-core'
```

Always import from the package barrel, never from a file path. Every app must be wrapped in `<ZnApp>`.

```vue
<ZnApp mode="system">
  <ZnScreen title="My app">
    <ZnSection title="Content">…</ZnSection>
  </ZnScreen>
</ZnApp>
```

## Theme

`ZnApp` is the only theme switch: `mode` = `system` (default), `light` or `dark`. It applies `zn-theme-light`/`zn-theme-dark` to `<body>` and follows the OS preference in `system` mode.

All colors and spacing come from `--md-*` tokens (defined in `src/assets/css/global.css`): `primary`, `on-primary`, `primary-container`, `background`, `on-background`, `surface`, `surface-container-low`, `surface-container-highest` (input fill), `surface-variant`, `on-surface-variant`, `outline`, `error`, `secondary-container`, `section-gap`… Each has light and dark values; use them instead of literal colors.

## Components

**Layout** — `ZnApp`, `ZnScreen` (`title`, `subtitle`, `menuLabel`; slots `#icon`, `#title`, `#actions`), `ZnScrollArea`, `ZnMasterSlaveLayout` (`viewKey`, `breakpoint`; slots `#master`, default), `ZnSection` (`title`, `collapsible`, `expanded`, `columns` 0–10, `.zn-span-N` children), `ZnTabs` (`tabs`, `modelValue`, `variant` primary/secondary; slot `#panel`), `ZnDrawer` (`modelValue`, `variant` modal/standard, `side` start/end, `width`, `label`, `closeButton`, `closeLabel`, `closeOnEscape`, `closeOnScrim`; slots `#header`, default).

On desktop `ZnMasterSlaveLayout` shows the navigation beside the content. On mobile it shows one pane at a time: if the app starts without a selected route, the navigation takes the screen first; if it starts on a page (content-first), the page keeps the focus and the header hamburger opens the navigation as a modal drawer. Apps do not implement this themselves.

The screen header uses one shared geometry in every panel, so the master and the content titles stay on the same line. Its measurements are CSS variables on `.zn-screen`: `--zn-screen-header-height` (72px), `--zn-screen-header-padding-inline` (24px), `--zn-screen-header-compact-height` (60px), `--zn-screen-header-compact-padding-inline` (16px) and `--zn-screen-content-padding` (24px); at ≤600px they become 64px/16px/64px/16px/16px. An embedding context (side pane, drawer, split view) overrides these variables on its own `.zn-screen` ancestor and must not redeclare the header's `height`, `min-height` or vertical padding. Keep the same title/subtitle shape in both panes: the header centers the heading block, so a subtitle adds a line and shifts the title.

**Window Controls Overlay** — an installed desktop PWA can merge the system window controls into the top app bar. Add `display_override: ['window-controls-overlay', 'standalone']` to the manifest (keep `display: 'standalone'` as the fallback) and keep `theme_color`/`background_color` at `#FEF7FF` to match the light `--md-background`. No component changes are needed: a `ZnScreen` outside a layout becomes the native title bar (its header uses `env(titlebar-area-x/y/width/height)`, the content starts below it and the actions shrink to 32px), while `ZnMasterSlaveLayout` reserves the native controls as padding and sets both pane headers to the titlebar height so their titles stay aligned. Headers and titles are draggable (`app-region: drag`); interactive elements are excluded automatically, and custom widgets can opt out with the `.zn-no-drag` class. Never draw your own minimize/maximize/close buttons. For a quick check, install the app and open Chrome/Edge DevTools → Application → Manifest → Window Controls Overlay.

**Containers and controls** — `ZnAlert` (`modelValue`, `variant` success/info/warning/error, `size` small/medium/large, `dismissible`, `dismissLabel`; default message slot, `#icon` and `#actions` slots; the X emits `update:modelValue` with `false` and `dismiss`), `ZnBox` (filled/elevated/outlined), `ZnRow` (flex: `padding`, `gap`, `align`, `justify`, `direction`, `wrap`), `ZnCard` (`title`, `variant`, `image`, `imageVariant` header/full), `ZnButton` (`variant` filled/tonal/elevated/outlined/text, `iconOnly`, `tag`), `ZnChip` (assist/filter/input/suggestion; `size` small 24px / medium 32px / large 40px; `selected`, `clickable`, `removable`), `ZnSwitch` (`labelLeft`/`labelRight`, `textOn`/`textOff`, icon slots).

Its `size` scale adjusts the padding, icon, close target, action button height and type (small for inline context banners, medium by default, large for prominent notices). `ZnAlert` is a persistent in-content message, not a snackbar: it stays in the layout, announces itself (`status` for success/info, `alert` for warning/error), can show an action button through `#actions` and can be dismissed with the X on the right when `dismissible` is true. Use it for contextual notices that belong to a page section; use a dialog or a transient overlay for actions that must interrupt.

**Inputs** — `ZnSingleLineText`, `ZnMultilineText`, `ZnEmailInput`, `ZnPhoneInput`, `ZnNumberInput`, `ZnDateInput`, `ZnTimeInput`, `ZnDateTimeInput`, `ZnSelect`, `ZnRangeInput`, `ZnDateRangeInput`, `ZnTimeRangeInput`, `ZnDateTimeRangeInput`. All share MD3 anatomy (floating label, notch, hint, error) with:

| Prop | Values |
|---|---|
| `variant` | `outlined` (default) · `filled` |
| `size` | `xsmall` 40px · `small` 48px · `medium` 56px (default) · `large` 64px |
| common | `label`, `hint`, `error`, `placeholder`, `disabled`, `readonly`, `required`, `floatLabel` |
| slots | `#leading`, `#trailing` |

- `label` is optional (add `aria-label`); `floatLabel` keeps it floating when empty.
- `ZnEmailInput` validates on blur and emits `update:valid`/`validation`; `ZnPhoneInput` sanitizes input and validates digit count (`minDigits` 6, `maxDigits` 15); `ZnNumberInput` emits `Number | null` and validates `min`/`max` on blur.
- `ZnSelect` supports `multiple` (MD3 chips), `maxVisibleItems`, teleports its menu (also inside dialogs) and is fully keyboard navigable.
- `ZnRangeInput` offers continuous, discrete (`showTicks`), centered and double-handle variants.
- Temporal ranges validate that the end is not before the start.

**Media** — `ZnIcon` (`name` snake_case, `family` filled/outlined/round/sharp/two-tone, `size`, `label`), `ZnImage`.

**Dialogs** — mount `ZnDialogHost` once, then `const { alert, confirm, prompt } = useDialogs()`.

## Composables and helpers

- `useOnlineStatus()` → `{ isOnline }`.
- `formatDate(date)` → readable date in Spanish.

## Icons

Add `<ZnIcon name="volume_up" />`, then run `npm run build:icons` and commit `icon-profile.json` plus `public/icons/*.svg`. `ZnIcon` downloads each family sprite once and caches it; production builds use the committed sprites.

## Demos and tests

Every component is demonstrated in Kitchensink (`/buttons`, `/inputs/*`, `/data/*`, `/icons`…). Tests: `npx vitest run --project ui-core`.
