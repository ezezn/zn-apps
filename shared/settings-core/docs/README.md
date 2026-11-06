# @zn-apps/settings-core

`@zn-apps/settings-core` mantiene un documento JSON de configuración en Web Storage y lo expone como un proxy profundo. No depende de Vue ni de otras librerías compartidas.

## Uso

```js
import { createSettings } from '@zn-apps/settings-core'

const settings = createSettings({ namespace: 'mi-app' })

settings.define('pwa', {
  installDismissed: false
})

console.log(settings.pwa.installDismissed) // false o el valor guardado
settings.pwa.installDismissed = true
```

Las definiciones rellenan valores ausentes y no sobrescriben valores que ya estén guardados. También se puede declarar una estructura completa:

```js
settings.define({
  audio: { volume: 1, muted: false },
  ui: { theme: { mode: 'system' } }
})
```

## API

- `createSettings({ namespace, key, storage, defaults })`: crea una instancia. La clave final por defecto es `zn-apps:settings`.
- `settings.define(path, definition)` o `settings.define(definitions)`: registra valores por defecto y persiste la estructura resultante.
- `settings.foo.bar`: lee una propiedad anidada desde el documento actual.
- `settings.foo.bar = value`: guarda una propiedad anidada.
- `settings.get(path, fallback)`, `settings.set(path, value)` y `settings.has(path)`: acceso explícito por rutas separadas por puntos.
- `settings.toJSON()`: devuelve una copia independiente del documento completo.
- `settings.reset(path?)`: elimina una rama o restaura el documento a sus definiciones.

El parámetro `storage` acepta cualquier objeto compatible con Web Storage, lo que permite usar `sessionStorage` o un backend de pruebas.
