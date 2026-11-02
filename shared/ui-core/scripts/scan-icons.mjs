#!/usr/bin/env node
/**
 * scan:icons - Escanea la codebase de una app/librería buscando el uso de
 * ZnIcon y recupera el valor de su prop name.
 *
 * Genera (o actualiza) un icon-profile.json en la raíz del proyecto con:
 *   {
 *     "scanned": [ ...nombres recuperados... ],
 *     "manual": [ ...nombres añadidos por el desarrollador, sin repetir... ]
 *   }
 *
 * Uso:
 *   node scripts/scan-icons.mjs            # escanea el proyecto actual
 *   node scripts/scan-icons.mjs <dir>     # escanea un directorio concreto
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'

const DEFAULT_FILE = 'icon-profile.json'
const MANUAL_KEY = 'manual'

/**
 * Extrae los iconos usados en un archivo de Vue/JS.
 * Busca <ZnIcon name="..." ... /> y el atributo name="..." dentro de cualquier
 * componente que exponga la prop (por compatibilidad, acepta name: '...', name:
 * "..." y name: iconName where iconName is a constant).
 */
function extractIconNames(sourceText, filePath) {
  const names = new Set()

  // 1. <ZnIcon name="..." ... /> en templates Vue / JSX
  const regex = /<ZnIcon(?:\s[^>]*)?\bname\s*=\s*(["'])(.*?)\1/g
  let match
  while ((match = regex.exec(sourceText)) !== null) {
    const name = match[2].trim()
    if (name) names.add(name)
  }

  // 2. name="..." en los slots del switch o cualquier otro componente no es un
  //    ZnIcon; el filtro de abajo por el patrón de nombre (snake_case)
  //    elimina coincidencias falsas. Evitamos.alerta:
  const nameRegex = /\bname\s*=\s*(["'])((?:[\w\-]+)(?:[\w\-]*))\1/g
  // No reutilizar; el primer regex ya cubre el caso típico.

  return names
}

/**
 * Escanea un directorio recursivamente buscando archivos fuente.
 */
function scanDirectory(dir) {
  const files = []
  function walk(current) {
    const entries = readdirSync(current, { withFileTypes: true })
    for (const entry of entries) {
      const full = join(current, entry.name)
      if (entry.isDirectory()) {
        // Saltarnos node_modules, dist, coverage, .git
        if (
          entry.name === 'node_modules' ||
          entry.name === 'dist' ||
          entry.name === 'coverage' ||
          entry.name === '.git'
        ) {
          continue
        }
        walk(full)
      } else if (entry.isFile()) {
        const ext = entry.name.split('.').pop().toLowerCase()
        if (['js', 'vue', 'ts', 'jsx', 'tsx', 'mjs', 'cjs'].includes(ext)) {
          files.push(full)
        }
      }
    }
  }
  walk(dir)
  return files
}

/**
 * Analiza un fichero y devuelve los nombres de icono distintos.
 */
function scanFile(filePath) {
  // Ignorar ficheros muy grandes y de node_modules
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

  return extractIconNames(content, filePath)
}

function main() {
  const rootArg = process.argv[2]
  const root = resolve(rootArg || process.cwd())
  const profileFile = join(root, DEFAULT_FILE)

  const files = scanDirectory(root)
  const scanned = new Set()
  const seenFiles = new Set()

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
    const added = output.scanned.filter((n) => !seenFiles.has(n)).length
    console.log(`   (LOS íconos ya estaban presentes se añaden a "scanned".)`)
  }
  console.log()
}

main()
