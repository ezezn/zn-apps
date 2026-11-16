import { describe, expect, it } from 'vitest'
import { htmlToMarkdown, markdownToHtml } from '../markdown.js'

describe('markdownToHtml', () => {
  it('convierte encabezados, párrafos y formato inline', () => {
    const html = markdownToHtml([
      '## Título',
      '',
      'Texto **negrita**, *cursiva*, <u>subrayado</u>, ~~tachado~~, ![foto](data:image/png;base64,123) y [enlace](https://example.com).'
    ].join('\n'))

    expect(html).toContain('<h2>Título</h2>')
    expect(html).toContain('<strong>negrita</strong>')
    expect(html).toContain('<em>cursiva</em>')
    expect(html).toContain('<u>subrayado</u>')
    expect(html).toContain('<s>tachado</s>')
    expect(html).toContain('<img src="data:image/png;base64,123" alt="foto">')
    expect(html).toContain('<a href="https://example.com">enlace</a>')
  })

  it('convierte imágenes con ancho y alto en píxeles', () => {
    const html = markdownToHtml('![foto](data:image/png;base64,123 =300x200)')

    expect(html).toContain(
      '<img src="data:image/png;base64,123" alt="foto" width="300" height="200">'
    )
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
      '<h2>Título</h2><p>Texto <strong>negrita</strong> y <em>cursiva</em> con <u>subrayado</u> y <s>tachado</s> y <img src="data:img" alt="pic"> y <a href="https://test.com">link</a>.</p>'
    )

    expect(markdown).toContain('## Título')
    expect(markdown).toContain('**negrita**')
    expect(markdown).toContain('*cursiva*')
    expect(markdown).toContain('<u>subrayado</u>')
    expect(markdown).toContain('~~tachado~~')
    expect(markdown).toContain('![pic](data:img)')
    expect(markdown).toContain('[link](https://test.com)')
  })

  it('serializa el tamaño de las imágenes', () => {
    const markdown = htmlToMarkdown(
      '<p><img src="data:img" alt="pic" width="300" height="200"></p>'
    )

    expect(markdown).toBe('![pic](data:img =300x200)')
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
