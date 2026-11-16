# Convenciones y lineamientos

## Sistema de diseño

- Los componentes usan el prefijo `Zn`, viven en `shared/ui-core/src/components/` y se importan desde el barrel `@zn-apps/ui-core`.
- Usa los tokens `--md-*`; nunca hard-codees colores de la paleta.
- No dupliques botones, tarjetas, switches ni lógica de tema en una app si un componente `Zn*` ya lo cubre.
- El cambio de tema lo gestiona exclusivamente `<ZnApp>`; toda app se envuelve en él.
- Revisa los componentes disponibles antes de crear una variante de layout.

## Iconos

- Referencia iconos con `<ZnIcon name="..." family="..." />` (`name` en snake_case).
- Tras agregar o renombrar usos, ejecuta `npm run build:icons` y haz commit de `icon-profile.json` y los sprites de `public/icons/`.
- Los builds de producción nunca escanean ni generan iconos: consumen los sprites versionados.
- Kitchensink declara el catálogo completo; las apps productivas sólo incluyen lo que usan.

## PWA

Toda app nueva debe ser instalable de forma independiente:

1. `public/pwa-icon.svg` más exportaciones PNG de 192×192 y 512×512 dentro del área segura maskable.
2. Ambos PNG declarados en `VitePWA({ manifest: { icons } })` con tamaños exactos, `type: "image/png"`, `purpose: "any maskable"` y rutas relativas a la app.
3. `name`/`short_name`, `start_url`, `scope` y `display: "standalone"` válidos para `/zn-apps/<app>/`.
4. Incluir la app en el build de producción para que `npm run validate:pwa` la valide.
5. `initPwaInstallListener()`, `initPwaUpdateListener()` e `initPwaThemeSync()` en `src/main.js`.
6. `ZnPwaInstallPrompt` y `ZnPwaUpdatePrompt` como **hijos directos de `ZnApp`**, nunca dentro de `ZnScreen` ni de contenedores con `transform`/`overflow`/`isolation`.
7. Alias de `@zn-apps/pwa-integration` al código fuente en `vite.config.js` (su CSS se emite aparte; desde `dist/` los popups quedan sin estilos y fuera del viewport).
8. `theme_color` y `background_color` = `#FEF7FF` y `<meta name="theme-color" content="#FEF7FF">` en `index.html`.
9. Claves i18n `install*`, `update*`, `pwa.*` en `en` y `es`.

Las actualizaciones usan `registerType: 'prompt'`: el worker nuevo espera, la app consulta cada 30 minutos y al volver al primer plano, y al aplicar la actualización envía `SKIP_WAITING` y recarga.

## Internacionalización

- `vue-i18n` con mensajes `en` y `es` en todas las apps.
- Locale inicial: `settings.i18n.locale` → idioma base de `navigator.language` → `en`.
- Cada app registra su propio namespace de `settings-core`; la configuración nunca se comparte entre apps.

## Campos de datos (`ui-data-*`)

- La familia comparte un esquema y un valor JSON; una app puede alternar entre formulario, vista y editor sin transformar los datos.
- **La paridad es obligatoria**: una capacidad de campo (prop, estado, variante, tamaño, adorno, `span`, chips…) debe existir en `ZnDataField`, `ZnDataViewField` y el diálogo de `ZnDataEditorField` en el mismo cambio.
- Un valor nuevo de `FieldTypes` exige: declaración/formato en `ui-data-core`, input en el formulario, presentación en la vista, verificación del diálogo del editor, documentación y tests.
- `field.span` se limita a las columnas de la sección y se respeta en los tres renderizadores.
- Todo tipo o feature nueva necesita un ejemplo en Kitchensink que cubra formulario, vista y editor.

## Versionado y changelog

Los `CHANGELOG.md` y los bumps de versión se generan **sólo cuando se solicitan**, indicando la naturaleza del cambio:

| Solicitud | SemVer |
|---|---|
| Rediseño de aplicación / breaking change | major |
| Nueva feature | minor |
| Bugfix | patch |

```bash
node scripts/bump-version.mjs <directorio-proyecto> <major|minor|patch>
```

Cada proyecto mantiene `<proyecto>/CHANGELOG.md` con entradas bilingües (ES/EN), la versión más reciente arriba.

## Documentación

Dos árboles, dos audiencias:

| Árbol | Audiencia | Idioma |
|---|---|---|
| `doc/` + `<proyecto>/doc/{en,es}/` | Usuarios y desarrolladores | **Inglés y español, siempre ambos** |
| `ai/` + `<proyecto>/ai/` | Agentes de IA | sólo inglés, compacta |

Actualiza la documentación en el mismo cambio que una feature o decisión, y sólo las partes afectadas:

- componente/token/composable → docs de esa librería;
- tipo de campo o clave de esquema → docs de `ui-data-core` y de las librerías `ui-data-*` afectadas;
- regla de dominio u override de una app → docs de esa app;
- arquitectura, flujo, testing o arquetipos globales → archivos raíz de `doc/` y `ai/`.

Nunca agregues notas de implementación a la documentación de usuario; `ai/` concentra el detalle técnico y `doc/` el uso y el comportamiento.

Valida todos los enlaces y anclas con `npm run check:docs` después de editar documentación.

## Relacionado

- [Primeros pasos](./getting-started.md) · [Arquitectura](./architecture.md) · [Tipos de app](./app-types.md)
- [Manual de pwa-integration](../../shared/pwa-integration/doc/es/README.md) · [Manual de ui-data-core](../../shared/ui-data-core/doc/es/README.md)
