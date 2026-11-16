# Changelog

## [0.1.0] - 2026-11-16

### Español
#### Tipo de cambio: Nueva aplicación
- **Resumen**: Primera versión de Daily Task Report, una PWA local para registrar y editar las tareas reportadas desde un sistema externo.
- **Detalles**:
  - Layout maestro-esclavo con navegación a Tareas, Configuración y Acerca de.
  - Listado de tareas en tarjetas colapsables con búsqueda por nombre o ID externo, filtro por estado y orden por nombre, fecha de la tarea o fecha de agregado.
  - Diálogo de creación y edición con los campos obligatorios validados; la fecha de agregado se completa con la fecha actual.
  - Datos guardados localmente con Dexie (IndexedDB) y estado por página en un store de Pinia.
  - Configuración de idioma, tema y nombres singular/plural de la entidad en inglés y español, para no exponer el vocabulario real del trabajo en el repositorio.
  - Exportación e importación de los datos locales en JSON desde Configuración; la importación valida el archivo, muestra una ventana de revisión con el resumen y el detalle a importar y fusiona por ID externo en una sola transacción.
  - Acción para borrar todos los datos locales con confirmación.
  - Tests de los helpers, del store de Pinia, de la tarjeta, del diálogo, del diálogo de importación y de las rutas.

### English
#### Change type: New application
- **Summary**: First release of Daily Task Report, a local PWA to track and edit the tasks reported from an external system.
- **Details**:
  - Master-slave layout with navigation to Tasks, Settings and About.
  - Collapsible task cards with search by name or external ID, status filter and sorting by name, task date or added date.
  - Create/edit dialog with validated required fields; the added date is prefilled with the current time.
  - Data stored locally with Dexie (IndexedDB) and page-scoped state in a Pinia store.
  - Language, theme and English/Spanish singular-plural entity naming, so the repository does not expose the real work vocabulary.
  - JSON export and import of the local data from Settings; import validates the file, shows a review window with the summary and the data to import, and merges by external ID in a single transaction.
  - Action to delete all local data with confirmation.
  - Tests for the helpers, the Pinia store, the card, the dialog, the import dialog and the routes.
