# @zn-apps/storage — Documentación de Librería

> Ubicación: `shared/storage/`  
> Paquete npm: `@zn-apps/storage`  
> Responsabilidad: Persistencia framework-agnostic sobre Web Storage con namespacing y serialización JSON.

---

## 1. Propósito y Alcance

`@zn-apps/storage` proporciona una capa delgada, agnóstica y tipada conceptualmente para el almacenamiento local en navegadores o entornos de prueba.
Está completamente desacoplada de Vue, no depende del DOM directo (tolera entornos sin `window` o con `localStorage` deshabilitado por modos de privacidad) y asegura que múltiples apps en el mismo dominio no colisionen sus claves.

---

## 2. Arquitectura y Decisiones de Diseño

- **Aislamiento por Namespace**: Cada clave se guarda con el prefijo `${namespace}:`. Esto garantiza que `zound-box`, `kitchensink` o cualquier app futura operen bajo el mismo origen (`github.io/zn-apps/`) sin pisar configuraciones de otras aplicaciones.
- **Tolerancia a Fallos y Modos Privados**: El acceso a `localStorage` se envuelve en bloques seguros. Si el navegador bloquea cookies/almacenamiento o la cuota se supera, los métodos retornan `fallback` o `false` sin lanzar excepciones no controladas.
- **Serialización Automática**: Serializa objetos con `JSON.stringify` al escribir y `JSON.parse` al leer. Si un valor preexistente no es JSON válido, se devuelve como string crudo sin fallar.
- **Backend Inyectable**: Por defecto usa `globalThis.localStorage`, pero admite `sessionStorage` o cualquier mock compatible con la interfaz `Storage` (`getItem`, `setItem`, `removeItem`, `key`, `length`).

---

## 3. Modelo de Dominio y DTOs

### `StorageOptions`
```typescript
interface StorageOptions {
  /** Prefijo aplicado a cada clave. Por defecto 'zn-apps'. */
  namespace?: string
  /** Backend compatible con Web Storage. Por defecto window.localStorage. */
  storage?: Storage | null
}
```

### `StorageInstance`
```typescript
interface StorageInstance {
  /** Obtiene un valor deserializado o fallback si no existe. */
  get<T = any>(key: string, fallback?: T): T
  /** Guarda un valor serializado. Retorna boolean indicando éxito. */
  set(key: string, value: any): boolean
  /** Elimina una clave con su namespace. Retorna boolean. */
  remove(key: string): boolean
  /** Verifica si la clave existe. */
  has(key: string): boolean
  /** Limpia todas las claves asociadas al namespace actual. */
  clear(): boolean
}
```

---

## 4. Reglas de Negocio

1. **Convención de Namespace**: Cada aplicación DEBE instanciar su storage usando su ID de app como namespace (ej. `createStorage({ namespace: 'zound-box' })`).
2. **Borrado Seguro**: `clear()` solo remueve las claves que comiencen con el prefijo del namespace configurado. No borra claves globales ni de otras aplicaciones.
3. **Inmutabilidad de Retorno**: `get()` retorna nuevas instancias para objetos/arrays parseados. Mutar el objeto devuelto no muta el almacenamiento hasta llamar a `set()`.

---

## 5. Ejemplos de Uso

```javascript
import { createStorage } from '@zn-apps/storage'

// Instancia específica de la app
const appStorage = createStorage({ namespace: 'zound-box' })

// Guardar preferencias
appStorage.set('active-sounds', ['rain', 'white-noise'])

// Leer con valor por defecto
const sounds = appStorage.get('active-sounds', [])

// Eliminar
appStorage.remove('active-sounds')
```

---

## 6. Testing

Los tests de `@zn-apps/storage` residen en `shared/storage/src/__tests__/storage.spec.js`.
Se ejecutan mediante:
```bash
npm run test:shared
```
o filtrando el proyecto Vitest:
```bash
npx vitest run --project storage
```
