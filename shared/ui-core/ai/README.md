# @zn-apps/ui-core — AI context

Design system (MD3) for every app: `Zn*` components, `--md-*` tokens, composables, helpers, icon chunks.
Location: `shared/ui-core/`. Published as `dist/ui-core.js` + `dist/ui-core.css`; apps consume `"@zn-apps/ui-core": "*"`.

## Rules

- Components live in `src/components/<group>/`, use the `Zn` prefix and MD3 tokens only.
- Import from the barrel `src/index.js` (exported name), never by file path.
- No `vue-router`, no Pinia, no app-specific logic inside the library.
- Any new or changed component, prop or state needs its spec in `src/components/__tests__/`.

## Groups (`src/components/`)

| Folder | Contents |
|---|---|
| `layout/` | `ZnApp`, `ZnScreen`, `ZnScrollArea`, `ZnMasterSlaveLayout`, `screenNavigation.js` |
| `navigation/` | `ZnTabs`, `ZnDrawer` |
| `containers/` | `ZnBox`, `ZnRow`, `ZnSection`, `ZnCard` |
| `controls/` | `ZnButton`, `ZnChip`, `ZnSwitch` |
| `input/` | `ZnSingleLineText`, `ZnMultilineText`, `ZnEmailInput`, `ZnPhoneInput`, `ZnNumberInput`, `ZnDateInput`, `ZnTimeInput`, `ZnDateTimeInput`, `ZnSelect`, `ZnRangeInput`, `ZnDateRangeInput`, `ZnTimeRangeInput`, `ZnDateTimeRangeInput`, plus `ZnFieldShell` (exported MD3 anatomy) and internal `ZnTemporalRange` |
| `dialogs/` | `ZnDialog`, `ZnDialogHost` |
| `media/` | `ZnIcon`, `ZnImage` |

## Theme & tokens

`ZnApp` is the only theme switch: `mode` = `system` (default) | `light` | `dark`; it writes `zn-theme-light`/`zn-theme-dark` on `<body>` and listens to `prefers-color-scheme` in system mode.

Key tokens (`src/assets/css/global.css`, `--md-*`, light / dark):

| Token | Light | Dark | Role |
|---|---|---|---|
| `primary` | `#6750A4` | `#D0BCFF` | main action |
| `on-primary` | `#FFFFFF` | `#381E72` | content on primary |
| `primary-container` | `#EADDFF` | `#4F378B` | emphasis container |
| `on-primary-container` | `#21005D` | `#EADDFF` | content on it |
| `background` | `#FEF7FF` | `#141218` | app background |
| `on-background` | `#1D1B20` | `#E6E1E5` | main text |
| `surface` | `#FEF7FF` | `#141218` | cards/screens |
| `surface-container-low` | `#F7F2FA` | `#1D1B20` | low elevation |
| `surface-container-highest` | `#E6E0E9` | `#36343B` | input fill |
| `surface-variant` | `#E7E0EC` | `#49454F` | card/switch idle |
| `on-surface-variant` | `#49454F` | `#CAC4D0` | secondary text/borders |
| `outline` | `#79747E` | `#938F99` | outlined borders |
| `error` | `#B3261E` | `#F2B8B5` | validation |
| `section-gap` | `24px` | `24px` | vertical section spacing |

Also available: `--md-secondary-container`, `--md-on-secondary-container` (selected chips/filters).

## Layout components

