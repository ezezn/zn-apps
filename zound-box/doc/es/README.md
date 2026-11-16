# Zound Box — manual de usuario

PWA mezcladora de audio ambiental: combina un paisaje sonoro continuo con un seseo rítmico, offline e instalable.

- Carpeta: `zound-box/` · Ruta de despliegue: `/zn-apps/zound-box/`
- English: [Read in English](../en/README.md)

## Qué hace

- **Canal de fondo**: ruido blanco, lluvia, viento, canción de cuna y paisajes similares.
- **Canal de seseo**: sonidos rítmicos de seseo (×2, ×3, ×5).
- Tarjeta maestra de play/pausa, mute y diálogo "Acerca de" con versión y changelog.
- Funcionamiento offline completo mediante service worker; instalable como PWA.

## Arquitectura

PWA utilitaria mono-pantalla, construida sobre:

| Decisión | Motivo |
|---|---|
| `@zn-apps/ui-core` | `ZnApp`, `ZnScreen`, `ZnSection`, `ZnCard`, `ZnButton`, `ZnSwitch`, `ZnIcon`, `ZnDialog` |
| `@zn-apps/ui-about` | Diálogo Acerca de con metadatos de `package.json` |
| Sin `vue-router` | una sola pantalla; un router sólo agregaría peso |
| Sin Pinia | estado local con `ref()` en `App.vue` |
| Visuales de tarjeta locales | `SoundToggle.vue` oscurece y pone en escala de grises los sonidos inactivos y recupera el color al activarse |
| Vue I18n | inglés y español, locale desde settings → sistema → inglés |

## Modelo de dominio

`src/data/sound-channels.json` describe canales y pistas:

- **SoundItem**: `id`, `label`, `description`, `cardType` (`imagen`/`icono`), `image?`, `icon?`, `audio`, `durationSeconds`, `fadeInEndSeconds`, `fadeOutStartSeconds`.
- **SoundChannel**: `id` (`background`/`shh`), `title`, `order`, `sounds[]`.
- **PlaybackState**: `isPlaying`, `isMuted`, `selectedSounds` (uno por canal), `hasPlaybackError`.

Las pistas con metadatos de fade reproducen desde el inicio y luego repiten la región estable entre el fin del fade-in y el inicio del fade-out; al deseleccionar se reproduce el tramo final para que el fade-out se escuche. Las pistas sin metadatos usan el loop nativo.

## Reglas

1. Los canales son independientes: un sonido de fondo y uno de seseo pueden sonar a la vez.
2. Sólo un sonido por canal; al elegir otro se reemplaza.
3. Tocar el sonido activo lo deselecciona y detiene ese canal.
4. Pausa detiene todos los canales pero recuerda las selecciones; play las reanuda, o inicia el primer sonido por defecto si no hay selección.
5. Mute baja el volumen al 10%, no a cero.
6. El navegador bloquea audio sin interacción: el reproductor captura el fallo y lo anuncia con `aria-live`.

## Estructura del proyecto

```
src/main.js                     bootstrap, i18n, listeners PWA
src/App.vue                     orquestador: estado maestro y layout
src/components/SoundChannelPlayer.vue   controlador <audio> por canal
src/components/SoundToggle.vue          tarjeta de sonido accesible
src/data/sound-channels.json
src/assets/sounds/              .ogg + .jpg con atribución
```

## Desarrollo

```bash
npm run dev --workspace=zound-box
npm run test:zound-box
npm run build:zound-box
```

Los tests cubren el ciclo de vida del audio, los estados de la tarjeta y la integración del mezclador.
