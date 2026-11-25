# Daily Task Report — manual de usuario

PWA para mantener una lista local de las tareas reportadas desde un sistema externo de trabajo: buscarlas, filtrarlas, ordenarlas, crearlas, editarlas y eliminarlas, sin conexión y con instalación.

- Carpeta: `daily-task-report/` · Ruta de despliegue: `/zn-apps/daily-task-report/`
- English: [Read in English](../en/README.md)

## Qué hace

- **Layout maestro-esclavo**: el panel de navegación a la izquierda y la página activa a la derecha. La entrada principal (la lista de tareas) queda arriba y las opciones secundarias (Configuración, Acerca de) se anclan al pie del panel. En móvil la página ocupa la pantalla y el botón hamburguesa de su header abre la navegación en un drawer.
- **Inicio** (la página principal): un calendario que abre en la **vista de semana** (se puede cambiar a mes) donde un clic selecciona un solo día, empezando por hoy. Debajo, tres listas para el día seleccionado: **Trabajo actual** (tareas con una actualización registrada ese día), **Día anterior** (tareas con una actualización registrada el día laboral anterior más cercano) y **Pendientes** (tareas activas sin actualizaciones en ninguno de los dos días). Cada lista se puede contraer: Trabajo actual y Día anterior empiezan abiertas y Pendientes empieza cerrada. Cada tarjeta tiene acciones: crear una nueva actualización para esa tarea y editar cualquiera de las actualizaciones que muestra. Al crear desde una tarjeta, el diálogo presenta la **última actualización** de la tarea en solo lectura (fecha, hora y texto) con dos botones: copiar el texto al portapapeles o usarlo como texto inicial de la nueva actualización. El botón **Nuevo reporte** del encabezado convierte esas listas en un borrador de reporte. El calendario sólo selecciona la fecha: no dibuja los eventos del día. Encima de él, un banner informativo indica si la fecha seleccionada ya tiene un reporte (con la acción **Abrir reporte** cuando existe, «Reporte no creado aún.» para hoy y «No hay reporte para …» para otras fechas) y añade cuánto falta para el próximo día no laborable, con su título entre paréntesis, por ejemplo «Próximo día no laborable en 3 días (Fin de año)». El banner se puede ocultar y vuelve a aparecer cuando cambia la fecha o el reporte.
- **Lista de tareas** con tarjetas: la tarjeta colapsada muestra el nombre, el ID externo, el estado interno y el estado en la app externa. El nombre es un enlace que abre la tarea en la app externa en una pestaña nueva (cuando la tarea tiene enlace externo), y el control «Mostrar detalles» comparte la fila de los estados, alineado a la derecha. Al descolapsarla aparecen la descripción, las fechas y un botón para abrir el enlace externo.
- **Historial de actualizaciones**: cada tarea puede acumular actualizaciones — qué cambió y la fecha y hora en que se estableció. La sección **Actualizaciones** las lista todas, de la más reciente a la más antigua, con acciones de editar y eliminar; la tarjeta extendida muestra las actualizaciones de esa tarea, también de la más reciente a la más antigua, cada una con su acción de editar.
- **Reportes**: documentos inmutables con cuatro secciones — **Qué hice ayer**, **En qué trabajo hoy**, **Qué podría finalizar hoy** y **Bloqueos**. Cada sección contiene referencias a actualizaciones (nombre de la tarea + texto editable) o comentarios simples. Se crean sólo desde Inicio, llevan como nombre la fecha y hora de creación y en la sección **Reportes** se pueden filtrar por día o rango de días con dos campos de fecha, copiar en un documento nuevo o eliminar.
- **Filtros** en la parte superior: búsqueda por nombre o ID externo y filtro por estado interno o externo.
- **Orden** por nombre, fecha de la tarea o fecha de agregado, ascendente o descendente.
- **Diálogo de creación y edición** con todos los campos de la entidad; **eliminación** con confirmación.
- **Configuración**: idioma, esquema de colores, días laborales, los nombres de la entidad y los estados externos que se explican abajo.
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
| Estado externo | no | Uno de los valores configurados en Configuración → Estados externos; la etiqueta sigue el idioma de la app |