- **ZnApp** — root wrapper; prop `mode`; slot `default`.
- **ZnScreen** — view shell with dynamic header elevation on scroll. Props `title`, `subtitle`, `menuLabel` (`Abrir navegación`). Slots `#icon`, `#title`, `#actions`, default (scroll area). On mobile, when the slave content has focus inside `ZnMasterSlaveLayout`, the header renders the hamburger that opens the layout drawer; inside the master itself the layout hides it.
- **ZnScrollArea** — accessible scroll container. Prop `label`; slot `default`.
- **ZnMasterSlaveLayout** — responsive master/detail. Props `viewKey` (bind `$route.fullPath`), `breakpoint` (768). Slots `#master`, default. Desktop: both panes side by side (navigation acts as an MD3 standard drawer). Mobile: one pane at a time and the navigation is an MD3 **modal drawer**; the initial state depends on the pattern — navigation-first (`viewKey` null, or a default slot that has not rendered yet because the router is still resolving) shows the master full screen, content-first (`viewKey` set **and** content already rendered, or after a route change) shows the page and leaves the master behind the hamburger. Honors `prefers-reduced-motion`.
- **ZnDrawer** — MD3 navigation drawer. Props `modelValue`, `variant` (`modal` default | `standard`), `side` (`start` | `end`), `width` (360px), `label`, `closeButton` (true), `closeLabel`, `closeOnEscape`, `closeOnScrim`. Slots `#header`, default. `modal` adds a scrim, traps Tab focus, locks body scroll, closes on Escape/scrim and restores focus on close; `standard` is docked, without scrim or focus trap. Events `update:modelValue`, `open`, `close`.
- **ZnSection** — grouped content, optional collapse + grid. Props `title`, `collapsible`, `expanded` (true), `columns` (0 → off, 1..10). Slot `default`; children can use `.zn-span-2`..`.zn-span-10`. Event `toggle(isOpen)`.
- **ZnTabs** — MD3 tabs. Props `tabs` (`{value,label,content?,icon?,badge?,disabled?}[]`), `modelValue`, `variant` (`primary`|`secondary`). Slot `#panel` (`{tab,index}`).

## Master-slave navigation contract

`ZnMasterSlaveLayout` provides `screenNavigationKey` (`isMobile`, `isSlaveVisible`, `isDrawerOpen`, `openDrawer`, `closeDrawer`, `goBack`); `ZnScreen` consumes it. Apps only bind `viewKey` and provide `#master` + default slots — they never wire the drawer, the hamburger or the breakpoint themselves. Mount the app after `router.isReady()` so the first mobile paint already has the page instead of an empty slot. `isMobile` is resolved in `setup` from `matchMedia`, so the first render already carries `zn-master-slave-layout--mobile`; there is no `@media` fallback, and the content pane is never hidden by CSS.

| Context | Desktop | Mobile navigation-first (`viewKey` null at mount, or empty default slot) | Mobile content-first (`viewKey` set and content rendered) |
|---|---|---|---|
| Master | sticky side column | full screen until a route exists | modal drawer, closed |
| Slave | beside the master | off-screen until a route exists | full screen |
| Header | no navigation button | — | hamburger → drawer |

## Containers & controls

- **ZnBox** — neutral container, variants `filled`|`elevated`|`outlined`.
- **ZnRow** — flexbox container. Props `padding` (`16px`), `gap` (`12px`), `align`, `justify`, `direction` (`row`|`column`), `wrap`. Use it instead of duplicating `display: flex`.
- **ZnCard** — `title`, `variant` (`filled`|`elevated`|`outlined`), `image`, `imageVariant` (`header` scrim | `full`). Slots `#title`, default.
- **ZnButton** — `variant` (`filled`|`tonal`|`elevated`|`outlined`|`text`), `disabled`, `iconOnly` (40×40 circular), `tag` (`button`|`a`). Slots `#icon`, default.
- **ZnChip** — `variant` (`assist`|`filter`|`input`|`suggestion`), `size` (`small` 24px | `medium` 32px | `large` 40px), `label`, `selected`, `disabled`, `elevated`, `clickable` (keyboard accessible; `filter` → `role="checkbox"` + `aria-checked`), `removable` + `removeLabel`. Slots `#icon` (18px), default. Events `click`, `remove`. Geometry: 32dp height, 8dp radius. `ZnSelect multiple` reuses it with the field's `size` (48/24, 56/32, 64/40).
- **ZnSwitch** — `modelValue`, `labelLeft`/`labelRight`, `textOn`/`textOff`, `disabled`; slots `#labelLeft`, `#labelRight`, `#iconOn`, `#iconOff`; events `update:modelValue`, `change`.

## Inputs

`ZnFieldShell` renders the shared anatomy (notched outline, floating label, hint, error). Common props: `modelValue`, `label`, `hint`, `error`, `placeholder`, `name`, `disabled`, `readonly`, `required`, `floatLabel`, `variant`, `size`. Slots `#leading`, `#trailing`. Native attributes and listeners are forwarded to the real `<input>`/`<textarea>`.

