import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ZnRichTextEditor from '../ZnRichTextEditor.vue'
import ZnRichTextView from '../ZnRichTextView.vue'

const markdown = '## Título\n\nTexto **fuerte** y <u>subrayado</u>.'

describe('ZnRichTextEditor', () => {
  it('renderiza el markdown como HTML en el área editable', () => {
    const wrapper = mount(ZnRichTextEditor, {
      props: { modelValue: markdown, label: 'Notas' }
    })

    const canvas = wrapper.find('.zn-richtext__canvas')
    expect(canvas.attributes('contenteditable')).toBe('true')
    expect(canvas.html()).toContain('<h2>Título</h2>')
    expect(canvas.html()).toContain('<strong>fuerte</strong>')
    expect(canvas.html()).toContain('<u>subrayado</u>')
  })

  it('permite editar el markdown crudo y emite el valor', async () => {
    const wrapper = mount(ZnRichTextEditor, {
      props: { modelValue: markdown }
    })

    await wrapper.find('.zn-richtext__source-toggle').trigger('click')

    const source = wrapper.find('textarea.zn-richtext__source')
    expect(source.element.value).toBe(markdown)

    await source.setValue('# Nuevo\n\n**Contenido**')

    expect(wrapper.emitted('update:modelValue').at(-1)).toEqual(['# Nuevo\n\n**Contenido**'])
  })

  it('expone la toolbar sólo cuando es editable', () => {
    const editable = mount(ZnRichTextEditor, { props: { modelValue: '' } })
    expect(editable.find('[role="toolbar"]').exists()).toBe(true)

    const readonly = mount(ZnRichTextEditor, {
      props: { modelValue: markdown, readonly: true }
    })
    expect(readonly.find('[role="toolbar"]').exists()).toBe(false)
  })
})

describe('ZnRichTextView', () => {
  it('convierte el markdown a HTML de presentación', () => {
    const wrapper = mount(ZnRichTextView, { props: { modelValue: markdown } })

    expect(wrapper.find('h2').text()).toBe('Título')
    expect(wrapper.find('strong').text()).toBe('fuerte')
    expect(wrapper.find('u').text()).toBe('subrayado')
  })

  it('muestra emptyText cuando no hay contenido', () => {
    const wrapper = mount(ZnRichTextView, {
      props: { modelValue: '', emptyText: 'Sin notas' }
    })

    expect(wrapper.text()).toBe('Sin notas')
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('renderiza tablas y respeta el tamaño', () => {
    const wrapper = mount(ZnRichTextView, {
      props: {
        modelValue: '| A | B |\n| --- | :---: |\n| 1 | 2 |',
        size: 'large'
      }
    })

    expect(wrapper.classes()).toContain('zn-richtext-view--large')
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('td')).toHaveLength(2)
  })
})