## Uso

1. **Crear**: botón del encabezado de la página. Los campos obligatorios se validan antes de guardar.
2. **Editar**: el icono de lápiz de la tarjeta abre el mismo diálogo con los valores actuales.
3. **Eliminar**: el icono de papelera pide confirmación y después borra el registro de forma permanente.
4. **Consultar**: el control «Mostrar detalles» (al final de la fila de estados) despliega el resto de la información sin salir de la lista. El nombre de la tarea abre el enlace externo en una pestaña nueva.
5. **Filtrar y ordenar**: la búsqueda y los selectores conservan su estado mientras navegas por la app. El selector de estado externo aparece cuando hay al menos un estado configurado.
6. **Registrar una actualización**: abre **Actualizaciones** en la navegación, elige la tarea, describe qué cambió y confirma la fecha y hora (se completan con el momento actual). Puedes editar cualquier entrada desde la sección o desde la tarjeta de la tarea, y eliminarla desde la sección.
7. **Consultar el historial**: extiende la tarjeta de una tarea para ver sus actualizaciones de la más reciente a la más antigua.
8. **Leer el día**: abre **Inicio**, cambia entre la vista de semana y la de mes y haz clic en un día. Las tres listas se actualizan a la vez y cada una muestra las actualizaciones del día que cubre; la lista de pendientes muestra las tareas activas que no se actualizaron ni el día seleccionado ni el día laboral anterior.
9. **Crear un reporte**: en **Inicio**, selecciona el día y usa **Nuevo reporte** en el encabezado. El borrador ya trae las actualizaciones de ayer en **Qué hice ayer** y las del día seleccionado en **En qué trabajo hoy**. Revisa o extiende cada texto, quita las líneas que no necesites, agrega comentarios (por ejemplo en **Bloqueos** o **Qué podría finalizar hoy**) y confirma. El reporte se guarda con la fecha y hora actuales como nombre.
10. **Consultar reportes**: abre **Reportes**, filtra por un solo día (completa sólo *Desde* o *Hasta*) o por un rango, y usa la acción de copiar para crear un documento nuevo con la fecha y hora actuales. Para descartar uno, usa la acción de eliminar y confirma.
11. **Registrar un día no trabajado**: abre **Días no trabajados**, elige el mes y agrega cada ausencia con su motivo y fechas. El reporte ya las tiene en cuenta (ver abajo).

## Días no trabajados

La sección **Días no trabajados** guarda los días en los que no trabajaste, sea cual sea el motivo: enfermedad, mudanza, matrimonio, sin goce de sueldo, vacaciones, cumpleaños, feriado nacional o cualquier otro día no laborable. Cada registro es un evento con un motivo, una nota opcional y un rango de fechas: un solo día si sólo completas la fecha de inicio, o varios días con inicio y fin (ambos incluidos).

El calendario mensual muestra esos eventos etiquetados por su nota (el título que escribes), con el motivo como respaldo si la nota está vacía, cada motivo con su propio color, y sus flechas y selectores de mes y año permiten ir a cualquier mes. La lista de abajo siempre muestra los registros que se superponen con el mes que estás viendo. Debajo, **Próximos días** lista desde hoy las ausencias que siguen en curso o empiezan más adelante, aunque pertenezcan a otro mes, para que veas lo que viene sin cambiar de mes. El subtítulo de la página siempre indica cuánto falta para la próxima, en meses, semanas y días («Próximo día no laboral en 3 meses y 6 días»); mientras una ausencia está en curso dice «hoy», y sin registros próximos muestra el resumen del mes en pantalla. Usa el botón del encabezado para agregar uno y los iconos de cada fila para editarlo o eliminarlo.

Todos los días que cubren esos registros se omiten en **Día anterior**: el reporte busca el día más cercano que no sea un día no laborable de la semana ni un día configurado como no trabajado. Así, un feriado en medio de la semana o dos semanas de vacaciones no se convierten en el día de referencia.

