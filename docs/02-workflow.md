# Flujo de Trabajo y Operaciones en el Monorepo

> Ubicación: `docs/02-workflow.md`  
> Propósito: Guía práctica para desarrolladores y agentes de IA sobre cómo operar, desarrollar, compilar, probar y publicar proyectos en `zn-apps`.

---

## 1. Entorno y Configuración Inicial

El monorepo utiliza **npm workspaces** con Node >= 20 (recomendado Node 24).

```bash
# Instalación global de dependencias (resuelve todos los workspaces)
npm install
```

### Estructura de Paquetes en `package.json`
```json
"workspaces": [
  "zound-box",
  "kitchensink",
  "shared/ui-core",
  "shared/settings-core",
  "shared/ui-about"
]
```

---

## 2. Desarrollo Local

### Servidores de Desarrollo por Aplicación
Puedes iniciar el servidor Vite de cualquier app desde la raíz:

```bash
# Iniciar Zound Box (puerto local)
npm run dev --workspace=zound-box

# Iniciar Kitchensink
npm run dev --workspace=kitchensink
```

### Desarrollo en Librerías Compartidas
Si estás realizando cambios simultáneos en una librería compartida y deseas recompilación automática:

```bash
# Observar cambios en ui-core
npm run dev --workspace=@zn-apps/ui-core

```

> **Nota para Testing:** Las configuraciones de Vitest de las apps (`vitest.config.js`) resuelven `@zn-apps/ui-core` directamente al código fuente `shared/ui-core/src/index.js`, de modo que puedes ejecutar tests inmediatamente sin recompilar la librería.

---

## 3. Pipeline de Iconos (`ZnIcon`)

Cada aplicación genera su propio sprite SVG optimizado para no cargar la colección completa de glifos en memoria. El chunk de la app es la unión de su `icon-profile.json` y los perfiles de las librerías compartidas (`shared/ui-core` y `shared/pwa-integration`), de modo que los iconos que usan los componentes compartidos siempre estén disponibles.

```
Código fuente (.vue)
       │
       ▼ (npm run scan:icons)
icon-profile.json { scanned: [...], manual: [...] }
       │
       ▼ (npm run generate:icons)
public/icons/sprite-<familia>.svg
       │
       ▼ (Vite build)
dist/icons/sprite-<familia>.svg (Precacheado por Workbox)
```

### Comandos de Iconos

| Comando | Acción | Cuándo usarlo |
|---|---|---|
| `npm run scan:icons` | Escanea etiquetas `<ZnIcon name="...">` en el código y actualiza `icon-profile.json` | Al agregar o renombrar iconos en templates |
| `npm run generate:icons` | Genera los sprites SVG por familia en `public/icons/` | Tras escanear o modificar el array `manual` |
| `npm run build:icons` | Ejecuta scan + generate en una sola orden | **Antes de hacer commit** con nuevos iconos |

> **Regla de CI:** El flujo de CI **no regenera iconos** en el deploy. Utiliza los sprites versionados en `public/icons/` para builds reproducibles y rápidos.

---

## 4. Requisitos y Validación PWA

Para que una aplicación sea reconocida como PWA instalable de forma autónoma:

1. **Icono Fuente SVG**: Debe existir `public/pwa-icon.svg` editable.
2. **Exportaciones PNG**: Deben generarse `public/pwa-icon-192.png` (192×192) y `public/pwa-icon-512.png` (512×512).
   - **Safe Area**: Mantén los elementos gráficos centrales dentro del 80% interior para no ser recortados en máscaras circulares u octogonales.
3. **Declaración en `vite.config.js`**:
   ```javascript
   icons: [
     { src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
     { src: 'pwa-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
   ]
   ```
4. **Script de Validación**:
   ```bash
   npm run validate:pwa
   ```
   Valida que los manifiestos generados existan, apunten a rutas relativas correctas y que las imágenes existan con dimensiones exactas.

### 4.1 Configuración de barras de color PWA

Para que la barra de estado superior y la barra inferior sigan el esquema de colores de la aplicación:

1. **Usar `usePwaMeta` en `App.vue`**: Invocar el composable `usePwaMeta` con `syncOnMount: true` para sincronizar dinámicamente la barra superior (`<meta name="theme-color">`) y el fondo del documento con el esquema de colores actual de la app (basado en el tema oscuro/claro o del sistema).

2. **Color según tema**: Usar `#1D1B20` para modo oscuro y `#FEF7FF` para modo claro como colores iniciales, los cuales serán actualizados automáticamente por `syncWithScreenHeading()` basándose en el color de cabecera de `ZnScreen`.

3. **Actualización reactiva**: Los colores se actualizan automáticamente cuando el tema cambia (fondo oscuro/light) gracias a la reactividad de Vue y la detección de `prefers-color-scheme` del sistema.

### 4.2 Integración obligatoria de los popups PWA

Toda app nueva **debe** integrar los dos popups de `@zn-apps/pwa-integration`. No basta con declararlos: sin los pasos siguientes se montan sin estilos o nunca se muestran.

1. **Listeners globales en `src/main.js`** (antes de `mount`):
   ```javascript
   import { initPwaInstallListener, initPwaUpdateListener } from '@zn-apps/pwa-integration'

   initPwaInstallListener() // captura beforeinstallprompt / appinstalled
   initPwaUpdateListener()  // detecta versiones nuevas del service worker
   ```
   Sin `initPwaInstallListener()` el popup de instalación nunca aparece en un teléfono real; sin `initPwaUpdateListener()` nunca aparece el de actualización.

