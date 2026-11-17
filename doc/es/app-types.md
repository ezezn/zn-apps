# Tipos de app y overrides

Para mantener consistencia y evitar sobreingeniería, cada aplicación se clasifica en uno de estos arquetipos.

## Arquetipos

### 1. PWA utilitaria mono-pantalla
Ejemplo: `zound-box`.
- Propósito: una tarea concreta (reproductor, temporizador, conversor, calculadora).
- **Sin `vue-router`**: toda la experiencia vive en una pantalla o modal.
- **Estado local** con `ref()`/`reactive()` en el `App.vue` orquestador o en composables locales; sin Pinia.
- Composición con primitivas MD3: `ZnApp`, `ZnScreen`, `ZnSection`, `ZnCard`, `ZnButton`, `ZnSwitch`.
- Diálogos (`ZnDialog`, `useDialogs()`) para configuración o "Acerca de".

### 2. PWA multi-pantalla con router
Ejemplo: apps derivadas del blueprint de `kitchensink`.
- Propósito: varias vistas, paneles, flujos por pasos, secciones navegables por URL.
- `vue-router` con `createWebHistory()` y base `/zn-apps/<app>/`.
- `ZnMasterSlaveLayout`: navegación lateral (`#master`) + contenido (`default`) en escritorio; en móvil una pantalla a la vez, con la navegación en un drawer modal que abre el botón hamburguesa del `ZnScreen` activo. Si la app arranca sin ruta seleccionada, la navegación ocupa primero la pantalla móvil.
- Estado: Composition API o Pinia **estrictamente dentro de la app**.
- Deep linking: cada vista tiene su URL propia.

### 3. PWA showroom / catálogo
Ejemplo: `kitchensink`.
- Demuestra componentes, cataloga recursos (iconos, tokens) y sirve como plantilla viva.
- Catálogo completo de iconos declarado en `manual` (~2100 glifos).
- Una página de demostración por cada variante de componente y composable.

## Matriz de decisiones

| Criterio | Mono-pantalla | Multi-pantalla | Showroom |
|---|---|---|---|
| `vue-router` | ❌ | ✅ | ✅ |
| `ZnMasterSlaveLayout` | ❌ (`ZnScreen` directo) | ✅ recomendado | ✅ |
| Estado | `ref()` local | `ref()` local o Pinia de app | `ref()` local |
| Persistencia con `settings-core` | opcional, namespace propio | opcional, namespace propio | opcional |
| i18n `en`/`es` | ✅ | ✅ | ✅ |
| `icon-profile.json` | sólo `scanned` | `scanned` + `manual` específico | catálogo completo en `manual` |
| Panel Acerca de | dentro de `ZnDialog` | vista `/about` o diálogo | vista `/about` |
| Manifiesto PWA + PNG 192/512 | ✅ | ✅ | ✅ |

## Aspectos invariables (no se pueden sobrescribir)

1. Una carpeta por app con su propio `package.json`, `vite.config.js` y `dist/`.
2. Sin estado compartido entre aplicaciones.
3. Base URL `/zn-apps/<nombre-app>/`.
4. Toda app envuelta en `<ZnApp>` para sincronizar el tema MD3.
5. Los tokens `--md-*` y la tipografía Roboto se mantienen intactos.
6. `pwa-icon-192.png` y `pwa-icon-512.png` válidos con propósito `any maskable`.

## Overrides permitidos

1. **Presencia de router** — omitirlo en apps mono-pantalla, agregarlo en apps multi-vista.
2. **Componentes de dominio** — componentes locales que componen primitivas `Zn*` con visuales propios (p. ej. `SoundToggle.vue` con filtro grayscale/brightness sobre `ZnCard`).
3. **Estrategia de caché PWA** — ajustar Workbox para activos del dominio (`.ogg`, `.jpg`, fuentes personalizadas).
4. **Dominio de datos** — cada app define sus esquemas, DTOs, contratos de eventos y reglas de negocio en `src/data/` o `src/models/`.

## Crear una app nueva

Usa `kitchensink/` como blueprint: estructura, manifiesto de `VitePWA`, perfil de iconos, listeners y popups PWA, i18n y carpetas `ai/` y `doc/{en,es}/`. Los pasos están detallados en el [manual de Kitchensink](../../kitchensink/doc/es/README.md#guía-blueprint-para-una-app-nueva).

## Relacionado

- [Convenciones](./conventions.md) — checklist PWA, iconos, i18n y contrato de campos.
- [Manual de Zound Box](../../zound-box/doc/es/README.md) — referencia mono-pantalla.
- [Manual de Kitchensink](../../kitchensink/doc/es/README.md) — referencia multi-pantalla.