## Reportes

Un reporte es una foto del momento: los cambios posteriores en una tarea o en sus actualizaciones no modifican un reporte existente. Cada línea puede ser:

- **Una actualización de una tarea**: conserva la referencia a la tarea y a la actualización de origen, y su texto empieza con la descripción de esa actualización. Puedes reescribirlo o extenderlo antes de guardar.
- **Un comentario**: texto libre, agregado con el botón **Agregar comentario** de cualquier sección.

Al crear un reporte, **Qué podría finalizar hoy** también ofrece un selector de **Caso relacionado** y un botón **Agregar caso**. Crea una referencia a una tarea sin una actualización existente: el texto empieza con la descripción de la tarea y puedes reescribirlo como comentario de ese caso.

Las cuatro secciones son fijas y siempre se muestran en el mismo orden. Las secciones vacías aparecen como «Sin elementos». El encabezado de la página indica cuántos reportes coinciden con el filtro de fechas y el total; los filtros son inclusivos y los dos campos se pueden usar juntos o por separado. Cuando **Desde** y **Hasta** seleccionan el mismo día y existe un reporte para esa fecha, un aviso sobre la lista lo indica y enlaza directamente a esa tarjeta. Desde esa página no se pueden crear reportes, sólo exportar, copiar o eliminar.

### Exportar un reporte

Cada tarjeta de reporte tiene una acción **Exportar**. Abre un diálogo donde eliges una plantilla y ves el markdown generado en una vista previa, y desde ahí puedes **Copiar texto** (portapapeles) o **Descargar .md**. La plantilla predeterminada genera las cuatro secciones con una línea por elemento: una actualización de una tarea se convierte en `[Nombre de la tarea](enlace externo) -> comentario` (sólo el nombre si la tarea no tiene enlace) y un comentario simple se convierte en su texto. Una sección sin elementos se muestra como `No`.

El texto de las plantillas se edita en **Configuración → Plantillas de exportación**. Los marcadores de sección son los nombres `yesterday`, `today`, `finish` y `blockers` escritos entre llaves; cada uno se reemplaza por las líneas de esa sección. Puedes conservar la plantilla predeterminada y agregar todas las tuyas que necesites. El diálogo de exportación recuerda en este dispositivo la última plantilla que usaste y la selecciona la próxima vez.

## Configuración

| Sección | Opciones |
|---|---|
| Idioma | Seguir el idioma del sistema o forzar inglés/español |
| Esquema de colores | Seguir al sistema o forzar claro/oscuro |
| Días laborales | Los días de la semana que cuentan como laborales; por defecto de lunes a viernes |
| Plantillas de exportación | Plantillas markdown disponibles en el diálogo de exportación; la predeterminada siempre está disponible |
| Nombres de las entidades | Singular y plural en inglés y español; la vista previa usa el idioma activo |
| Estados externos | Listar, agregar, editar y eliminar los valores posibles del campo de estado externo |
| Datos | Exportar una copia JSON de tareas, actualizaciones y reportes, fusionar una o borrar todos los datos locales |

Los interruptores de **Días laborales** deciden qué días considera laborales el reporte. **Día anterior** siempre busca el día laboral más cercano antes de la fecha seleccionada, así que un lunes se compara contra el viernes (y cada día de un fin de semana largo contra el último día trabajado). Los días guardados en **Días no trabajados** también se omiten, así que los feriados y las vacaciones desplazan el día de referencia. Al menos un día debe quedar activo.

Si vacías el singular o el plural, se restaura el valor por defecto de ese idioma (`Task/Tasks`, `Tarea/Tareas`).

Cada estado externo tiene una **etiqueta en inglés**, obligatoria, y una **etiqueta en español**, opcional: si queda vacía se usa la inglesa. La app genera un identificador oculto para cada estado, así que en Configuración y en las tarjetas sólo se ven las etiquetas. Si no hay estados configurados, el campo del diálogo de la tarea queda deshabilitado y remite a esta sección. Al eliminar un estado, las tareas que ya lo usan quedan intactas.

