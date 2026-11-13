import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZnDataView from '../ZnDataView.vue'

const schema = {
  sections: [
    {
      title: 'Cuenta',
      icon: 'person',
      layout: 2,
      fields: [
        { path: 'name', type: 'text', label: 'Nombre' },
        {
          path: 'role',
          type: 'select',
          label: 'Rol',
          options: [
            { value: 'admin', label: 'Administración' },
            { value: 'editor', label: 'Edición' }
          ]
        },
        { path: 'tags', type: 'multi-select', label: 'Etiquetas', options: ['Diseño', 'Código'] },
        { path: 'active', type: 'switch', label: 'Activo' },
        { path: 'note', type: 'text', label: 'Nota', hidden: true }
      ]
    },
    {
      title: 'Colapsada',
      collapsible: true,
      expanded: false,
      fields: [{ path: 'system.id', type: 'text', label: 'ID' }]
    }
  ]
}

const modelValue = {
  name: 'Ada Lovelace',
  role: 'admin',
  tags: ['Diseño', 'Código'],
  active: true,
  note: 'oculta',
  system: { id: 'usr-001' }
}

function fieldByLabel(wrapper, label) {
  return wrapper.findAll('.zn-view-field').find((field) => field.text().includes(label))
}

describe('ZnDataView', () => {
  it('renderiza etiquetas y valores formateados', () => {
    const wrapper = mount(ZnDataView, { props: { schema, modelValue } })

    expect(wrapper.text()).toContain('Cuenta')
    expect(fieldByLabel(wrapper, 'Nombre').text()).toContain('Ada Lovelace')
    expect(fieldByLabel(wrapper, 'Rol').text()).toContain('Administración')
    expect(fieldByLabel(wrapper, 'Etiquetas').text()).toContain('Diseño, Código')
    expect(fieldByLabel(wrapper, 'Activo').text()).toContain('Yes')
  })

  it('respeta hidden, emptyText y los textos de booleanos', () => {
    const wrapper = mount(ZnDataView, {
      props: {
        schema,
        modelValue: { name: '', role: null, tags: [], active: false },
        emptyText: 'Sin dato',
        trueText: 'Activo',
        falseText: 'Inactivo'
      }
    })

    expect(wrapper.text()).not.toContain('Nota')
    expect(fieldByLabel(wrapper, 'Nombre').text()).toContain('Sin dato')
    expect(fieldByLabel(wrapper, 'Rol').text()).toContain('Sin dato')
    expect(fieldByLabel(wrapper, 'Activo').text()).toContain('Inactivo')
  })

  it('aplica el layout de columnas y el estado inicial colapsable', () => {
    const wrapper = mount(ZnDataView, { props: { schema, modelValue } })

    const firstContent = wrapper.findAll('.zn-section__content')[0]
    expect(firstContent.attributes('style')).toContain('--zn-grid-cols: 2')

    const details = wrapper.find('details')
    expect(details.exists()).toBe(true)
    expect(details.element.open).toBe(false)
  })

  it('permite etiquetas en línea por vista y por campo', () => {
    const wrapper = mount(ZnDataView, {
      props: { schema, modelValue, labelPosition: 'inline' }
    })

    expect(wrapper.classes()).toContain('zn-data-view')
    expect(wrapper.findAll('.zn-view-field--inline').length).toBe(5)

    const customSchema = {
      sections: [
        {
          fields: [
            { path: 'name', type: 'text', label: 'Nombre' },
            { path: 'active', type: 'switch', label: 'Activo', labelPosition: 'top' }
          ]
        }
      ]
    }

    const mixed = mount(ZnDataView, {
      props: { schema: customSchema, modelValue, labelPosition: 'inline' }
    })

    const fields = mixed.findAll('.zn-view-field')
    expect(fields[0].classes()).toContain('zn-view-field--inline')
    expect(fields[1].classes()).not.toContain('zn-view-field--inline')
  })
})
