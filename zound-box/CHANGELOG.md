# Changelog

## [0.1.1] - 2026-11-12

### Español
#### Tipo de cambio: Bugfixing
- **Resumen**: Se corrigió la integración PWA: los popups de instalación y actualización ya se muestran correctamente y la barra de navegación del sistema deja de verse azul.
- **Detalles**:
  - **Barras del sistema**: `theme_color` y `background_color` del manifiesto ahora usan el color del esquema claro de Material Design 3 (`#FEF7FF`) en lugar del azul `#2563eb`, y `index.html` declara `<meta name="theme-color">` para que la barra inferior de Android no aparezca azul durante el arranque.
  - **Sincronización automática del tema**: `initPwaThemeSync()` en `src/main.js` actualiza la barra superior y la barra inferior del sistema (y el fondo de overscroll) cada vez que cambia el tema claro/oscuro, en lugar de aplicar los colores solo al montar.
  - **Popups PWA**: `@zn-apps/pwa-integration` se resuelve al código fuente en `vite.config.js`; antes se consumía el build de `dist/`, cuyo CSS no se importaba, y los popups aparecían sin estilos al final del documento (fuera del viewport y alargando el scroll).
  - **Actualización de la PWA instalada**: se detecta un service worker en espera al arrancar, se buscan versiones nuevas periódicamente y al volver a primer plano, y al aceptar la actualización se aplica `SKIP_WAITING` y se recarga una sola vez.
  - **Iconos e i18n**: se añadieron los iconos `download` y `system_update` al chunk de la app y las claves `pwa.*` en inglés y español.

### English
#### Change type: Bugfixing
- **Summary**: Fixed the PWA integration: the install/update popups now render correctly and the Android system navigation bar is no longer blue.
- **Details**:
  - **System bars**: manifest `theme_color` and `background_color` now use the Material Design 3 light background (`#FEF7FF`) instead of the `#2563eb` blue, and `index.html` declares `<meta name="theme-color">` so the Android bottom bar is not blue while the app boots.
  - **Automatic theme sync**: `initPwaThemeSync()` in `src/main.js` updates the status bar, the system navigation bar and the overscroll background whenever the light/dark theme changes, instead of applying colors only once on mount.
  - **PWA popups**: `@zn-apps/pwa-integration` is resolved to source in `vite.config.js`; consuming the `dist/` build skipped its CSS, so the popups rendered unstyled at the end of the document (outside the viewport and lengthening the page scroll).
  - **Installed PWA updates**: a waiting service worker is detected on startup, new versions are polled periodically and when the app returns to the foreground, and accepting the update sends `SKIP_WAITING` and reloads exactly once.
  - **Icons and i18n**: added the `download` and `system_update` icons to the app chunk and the `pwa.*` keys in English and Spanish.

## [0.1.0] - 2026-11-10

### Español
#### Tipo de cambio: Nueva feature
- **Resumen**: Panel modal de configuración (`ZnDialog`) con persistencia en Web Storage para opciones de idioma, audio y tema, además de restauración de sonidos activos.
- **Detalles**:
  - **Sección Idioma**: Switch para seguir el idioma del sistema y selector desplegable de idioma manual (Español / Inglés).
  - **Sección Audio**: Opciones para iniciar la aplicación con volumen atenuado al 10% y recordar la combinación de sonidos seleccionados.
  - **Sección Esquema de colores**: Traslado de la selección de tema desde el header hacia el diálogo; opción de seguir el tema del sistema operativo o fijar un modo claro/oscuro personalizado.
  - **Alineación visual**: Switches con etiquetas posicionadas a la izquierda.
  - **Persistencia de sonidos**: Almacenamiento continuo del estado de canales en las settings de la aplicación y restauración automática al iniciar.

### English
#### Change type: New feature
- **Summary**: Settings modal dialog (`ZnDialog`) with Web Storage persistence for language, audio, and color scheme preferences, plus sound selection restoration.
- **Details**:
  - **Language section**: Toggle to follow the system language and a dropdown selector for manual language choice (Spanish / English).
  - **Audio section**: Options to launch the application with volume reduced to 10% and remember the selected sound combination.
  - **Color scheme section**: Moved theme toggles from the top header into the settings dialog; supports following the OS color scheme or setting a custom light/dark mode.
  - **Visual layout**: All setting switches display their labels on the left side.
  - **Sound persistence**: Continuous storage of active channel sounds in application settings and automatic restoration upon startup.
