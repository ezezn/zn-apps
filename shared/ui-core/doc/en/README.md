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

**Containers and controls** — `ZnBox` (filled/elevated/outlined), `ZnRow` (flex: `padding`, `gap`, `align`, `justify`, `direction`, `wrap`), `ZnCard` (`title`, `variant`, `image`, `imageVariant` header/full), `ZnButton` (`variant` filled/tonal/elevated/outlined/text, `iconOnly`, `tag`), `ZnChip` (assist/filter/input/suggestion; `size` small 24px / medium 32px / large 40px; `selected`, `clickable`, `removable`), `ZnSwitch` (`labelLeft`/`labelRight`, `textOn`/`textOff`, icon slots).

**Inputs** — `ZnSingleLineText`, `ZnMultilineText`, `ZnEmailInput`, `ZnPhoneInput`, `ZnNumberInput`, `ZnDateInput`, `ZnTimeInput`, `ZnDateTimeInput`, `ZnSelect`, `ZnRangeInput`, `ZnDateRangeInput`, `ZnTimeRangeInput`, `ZnDateTimeRangeInput`. All share MD3 anatomy (floating label, notch, hint, error) with:

| Prop | Values |
|---|---|
| `variant` | `outlined` (default) · `filled` |
| `size` | `small` 48px · `medium` 56px (default) · `large` 64px |
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