- `variant`: `outlined` (default, notched contour) | `filled` (tonal container + 1px indicator, 2px on focus/error). Also accepted by the three temporal ranges.
- `size`: `small` 48px | `medium` 56px (default) | `large` 64px. MD3 56dp standard, 4dp density steps (`small` = density −2). Applies identically in both variants, with/without icons, and in `ZnSelect`/email/phone/number/temporal fields.
- `label` optional: without it there is no notch and the placeholder stays visible — add `aria-label`.
- `floatLabel` keeps the label above the contour when empty; temporal fields force it (native controls show `dd/mm/aaaa`, `--:--`).
- Field fill uses `--md-surface-container-highest`; the outline is border-only so the editable area differs from the card surface in both themes.
- With `#leading`, the resting label shifts 44px to clear the icon.
- The outline is drawn with three panels (start border, auto-width notch, end border) instead of `fieldset`/`legend`, so the border matches the container in every browser.

| Component | Extra props | Events |
|---|---|---|
| `ZnSingleLineText` | `type`, `maxlength`, `autocomplete` | `update:modelValue`, `enter`, `focus`, `blur` |
| `ZnMultilineText` | `rows` (4), `maxlength` | `update:modelValue`, `focus`, `blur` |
| `ZnEmailInput` | `validate` (true), `invalidMessage`, `autocomplete` (`email`) | `update:modelValue`, `update:valid`, `validation(Boolean)` |
| `ZnPhoneInput` | `minDigits` (6), `maxDigits` (15), `validate`, `invalidMessage` | sanitized `update:modelValue`, `update:valid`, `validation` |
| `ZnNumberInput` | `min`, `max`, `step` (`'any'`), `validate`, `invalidMessage` | `update:modelValue` → `Number \| null`, `update:valid`, `validation` |
| `ZnDateInput`/`ZnTimeInput`/`ZnDateTimeInput` | `min`, `max`, `step` (time, datetime) | `update:modelValue`, `change`, `focus`, `blur` |
| `ZnSelect` | `options`, `multiple`, `maxVisibleItems` (6), label/hint/error/placeholder/disabled/required/variant | `update:modelValue`, `change`, `open`, `close` |
| `ZnRangeInput` | `modelValue` (number or `[start,end]`), `min`, `max`, `step`, `showValue`, `valueFormat`, `showTicks`, `centered` | `update:modelValue`, `change` |
| `ZnDateRangeInput`/`ZnTimeRangeInput`/`ZnDateTimeRangeInput` | `modelValue` `[start,end]`, `startLabel`, `endLabel`, `startName`, `endName`, `min`, `max`, `step`, `hint`, `error`, `invalidMessage`, `disabled`, `required` | `update:modelValue`, `change`, `focus`, `blur` |

Notes:
- `ZnNumberInput` wraps `ZnSingleLineText` (`type="number"`, `inputmode="decimal"`), keeps internal text for intermediate states (`1.`), and validates `min`/`max` on blur.
- `ZnSelect` renders the menu in a `Teleport` with fixed positioning; inside a `<dialog>` it teleports into the dialog (a modal would cover a `<body>` menu) and closes with it. Keyboard: arrows, Home/End, Enter/Space, Escape.
- `ZnRangeInput` variants: continuous, discrete (`showTicks`, max 50 marks), centered, range; double values never cross.
- Temporal ranges share `ZnTemporalRange`: cross limits (`max` start = end, `min` end = start) and an error when end < start.

## Icons

`ZnIcon` props: `name` (snake_case), `family` (`filled`|`outlined`|`round`|`sharp`|`two-tone`), `size` (24), `label` (otherwise `aria-hidden`). Renders `<use>` against `<BASE_URL>icons/sprite-<family>.svg`; `loadIconFamily()` fetches a family once into `#zn-icon-sprite-host`.

Pipeline: `scan:icons` → `icon-profile.json` (`scanned` + preserved `manual`) → `generate:icons` → `public/icons/` → precached by Workbox. See [`../../../ai/workflow.md`](../../../ai/workflow.md).

## Dialogs

Mount `ZnDialogHost` once per app, then:

```js
import { useDialogs } from '@zn-apps/ui-core'
const { alert, confirm, prompt } = useDialogs()
await alert('Saved.')
const ok = await confirm('Restart the session?')
const name = await prompt('Your name:', { required: true }) // string | null
```

## Composables & helpers

- `useOnlineStatus()` → `{ isOnline }`.
- `formatDate(date)` → Spanish readable date (`"28 de octubre de 2026"`).

## Tests

```bash
npx vitest run --project ui-core
```

Specs in `src/components/__tests__/` (plus `composables/__tests__`, `utils/__tests__`).
