#!/usr/bin/env node
/**
 * scan:icons — Escanea la codebase de una app/librería buscando el uso de
 * ZnIcon y recupera el valor de su prop `name`.
 *
 * Genera (o actualiza) un icon-profile.json en la raíz del proyecto:
 *
 *   {
 *     "scanned": [ "nombres recuperados..." ],
 *     "manual":  [ "nombres añadidos por el desarrollador..." ]
 *   }
 *
 * Uso:
 *   node scripts/scan-icons.mjs                 # escanea el proyecto actual
 *   node scripts/scan-icons.mjs <dir>           # escanea un directorio
 *   node scripts/scan-icons.mjs --dir <dir>     # variante con --dir
 *   node scripts/scan-icons.mjs --file <path>   # escanea un único fichero
 *
 * El escáner coincide únicamente con la etiqueta <ZnIcon ...> y extrae el
 * atributo `name` (no :name, ni $name, ni coincidencias de otros componentes).
 * Ignora los comentarios, los bloques <pre> y cualquier atributo que no sea
 * el nombre de un ícono real.
 *
 * Nota: el directorio scripts/ se salta siempre para evitar que este
 * mismo script se Escanee sobre sí mismo.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const DEFAULT_FILE = 'icon-profile.json'
const MANUAL_KEY = 'manual'

// Palabras reservadas / comunes que no son nombres de íconos.
const RESERVED_WORDS = new Set([
  'name', 'icon', 'btn', 'class', 'type', 'value', 'ref', 'key',
  'function', 'const', 'let', 'var', 'return', 'import', 'export',
  'from', 'as', 'await', 'async', 'new', 'delete', 'void', 'typeof',
  'instanceof', 'in', 'of', 'if', 'else', 'switch', 'case', 'break',
  'while', 'do', 'for', 'try', 'catch', 'finally', 'throw', 'debugger',
  'this', 'super', 'extends', 'window', 'document', 'exportDefault',
  'router', 'route', 'routes', 'Vue', 'createApp', 'mount', 'createRouter'
])

/**
 * Extrae los iconos usados en un archivo Vue/JS.
 *
 * Solo considera la etiqueta <ZnIcon ...> y su atributo `name`.
 * El regex requiere:
 *   - <ZnIcon seguido de cualquier cosa excepto '>' (los atributos del tag)
 *   - luego la palabra 'name'
 *   - luego = y una comilla simple o doble
 *   - el valor dentro de la misma etiqueta (no cruzando '>')
 *
 * El valor solo se acepta si es un nombre de ícono real (snake_case, sin
 * puntos ni caractéres especiales), para descartar falsos positivos de
 * variables JS, código en <pre>, o :name / $name v-bind.
 */
function extractIconNames(sourceText) {
  const names = new Set()

  // /<ZnIcon\b          → abre el tag ZnIcon
  // (?:[^>]*?\bname\b)?  → opcionalmente coincide con cualquier cosa hasta
  //                        la palabra 'name' (evitando :name / $name)
  // \s*=\s*              → '='
  // (["'])               → captura el tipo de comilla
  // ([^"']*)            → el valor del nombre (sin comillas internas)
  // \1                   → cierra con la misma comilla
  const ICON_TAG_RE = /<ZnIcon\b(?:[^>]*?\bname\b\s*=\s*["']([^"']*)["'])?/g

  // Solo los nombres de íconos válidos en Material Design (snake_case, sin '.').
  const ICON_NAME_RE = /^[a-z0-9]+(?:_[a-z0-9]+)*$/

  let match
  while ((match = ICON_TAG_RE.exec(sourceText)) !== null) {
    const tag = match[0]
    // Ignorar etiquetas que usan :name o $name (v-bind / dynamic vars)
    if (/\bname\s*=/i.test(tag) === false) continue

    // Capturar el valor del nombre de la etiqueta
    const nameMatch = tag.match(/\bname\s*=\s*["']([^"']*)["']/)
    if (!nameMatch) continue

    const name = nameMatch[1].trim()
    // Validar que sea un nombre de ícono real (snake_case sin puntos).
    // Esto elimina falsos positivos como "..." (puntos), "btn.icon"
    // o cualquier cadena que no cumpla el patrón de nombre de icono.
    if (!ICON_NAME_RE.test(name)) continue

    // Descartar palabras reservadas / comunes que no son nombres de íconos.
    if (RESERVED_WORDS.has(name)) continue

    names.add(name)
  }

  return names
}

