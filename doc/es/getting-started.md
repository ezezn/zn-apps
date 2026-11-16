# Primeros pasos

## Requisitos

- **Node.js** 24.x recomendado (compatible con 20+).
- **npm** 10+ (soporte nativo de workspaces).

## Instalación

Todas las dependencias del monorepo se resuelven desde la raíz en un solo paso:

```bash
git clone https://github.com/<usuario>/zn-apps.git
cd zn-apps
npm install
```

## Desarrollo local

```bash
# Aplicaciones
npm run dev --workspace=kitchensink
npm run dev --workspace=daily-task-report
npm run dev --workspace=zound-box

# Compilación en watch de librerías compartidas (mientras cambias shared/ui-*/src)
npm run dev --workspace=@zn-apps/ui-core
```

También puedes entrar a la carpeta del proyecto y ejecutar `npm run dev`. Para cambios en librerías compartidas usa el build en watch.

## Tests

Vitest + `@vue/test-utils` + happy-dom, orquestados desde la raíz:

```bash
npm test                    # modo watch
npm run test:run            # suite completa una vez (modo CI)
npm run test:coverage       # cobertura V8
npm run test:shared         # todas las librerías compartidas
npm run test:zound-box
npm run test:kitchensink
npm run test:daily-task-report
npx vitest run --project ui-core              # una librería
npx vitest run ruta/al/archivo.spec.js        # un archivo
```

Elige el alcance mínimo que cubra tu cambio. La suite completa es para cambios transversales, de código compartido o de release. Las tareas sólo de documentación no requieren tests ni builds. CI ejecuta `npm run test:run` antes de desplegar.

## Builds

```bash
npm run build:shared       # todas las librerías compartidas
npm run build:zound-box
npm run build:kitchensink
npm run build:daily-task-report
npm run build:production   # monorepo completo -> dist/
npm run validate:pwa       # valida manifiestos y PNG 192/512
```

`build:production` (alias `build:all`) limpia `dist/`, copia la landing y el service worker raíz, compila librerías y apps, mueve cada `dist/` a `dist/<app>/` y valida los manifiestos PWA.

Los iconos **no** se regeneran en producción:

```bash
npm run scan:icons         # escanea <ZnIcon name="..."> en icon-profile.json
npm run generate:icons     # regenera public/icons/sprite-<familia>.svg
npm run build:icons        # ambos; luego haz commit de perfiles y sprites
```

## Despliegue

`.github/workflows/deploy.yml` se ejecuta en cada push a `main`: install → `npm run test:run` → `npm run build:production` → inyección de `404.html` → publicación en GitHub Pages bajo `/zn-apps/`.

## Siguientes pasos

- [Arquitectura](./architecture.md) — stack, estructura y principios.
- [Tipos de app](./app-types.md) — elige un arquetipo y los overrides permitidos.
- [Convenciones](./conventions.md) — sistema de diseño, iconos, PWA, i18n y versionado.
- Manuales por proyecto: [tabla de proyectos](./README.md#proyectos).
