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
