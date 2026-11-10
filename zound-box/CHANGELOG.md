# Changelog

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
