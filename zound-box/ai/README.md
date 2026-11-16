# Zound Box — AI context

Ambient audio mixer PWA: two independent looping channels (background soundscapes + rhythmic shh), offline capable, installable. Single screen, no router.
Location: `zound-box/`, base `/zn-apps/zound-box/`.

## Architecture decisions

| Decision | State | Reason |
|---|---|---|
| Component library | `@zn-apps/ui-core` | `ZnApp`, `ZnScreen`, `ZnSection`, `ZnCard`, `ZnButton`, `ZnSwitch`, `ZnIcon`, `ZnDialog` |
| About panel | `@zn-apps/ui-about` | `ZnAbout` with `package.json` metadata inside a `ZnDialog` |
| `vue-router` | **omitted** | single-screen audio console; router would add bundle weight |
| Pinia | **omitted** | local `ref()` state in `App.vue` |
| Card visuals | **local override** | `SoundToggle.vue` applies `filter: grayscale(100%) brightness(0.6)` when idle and full color when active |
| i18n | implemented | Vue I18n `en`/`es`, locale from `settings.i18n.locale` (namespace `zound-box`) → system base → `en` |

## Domain DTOs (`src/data/sound-channels.json`)

```ts
interface SoundItem {
  id: string; label: string; description: string
  cardType: 'imagen' | 'icono'
  image?: string          // src/assets/sounds/*.jpg
  icon?: string           // Material glyph when there is no image
  audio: string           // src/assets/sounds/*.ogg
  durationSeconds: number
  fadeInEndSeconds: number    // end of fade-in
  fadeOutStartSeconds: number // start of fade-out
}

interface SoundChannel {
  id: string      // 'background' | 'shh'
  title: string
  order: number
  sounds: SoundItem[]
}

interface PlaybackState {
  isPlaying: boolean
  isMuted: boolean
  selectedSounds: Record<string, string | null> // channelId -> soundId
  hasPlaybackError: boolean
}
```

Items with fade metadata play from 0 and then loop the stable region between `fadeInEndSeconds` and `fadeOutStartSeconds`; deselecting plays one last pass from `fadeOutStartSeconds` to the end. Items without metadata use native full loops.

## Business rules

1. Channels are orthogonal: one background sound + one shh sound can play together.
2. One sound per channel: selecting another replaces it.
3. Tapping the active sound deselects it and stops the channel.
4. Master play/pause: pause stops all channels but keeps selections; play resumes them, or starts the first default sound when nothing is selected.
5. Mute attenuates to **10%** of volume, not 0.
6. Browsers block `play()` without user interaction: `SoundChannelPlayer` catches the rejected promise and emits `@error`, surfaced with `aria-live="polite"`.

## Structure

```
src/main.js            # Vue bootstrap, i18n, PWA listeners + theme sync
src/App.vue            # orchestrator: master reactive state, layout
src/components/SoundChannelPlayer.vue   # autonomous <audio> controller per channel
src/components/SoundToggle.vue          # accessible interactive card (ZnCard + ARIA)
src/data/sound-channels.json
src/assets/sounds/     # .ogg + .jpg with attribution
```

## Tests

`SoundChannelPlayer.spec.js` (audio lifecycle, play/pause/stop, `source` changes), `SoundToggle.spec.js` (click emission, MD3 variant by selection, `aria-pressed`), `App.spec.js` (mixer integration, theme toggle, About dialog) → `npm run test:zound-box`.