## Copia de seguridad

La sección **Datos** de Configuración tiene tres acciones:

- **Exportar JSON** descarga `daily-task-report-AAAA-MM-DD.json` con **todo** lo guardado localmente: las tareas, sus actualizaciones y los reportes (sin los ids internos). Cada tarea lleva una `ref` y las actualizaciones y los elementos de los reportes apuntan a ella, así que los vínculos se conservan al exportar.
- **Importar JSON** lee un archivo creado por esta app y abre una ventana de revisión antes de cambiar nada. Muestra cuántas tareas se agregarán, actualizarán o quedarán sin cambios, cuántas actualizaciones y reportes contiene el archivo, y lista las tareas con su estado. Al confirmar, las tareas se **fusionan por ID externo** (los valores importados tienen prioridad), después las actualizaciones se enlazan con la tarea correspondiente y los reportes se restauran como documentos. Las entradas que ya existen se omiten, así que importar dos veces el mismo archivo no duplica el historial ni los reportes. Los archivos antiguos que sólo contienen tareas se siguen aceptando.
- **Borrar todos los datos** pide confirmación con el número de entradas locales y después elimina las tareas, sus actualizaciones y todos los reportes de forma permanente.

La importación y el borrado son atómicos: se ejecutan en una sola transacción de la base, rechazan archivos de otras apps o con estructura inválida y no tocan los datos actuales si cancelas la ventana de revisión. Cancelar la confirmación deja todo como estaba.

## Datos y privacidad

- Las tareas se guardan en **IndexedDB** (Dexie) en el navegador del dispositivo: nunca en `localStorage` ni en un servidor.
- La configuración (idioma, tema, días laborales, nombres y estados externos) se guarda aparte con `settings-core`.
- Al borrar los datos del sitio de la app se eliminan las tareas, sus actualizaciones y los reportes; exporta una copia antes si quieres conservar las tareas.

## Estructura del proyecto

```
src/main.js                  arranque: Pinia, router, i18n, listeners PWA
src/App.vue                  layout maestro-esclavo, navegación, popups PWA
src/router/index.js          / (Inicio), /tasks, /updates, /reports, /settings, /about
src/views/HomePage.vue       calendario (semana/mes, un día) y las listas del reporte diario
src/components/DailyTaskList.vue una lista de Inicio: título, contador, entradas, vacío y botón para contraerla
src/helpers/daily-report.js  división actual / anterior / pendientes para una fecha (según días laborales)
src/composables/useBusinessDays.js  días laborales configurados
src/views/TasksPage.vue      filtros, orden, lista y diálogo
src/views/UpdatesPage.vue    historial: más reciente primero, editar y eliminar
src/views/ReportsPage.vue    documentos de reporte: filtro por fechas, exportar, copiar y eliminar
src/views/SettingsPage.vue   idioma, tema, días laborales, nombres de la entidad y estados externos
src/views/AboutPage.vue      panel ZnAbout
src/components/TaskCard.vue  tarjeta colapsable con acciones de editar/eliminar
src/components/TaskDialog.vue diálogo de creación/edición (ZnDataForm)
src/components/UpdateDialog.vue diálogo de creación/edición de una actualización
src/components/ReportCreateDialog.vue diálogo de Inicio que arma un reporte desde las listas del día
src/components/ExternalStatusDialog.vue diálogo de creación/edición de un estado externo
src/stores/tasks.js          store de Pinia de la lista de tareas
src/stores/updates.js        store de Pinia del historial
src/stores/reports.js        store de Pinia de los reportes
src/db/                      base Dexie y repositorios de tareas, actualizaciones y reportes
src/helpers/                 DTO, validación, filtros, orden, reportes y fechas
src/data/task-schema.js      esquemas ui-data para formulario y vista
```

## Desarrollo

```bash
npm run dev --workspace=daily-task-report
npm run test:daily-task-report
npm run build:daily-task-report
```
