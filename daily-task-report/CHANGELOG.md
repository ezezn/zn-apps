# Changelog

## [0.2.0] - 2026-11-20

### Español
#### Tipo de cambio: Nuevas funcionalidades
- **Resumen**: Historial de actualizaciones por tarea, reportes diarios con exportación a markdown y copia de seguridad completa de la base local.
- **Detalles**:
  - Historial de **actualizaciones** por tarea: página propia para crear, editar y eliminar entradas, y las más recientes visibles en la tarjeta de la tarea.
  - **Inicio** con calendario semanal y mensual: listas de trabajo actual, día laboral anterior y pendientes para la fecha seleccionada, con las actualizaciones de cada día.
  - **Días laborales** configurables por día de la semana en Configuración; el día anterior salta fines de semana y días no laborales.
  - Aviso sobre el estado del reporte de la fecha seleccionada, con acción para abrirlo desde Inicio.
  - **Reportes**: creación desde Inicio a partir de las listas de hoy y ayer, con cuatro secciones (qué hice ayer, en qué trabajo hoy, qué podría finalizar hoy y bloqueos), referencias a casos con comentario editable y comentarios simples. La página de reportes filtra por día o rango con campos de fecha, copia un reporte con fecha y hora nuevas y elimina con confirmación.
  - **Exportación de reportes** a markdown: selector de plantillas, vista previa, copiar al portapapeles y descarga `.md`. Plantillas editables en Configuración y la última usada se recuerda en el dispositivo.
  - **Estados externos** configurables, con etiquetas en inglés y español y un identificador oculto por estado.
  - Copia de seguridad JSON **v2** con tareas, actualizaciones y reportes, incluidos sus vínculos; la importación restaura todo en una transacción, evita duplicar actualizaciones y reportes y sigue aceptando archivos v1.
  - Tests para actualizaciones, reportes, días laborales, exportación de reportes, copia de seguridad y la nueva página de reportes.

### English
#### Change type: New features
- **Summary**: Per-task update log, daily reports with markdown export and a complete local-database backup.
- **Details**:
  - Per-task **update log**: dedicated page to create, edit and delete entries, with the latest ones shown on the task card.
  - **Home** with week and month calendars: current work, previous business day and pending lists for the selected date, with each day's updates.
  - **Business days** configurable per weekday in Settings; the previous day skips weekends and other non-working days.
  - Notice about the report status of the selected date, with an action to open it from Home.
  - **Reports**: created from Home using the today and yesterday lists, with four sections (what I did yesterday, what I am working on today, what I could finish today and blockers), case references with editable comments and plain notes. The Reports page filters by day or range with date fields, copies a report with a new timestamp and deletes with confirmation.
  - **Report export** to markdown: template selector, live preview, clipboard copy and `.md` download. Templates are editable in Settings and the last one used is remembered on the device.
  - Configurable **external statuses** with English/Spanish labels and a hidden identifier per status.
  - **v2 JSON backup** with tasks, updates and reports, including their links; import restores everything in one transaction, skips duplicate updates and reports and still accepts v1 files.
  - Tests for updates, reports, business days, report export, backup and the new Reports page.

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
