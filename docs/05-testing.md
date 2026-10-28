# Testing — Estrategia y Guía de Tests Unitarios

> Contexto de IA para testing en el monorepo. Actualizado: 2026-10-28.

## Resumen del Stack de Testing

| Herramienta | Versión | Rol |
|---|---|---|
| **Vitest** | ^5.0 | Runner y framework de tests unificado |
| **@vue/test-utils** | ^2.5 | Utilidades oficiales de montaje para Vue 3 |
| **happy-dom** | ^21.0 | Entorno DOM virtual de alto rendimiento |
| **@vitest/coverage-v8** | ^5.0 | Motor de cobertura de código |

---

## Arquitectura de Configuración (Opción A: Centralizada)

El monorepo utiliza la propiedad `projects` de Vitest para orquestar la ejecución modular pero centralizada:

```
zn-apps/
├── vitest.config.js          # Configuración raíz: lista de proyectos y reportes de cobertura
├── vitest.setup.js           # Mocks globales (matchMedia, IntersectionObserver)
│
├── shared/
│   ├── vitest.config.js      # Configuración del paquete shared
│   └── src/
│       ├── components/__tests__/
│       │   ├── ZnButton.spec.js
│       │   ├── ZnSwitch.spec.js
│       │   ├── ZnApp.spec.js
│       │   └── ZnCard.spec.js
│       ├── composables/__tests__/
│       │   └── useOnlineStatus.spec.js
│       └── utils/__tests__/
│           └── helpers.spec.js
│
├── zound-box/
│   ├── vitest.config.js      # Configuración de Zound Box (con alias a shared src)
│   └── src/__tests__/
│       └── App.spec.js
│
└── kitchensink/
    ├── vitest.config.js      # Configuración de Kitchensink (con alias a shared src)
    └── src/__tests__/
        └── router.spec.js
```

### Resolución de dependencias (`@zn-apps/shared`)
En las configuraciones de `zound-box` y `kitchensink`, los tests resuelven `@zn-apps/shared` directamente a `../shared/src/index.js` y `@zn-apps/shared/dist/shared.css` a `../shared/src/assets/css/global.css`. Esto garantiza que los tests se puedan ejecutar de inmediato **sin necesidad de compilar previamente** la librería `shared`.

---

## Comandos Disponibles

Desde la raíz del monorepo:

| Comando | Descripción |
|---|---|
| `npm test` | Inicia Vitest en modo observador interactivo (watch) |
| `npm run test:run` | Ejecuta todos los tests una sola vez (modo CI) |
| `npm run test:coverage` | Genera reporte de cobertura global con motor V8 |
| `npm run test:shared` | Ejecuta únicamente los tests del paquete `shared` |
| `npm run test:zound-box` | Ejecuta únicamente los tests de `zound-box` |
| `npm run test:kitchensink` | Ejecuta únicamente los tests de `kitchensink` |

---

## Mocks Globales (`vitest.setup.js`)

Se ejecutan automáticamente antes de cada suite de tests:

1. **`window.matchMedia`**: Utilizado por `ZnApp.vue` para detectar el tema del sistema (`prefers-color-scheme`).
2. **`IntersectionObserver`**: Utilizado por `ZnScreen.vue` para detectar el scroll del centinela y aplicar la clase de cabecera condensada/elevada.

---

## Integración Continua (GitHub Actions)

El workflow en `.github/workflows/deploy.yml` incluye el paso de validación antes del build:

```yaml
- name: Instalar Dependencias del Monorrepo
  run: npm install

- name: Ejecutar Tests Unitarios
  run: npm run test:run

- name: Ejecutar Compilación Unificada
  run: npm run build:all
```

Si algún test falla, el pipeline se detiene evitando desplegar código roto a GitHub Pages.

---

## Cómo Añadir Tests a Nuevos Componentes o Apps

1. Crear archivo `[Nombre].spec.js` dentro de una subcarpeta `__tests__/`.
2. Usar `mount` de `@vue/test-utils` y `describe, it, expect` de `vitest`.
3. Para componentes que consumen `@zn-apps/shared`, no se requiere configuración extra; los alias del proyecto los resuelven automáticamente.
