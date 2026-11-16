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

  it('normaliza la URL del enlace con https:// y valida el formulario', async () => {
    const wrapper = mount(ZnRichTextEditor, {
      props: { modelValue: 'Hola' },
      attachTo: document.body
    })

    await wrapper.find('button[title="Insertar enlace"]').trigger('mousedown')

    const textInput = wrapper.find('input[placeholder="Texto a mostrar"]')
    const urlInput = wrapper.find('input[placeholder="https://ejemplo.com"]')

    await textInput.setValue('Ejemplo')
    await urlInput.setValue('example.com')
    expect(urlInput.element.value).toBe('example.com')

    await urlInput.trigger('blur')
    expect(urlInput.element.value).toBe('https://example.com')
    expect(wrapper.find('.zn-dialog-error').exists()).toBe(false)

    const dialog = urlInput.element.closest('dialog')
    const insert = Array.from(dialog.querySelectorAll('button'))
      .find((button) => button.textContent.trim() === 'Insertar')
    expect(insert.disabled).toBe(false)

    wrapper.unmount()
  })

  it('marca como inválida una URL que no se puede resolver', async () => {
    const wrapper = mount(ZnRichTextEditor, {
      props: { modelValue: 'Hola' },
      attachTo: document.body
    })

    await wrapper.find('button[title="Insertar enlace"]').trigger('mousedown')

    const textInput = wrapper.find('input[placeholder="Texto a mostrar"]')
    const urlInput = wrapper.find('input[placeholder="https://ejemplo.com"]')

    await textInput.setValue('Ejemplo')
    await urlInput.setValue('http://')

    expect(wrapper.find('.zn-dialog-error').exists()).toBe(true)
    const dialog = urlInput.element.closest('dialog')
    const insert = Array.from(dialog.querySelectorAll('button'))
      .find((button) => button.textContent.trim() === 'Insertar')
    expect(insert.disabled).toBe(true)

    wrapper.unmount()
  })

  it('prellena y actualiza el enlace existente bajo el cursor', async () => {
    const wrapper = mount(ZnRichTextEditor, {
      props: { modelValue: 'Enlace [ejemplo](https://example.com) aquí' },
      attachTo: document.body
    })

    const canvas = wrapper.find('.zn-richtext__canvas').element
    const link = canvas.querySelector('a')
    expect(link).not.toBeNull()

    const range = document.createRange()
    range.setStart(link.firstChild, 1)
    range.setEnd(link.firstChild, 1)
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)

    await wrapper.find('button[title="Insertar enlace"]').trigger('mousedown')

    const textInput = wrapper.find('input[placeholder="Texto a mostrar"]')
    const urlInput = wrapper.find('input[placeholder="https://ejemplo.com"]')
    expect(textInput.element.value).toBe('ejemplo')
    expect(urlInput.element.value).toBe('https://example.com')

    await textInput.setValue('otro')
    await urlInput.setValue('other.com')

    const dialog = urlInput.element.closest('dialog')
    const save = Array.from(dialog.querySelectorAll('button'))
      .find((button) => button.textContent.trim() === 'Guardar')
    save.click()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('update:modelValue').at(-1)[0]).toContain('[otro](https://other.com)')

    wrapper.unmount()
  })

  it('permite abrir el diálogo de tabla, imagen y enlace desde la toolbar', async () => {
    const wrapper = mount(ZnRichTextEditor, { props: { modelValue: '' } })

    const tableBtn = wrapper.find('button[title="Tabla"]')
    expect(tableBtn.exists()).toBe(true)
    await tableBtn.trigger('mousedown')
    expect(wrapper.vm.showTableDialog).toBe(true)

    const imgBtn = wrapper.find('button[title="Insertar imagen"]')
    expect(imgBtn.exists()).toBe(true)
    await imgBtn.trigger('mousedown')
    expect(wrapper.vm.showImageDialog).toBe(true)

    const linkBtn = wrapper.find('button[title="Insertar enlace"]')
    expect(linkBtn.exists()).toBe(true)
    await linkBtn.trigger('mousedown')
    expect(wrapper.vm.showLinkDialog).toBe(true)
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
