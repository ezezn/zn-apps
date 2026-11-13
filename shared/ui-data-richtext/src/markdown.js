/**
 * Conversor Markdown ↔ HTML del editor de texto enriquecido.
 *
 * Subconjunto soportado: párrafos, encabezados h1–h6, negrita, cursiva,
 * subrayado (`<u>`), tachado (`~~`), código en línea y en bloque, listas,
 * citas, separadores, enlaces y tablas GFM con alineación por columna.
 * La alineación de bloques que Markdown no puede expresar se conserva como
 * HTML mínimo (`<p style="text-align:center">…</p>`), que sigue siendo
 * Markdown válido con HTML embebido.
 */

const BLOCK_TAGS = new Set([
  'P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
  'UL', 'OL', 'PRE', 'TABLE', 'BLOCKQUOTE', 'HR'
])

const TABLE_SEPARATOR = /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)*\|?\s*$/
const ALIGNED_BLOCK = /^<(p|h[1-6])\s+style="text-align:\s*(left|center|right)\s*">(.*)<\/\1>$/i

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function inlineToHtml(text = '') {
  let out = escapeHtml(text)

  // HTML mínimo que el propio serializador genera y que Markdown permite.
  out = out.replace(/&lt;u&gt;/gi, '<u>').replace(/&lt;\/u&gt;/gi, '</u>')
  out = out.replace(/&lt;br\s*\/?&gt;/gi, '<br>')

  out = out.replace(/`([^`\n]+)`/g, (_, code) => `<code>${code}</code>`)
  out = out.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/__([^_\n]+)__/g, '<strong>$1</strong>')
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>')
  out = out.replace(/~~([^~\n]+)~~/g, '<s>$1</s>')
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  return out
}

function splitRow(line = '') {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '')
  return trimmed.split('|').map((cell) => cell.trim())
}

function alignmentFromSeparator(cell = '') {
  const value = cell.trim()
  const left = value.startsWith(':')
  const right = value.endsWith(':')
  if (left && right) return 'center'
  if (right) return 'right'
  if (left) return 'left'
  return ''
}

function cellStyle(alignment) {
  return alignment ? ` style="text-align:${alignment}"` : ''
}

function isTableStart(lines, index) {
  return Boolean(
    lines[index]?.includes('|') &&
    lines[index + 1] &&
    TABLE_SEPARATOR.test(lines[index + 1]) &&
    lines[index + 1].includes('-')
  )
}

function isBlockStart(lines, index) {
  const line = lines[index] ?? ''
  return (
    /^#{1,6}\s+/.test(line) ||
    /^```/.test(line) ||
    /^\s*[-*+]\s+/.test(line) ||
    /^\s*\d+\.\s+/.test(line) ||
    /^\s*>\s?/.test(line) ||
    /^\s*(---+|\*\*\*+)\s*$/.test(line) ||
    ALIGNED_BLOCK.test(line) ||
    isTableStart(lines, index)
  )
}

export function markdownToHtml(markdown = '') {
  const lines = String(markdown ?? '').replace(/\r\n?/g, '\n').split('\n')
  const blocks = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (!line.trim()) {
      index += 1
      continue
    }

    if (/^```/.test(line)) {
      index += 1
      const code = []
      while (index < lines.length && !/^```/.test(lines[index])) {
        code.push(lines[index])
        index += 1
      }
      if (index < lines.length) index += 1
      blocks.push(`<pre><code>${escapeHtml(code.join('\n'))}</code></pre>`)
      continue
    }

    const aligned = line.match(ALIGNED_BLOCK)
    if (aligned) {
      const tag = aligned[1].toLowerCase()
      blocks.push(`<${tag} style="text-align:${aligned[2].toLowerCase()}">${inlineToHtml(aligned[3])}</${tag}>`)
      index += 1
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      blocks.push(`<h${level}>${inlineToHtml(heading[2])}</h${level}>`)
      index += 1
      continue
    }

    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      blocks.push('<hr>')
      index += 1
      continue
    }

    if (isTableStart(lines, index)) {
      const header = splitRow(lines[index])
      const separator = splitRow(lines[index + 1])
      const alignments = separator.map(alignmentFromSeparator)
      index += 2

      const rows = []
      while (index < lines.length && lines[index].trim() && lines[index].includes('|')) {
        rows.push(splitRow(lines[index]))
        index += 1
      }

      const head = header
        .map((cell, column) => `<th${cellStyle(alignments[column])}>${inlineToHtml(cell)}</th>`)
        .join('')
      const body = rows
        .map((row) => `<tr>${header.map((_, column) => {
          const cell = row[column] ?? ''
          return `<td${cellStyle(alignments[column])}>${inlineToHtml(cell)}</td>`
        }).join('')}</tr>`)
        .join('')

      blocks.push(`<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`)
      continue
    }

    const ordered = /^\s*\d+\.\s+/.test(line)
    if (ordered || /^\s*[-*+]\s+/.test(line)) {
      const matcher = ordered ? /^\s*\d+\.\s+(.*)$/ : /^\s*[-*+]\s+(.*)$/
      const items = []
      while (index < lines.length) {
        const match = lines[index].match(matcher)
        if (!match) break
        items.push(`<li>${inlineToHtml(match[1])}</li>`)
        index += 1
      }
      blocks.push(`<${ordered ? 'ol' : 'ul'}>${items.join('')}</${ordered ? 'ol' : 'ul'}>`)
      continue
    }

    if (/^\s*>\s?/.test(line)) {
      const quoted = []
      while (index < lines.length && /^\s*>\s?/.test(lines[index])) {
        quoted.push(lines[index].replace(/^\s*>\s?/, ''))
        index += 1
      }
      blocks.push(`<blockquote><p>${inlineToHtml(quoted.join('\n')).replace(/\n/g, '<br>')}</p></blockquote>`)
      continue
    }

    const paragraph = []
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines, index)) {
      paragraph.push(lines[index])
      index += 1
    }
    if (paragraph.length) {
      blocks.push(`<p>${inlineToHtml(paragraph.join('\n')).replace(/\n/g, '<br>')}</p>`)
    }
  }

  return blocks.join('\n')
}

