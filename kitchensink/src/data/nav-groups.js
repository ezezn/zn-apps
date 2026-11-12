/**
 * Definición de los grupos de navegación del menú maestro.
 *
 * Cada grupo corresponde a una librería del monorepo y contiene
 * subsecciones colapsables que agrupan sus vistas de demostración.
 */
export const navGroups = [
  {
    key: 'ui-core',
    label: '@zn-apps/ui-core',
    icon: 'widgets',
    sections: [
      {
        key: 'navigation',
        label: 'Navegación',
        items: [
          { key: 'tabs', label: 'Pestañas (ZnTabs)', to: '/tabs' },
          {
            key: 'navigation-layout',
            label: 'Layout maestro (ZnMasterSlaveLayout)',
            to: '/navigation-layout'
          }
        ]
      },
      {
        key: 'layout',
        label: 'Layout',
        items: [
          { key: 'layout', label: 'Layout (ZnBox / ZnRow)', to: '/layout' },
          { key: 'sections', label: 'Secciones (ZnSection)', to: '/sections' },
          { key: 'screen', label: 'Pantallas (ZnScreen)', to: '/screen' }
        ]
      },
      {
        key: 'controls',
        label: 'Controles',
        items: [
          { key: 'buttons', label: 'Botones (ZnButton)', to: '/buttons' },
          { key: 'cards', label: 'Tarjetas (ZnCard)', to: '/cards' },
          { key: 'switches', label: 'Selectores (ZnSwitch)', to: '/switches' },
          { key: 'dialogs', label: 'Diálogos (ZnDialog)', to: '/dialogs' }
        ]
      },
      {
        key: 'input',
        label: 'Entradas de datos',
        items: [
          { key: 'inputs', label: 'Resumen de entradas', to: '/inputs' },
          { key: 'input-text', label: 'Texto (ZnSingleLineText)', to: '/inputs/text' },
          { key: 'input-multiline', label: 'Multilínea (ZnMultilineText)', to: '/inputs/multiline' },
          { key: 'input-email', label: 'Email (ZnEmailInput)', to: '/inputs/email' },
          { key: 'input-phone', label: 'Teléfono (ZnPhoneInput)', to: '/inputs/phone' },
          { key: 'input-date', label: 'Fecha (ZnDateInput)', to: '/inputs/date' },
          { key: 'input-time', label: 'Hora (ZnTimeInput)', to: '/inputs/time' },
          { key: 'input-datetime', label: 'Fecha y hora (ZnDateTimeInput)', to: '/inputs/datetime' },
          { key: 'input-select', label: 'Select (ZnSelect)', to: '/inputs/select' },
          { key: 'input-range', label: 'Rango numérico (ZnRangeInput)', to: '/inputs/range' },
          { key: 'input-date-range', label: 'Rango de fechas (ZnDateRangeInput)', to: '/inputs/date-range' },
          { key: 'input-time-range', label: 'Rango de horas (ZnTimeRangeInput)', to: '/inputs/time-range' },
          { key: 'input-datetime-range', label: 'Rango fecha-hora (ZnDateTimeRangeInput)', to: '/inputs/datetime-range' }
        ]
      },
      {
        key: 'resources',
        label: 'Recursos y utilidades',
        items: [
          { key: 'icons', label: 'Iconos (ZnIcon)', to: '/icons' },
          { key: 'legacy', label: 'Utilidades', to: '/legacy' }
        ]
      }
    ]
  },
  {
    key: 'ui-about',
    label: '@zn-apps/ui-about',
    icon: 'info',
    sections: [
      {
        key: 'about',
        label: 'Aplicación',
        items: [
          {
            key: 'about',
            label: 'Acerca de la app (ZnAbout)',
            to: '/about'
          }
        ]
      }
    ]
  },
  {
    key: 'settings-core',
    label: '@zn-apps/settings-core',
    icon: 'tune',
    sections: [
      {
        key: 'settings',
        label: 'Configuración',
        items: [
          {
            key: 'settings',
            label: 'Configuración (settings-core)',
            to: '/settings'
          }
        ]
      }
    ]
  },
  {
    key: 'pwa-integration',
    label: '@zn-apps/pwa-integration',
    icon: 'devices',
    sections: [
      {
        key: 'pwa-theme',
        label: 'Tema y barras',
        items: [
          {
            key: 'pwa-color-scheme',
            label: 'Esquema de color (useColorScheme)',
            to: '/pwa/color-scheme'
          },
          {
            key: 'pwa-bar-styling',
            label: 'Barras del sistema (usePwaMeta)',
            to: '/pwa/bar-styling'
          }
        ]
      },
      {
        key: 'pwa-install',
        label: 'Instalación',
        items: [
          {
            key: 'pwa-install',
            label: 'Instalación PWA (usePwaInstall)',
            to: '/pwa/install'
          }
        ]
      }
    ]
  }
]

/** Devuelve el grupo que contiene la ruta indicada (o null si no pertenece a ninguno). */
export function findGroupByPath(groups, path) {
  return (
    groups.find((group) =>
      group.sections.some((section) => section.items.some((item) => item.to === path))
    ) || null
  )
}
