#!/usr/bin/env node

/**
 * Build selectivo para CI.
 *
 * Compara el commit anterior del push con el actual y compila solo los
 * workspaces afectados (apps y librerías). Si el cambio toca configuración
 * global, iconos o el propio pipeline, cae a `npm run build:production`.
 *
 * El sitio publicado se completa con el artefacto de la ejecución anterior
 * (la workflow lo restaura en `dist/`): aquí solo sobrescribimos las apps que
 * se recompilan. Si esa restauración no existe, se hace build completo.
 *
 * Variables de entorno:
 *   BASE_SHA  commit anterior (github.event.before)
 *   HEAD_SHA  commit actual (github.sha); por defecto HEAD
 *   FULL_BUILD=1  fuerza el build completo
 *   RESTORE_OK=1  la workflow restauró el sitio anterior en `dist/`
 *   DRY_RUN=1     imprime lo que compilaría sin ejecutar nada
 */

import { execFileSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')

/** Archivos raíz que obligan a recompilar todo. */
const GLOBAL_FILES = new Set([
  'package.json',
  'package-lock.json',
  'vitest.config.js',
  'vitest.setup.js',
  'index.html',
  'sw.js'
])
const GLOBAL_PREFIXES = ['scripts/']

/** Rutas que no afectan a ningún build. */
const IGNORED_PATTERNS = [
  /\.md$/i,
  /^ai\//,
  /^doc\//,
  /^\.github\//,
  /^\.git\//,
  /^CHANGELOG/i,
  /^LICENSE/i
]

const log = (message) => console.log(`[build-changed] ${message}`)

function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'))
}

function loadProjects() {
  const workspaceDirs = readJson(path.join(root, 'package.json')).workspaces || []
  return workspaceDirs.map((dir) => {
    const manifest = readJson(path.join(root, dir, 'package.json'))
    return {
      dir,
      name: manifest.name,
      isApp: !dir.startsWith('shared/'),
      deps: Object.keys({
        ...(manifest.dependencies || {}),
        ...(manifest.peerDependencies || {})
      })
    }
  })
}

function resolveCommit(sha) {
  if (!sha || /^0+$/.test(sha)) return null
  try {
    return execFileSync('git', ['rev-parse', '--verify', `${sha}^{commit}`], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim()
  } catch {
    return null
  }
}

function changedFiles(base, head) {
  const output = execFileSync('git', ['diff', '--name-only', '--diff-filter=ACMRD', base, head], {
    cwd: root,
    encoding: 'utf8'
  })
  return output.split('\n').map((line) => line.trim()).filter(Boolean)
}

function projectForFile(file, projects) {
  let match = null
  for (const project of projects) {
    if (file === project.dir || file.startsWith(`${project.dir}/`)) {
      if (!match || project.dir.length > match.dir.length) match = project
    }
  }
  return match
}

/** Ordena las librerías para que cada una se compile después de sus dependencias. */
function sortByDependencies(libs) {
  const byName = new Map(libs.map((lib) => [lib.name, lib]))
  const depth = new Map()

  const visit = (lib, seen = new Set()) => {
    if (depth.has(lib.name)) return depth.get(lib.name)
    if (seen.has(lib.name)) return 0
    seen.add(lib.name)
    let value = 0
    for (const dep of lib.deps) {
      const target = byName.get(dep)
      if (target) value = Math.max(value, visit(target, seen) + 1)
    }
    depth.set(lib.name, value)
    return value
  }

  return [...libs].sort((a, b) => visit(a) - visit(b))
}

function run(script) {
  if (process.env.DRY_RUN === '1') {
    log(`(dry-run) npm ${script}`)
    return
  }
  log(`npm ${script}`)
  execFileSync('npm', script.split(' '), { cwd: root, stdio: 'inherit' })
}

function fullBuild(reason) {
  log(`build completo: ${reason}`)
  run('run build:production')
}

function main() {
  if (process.env.FULL_BUILD === '1') return fullBuild('FULL_BUILD=1')

  // Sin el sitio anterior no hay forma de conservar las apps sin cambios.
  // (No basta con mirar `dist/index.html`: el portal está versionado.)
  if (process.env.RESTORE_OK !== '1' || !existsSync(path.join(distDir, 'index.html'))) {
    return fullBuild('no se restauró el despliegue anterior')
  }

  const base = resolveCommit(process.env.BASE_SHA)
  const head = resolveCommit(process.env.HEAD_SHA || 'HEAD')
  if (!base || !head) return fullBuild('no se pudo resolver el rango de commits')

  const files = changedFiles(base, head)
  if (files.length === 0) {
    log('sin archivos modificados; se conserva el despliegue anterior')
    return
  }

  const projects = loadProjects()
  const changed = new Set()
  const unknown = []

  for (const file of files) {
    // La documentación no compila nada, aunque viva dentro de un proyecto.
    if (IGNORED_PATTERNS.some((pattern) => pattern.test(file))) continue

    const project = projectForFile(file, projects)
    if (project) {
      changed.add(project)
      continue
    }
    if (GLOBAL_FILES.has(file) || GLOBAL_PREFIXES.some((prefix) => file.startsWith(prefix))) {
      return fullBuild(`cambió ${file}`)
    }
    unknown.push(file)
  }

  if (unknown.length > 0) {
    return fullBuild(`archivos fuera de los workspaces: ${unknown.join(', ')}`)
  }
  if (changed.size === 0) {
    log('solo cambios de documentación; no hay nada que compilar')
    return
  }

  const libs = sortByDependencies([...changed].filter((project) => !project.isApp))
  const apps = [...changed].filter((project) => project.isApp)

  log(`librerías: ${libs.map((lib) => lib.name).join(', ') || 'ninguna'}`)
  log(`apps: ${apps.map((app) => app.name).join(', ') || 'ninguna'}`)

  // Las apps empaquetan las librerías desde su código fuente (alias en vite),
  // así que un cambio en una librería no obliga a recompilar todas las apps,
  // pero sí conviene saber cuáles quedan con el código anterior.
  const staleApps = projects.filter(
    (project) =>
      project.isApp &&
      !changed.has(project) &&
      project.deps.some((dep) => libs.some((lib) => lib.name === dep))
  )
  for (const app of staleApps) {
    log(`aviso: ${app.name} usa una librería modificada y no se recompiló`)
  }

  for (const lib of libs) run(`run build --workspace=${lib.name}`)
  for (const app of apps) run(`run build --workspace=${app.name}`)

  if (process.env.DRY_RUN === '1') return

  mkdirSync(distDir, { recursive: true })
  for (const file of ['index.html', 'sw.js']) {
    const source = path.join(root, file)
    if (existsSync(source)) cpSync(source, path.join(distDir, file))
  }

  for (const app of apps) {
    const appDist = path.join(root, app.dir, 'dist')
    if (!existsSync(appDist)) {
      throw new Error(`${app.name}: no se generó ${app.dir}/dist`)
    }
    rmSync(path.join(distDir, app.dir), { recursive: true, force: true })
    cpSync(appDist, path.join(distDir, app.dir), { recursive: true })
    log(`dist/${app.dir} actualizado`)
  }
}

try {
  main()
} catch (error) {
  console.error(`[build-changed] ${error.message}`)
  process.exit(1)
}