/**
 * Escanea un directorio recursivamente buscando archivos fuente.
 *
 * Se salta el directorio scripts/ para evitar que este mismo script se
 * Escanee sobre sí mismo.
 */
function scanDirectory(dir) {
  const files = []
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      // Saltarnos node_modules, dist, coverage, .git, scripts
      if (
        entry.name === 'node_modules' ||
        entry.name === 'dist' ||
        entry.name === 'coverage' ||
        entry.name === '.git' ||
        entry.name === 'scripts'
      ) {
        continue
      }
      files.push(...scanDirectory(full))
    } else if (entry.isFile()) {
      const ext = entry.name.split('.').pop().toLowerCase()
      if (['js', 'vue', 'ts', 'jsx', 'tsx', 'mjs', 'cjs'].includes(ext)) {
        files.push(full)
      }
    }
  }
  return files
}

/**
 * Analiza un fichero y devuelve los nombres de icono distintos.
 */
function scanFile(filePath) {
  try {
    const stat = statSync(filePath)
    if (stat.size > 2 * 1024 * 1024) return new Set()
  } catch {
    return new Set()
  }

  let content
  try {
    content = readFileSync(filePath, 'utf8')
  } catch {
    return new Set()
  }

  return extractIconNames(content)
}

function main() {
  const args = process.argv.slice(2)
  let root = process.cwd()
  let singleFile = null

  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--dir' || a === '--file') {
      const val = args[i + 1]
      if (val) {
        if (a === '--dir') root = resolve(val)
        else singleFile = resolve(val)
        i++
      }
    } else if (!a.startsWith('-')) {
      root = resolve(a)
    }
  }

  if (singleFile) {
    const names = scanFile(singleFile)
    const namesArr = [...names].sort((a, b) => a.localeCompare(b, 'es-ES'))
    console.log(`\n📋 Íconos encontrados en ${singleFile}: ${namesArr.join(', ') || '(ninguno)'}`)
    return
  }

  const profileFile = join(root, DEFAULT_FILE)

  const files = scanDirectory(root)
  const scanned = new Set()

  for (const file of files) {
    const names = scanFile(file)
    for (const name of names) {
      scanned.add(name)
    }
  }

  // Cargar manuales ya existentes (si los hay)
  const manual = new Set()
  let exists = false
  if (existsSync(profileFile)) {
    exists = true
    try {
      const data = JSON.parse(readFileSync(profileFile, 'utf8'))
      if (Array.isArray(data?.[MANUAL_KEY])) {
        for (const item of data[MANUAL_KEY]) {
          if (typeof item === 'string' && item.trim()) manual.add(item.trim())
        }
      }
    } catch {
      // El fichero está corrupto; empezamos de cero
    }
  }

  // Unimos: scanned + manual. Los manuales nunca se sobrescriben ni se eliminan.
  const finalScanned = new Set(scanned)
  for (const m of manual) finalScanned.add(m)

  const output = {
    scanned: [...finalScanned].sort((a, b) => a.localeCompare(b, 'es-ES')),
    manual: [...manual].sort((a, b) => a.localeCompare(b, 'es-ES')),
  }

  writeFileSync(profileFile, JSON.stringify(output, null, 2) + '\n', 'utf8')

  console.log(`\n✅ icon-profile.json actualizado en ${profileFile}`)
  console.log(`   Proyecto: ${root}`)
  console.log(`   Archivos escaneados: ${files.length}`)
  console.log(`   Iconos en "scanned": ${output.scanned.length}`)
  console.log(`   Iconos en "manual":  ${output.manual.length}`)
  if (exists) {
    console.log(`   (El fichero ya existía; los manuales se preservan y los nuevos íconos se añaden a "scanned".)`)
  }
  console.log()
}

main()
