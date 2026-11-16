#!/usr/bin/env node

// Verifica que los enlaces relativos y las anclas de la documentación (`doc/` y
// `ai/` de la raíz y de cada proyecto) apunten a archivos y secciones reales.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const root = process.cwd()

const docRoots = [
  'ai',
  'doc',
  'shared/ui-core',
  'shared/settings-core',
  'shared/ui-about',
  'shared/pwa-integration',
  'shared/ui-data-core',
  'shared/ui-data-form',
  'shared/ui-data-view',
  'shared/ui-data-editor',
  'shared/ui-data-richtext',
  'zound-box',
  'kitchensink'
]

const entryFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  'README.md',
  'shared/README.md',
  'zound-box/README.md',
  'kitchensink/README.md',
  '.github/copilot-instructions.md'
]

function collectMarkdown(target, files) {
  const absolute = path.resolve(root, target)
  if (!existsSync(absolute)) return files

  if (statSync(absolute).isFile()) {
    if (absolute.endsWith('.md')) files.push(absolute)
    return files
  }

  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue
    collectMarkdown(path.join(target, entry.name), files)
  }
  return files
}

const files = new Set(entryFiles.map((entry) => path.resolve(root, entry)))
for (const docRoot of docRoots) {
  collectMarkdown(docRoot, []).forEach((file) => files.add(file))
}
for (const docFolder of ['doc', 'ai']) {
  const projectDocs = readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist')
    .map((entry) => path.join(entry.name, docFolder))
  for (const folder of projectDocs) collectMarkdown(folder, []).forEach((file) => files.add(file))
}

/** Encabezados como los indexa GitHub: minúsculas, sin puntuación, espacios a guiones. */
function headingSlugs(markdown) {
  return [...markdown.matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) =>
    match[1]
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-')
  )
}

/** Ignora ejemplos dentro de bloques e inline code. */
function stripCode(markdown) {
  return markdown.replace(/```[\s\S]*?```/g, '').replace(/`[^`\n]*`/g, '')
}

const problems = []
let checkedLinks = 0

for (const file of files) {
  const markdown = readFileSync(file, 'utf8')
  const relativeFile = path.relative(root, file)

  for (const match of stripCode(markdown).matchAll(/\]\(([^)\s]+)\)/g)) {
    const link = match[1]
    if (/^(https?:|mailto:|tel:|#)/.test(link)) continue

    checkedLinks += 1
    const [rawTarget, ...anchorParts] = link.split('#')
    const anchor = anchorParts.join('#')
    const target = path.resolve(path.dirname(file), decodeURIComponent(rawTarget))

    if (!existsSync(target)) {
      problems.push(`${relativeFile}: enlace roto → ${link}`)
      continue
    }
    if (!anchor) continue

    if (statSync(target).isDirectory()) {
      problems.push(`${relativeFile}: ancla en un directorio → ${link}`)
      continue
    }
    if (!target.endsWith('.md')) continue

    const slugs = headingSlugs(readFileSync(target, 'utf8'))
    let decodedAnchor = anchor
    try {
      decodedAnchor = decodeURIComponent(anchor)
    } catch {
      // un ancla mal codificada ya no coincide con ningún encabezado
    }
    if (!slugs.includes(decodedAnchor.toLowerCase())) {
      problems.push(`${relativeFile}: ancla inexistente → ${link}`)
    }
  }
}

if (problems.length > 0) {
  console.error('Falló la verificación de enlaces de documentación:')
  for (const problem of problems) console.error(`- ${problem}`)
  process.exit(1)
}

console.log(`Enlaces de documentación correctos: ${checkedLinks} enlaces en ${files.size} archivos.`)
