# Daily Task Report — manual de usuario

PWA para mantener una lista local de las tareas reportadas desde un sistema externo de trabajo: buscarlas, filtrarlas, ordenarlas, crearlas, editarlas y eliminarlas, sin conexión y con instalación.

- Carpeta: `daily-task-report/` · Ruta de despliegue: `/zn-apps/daily-task-report/`
- English: [Read in English](../en/README.md)

## Qué hace

- **Layout maestro-esclavo**: el panel de navegación a la izquierda y la página activa a la derecha. La entrada principal (la lista de tareas) queda arriba y las opciones secundarias (Configuración, Acerca de) se anclan al pie del panel. En móvil la página ocupa la pantalla y el botón hamburguesa de su header abre la navegación en un drawer.
- **Lista de tareas** con tarjetas: la tarjeta colapsada muestra el nombre, el ID externo, el estado interno y el estado en la app externa. El nombre es un enlace que abre la tarea en la app externa en una pestaña nueva (cuando la tarea tiene enlace externo), y el control «Mostrar detalles» comparte la fila de los estados, alineado a la derecha. Al descolapsarla aparecen la descripción, las fechas y un botón para abrir el enlace externo.
- **Historial de actualizaciones**: cada tarea puede acumular actualizaciones — qué cambió y la fecha y hora en que se estableció. La sección **Actualizaciones** las lista todas, de la más reciente a la más antigua, con acciones de editar y eliminar; la tarjeta extendida muestra las actualizaciones de esa tarea, también de la más reciente a la más antigua, cada una con su acción de editar.
- **Filtros** en la parte superior: búsqueda por nombre o ID externo y filtro por estado interno.
- **Orden** por nombre, fecha de la tarea o fecha de agregado, ascendente o descendente.
- **Diálogo de creación y edición** con todos los campos de la entidad; **eliminación** con confirmación.
- **Configuración**: idioma, esquema de colores y los nombres de la entidad que se explican abajo.
- **Acerca de** con versión, créditos y changelog.

Todos los datos quedan en el navegador (IndexedDB). No hay cuenta, servidor ni sincronización.

## La entidad

En el código las entidades se llaman **Tasks**. En Configuración puedes cambiar cómo se muestran, en inglés y español, en singular y plural. Así el repositorio público no expone el vocabulario real del trabajo mientras la interfaz habla el idioma del equipo.

| Campo | Obligatorio | Notas |
|---|---|---|
| ID externo | sí | Identificador en el sistema externo |
| Nombre | sí | Título principal de la tarjeta |
| Descripción | no | Texto libre, visible al descolapsar la tarjeta |
| Fecha de la tarea | no | Fecha a la que pertenece la tarea en el sistema externo |
| Fecha de agregado | sí | Se completa con la fecha y hora actuales al crear; es editable |
| Enlace externo | no | Se agrega `https://` si falta el esquema |
| Estado interno | sí | Activa o Inactiva (por defecto: Activa) |
| Estado externo | no | Etiqueta de estado copiada de la app externa. Configurable en Configuración → Datos → Estados externos |

## Uso

1. **Crear**: botón del encabezado de la página. Los campos obligatorios se validan antes de guardar.
2. **Editar**: el icono de lápiz de la tarjeta abre el mismo diálogo con los valores actuales.
3. **Eliminar**: el icono de papelera pide confirmación y después borra el registro de forma permanente.
4. **Consultar**: el control «Mostrar detalles» (al final de la fila de estados) despliega el resto de la información sin salir de la lista. El nombre de la tarea abre el enlace externo en una pestaña nueva.
5. **Filtrar y ordenar**: la búsqueda y los dos selectores conservan su estado mientras navegas por la app.
6. **Registrar una actualización**: abre **Actualizaciones** en la navegación, elige la tarea, describe qué cambió y confirma la fecha y hora (se completan con el momento actual). Puedes editar cualquier entrada desde la sección o desde la tarjeta de la tarea, y eliminarla desde la sección.
7. **Consultar el historial**: extiende la tarjeta de una tarea para ver sus actualizaciones de la más reciente a la más antigua.

## Configuración

| Sección | Opciones |
|---|---|
| Idioma | Seguir el idioma del sistema o forzar inglés/español |
| Esquema de colores | Seguir al sistema o forzar claro/oscuro |
| Nombres de las entidades | Singular y plural en inglés y español; la vista previa usa el idioma activo |
| Datos | Exportar una copia JSON, fusionar una por ID externo o borrar todos los datos locales |

Si vacías el singular o el plural, se restaura el valor por defecto de ese idioma (`Task/Tasks`, `Tarea/Tareas`).

## Copia de seguridad

La sección **Datos** de Configuración tiene tres acciones:

- **Exportar JSON** descarga `daily-task-report-AAAA-MM-DD.json` con todas las tareas y sus campos (sin los ids internos). El historial de actualizaciones todavía no forma parte de la copia, así que una importación no lo restaura.
- **Importar JSON** lee un archivo creado por esta app y abre una ventana de revisión antes de cambiar nada. Muestra cuántas entradas se agregarán, actualizarán o quedarán sin cambios y lista los datos con su estado. Al confirmar, la importación **fusiona por ID externo**: una entrada con el mismo ID externo actualiza la existente (los valores importados tienen prioridad) y el resto se agrega como nueva.
- **Borrar todos los datos** pide confirmación con el número de entradas locales y después las elimina de forma permanente.

La importación y el borrado son atómicos: se ejecutan en una sola transacción de la base, rechazan archivos de otras apps o con estructura inválida y no tocan los datos actuales si cancelas la ventana de revisión. Cancelar la confirmación deja todo como estaba.

## Datos y privacidad

- Las tareas se guardan en **IndexedDB** (Dexie) en el navegador del dispositivo: nunca en `localStorage` ni en un servidor.
- La configuración (idioma, tema, nombres) se guarda aparte con `settings-core`.
- Al borrar los datos del sitio de la app se eliminan las tareas; exporta una copia antes si quieres conservarlas.

## Estructura del proyecto

```
src/main.js                  arranque: Pinia, router, i18n, listeners PWA
src/App.vue                  layout maestro-esclavo, navegación, popups PWA
src/router/index.js          /tasks, /settings, /about
src/views/TasksPage.vue      filtros, orden, lista y diálogo
src/views/UpdatesPage.vue    historial: más reciente primero, editar y eliminar
src/views/SettingsPage.vue   idioma, tema y nombres de la entidad
src/views/AboutPage.vue      panel ZnAbout
src/components/TaskCard.vue  tarjeta colapsable con acciones de editar/eliminar
src/components/TaskDialog.vue diálogo de creación/edición (ZnDataForm)
src/components/UpdateDialog.vue diálogo de creación/edición de una actualización
src/stores/tasks.js          store de Pinia de la lista de tareas
src/stores/updates.js        store de Pinia del historial
src/db/                      base Dexie y repositorios de tareas y actualizaciones
src/helpers/                 DTO, validación, filtros, orden y fechas
src/data/task-schema.js      esquemas ui-data para formulario y vista
```

## Desarrollo

```bash
npm run dev --workspace=daily-task-report
npm run test:daily-task-report
npm run build:daily-task-report
```
