# App: Zound Box — Documentación de Proyecto

> Ubicación: `zound-box/`  
> Base path: `/zn-apps/zound-box/`  
> Responsabilidad: PWA de reproducción y mezcla de audio ambiental para descanso, enfoque y relajación infantil.

---

## 1. Visión General del Proyecto

**Zound Box** es la primera aplicación productiva del monorepo `zn-apps`. Permite reproducir y combinar dos canales independientes de audio en bucle:
1. **Canal de Fondo (Background)**: Paisajes sonoros relajantes continuos (ruido blanco, lluvia, viento, canción de cuna).
2. **Canal de Seseo (Shh)**: Sonidos rítmicos de seseo para calmar bebés (×2, ×3, ×5 repeticiones).

Cuenta con soporte offline completo mediante Service Worker (PWA instalable), tarjeta de control maestro de reproducción y diálogo informativo "Acerca de".

---

## 2. Arquitectura y Decisiones de Override

| Decisión Arquitectónica | Estado en Zound Box | Justificación / Razón de Override |
|---|---|---|
| **Librería de Componentes** | Hereda `@zn-apps/ui-core` | Consume `ZnApp`, `ZnScreen`, `ZnSection`, `ZnCard`, `ZnButton`, `ZnSwitch`, `ZnIcon` y `ZnDialog`. |
| **Panel Acerca de** | Hereda `@zn-apps/ui-about` | Muestra `ZnAbout` con metadatos extraídos de `package.json` dentro de un `ZnDialog`. |
| **Routing (`vue-router`)** | **Omitido (Override)** | La aplicación es una consola de audio mono-pantalla. Agregar router sumaría peso innecesario al bundle sin aportar valor navegacional. |
| **Gestión de Estado (Pinia)** | **Omitido (Override)** | Se utiliza Composition API local con `ref()` en `App.vue`. No hay múltiples vistas que compartan estado y se evita cualquier riesgo de acoplamiento cross-app. |
| **Estilos Visuales de Tarjeta** | **Override Local** | `SoundToggle.vue` encapsula un efecto visual personalizado: en estado inactivo las imágenes se muestran oscurecidas y en escala de grises (`filter: grayscale(100%) brightness(0.6)`), recuperando color pleno al activarse. |

### Internacionalización — implementación completada

Zound Box integra Vue I18n con mensajes en inglés y español. El locale inicial se obtiene de `settings.i18n.locale` dentro del namespace `zound-box`; si no existe un valor válido, usa el idioma base del sistema y finalmente inglés. Las cadenas de la pantalla principal, reproducción, canales, sonidos y diálogo Acerca de ya están traducidas.

---

## 3. Modelo de Dominio y DTOs

Estructura de datos definida en `src/data/sound-channels.json`:

### `SoundItem`
```typescript
interface SoundItem {
  id: string                     // Identificador único (ej. "white-noise", "rain")
  label: string                  // Nombre legible
  description: string            // Descripción concisa para accesibilidad
  cardType: 'imagen' | 'icono'   // Estilo de tarjeta
  image?: string                 // Archivo en src/assets/sounds/ (ej. "rain.jpg")
  icon?: string                  // Glifo Material para cards sin imagen
  audio: string                  // Archivo de audio en src/assets/sounds/ (ej. "rain.ogg")
  durationSeconds: number        // Duración total del audio
  fadeInEndSeconds: number       // Marca de tiempo donde finaliza la entrada suave
  fadeOutStartSeconds: number    // Marca de tiempo donde inicia la salida suave
}
```

En los sonidos con ambos tiempos, `SoundChannelPlayer` reproduce inicialmente desde cero y luego repite el tramo estable entre `fadeInEndSeconds` y `fadeOutStartSeconds`. Al deseleccionar el sonido, reproduce una última vez desde `fadeOutStartSeconds` hasta el final para que se oiga el fadeout. Los sonidos sin esos metadatos usan el loop nativo completo.

### `SoundChannel`
```typescript
interface SoundChannel {
  id: string                     // Identificador de canal ("background" | "shh")
  title: string                  // Título de la sección
  order: number                  // Orden de despliegue en UI
  sounds: SoundItem[]            // Lista de sonidos disponibles en este canal
}
```

### `PlaybackState` (Estado reactivo de la aplicación)
```typescript
interface PlaybackState {
  isPlaying: boolean             // Estado maestro de reproducción (play/pausa)
  isMuted: boolean               // Atenuación de volumen activa (10% vs 100%)
  selectedSounds: Record<string, string | null> // Sonido activo por channelId
  hasPlaybackError: boolean      // Bandera de error al cargar o reproducir audio
}
```

---

## 4. Reglas de Negocio

1. **Concurrencia entre Canales**: Los canales de sonido son ortogonales e independientes. El usuario puede reproducir simultáneamente un sonido de fondo (ej. lluvia) junto a un sonido de seseo (ej. ×3).
2. **Exclusividad Intra-Canal**: Dentro de un mismo canal, solo puede haber un sonido seleccionado a la vez. Si el usuario presiona otro sonido del mismo canal, el anterior se desactiva.
3. **Toggle de Desactivación**: Si el usuario pulsa sobre el sonido actualmente activo en un canal, dicho sonido se deselecciona y el canal se detiene.
4. **Comportamiento del Botón Maestro Play/Pause**:
   - Al pausar: Detiene temporalmente todos los canales activos sin olvidar qué sonido estaba seleccionado.
   - Al reproducir: Si hay sonidos seleccionados, reanuda la reproducción. Si no hay ningún sonido seleccionado, activa el primer sonido por defecto del canal principal.
5. **Atenuación vs Silenciado Total**: El botón de "mute" atenúa el volumen al **10%** en vez de 0%. Esto permite que los sonidos de fondo sigan acompañando sutilmente sin interrumpir abruptamente el ambiente sonoro.
6. **Políticas de Audio del Navegador**: El navegador bloquea `play()` sin interacción previa del usuario. `SoundChannelPlayer` captura cualquier rechazo de promesa y emite un evento `@error` para informar en la interfaz con accesibilidad en vivo (`aria-live="polite"`).

---

## 5. Arquitectura de Componentes

```
zound-box/src/
├── main.js                   # Inicialización de Vue y montaje
├── App.vue                   # Vista orquestadora, estado reactivo maestro y layout
├── components/
│   ├── SoundChannelPlayer.vue# Controlador autónomo de la etiqueta <audio> por canal
│   └── SoundToggle.vue       # Tarjeta accesible interactiva (ZnCard + accesibilidad ARIA)
├── data/
│   └── sound-channels.json   # Definición declarativa de canales y pistas
└── assets/sounds/            # Archivos .ogg y .jpg locales con atribuciones
```

---

## 6. Testing

La suite de pruebas de Zound Box valida:
- `SoundChannelPlayer.spec.js`: ciclo de vida de audio HTML5, eventos de play/pause/stop y cambios reactivos de `source`.
- `SoundToggle.spec.js`: emisiones de click, variantes MD3 según selección y atributos ARIA (`aria-pressed`).
- `App.spec.js`: integración completa del mezclador, alternancia de temas y diálogo "Acerca de".

Ejecutar tests:
```bash
npm run test:zound-box
```