/* --------------------------------------------------------------------------
   HTML → Markdown
   -------------------------------------------------------------------------- */

function escapeMarkdown(text = '') {
  return String(text)
    .replace(/\u00a0/g, ' ')
    .replace(/\\/g, '\\\\')
    .replace(/([`*_[\]~])/g, '\\$1')
}

function alignmentOf(node) {
  const inline = node.style?.textAlign
  const attribute = node.getAttribute?.('align')
  const value = String(inline || attribute || '').toLowerCase()
  return ['left', 'center', 'right'].includes(value) ? value : ''
}

function hasBlockChild(node) {
  return Array.from(node.children || []).some((child) => BLOCK_TAGS.has(child.tagName))
}

function serializeInline(node) {
  if (!node) return ''
  if (node.nodeType === 3) return escapeMarkdown(node.textContent)
  if (node.nodeType !== 1) return ''

  const tag = node.tagName
  const children = Array.from(node.childNodes).map(serializeInline).join('')

  switch (tag) {
    case 'STRONG':
    case 'B':
      return children ? `**${children}**` : ''
    case 'EM':
    case 'I':
      return children ? `*${children}*` : ''
    case 'U':
      return children ? `<u>${children}</u>` : ''
    case 'S':
    case 'STRIKE':
    case 'DEL':
      return children ? `~~${children}~~` : ''
    case 'CODE':
      return `\`${node.textContent}\``
    case 'A': {
      const href = node.getAttribute('href') || ''
      return children ? `[${children}](${href})` : ''
    }
    case 'BR':
      return '\n'
    case 'SPAN': {
      let result = children
      const style = node.style
      if (style?.textDecoration?.includes('line-through')) result = `~~${result}~~`
      if (style?.textDecoration?.includes('underline')) result = `<u>${result}</u>`
      if (style?.fontStyle === 'italic') result = `*${result}*`
      if (style?.fontWeight === 'bold' || Number(style?.fontWeight) >= 600) result = `**${result}**`
      return result
    }
    default:
      return children
  }
}

function serializeTable(table) {
  const rows = Array.from(table.querySelectorAll('tr')).map((row) =>
    Array.from(row.cells).map((cell) => ({
      text: serializeInline(cell).replace(/\n+/g, ' ').replace(/\|/g, '\\|').trim(),
      align: alignmentOf(cell)
    }))
  )

  if (!rows.length) return ''
  const header = rows[0]
  const body = rows.slice(1)
  const separator = header.map((cell) => {
    if (cell.align === 'center') return ':---:'
    if (cell.align === 'right') return '---:'
    return '---'
  })

  const line = (cells) => `| ${cells.join(' | ')} |`
  return [
    line(header.map((cell) => cell.text)),
    line(separator),
    ...body.map((row) => line(header.map((_, column) => row[column]?.text ?? '')))
  ].join('\n')
}

function serializeBlock(node) {
  if (!node) return ''
  if (node.nodeType === 3) {
    const text = node.textContent.replace(/\u00a0/g, ' ').trim()
    return text ? escapeMarkdown(text) : ''
  }
  if (node.nodeType !== 1) return ''

  const tag = node.tagName

  if (/^H[1-6]$/.test(tag)) {
    const content = serializeInline(node).trim()
    if (!content) return ''
    const alignment = alignmentOf(node)
    if (alignment) {
      return `<${tag.toLowerCase()} style="text-align:${alignment}">${content}</${tag.toLowerCase()}>`
    }
    return `${'#'.repeat(Number(tag[1]))} ${content}`
  }

  if (tag === 'P' || tag === 'DIV') {
    if (tag === 'DIV' && hasBlockChild(node)) {
      return Array.from(node.childNodes).map(serializeBlock).filter(Boolean).join('\n\n')
    }
    const content = serializeInline(node).trim()
    if (!content) return ''
    const alignment = alignmentOf(node)
    return alignment ? `<p style="text-align:${alignment}">${content}</p>` : content
  }

  if (tag === 'UL' || tag === 'OL') {
    return Array.from(node.children)
      .filter((child) => child.tagName === 'LI')
      .map((item, index) => {
        const content = serializeInline(item).replace(/\n+/g, ' ').trim()
        return `${tag === 'OL' ? `${index + 1}. ` : '- '}${content}`
      })
      .join('\n')
  }

  if (tag === 'PRE') {
    const code = node.textContent.replace(/\u00a0/g, ' ').replace(/\n$/, '')
    return `\`\`\`\n${code}\n\`\`\``
  }

  if (tag === 'TABLE') {
    return serializeTable(node)
  }

  if (tag === 'BLOCKQUOTE') {
    const content = serializeInline(node).trim()
    return content
      ? content.split('\n').map((line) => `> ${line}`).join('\n')
      : ''
  }

  if (tag === 'HR') return '---'

  const inline = serializeInline(node).trim()
  return inline
}

export function htmlToMarkdown(html = '') {
  if (typeof document === 'undefined') return String(html ?? '')

  const container = document.createElement('div')
  container.innerHTML = String(html ?? '')

  return Array.from(container.childNodes)
    .map(serializeBlock)
    .filter((block) => block && block.trim())
    .join('\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}
