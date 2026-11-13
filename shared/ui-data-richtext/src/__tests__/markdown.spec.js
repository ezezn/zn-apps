import { describe, expect, it } from 'vitest'
import { htmlToMarkdown, markdownToHtml } from '../markdown.js'

describe('markdownToHtml', () => {
  it('convierte encabezados, párrafos y formato inline', () => {
    const html = markdownToHtml([
      '## Título',
      '',
      'Texto **negrita**, *cursiva*, <u>subrayado</u> y ~~tachado~~.'
    ].join('\n'))

    expect(html).toContain('<h2>Título</h2>')
    expect(html).toContain('<strong>negrita</strong>')
    expect(html).toContain('<em>cursiva</em>')
    expect(html).toContain('<u>subrayado</u>')
    expect(html).toContain('<s>tachado</s>')
  })

  it('convierte tablas GFM con alineación por columna', () => {
    const html = markdownToHtml([
      '| Campo | Valor |',
      '| --- | :---: |',
      '| Estado | **Activo** |'
    ].join('\n'))

    expect(html).toContain('<table>')
    expect(html).toContain('<th>Campo</th>')
    expect(html).toContain('<th style="text-align:center">Valor</th>')
    expect(html).toContain('<td style="text-align:center"><strong>Activo</strong></td>')
  })

  it('respeta bloques alineados guardados como HTML mínimo', () => {
    const html = markdownToHtml('<p style="text-align:center">Centrado **fuerte**</p>')

    expect(html).toBe('<p style="text-align:center">Centrado <strong>fuerte</strong></p>')
  })

  it('convierte listas, citas y código', () => {
    const html = markdownToHtml([
      '- Uno',
      '- Dos',
      '',
      '> Cita',
      '',
      '```js',
      'const a = 1',
      '```'
    ].join('\n'))

    expect(html).toContain('<ul><li>Uno</li><li>Dos</li></ul>')
    expect(html).toContain('<blockquote><p>Cita</p></blockquote>')
    expect(html).toContain('<pre><code>const a = 1</code></pre>')
  })
})

describe('htmlToMarkdown', () => {
  it('serializa párrafos, encabezados y formato inline', () => {
    const markdown = htmlToMarkdown(
      '<h2>Título</h2><p>Texto <strong>negrita</strong> y <em>cursiva</em> con <u>subrayado</u> y <s>tachado</s>.</p>'
    )

    expect(markdown).toContain('## Título')
    expect(markdown).toContain('**negrita**')
    expect(markdown).toContain('*cursiva*')
    expect(markdown).toContain('<u>subrayado</u>')
    expect(markdown).toContain('~~tachado~~')
  })

  it('serializa alineación de bloques como HTML dentro de Markdown', () => {
    const markdown = htmlToMarkdown('<p style="text-align: center">Centro</p>')

    expect(markdown).toBe('<p style="text-align:center">Centro</p>')
  })

  it('serializa tablas con alineación y escapa pipes', () => {
    const markdown = htmlToMarkdown([
      '<table>',
      '<thead><tr><th>Campo</th><th style="text-align:center">Valor</th></tr></thead>',
      '<tbody><tr><td>A | B</td><td><strong>Activo</strong></td></tr></tbody>',
      '</table>'
    ].join(''))

    expect(markdown).toContain('| Campo | Valor |')
    expect(markdown).toContain('| --- | :---: |')
    expect(markdown).toContain('A \\| B')
    expect(markdown).toContain('**Activo**')
  })

  it('hace round-trip de un documento con heading y tabla', () => {
    const source = '## Notas\n\nTexto **fuerte**.\n\n| A | B |\n| --- | :---: |\n| 1 | 2 |'
    const markdown = htmlToMarkdown(markdownToHtml(source))

    expect(markdown).toContain('## Notas')
    expect(markdown).toContain('**fuerte**')
    expect(markdown).toContain('| A | B |')
    expect(markdown).toContain('| --- | :---: |')
  })
})
