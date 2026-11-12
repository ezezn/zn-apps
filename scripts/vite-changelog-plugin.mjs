import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * Expone el `CHANGELOG.md` del proyecto en desarrollo y lo copia al `dist`
 * durante el build, para que `ZnAbout` pueda descargarlo desde
 * `${import.meta.env.BASE_URL}CHANGELOG.md` con `fetch`.
 *
 * No duplica el archivo: siempre lee el original de la raíz del proyecto.
 *
 * @param {{ root: string, fileName?: string }} options
 */
export function changelogPlugin({ root, fileName = 'CHANGELOG.md' }) {
  const projectRoot = resolve(root)
  const changelogFile = resolve(projectRoot, fileName)

  function readChangelog() {
    try {
      return readFileSync(changelogFile, 'utf8')
    } catch {
      return null
    }
  }

  return {
    name: 'zn-changelog',

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url || '').split('?')[0]
        if (!path.endsWith(`/${fileName}`)) return next()

        const source = readChangelog()
        if (source === null) {
          res.statusCode = 404
          res.end('Not found')
          return
        }

        res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
        res.setHeader('Cache-Control', 'no-cache')
        res.end(source)
      })
    },

    generateBundle() {
      const source = readChangelog()
      if (source === null) return
      this.emitFile({ type: 'asset', fileName, source })
    }
  }
}
