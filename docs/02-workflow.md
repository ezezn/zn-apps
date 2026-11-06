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
  "shared/storage",
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

# Observar cambios en storage
npm run dev --workspace=@zn-apps/storage
```

> **Nota para Testing:** Las configuraciones de Vitest de las apps (`vitest.config.js`) resuelven `@zn-apps/ui-core` directamente al código fuente `shared/ui-core/src/index.js`, de modo que puedes ejecutar tests inmediatamente sin recompilar la librería.

---

## 3. Pipeline de Iconos (`ZnIcon`)

Cada aplicación genera su propio sprite SVG optimizado para no cargar la colección completa de glifos en memoria.

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

---

## 5. Compilación y Construcción para Producción

### Compilación Individual de Librerías y Apps
```bash
# Compilar todas las librerías compartidas (ui-core, storage, ui-about)
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

## 6. Política de Testing y Validación de Regresiones

> ⚠️ **Regla de Ejecución**: Ejecuta los scripts de test y build **ÚNICAMENTE cuando existan cambios de código** (archivos `.vue`, `.js`, `.mjs`, `.css`, `package.json` o configuraciones de bundler).  
> **NO ejecutes tests ni builds en tareas exclusivas de documentación** (archivos `.md`, guías, diagramas o notas).

Al modificar código fuente o configuraciones:

```bash
# 1. Ejecutar todos los tests unitarios
npm run test:run

# 2. Compilar todo el monorepo
npm run build:all
```

Ambos comandos deben finalizar con código de salida `0`.

---

## 7. Despliegue Continuo (CI/CD)

- **Workflow**: `.github/workflows/deploy.yml`
- **Disparador**: `push` a la rama `main`.
- **Destino**: GitHub Pages (`https://<usuario>.github.io/zn-apps/`).
- **Comportamiento**:
  - Resuelve workspaces con `npm install`.
  - Ejecuta la suite de pruebas unitarias (`npm run test:run`).
  - Ejecuta `npm run build:production`.
  - Inyecta copias `404.html` para soporte de SPA routing.
  - Sube y publica el artefacto `dist/`.