2. **Montar ambos popups como hijos directos de `ZnApp`** en `src/App.vue`, fuera de `ZnScreen` y de `ZnMasterSlaveLayout`. Los popups usan `position: fixed`; si se anidan dentro de un contenedor con `transform`, `overflow` o `isolation`, quedan recortados o desplazados respecto al viewport.
   ```vue
   <ZnApp :mode="resolvedTheme">
     <ZnScreen>...</ZnScreen>

     <ZnPwaInstallPrompt :title="t('pwa.installTitle')" :message="t('pwa.installMessage')" :image="pwaIconUrl" :delay-ms="2000" />
     <ZnPwaUpdatePrompt :title="t('pwa.updateTitle')" :message="t('pwa.updateMessage')" :update-text="t('pwa.updateText')" :dismiss-text="t('pwa.dismissUpdate')" />
   </ZnApp>
   ```

3. **Resolver el paquete al código fuente en `vite.config.js`**:
   ```javascript
   '@zn-apps/pwa-integration': resolve(__dirname, '../shared/pwa-integration/src/index.js')
   ```
   El build de librería emite los estilos en `dist/pwa-integration.css`, un archivo que el entry JS no importa. Si la app resuelve el paquete desde `dist/`, los popups se renderizan **sin estilos**: aparecen como bloques al final del documento, alargan el scroll y quedan fuera del viewport. Al resolverlo al fuente, Vite compila los `<style scoped>` junto con la app.

4. **Claves de i18n** en `en` y `es`: `installTitle`, `installMessage`, `updateTitle`, `updateMessage`, `updateText` y `dismissUpdate`. Sin ellas el popup muestra la ruta de la clave (por ejemplo `pwa.updateTitle`).

### 4.3 Actualizaciones de una PWA ya instalada

Las apps usan `VitePWA({ registerType: 'prompt' })`: el service worker nuevo queda en estado `waiting` y **no se activa solo**. `shared/pwa-integration/src/utils/pwaUpdate.js` se encarga del ciclo completo:

- Consulta la registration al arrancar, así que una actualización pendiente de una sesión anterior se ofrece de inmediato.
- Revisa si hay versión nueva cada 30 minutos y al volver al primer plano (máximo una consulta cada 5 minutos), porque una PWA instalada puede pasar días abierta sin navegar.
- `updatePwa()` envía `SKIP_WAITING`, espera a que el worker nuevo active y recarga la página; sin esa recarga la app seguiría ejecutando el código anterior.
- Si el usuario descarta el aviso, se recuerda en `sessionStorage` solo para esa versión; al quedar la app al día el descarte se limpia.

### 4.4 Validación

Ejecutar `npm run validate:pwa` para verificar que los manifiestos generados existan y apunten a rutas e imágenes correctas.

---

## 5. Internacionalización de Aplicaciones

Cada aplicación nueva debe instalar `vue-i18n`, crear sus mensajes `en` y `es`, y resolver el locale inicial con esta prioridad:

1. `settings.i18n.locale` cuando contiene `en` o `es`.
2. El idioma base de `navigator.language`.
3. `en` si el sistema usa un idioma no soportado o no expone idioma.

La instancia de `@zn-apps/settings-core` debe usar un namespace propio de la aplicación. No se debe compartir el documento de settings entre apps.

---

## 6. Compilación y Construcción para Producción

### Compilación Individual de Librerías y Apps
```bash
# Compilar todas las librerías compartidas (ui-core, settings-core, ui-about)
npm run build:shared

# Compilar una app particular
npm run build:zound-box
npm run build:kitchensink
```

### Compilación Completa de Producción (`build:production` o `build:all`)
```bash
npm run build:all
```
Este comando ejecuta en secuencia:
1. Limpia y crea la carpeta `dist/` raíz.
2. Copia `index.html` (portal de entrada) y `sw.js` (service worker del portal).
3. Compila todas las librerías compartidas (`build:shared`).
4. Compila cada app (`build:zound-box`, `build:kitchensink`).
5. Copia los paquetes construidos a `dist/zound-box/` y `dist/kitchensink/`.
6. Ejecuta `validate:pwa` sobre todos los manifiestos de salida.

---

## 7. Política de Testing y Validación de Regresiones

> **Criterio de Ejecución**: Elige tests y builds de acuerdo con el alcance y el riesgo del cambio. La suite completa y el build completo no son un requisito automático para cada modificación de código; prioriza los comandos del proyecto afectado y amplía la verificación si el cambio cruza proyectos o afecta código compartido. CI siempre ejecuta la suite completa y el build de producción antes de desplegar.
>
> En tareas exclusivas de documentación (archivos `.md`, guías, diagramas o notas), no ejecutes tests ni builds.

Para cambios que ameriten verificación amplia o de release:

```bash
# 1. Ejecutar todos los tests unitarios
npm run test:run

# 2. Compilar todo el monorepo
npm run build:all
```

Para un cambio local más acotado, usa el comando de tests y build del proyecto afectado. Los comandos completos de arriba deben finalizar con código de salida `0` cuando se elijan.

---

## 8. Despliegue Continuo (CI/CD)

- **Workflow**: `.github/workflows/deploy.yml`
- **Disparador**: `push` a la rama `main`.
- **Destino**: GitHub Pages (`https://<usuario>.github.io/zn-apps/`).
- **Comportamiento**:
  - Resuelve workspaces con `npm install`.
  - Ejecuta la suite de pruebas unitarias (`npm run test:run`).
  - Ejecuta `npm run build:production`.
  - Inyecta copias `404.html` para soporte de SPA routing.
  - Sube y publica el artefacto `dist/`.
