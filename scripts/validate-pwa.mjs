#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const distRoot = path.resolve(process.argv[2] || 'dist')
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const requiredIconSizes = [192, 512]

function validateApp(appDir) {
  const appName = path.basename(appDir)
  const manifestPath = path.join(appDir, 'manifest.webmanifest')
  const errors = []

  if (!existsSync(manifestPath)) {
    return [`${appName}: falta manifest.webmanifest`]
  }

  let manifest
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch (error) {
    return [`${appName}: manifest.webmanifest no es JSON válido (${error.message})`]
  }

  if (!manifest.name && !manifest.short_name) errors.push(`${appName}: falta name o short_name`)
  if (!manifest.start_url) errors.push(`${appName}: falta start_url`)
  if (!manifest.scope) errors.push(`${appName}: falta scope`)
  if (!['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)) {
    errors.push(`${appName}: display debe ser standalone, fullscreen o minimal-ui`)
  }
  if (manifest.prefer_related_applications === true) {
    errors.push(`${appName}: prefer_related_applications debe ser false o estar omitido`)
  }

  if (manifest.start_url && manifest.scope) {
    try {
      const origin = 'https://pwa-validation.invalid'
      const scopeUrl = new URL(manifest.scope, origin)
      const startUrl = new URL(manifest.start_url, scopeUrl)
      const expectedScope = `/zn-apps/${appName}/`
      if (scopeUrl.origin !== origin || startUrl.origin !== origin) {
        errors.push(`${appName}: start_url y scope deben pertenecer al mismo sitio`)
      } else if (!scopeUrl.pathname.startsWith(expectedScope)) {
        errors.push(`${appName}: scope debe quedar bajo ${expectedScope}`)
      } else if (!startUrl.pathname.startsWith(scopeUrl.pathname)) {
        errors.push(`${appName}: start_url debe quedar dentro del scope`)
      }
    } catch {
      errors.push(`${appName}: start_url o scope no son URL válidas`)
    }
  }

  const icons = Array.isArray(manifest.icons) ? manifest.icons : []
  for (const size of requiredIconSizes) {
    const sizeLabel = `${size}x${size}`
    const icon = icons.find((candidate) => (
      candidate?.type === 'image/png'
      && String(candidate.sizes || '').split(/\s+/).includes(sizeLabel)
    ))

    if (!icon) {
      errors.push(`${appName}: falta un icono PNG ${sizeLabel} en el manifiesto`)
      continue
    }

    if (!String(icon.purpose || 'any').split(/\s+/).includes('any')) {
      errors.push(`${appName}: el icono ${sizeLabel} debe incluir purpose "any"`)
    }

    if (!icon.src || path.isAbsolute(icon.src) || /^[a-z][a-z\d+.-]*:/i.test(icon.src)) {
      errors.push(`${appName}: src del icono ${sizeLabel} debe ser una ruta relativa a la app`)
      continue
    }

    const iconPath = path.resolve(appDir, decodeURIComponent(icon.src.split(/[?#]/, 1)[0]))
    const appRoot = path.resolve(appDir)
    if (!iconPath.startsWith(`${appRoot}${path.sep}`)) {
      errors.push(`${appName}: el icono ${sizeLabel} apunta fuera de la app`)
      continue
    }
    if (!existsSync(iconPath) || !statSync(iconPath).isFile()) {
      errors.push(`${appName}: no existe el icono ${icon.src}`)
      continue
    }

    const png = readFileSync(iconPath)
    if (png.length < 24 || !png.subarray(0, 8).equals(pngSignature)) {
      errors.push(`${appName}: ${icon.src} no es un PNG válido`)
      continue
    }

    const width = png.readUInt32BE(16)
    const height = png.readUInt32BE(20)
    if (width !== size || height !== size) {
      errors.push(`${appName}: ${icon.src} declara ${sizeLabel}, pero mide ${width}x${height}`)
    }
  }

  return errors
}

if (!existsSync(distRoot) || !statSync(distRoot).isDirectory()) {
  console.error(`No existe el directorio de distribución: ${distRoot}`)
  process.exit(1)
}

const appDirs = readdirSync(distRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(distRoot, entry.name))

if (appDirs.length === 0) {
  console.error(`No se encontraron apps dentro de ${distRoot}`)
  process.exit(1)
}

const errors = appDirs.flatMap(validateApp)
if (errors.length > 0) {
  console.error('Falló la validación PWA:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Validación PWA correcta: ${appDirs.length} apps con iconos 192x192 y 512x512 válidos.`)
