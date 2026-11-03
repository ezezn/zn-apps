#!/usr/bin/env node
/**
 * scan-icons — Detecta los iconos de Material Design que usa un proyecto
 * (app o librería) mediante las etiquetas `<ZnIcon>` de su código fuente.
 *
 * Escribe/actualiza `icon-profile.json` en la raíz del proyecto escaneado:
 *
 *   {
 *     "scanned": ["home", "play_arrow", ...],   // detectados por el escáner
 *     "manual":  ["favorite", ...]              // añadidos por el desarrollador
 *   }
 *
 * `scanned` se recalcula en cada ejecución. `manual` nunca se modifica: sirve
 * para iconos que el escáner no puede resolver (por ejemplo `:name="icon"` con
 * una variable) o para declarar una colección completa a propósito, como hace
 * kitchensink con el catálogo de Material Icons.
 *
 * Uso:
 *   node scripts/scan-icons.mjs               # escanea el directorio actual
 *   node scripts/scan-icons.mjs <dir>         # escanea otro proyecto
 *
 * Solo se aceptan valores estáticos (`name="home"`). Los bindings dinámicos
 * (`:name`, `v-bind:name`) y `@` se ignoran, porque su valor no puede
 * determinarse sin ejecutar la aplicación.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const PROFILE_FILE = 'icon-profile.json'
const SCANNED_KEY = 'scanned'
const MANUAL_KEY = 'manual'

/** Familias válidas de Material Icons (deben coincidir con ui-core). */
const ICON_FAMILIES = ['filled', 'outlined', 'round', 'sharp', 'two-tone']

/** Carpetas que nunca contienen código de la app. */
const SKIPPED_DIRS = new Set(['node_modules', 'dist', 'coverage', '.git', 'scripts', '__tests__'])

const SOURCE_EXTENSIONS = new Set(['js', 'vue', 'ts', 'jsx', 'tsx', 'mjs', 'cjs'])

/** Nombres válidos de iconos Material (snake_case, sin puntos). */
const ICON_NAME_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/

/** Palabras que nunca son nombres de iconos. */
const RESERVED_WORDS = new Set([
  'name', 'icon', 'btn', 'class', 'type', 'value', 'ref', 'key',
  'function', 'const', 'let', 'var', 'return', 'import', 'export',
  'from', 'as', 'await', 'async', 'new', 'delete', 'void', 'typeof',
  'instanceof', 'in', 'of', 'if', 'else', 'switch', 'case', 'break',
  'while', 'do', 'for', 'try', 'catch', 'finally', 'throw', 'debugger',
  'this', 'super', 'extends', 'window', 'document',
  'router', 'route', 'routes', 'Vue', 'createApp', 'mount', 'createRouter'
])

/** Atributos estáticos de una etiqueta: `key="value"` o `key='value'`. */
const ATTRIBUTE_RE = /([^\s"'<>/=]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g

/** Etiqueta de apertura de ZnIcon (no cruza un `>`). */
const ICON_TAG_RE = /<ZnIcon\b([^>]*)>/g

/**
 * Lee un atributo estático. Las claves con prefijo (`:name`, `v-bind:name`,
 * `@name`) no coinciden, por lo que quedan fuera automáticamente.
 */
function readStaticAttribute(attributes, attributeName) {
  ATTRIBUTE_RE.lastIndex = 0
  let match
  while ((match = ATTRIBUTE_RE.exec(attributes)) !== null) {
    if (match[1] !== attributeName) continue
    return (match[2] ?? match[3] ?? '').trim()
  }
  return ''
}

/** Elimina comentarios HTML y de bloque para no escanear ejemplos comentados. */
function stripComments(source) {
  return source.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
}

/**
 * Extrae los iconos y las familias declaradas en un fichero fuente.
 *
 * @param {string} source
 * @returns {{ names: Set<string>, families: Set<string> }}
 */
function extractIconUsage(source) {
  const names = new Set()
  const families = new Set()
  const clean = stripComments(source)

  let match
  while ((match = ICON_TAG_RE.exec(clean)) !== null) {
    const attributes = match[1]

    const name = readStaticAttribute(attributes, 'name')
    if (name && ICON_NAME_RE.test(name) && !RESERVED_WORDS.has(name)) {
      names.add(name)
    }

    const family = readStaticAttribute(attributes, 'family')
    if (family && ICON_FAMILIES.includes(family)) {
      families.add(family)
    }
  }

  return { names, families }
}

/** Recorre recursivamente un proyecto y devuelve sus ficheros fuente. */
function collectSourceFiles(dir) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)

    if (entry.isDirectory()) {
      if (SKIPPED_DIRS.has(entry.name)) continue
      files.push(...collectSourceFiles(full))
      continue
    }

    if (!entry.isFile()) continue
    const extension = entry.name.split('.').pop().toLowerCase()
    if (!SOURCE_EXTENSIONS.has(extension)) continue
    if (/\.(test|spec)\.[^.]+$/.test(entry.name)) continue
    files.push(full)
  }
  return files
}

function scanProject(root) {
  const names = new Set()
  const families = new Set()

  const files = collectSourceFiles(root)
  for (const file of files) {
    // Protección ante ficheros enormes (bundles, fixtures, etc.).
    if (statSync(file).size > 2 * 1024 * 1024) continue

    const usage = extractIconUsage(readFileSync(file, 'utf8'))
    for (const name of usage.names) names.add(name)
    for (const family of usage.families) families.add(family)
  }

  return { files, names, families }
}

function readManualIcons(profileFile) {
  const manual = new Set()
  if (!existsSync(profileFile)) return manual

  try {
    const data = JSON.parse(readFileSync(profileFile, 'utf8'))
    if (Array.isArray(data?.[MANUAL_KEY])) {
      for (const item of data[MANUAL_KEY]) {
        if (typeof item === 'string' && item.trim()) manual.add(item.trim())
      }
    }
  } catch {
    console.warn(`⚠️  ${profileFile} no es JSON válido; se reconstruye solo con "scanned".`)
  }
  return manual
}

function sortNames(values) {
  return [...values].sort((a, b) => a.localeCompare(b, 'en'))
}

function main() {
  const rootArg = process.argv.slice(2).find((arg) => !arg.startsWith('-'))
  const root = resolve(rootArg || process.cwd())
  const profileFile = join(root, PROFILE_FILE)

  const { files, names, families } = scanProject(root)
  const manual = readManualIcons(profileFile)

  const profile = {
    [SCANNED_KEY]: sortNames(names),
    [MANUAL_KEY]: sortNames(manual)
  }

  writeFileSync(profileFile, JSON.stringify(profile, null, 2) + '\n', 'utf8')

  console.log(`\n🔍 ${root}`)
  console.log(`   Archivos fuente escaneados: ${files.length}`)
  console.log(`   Iconos en "scanned": ${profile.scanned.length}`)
  console.log(`   Iconos en "manual":  ${profile.manual.length}`)
  if (profile.scanned.length > 0) {
    console.log(`   Nombres: ${profile.scanned.join(', ')}`)
  }
  console.log(`   Familias usadas: ${[...families].sort().join(', ') || '(filled por defecto)'}`)
  console.log(`   → ${profileFile}\n`)
}

main()
