# @zn-apps/settings-core — manual de usuario

Configuración persistente de aplicaciones: un documento JSON almacenado en Web Storage y expuesto como proxy profundo. Sin dependencias de Vue ni del DOM.

- Paquete: `@zn-apps/settings-core` · Carpeta: `shared/settings-core/`
- English: [Read in English](../en/README.md)

## Uso

```js
import { createSettings } from '@zn-apps/settings-core'

const settings = createSettings({ namespace: 'mi-app' })

settings.define('pwa', { installDismissed: false })

settings.pwa.installDismissed        // valor guardado o default
settings.pwa.installDismissed = true // se guarda al instante
```

Las definiciones rellenan valores ausentes y nunca sobrescriben valores guardados. También se puede declarar la estructura completa:

```js
settings.define({
  audio: { volume: 1, muted: false },
  ui: { theme: { mode: 'system' } }
})
```

## API

| Miembro | Descripción |
|---|---|
| `createSettings({ namespace, key, storage, defaults })` | crea la instancia; clave por defecto `zn-apps:settings` |
| `settings.define(path, definition)` / `define(definitions)` | registra defaults y persiste el resultado |
| `settings.a.b` / `settings.a.b = v` | lectura / escritura profunda |
| `settings.get(path, fallback)`, `set(path, value)`, `has(path)` | acceso explícito por ruta con puntos |
| `settings.toJSON()` | copia independiente del documento completo |
| `settings.reset(path?)` | elimina una rama o restaura las definiciones |

`storage` acepta cualquier objeto compatible con Web Storage (`sessionStorage`, un doble de pruebas…).

## Reglas

- Cada app usa su propio namespace; el documento de configuración nunca se comparte entre apps.
- `i18n.locale` (`'en'`, `'es'` o `null`) es la preferencia de idioma que las apps leen al arrancar.
- Las definiciones son aditivas: renombrar una ruta deja el valor anterior huérfano, así que migra explícitamente.

## Demo y tests

Kitchensink `/settings` muestra la persistencia reactiva profunda. Tests: `npx vitest run --project settings-core`.
