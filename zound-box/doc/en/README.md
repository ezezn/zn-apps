# Zound Box — user manual

Ambient audio mixer PWA: mix a continuous background soundscape with a rhythmic shh, offline and installable.

- Folder: `zound-box/` · Deploy path: `/zn-apps/zound-box/`
- Spanish: [Leer en español](../es/README.md)

## What it does

- **Background channel**: white noise, rain, wind, lullaby and similar soundscapes.
- **Shh channel**: rhythmic shushing sounds (×2, ×3, ×5).
- Master play/pause card, mute, and an "About" dialog with version and changelog.
- Fully offline through a service worker; installable as a PWA.

## Architecture

Single-screen utility PWA, built on:

| Decision | Why |
|---|---|
| `@zn-apps/ui-core` | `ZnApp`, `ZnScreen`, `ZnSection`, `ZnCard`, `ZnButton`, `ZnSwitch`, `ZnIcon`, `ZnDialog` |
| `@zn-apps/ui-about` | About dialog with `package.json` metadata |
| No `vue-router` | one screen; a router would only add weight |
| No Pinia | local `ref()` state in `App.vue` |
| Local card visuals | `SoundToggle.vue` darkens and grayscales idle sounds (brightness/grayscale filter) and restores full color when active |
| Vue I18n | English and Spanish, locale from settings → system → English |

## Domain model

`src/data/sound-channels.json` describes channels and tracks:

- **SoundItem**: `id`, `label`, `description`, `cardType` (`imagen`/`icono`), `image?`, `icon?`, `audio`, `durationSeconds`, `fadeInEndSeconds`, `fadeOutStartSeconds`.
- **SoundChannel**: `id` (`background`/`shh`), `title`, `order`, `sounds[]`.
- **PlaybackState**: `isPlaying`, `isMuted`, `selectedSounds` (one per channel), `hasPlaybackError`.

Tracks with fade metadata play from the start and then loop the stable region between fade-in end and fade-out start; deselecting plays the final pass so the fade-out is audible. Tracks without metadata loop natively.

## Rules

1. Channels are independent: one background sound plus one shh sound can play together.
2. Only one sound per channel; selecting another replaces it.
3. Tapping the active sound deselects it and stops that channel.
4. Pause stops all channels but remembers selections; play resumes them, or starts the first default sound when nothing is selected.
5. Mute reduces volume to 10%, not zero.
6. Browsers block audio without user interaction: the player catches the failure and announces it through `aria-live`.

## Project structure

```
src/main.js                     bootstrap, i18n, PWA listeners
src/App.vue                     orchestrator: master state and layout
src/components/SoundChannelPlayer.vue   <audio> controller per channel
src/components/SoundToggle.vue          accessible sound card
src/data/sound-channels.json
src/assets/sounds/              .ogg + .jpg with attribution
```

## Development

```bash
npm run dev --workspace=zound-box
npm run test:zound-box
npm run build:zound-box
```

Tests cover the audio lifecycle, card states and the mixer integration.
