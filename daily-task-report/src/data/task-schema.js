import { FieldTypes } from '@zn-apps/ui-data-core'
import { TASK_STATUSES } from '../helpers/tasks.js'

export function statusLabel(t, status) {
  return TASK_STATUSES.includes(status) ? t(`status.${status}`) : String(status ?? '')
}

export function statusOptions(t) {
  return TASK_STATUSES.map((value) => ({ value, label: t(`status.${value}`) }))
}

/**
 * Schema for the create/edit dialog (`ZnDataForm`) and the read-only expanded
 * card (`ZnDataView`). Both consume the same Task DTO.
 */
export function taskFormSchema({ t, errors = {} }) {
  return {
    variant: 'outlined',
    sections: [
      {
        layout: 2,
        fields: [
          {
            path: 'name',
            type: FieldTypes.TEXT,
            label: t('tasks.name'),
            required: true,
            error: errors.name,
            span: 2,
            maxlength: 160
          },
          {
            path: 'externalId',
            type: FieldTypes.TEXT,
            label: t('tasks.externalId'),
            required: true,
            error: errors.externalId,
            maxlength: 120
          },
          {
            path: 'status',
            type: FieldTypes.SELECT,
            label: t('tasks.status'),
            options: statusOptions(t)
          },
          {
            path: 'externalStatus',
            type: FieldTypes.TEXT,
            label: t('tasks.externalStatus'),
            maxlength: 120
          },
          {
            path: 'taskDate',
            type: FieldTypes.DATE,
            label: t('tasks.taskDate')
          },
          {
            path: 'addedAt',
            type: FieldTypes.DATETIME,
            label: t('tasks.addedAt'),
            required: true,
            error: errors.addedAt
          },
          {
            path: 'externalUrl',
            type: FieldTypes.TEXT,
            label: t('tasks.externalLink'),
            placeholder: 'https://…',
            span: 2,
            maxlength: 500
          },
          {
            path: 'description',
            type: FieldTypes.TEXTAREA,
            label: t('tasks.description'),
            rows: 4,
            span: 2,
            maxlength: 2000
          }
        ]
      }
    ]
  }
}

export function taskViewSchema({ t }) {
  return {
    sections: [
      {
        layout: 2,
        fields: [
          {
            path: 'description',
            type: FieldTypes.TEXTAREA,
            label: t('tasks.description'),
            span: 2
          },
          {
            path: 'status',
            type: FieldTypes.SELECT,
            label: t('tasks.status'),
            options: statusOptions(t)
          },
          {
            path: 'externalStatus',
            type: FieldTypes.TEXT,
            label: t('tasks.externalStatus')
          },
          {
            path: 'taskDate',
            type: FieldTypes.TEXT,
            label: t('tasks.taskDate')
          },
          {
            path: 'addedAt',
            type: FieldTypes.TEXT,
            label: t('tasks.addedAt')
          }
        ]
      }
    ]
  }
}
