/**
 * Esquema y valor compartidos por las demos de `ui-data-form`,
 * `ui-data-view` y `ui-data-editor`. Usar el mismo contrato en las tres
 * páginas demuestra que los datos pueden alternar entre las tres librerías
 * sin transformarse.
 */
export const dataDemoSchema = {
  sections: [
    {
      title: 'Cuenta',
      icon: 'person',
      layout: 2,
      fields: [
        {
          path: 'profile.name',
          type: 'text',
          label: 'Nombre',
          placeholder: 'Ada Lovelace',
          required: true
        },
        {
          path: 'profile.email',
          type: 'email',
          label: 'Correo',
          placeholder: 'ada@example.com'
        },
        {
          path: 'profile.role',
          type: 'select',
          label: 'Rol',
          options: [
            { value: 'admin', label: 'Administración' },
            { value: 'editor', label: 'Edición' },
            { value: 'viewer', label: 'Sólo lectura' }
          ]
        },
        {
          path: 'profile.joined',
          type: 'date',
          label: 'Fecha de alta'
        },
        {
          path: 'profile.bio',
          type: 'textarea',
          label: 'Biografía',
          description: 'Máximo 240 caracteres.',
          rows: 3,
          maxlength: 240
        }
      ]
    },
    {
      title: 'Preferencias',
      icon: 'tune',
      collapsible: true,
      expanded: true,
      layout: 3,
      fields: [
        {
          path: 'preferences.notifications',
          type: 'switch',
          label: 'Notificaciones'
        },
        {
          path: 'preferences.theme',
          type: 'select',
          label: 'Tema',
          options: [
            { value: 'system', label: 'Sistema' },
            { value: 'light', label: 'Claro' },
            { value: 'dark', label: 'Oscuro' }
          ]
        },
        {
          path: 'preferences.dailyGoal',
          type: 'range',
          label: 'Meta diaria (min)',
          min: 0,
          max: 120,
          step: 15,
          showTicks: true
        },
        {
          path: 'preferences.tags',
          type: 'multi-select',
          label: 'Etiquetas',
          options: ['Diseño', 'Código', 'Investigación', 'Equipo']
        }
      ]
    },
    {
      title: 'Sistema',
      icon: 'lock',
      layout: 2,
      fields: [
        {
          path: 'system.id',
          type: 'text',
          label: 'Identificador',
          disabled: true
        },
        {
          path: 'system.internalNote',
          type: 'text',
          label: 'Nota interna',
          hidden: true,
          default: 'Sólo visible en el JSON'
        }
      ]
    }
  ]
}

export const dataDemoValue = {
  profile: {
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    role: 'admin',
    joined: '2026-01-15',
    bio: 'Matemática y escritora. Primera programadora de la historia.'
  },
  preferences: {
    notifications: true,
    theme: 'system',
    dailyGoal: 45,
    tags: ['Diseño', 'Código']
  },
  system: {
    id: 'usr-001'
  }
}
