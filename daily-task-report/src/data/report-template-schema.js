import { FieldTypes } from '@zn-apps/ui-data-core'

/** Create/edit form for one export template (name + markdown body). */
export function reportTemplateFormSchema({ t, errors = {} }) {
  return {
    variant: 'outlined',
    sections: [
      {
        layout: 1,
        fields: [
          {
            path: 'name',
            type: FieldTypes.TEXT,
            label: t('settings.templateName'),
            required: true,
            error: errors.name,
            maxlength: 80
          },
          {
            path: 'body',
            type: FieldTypes.TEXTAREA,
            label: t('settings.templateBody'),
            hint: t('settings.templateBodyHint'),
            required: true,
            error: errors.body,
            rows: 12,
            maxlength: 4000
          }
        ]
      }
    ]
  }
}
