import { FieldTypes } from '@zn-apps/ui-data-core'

/**
 * Create/edit form for one non-working day. `end` is optional: leaving it
 * empty (or repeating the start) makes it a single-day event.
 */
export function dayOffFormSchema({ t, errors = {}, typeOptions = [] }) {
  return {
    variant: 'outlined',
    sections: [
      {
        layout: 1,
        fields: [
          {
            path: 'type',
            type: FieldTypes.SELECT,
            label: t('daysOff.type'),
            required: true,
            options: typeOptions
          },
          {
            path: 'start',
            type: FieldTypes.DATE,
            label: t('daysOff.startDate'),
            required: true,
            error: errors.start
          },
          {
            path: 'end',
            type: FieldTypes.DATE,
            label: t('daysOff.endDate'),
            hint: t('daysOff.endDateHint')
          },
          {
            path: 'note',
            type: FieldTypes.TEXT,
            label: t('daysOff.note'),
            placeholder: t('daysOff.notePlaceholder'),
            maxlength: 120
          }
        ]
      }
    ]
  }
}
