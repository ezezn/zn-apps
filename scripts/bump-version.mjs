#!/usr/bin/env node

/**
 * Script auxiliar para calcular el nuevo número de versión SemVer y actualizar
 * el package.json del proyecto indicado.
 *
 * Uso:
 *   node scripts/bump-version.mjs <ruta-proyecto> <major|minor|patch>
 */

import fs from 'node:fs'
import path from 'node:path'

const [projectPath, releaseType] = process.argv.slice(2)

if (!projectPath || !releaseType) {
  console.error('Uso: node scripts/bump-version.mjs <ruta-proyecto> <major|minor|patch>')
  process.exit(1)
}

const validTypes = ['major', 'minor', 'patch']
const normalizedType = releaseType.toLowerCase()

if (!validTypes.includes(normalizedType)) {
  console.error(`Tipo de release inválido: "${releaseType}". Opciones válidas: ${validTypes.join(', ')}`)
  process.exit(1)
}

const packageJsonPath = path.resolve(projectPath, 'package.json')

if (!fs.existsSync(packageJsonPath)) {
  console.error(`No se encontró package.json en: ${packageJsonPath}`)
  process.exit(1)
}

const raw = fs.readFileSync(packageJsonPath, 'utf8')
const pkg = JSON.parse(raw)
const currentVersion = pkg.version || '0.0.0'

const parts = currentVersion.split('.').map((p) => parseInt(p, 10))
if (parts.length !== 3 || parts.some(isNaN)) {
  console.error(`Versión actual inválida en package.json: "${currentVersion}". Se esperaba formato x.y.z`)
  process.exit(1)
}

let [major, minor, patch] = parts

switch (normalizedType) {
  case 'major':
    major += 1
    minor = 0
    patch = 0
    break
  case 'minor':
    minor += 1
    patch = 0
    break
  case 'patch':
    patch += 1
    break
}

const newVersion = `${major}.${minor}.${patch}`
pkg.version = newVersion

fs.writeFileSync(packageJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')

console.log(`✓ ${pkg.name || projectPath}: ${currentVersion} → ${newVersion} (${normalizedType})`)
