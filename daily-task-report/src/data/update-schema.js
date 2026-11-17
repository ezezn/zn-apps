import { FieldTypes } from '@zn-apps/ui-data-core'

/**
 * Form schema shared by the Updates page and the expanded task card. `tasks`
 * feeds the selector so an update can be moved to another task.
 */
export function updateFormSchema({ t, errors = {}, tasks = [] }) {
  return {
    variant: 'outlined',
    sections: [
      {
        layout: 1,
        fields: [
          {
            path: 'taskId',
            type: FieldTypes.SELECT,
            label: t('updates.task'),
            required: true,
            error: errors.taskId,
            options: tasks.map((task) => ({ value: task.id, label: task.name }))
          },
          {
            path: 'createdAt',
            type: FieldTypes.DATETIME,
            label: t('updates.createdAt'),
            required: true,
            error: errors.createdAt
          },
          {
            path: 'description',
            type: FieldTypes.TEXTAREA,
            label: t('updates.description'),
            required: true,
            error: errors.description,
            rows: 4,
            maxlength: 2000
          }
        ]
      }
    ]
  }
}
