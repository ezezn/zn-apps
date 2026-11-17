import { createI18n } from 'vue-i18n'
import { createSettings } from '@zn-apps/settings-core'

export const messages = {
  en: {
    app: {
      title: 'Daily Task Report',
      settings: 'Settings',
      about: 'About Daily Task Report'
    },
    nav: {
      navigation: 'Navigation',
      tasks: 'Tasks',
      updates: 'Updates',
      settings: 'Settings',
      about: 'About'
    },
    entity: {
      defaultSingular: 'Task',
      defaultPlural: 'Tasks'
    },
    common: {
      cancel: 'Cancel',
      save: 'Save',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete'
    },
    tasks: {
      summary: '{shown} of {total}',
      new: 'New {entity}',
      editTitle: 'Edit {entity}',
      deleteTitle: 'Delete {entity}',
      deleteMessage: 'This permanently removes “{name}” and its updates. This cannot be undone.',
      search: 'Search by name or external ID',
      statusFilter: 'Status',
      allStatuses: 'All',
      sortBy: 'Sort by',
      sortName: 'Name',
      sortTaskDate: 'Task date',
      sortAddedAt: 'Added date',
      sortAsc: 'Ascending',
      sortDesc: 'Descending',
      hideDetails: 'Hide details',
      showDetails: 'Show details',
      emptyTitle: 'No {entityPlural} yet',
      emptyMessage: 'Create the first one to start tracking.',
      noResults: 'No {entityPlural} match these filters.',
      loading: 'Loading…',
      loadError: 'Could not load the local data.',
      saveError: 'Could not save the changes.',
      removeError: 'Could not delete the entry.',
      name: 'Name',
      externalId: 'External ID',
      externalStatus: 'Status in the external app',
      externalLink: 'External link',
      openLink: 'Open link',
      description: 'Description',
      taskDate: 'Task date',
      addedAt: 'Added at',
      status: 'Internal status',
      createHint: 'The added date is prefilled with the current time so you can adjust it before saving.'
    },
    updates: {
      title: 'Updates',
      summary: '{count} updates',
      new: 'New update',
      editTitle: 'Edit update',
      deleteTitle: 'Delete update',
      deleteMessage: 'This permanently removes the update. This cannot be undone.',
      sectionTitle: 'Updates',
      emptyForTask: 'No updates recorded for this task.',
      emptyTitle: 'No updates yet',
      emptyMessage: 'Record the first change of a task to start the log.',
      loading: 'Loading…',
      loadError: 'Could not load the updates.',
      saveError: 'Could not save the update.',
      removeError: 'Could not delete the update.',
      task: 'Task',
      description: 'What changed',
      createdAt: 'Date and time',
      unknownTask: 'Deleted task',
      createHint: 'The date and time default to now so you can adjust them before saving.'
    },
    status: {
      active: 'Active',
      inactive: 'Inactive'
    },
    errors: {
      required: 'This field is required'
    },
    settings: {
      title: 'Settings',
      languageSection: 'Language',
      useSystemLanguage: 'Use system language',
      language: 'Language',
      english: 'English',
      spanish: 'Spanish',
      themeSection: 'Color scheme',
      theme: 'Theme',
      themeSystem: 'Follow system',
      themeLight: 'Light',
      themeDark: 'Dark',
      entitySection: 'Entity naming',
      entityHint: 'The code always calls these entities Tasks. Change how they are shown in the app so the repository does not reveal work details.',
      entityEnglish: 'English',
      entitySpanish: 'Spanish',
      singular: 'Singular',
      plural: 'Plural',
      namingPreview: 'Preview: {singular} · {plural}',
      dataSection: 'Data',
      dataHint: 'Tasks live only in this browser. Export a JSON backup, merge one back, or delete all local data.',
      exportData: 'Export JSON',
      importData: 'Import JSON',
      exportDone: 'Backup downloaded.',
      exportError: 'Could not create the backup.',
      importTitle: 'Review import',
      importHint: 'Entries with the same external ID update the existing one; the rest are added. Imported values win.',
      importSummary: '{added} to add · {updated} to update · {unchanged} unchanged',
      importStatusNew: 'New',
      importStatusUpdate: 'Update',
      importStatusUnchanged: 'Unchanged',
      importPreview: 'Data to import',
      importEmpty: 'The file contains no {entityPlural}.',
      importAction: 'Import',
      importDone: '{added} added and {updated} updated.',
      importUpToDate: 'Everything is already up to date.',
      importError: 'The file is not a valid backup.',
      deleteAll: 'Delete all data',
      deleteAllTitle: 'Delete all data',
      deleteAllConfirm: 'Delete the {count} local {entityPlural}? This cannot be undone.',
      deleteAllDone: 'All local data deleted.'
    },
    aboutTabs: {
      credits: 'Credits',
      changelog: 'Changelog',
      loading: 'Loading changelog…',
      empty: 'No changelog available.',
      error: 'Could not load the changelog.'
    },
    pwa: {
      installTitle: 'Install Daily Task Report',
      installMessage: 'Install it on your device to open it quickly and use it offline.',
      updateTitle: 'Update available',
      updateMessage: 'A new version of the app is ready. Update now to get the latest fixes.',
      updateText: 'Update',
      dismissUpdate: 'Later'
    }
  },
  es: {
    app: {
      title: 'Daily Task Report',
      settings: 'Configuración',
      about: 'Acerca de Daily Task Report'
    },
    nav: {
      navigation: 'Navegación',
      tasks: 'Tareas',
      updates: 'Actualizaciones',
      settings: 'Configuración',
      about: 'Acerca de'
    },
    entity: {
      defaultSingular: 'Tarea',
      defaultPlural: 'Tareas',
      externalStatusManage: 'Manage external statuses',
      externalStatusAdd: 'Add external status',
      externalStatusDelete: 'Delete external status',
      externalStatusEmpty: 'No external statuses configured',
    },
    common: {
      cancel: 'Cancelar',
      save: 'Guardar',
      close: 'Cerrar',
      edit: 'Editar',
      delete: 'Eliminar'
    },
    tasks: {
      summary: '{shown} de {total}',
      new: 'Nueva {entity}',
      editTitle: 'Editar {entity}',
      deleteTitle: 'Eliminar {entity}',
      deleteMessage: 'Esto elimina “{name}” y sus actualizaciones de forma permanente. No se puede deshacer.',
      search: 'Buscar por nombre o ID externo',
      statusFilter: 'Estado',
      allStatuses: 'Todos',
      sortBy: 'Ordenar por',
      sortName: 'Nombre',
      sortTaskDate: 'Fecha de la tarea',
      sortAddedAt: 'Fecha de agregado',
      sortAsc: 'Ascendente',
      sortDesc: 'Descendente',
      hideDetails: 'Ocultar detalles',
      showDetails: 'Mostrar detalles',
      emptyTitle: 'Todavía no hay {entityPlural}',
      emptyMessage: 'Crea la primera para empezar a registrar.',
      noResults: 'Ninguna {entityPlural} coincide con estos filtros.',
      loading: 'Cargando…',
      loadError: 'No se pudieron cargar los datos locales.',
      saveError: 'No se pudieron guardar los cambios.',
      removeError: 'No se pudo eliminar el registro.',
      name: 'Nombre',
      externalId: 'ID externo',
      externalStatus: 'Estado en la app externa',
      externalLink: 'Enlace externo',
      openLink: 'Abrir enlace',
      description: 'Descripción',
      taskDate: 'Fecha de la tarea',
      addedAt: 'Fecha de agregado',
      status: 'Estado interno',
      createHint: 'La fecha de agregado se completa con la fecha actual para que la ajustes antes de guardar.'
    },
    updates: {
      title: 'Actualizaciones',
      summary: '{count} actualizaciones',
      new: 'Nueva actualización',
      editTitle: 'Editar actualización',
      deleteTitle: 'Eliminar actualización',
      deleteMessage: 'Esto elimina la actualización de forma permanente. No se puede deshacer.',
      sectionTitle: 'Actualizaciones',
      emptyForTask: 'Esta tarea no tiene actualizaciones registradas.',
      emptyTitle: 'Todavía no hay actualizaciones',
      emptyMessage: 'Registra el primer cambio de una tarea para iniciar el historial.',
      loading: 'Cargando…',
      loadError: 'No se pudieron cargar las actualizaciones.',
      saveError: 'No se pudo guardar la actualización.',
      removeError: 'No se pudo eliminar la actualización.',
      task: 'Tarea',
      description: 'Qué cambió',
      createdAt: 'Fecha y hora',
      unknownTask: 'Tarea eliminada',
      createHint: 'La fecha y hora se completan con el momento actual para que las ajustes antes de guardar.'
    },
    status: {
      active: 'Activa',
      inactive: 'Inactiva'
    },
    errors: {
      required: 'Este campo es obligatorio'
    },
    settings: {
      title: 'Configuración',
      languageSection: 'Idioma',
      useSystemLanguage: 'Usar idioma del sistema',
      language: 'Idioma',
      english: 'Inglés',
      spanish: 'Español',
      themeSection: 'Esquema de colores',
      theme: 'Tema',
      themeSystem: 'Seguir al sistema',
      themeLight: 'Claro',
      themeDark: 'Oscuro',
      entitySection: 'Nombres de las entidades',
      entityHint: 'El código siempre llama Tasks a estas entidades. Cambia cómo se muestran en la app para que el repositorio no revele detalles del trabajo.',
      entityEnglish: 'Inglés',
      entitySpanish: 'Español',
      singular: 'Singular',
      plural: 'Plural',
      namingPreview: 'Vista previa: {singular} · {plural}',
      dataSection: 'Datos',
      dataHint: 'Las tareas viven sólo en este navegador. Exporta una copia JSON, fusiona una o borra todos los datos locales.',
      exportData: 'Exportar JSON',
      importData: 'Importar JSON',
      exportDone: 'Copia descargada.',
      exportError: 'No se pudo crear la copia.',
      importTitle: 'Revisar importación',
      importHint: 'Las entradas con el mismo ID externo actualizan la existente; el resto se agrega. Los valores importados tienen prioridad.',
      importSummary: '{added} por agregar · {updated} por actualizar · {unchanged} sin cambios',
      importStatusNew: 'Nueva',
      importStatusUpdate: 'Actualizar',
      importStatusUnchanged: 'Sin cambios',
      importPreview: 'Datos a importar',
      importEmpty: 'El archivo no contiene {entityPlural}.',
      importAction: 'Importar',
      importDone: '{added} agregadas y {updated} actualizadas.',
      importUpToDate: 'Ya está todo actualizado.',
      importError: 'El archivo no es una copia válida.',
      deleteAll: 'Borrar todos los datos',
      deleteAllTitle: 'Borrar todos los datos',
      deleteAllConfirm: '¿Borrar las {count} {entityPlural} locales? No se puede deshacer.',
      deleteAllDone: 'Se borraron todos los datos locales.'
    },
    aboutTabs: {
      credits: 'Créditos',
      changelog: 'Changelog',
      loading: 'Cargando changelog…',
      empty: 'No hay changelog disponible.',
      error: 'No se pudo cargar el changelog.'
    },
    pwa: {
      installTitle: 'Instalar Daily Task Report',
      installMessage: 'Instálala en tu dispositivo para abrirla rápido y usarla sin conexión.',
      updateTitle: 'Actualización disponible',
      updateMessage: 'Hay una nueva versión de la app. Actualiza para recibir las últimas mejoras.',
      updateText: 'Actualizar',
      dismissUpdate: 'Ahora no'
    }
  }
}

export function systemLocale() {
  const language = typeof navigator !== 'undefined' ? navigator.language : ''
  return language.toLowerCase().split('-')[0] === 'es' ? 'es' : 'en'
}

export const settings = createSettings({ namespace: 'daily-task-report' })
settings.define({
  i18n: {
    useSystem: true,
    locale: null
  },
  theme: {
    preference: 'system'
  },
  entity: {
    names: {
      en: { singular: 'Task', plural: 'Tasks' },
      es: { singular: 'Tarea', plural: 'Tareas' }
    }
  }
})

export function resolveInitialLocale() {
  const useSystem = settings.i18n.useSystem ?? (settings.i18n.locale === null)
  if (useSystem) return systemLocale()
  const configured = settings.i18n.locale
  return configured === 'es' || configured === 'en' ? configured : systemLocale()
}

export const initialLocale = resolveInitialLocale()
export const i18n = createI18n({ legacy: false, locale: initialLocale, fallbackLocale: 'en', messages })
