/**
 * Eventos de ejemplo para las demos de @zn-apps/ui-calendar.
 *
 * `start` con hora crea un evento con horario; sin hora, un evento de día
 * completo. `end` es opcional y permite eventos de varios días.
 */
export const calendarDemoLabels = {
  today: 'Hoy',
  previous: 'Anterior',
  next: 'Siguiente',
  month: 'Mes',
  year: 'Año',
  date: 'Fecha',
  startDate: 'Fecha inicial',
  endDate: 'Fecha final',
  noEvents: 'Sin eventos',
  allDay: 'Todo el día',
  selectDay: 'Seleccionar {date}'
}

export const calendarDemoEvents = [
  {
    id: 'planning',
    title: 'Planificación semanal',
    start: '2026-11-09T09:00',
    end: '2026-11-09T10:30',
    color: '#6750A4'
  },
  {
    id: 'review',
    title: 'Revisión de novedades',
    start: '2026-11-10T14:00',
    end: '2026-11-10T15:00',
    color: '#625B71'
  },
  {
    id: 'release',
    title: 'Publicación de la versión',
    start: '2026-11-11T11:00',
    end: '2026-11-11T12:00',
    color: '#B3261E'
  },
  {
    id: 'conference',
    title: 'Conferencia de diseño',
    start: '2026-11-12',
    end: '2026-11-14',
    color: '#7D5260'
  },
  {
    id: 'retro',
    title: 'Retrospectiva',
    start: '2026-11-18T16:00',
    end: '2026-11-18T17:00',
    color: '#6750A4'
  }
]
