# App: Kitchensink — Documentación de Proyecto y Blueprint

> Ubicación: `kitchensink/`  
> Base path: `/zn-apps/kitchensink/`  
> Responsabilidades: Catálogo visual de componentes, biblioteca de referencia de iconos y plantilla/blueprint para nuevas aplicaciones del monorepo.

---

## 1. Visión General del Proyecto

**Kitchensink** cumple tres funciones fundamentales dentro del monorepo `zn-apps`:
1. **Showroom de Componentes**: Demostración viva e interactiva de cada componente de `@zn-apps/ui-core`, `@zn-apps/ui-about`, `@zn-apps/settings-core`, `@zn-apps/pwa-integration` y la familia `@zn-apps/ui-data-*` (`/data/core`, `/data/form`, `/data/view`, `/data/editor`), con ejemplos de variantes, props y accesibilidad. Los inputs documentan las variantes `outlined`/`filled` y los tamaños MD3 `small`/`medium`/`large`; `/inputs/chip` cubre las cuatro variantes de `ZnChip`.
2. **Catálogo Completo de Iconos**: Contiene el inventario exhaustivo de iconos Material Design en sus 5 familias (`filled`, `outlined`, `round`, `sharp`, `two-tone`), permitiendo explorar visualmente glifos para utilizarlos en otras apps.
3. **Blueprint para Nuevas Apps**: Es el modelo canónico a seguir para crear nuevas aplicaciones multi-pantalla con enrutamiento (`vue-router`), layout maestro-detalle (`ZnMasterSlaveLayout`) y configuración PWA estándar.

---

## 2. Arquitectura y Decisiones de Diseño

| Aspecto | Implementación en Kitchensink | Propósito |
|---|---|---|
| **Enrutador (`vue-router`)** | `createRouter` + `createWebHistory()` | Cada vista del showroom tiene su propia ruta (`/buttons`, `/cards`, etc.) permitiendo navegación directa y deep linking. |
| **Layout Maestro-Esclavo** | `ZnMasterSlaveLayout` | En escritorio divide la pantalla en menú lateral (`#master`) y área de demostración (`default`). En móvil colapsa la navegación y muestra botón de regreso automático. |
| **Perfil de Iconos Completo** | `manual` con catálogo total | A diferencia de apps productivas (que solo incluyen sus iconos escaneados), `kitchensink/icon-profile.json` declara más de 2000 nombres en su array `manual` para disponibilizar toda la biblioteca. |
| **Panel Acerca de** | `ZnAbout` integrado | Vista `/about` que muestra la integración con `@zn-apps/ui-about` usando los metadatos de `package.json`. |
| **Gestión de Configuración** | `createSettings` integrado | Vista `/settings` que muestra la persistencia reactiva profunda en Web Storage con `@zn-apps/settings-core`. |
| **Datos declarativos** | `ZnDataForm`, `ZnDataView` y `ZnDataEditor` | Vistas `/data/*` con un mismo `schema` y `value`: formulario con borrador/doble binding, presentación y edición por campo, incluidos multi-select y listas de valores como chips MD3. |

### Internacionalización — implementación inicial pendiente de completar

Kitchensink integra Vue I18n con mensajes en inglés y español, resolución desde `settings.i18n.locale`, idioma del sistema y fallback inglés. El shell principal, navegación, selector de tema y popup de instalación ya usan traducciones. Queda pendiente migrar las cadenas estáticas internas de todas las vistas demostrativas; esta nota debe retirarse cuando ese catálogo quede completamente traducido.

---

## 3. Modelo de Dominio y DTOs

Definido en `src/data/demo-views.js`:

### `DemoViewSection`
```typescript
interface DemoViewSection {
  title: string
  content: string
}
```

### `DemoView`
```typescript
interface DemoView {
  key: string                    // Clave identificadora y ruta URL (ej. "buttons")
  title: string                  // Título principal en el menú de navegación
  subtitle: string               // Descripción breve de la categoría
  sections: DemoViewSection[]    // Lista de bloques explicativos de la vista
}
```

### `IconProfile`
```typescript
interface IconProfile {
  scanned: string[]              // Iconos detectados por el escáner estático
  manual: string[]               // Iconos agregados manualmente o catálogo completo
}
```

---

## 4. Pipeline de Iconos en Kitchensink

Dado que Kitchensink actúa como catálogo visual para desarrolladores, su flujo de generación de iconos procesa la colección entera:

1. **Lectura de Perfil**: `kitchensink/icon-profile.json` une `scanned` + `manual` (~2122 iconos).
2. **Combinación con Shared**: Añade los iconos usados internamente por `@zn-apps/ui-core`.
3. **Generación de Sprites**: Genera los 5 sprites por familia en `kitchensink/public/icons/`:
   - `sprite-filled.svg`
   - `sprite-outlined.svg`
   - `sprite-round.svg`
   - `sprite-sharp.svg`
   - `sprite-two-tone.svg`
4. **Carga Diferida**: En runtime, `ZnIcon` carga únicamente el sprite de la familia visualizada mediante `loadIconFamily()`.

Comandos:
```bash
npm run scan:icons          # Actualiza iconos escaneados
npm run generate:icons      # Regenera sprites locales en public/icons/
```

---

## 5. Guía Blueprint: Creación de una Nueva App

Cuando vayas a crear una nueva aplicación en el monorepo, usa `kitchensink/` como referencia siguiendo estos pasos:

### Paso 1: Crear la estructura del proyecto
Crea una carpeta en la raíz (ej. `mi-app/`) con:
```
mi-app/
├── public/
│   ├── favicon.svg
│   ├── pwa-icon.svg
│   ├── pwa-icon-192.png       # 192x192 PNG con safe area maskable
│   └── pwa-icon-512.png       # 512x512 PNG con safe area maskable
├── src/
│   ├── main.js
│   ├── App.vue
│   └── views/
├── docs/                      # Documentación propia de la app (README.md)
├── icon-profile.json          # Inicializado con { "scanned": [], "manual": [] }
├── index.html
├── package.json
├── vite.config.js
└── vitest.config.js
```

### Paso 2: Declarar dependencias (`package.json`)
```json
{
  "name": "mi-app",
  "private": true,
  "version": "1.0.0",
  "dependencies": {
    "@zn-apps/ui-core": "*",
    "@zn-apps/ui-about": "*",
    "vue": "^3.5.34"
  }
}
```

### Paso 3: Configurar Vite y PWA (`vite.config.js`)
Configura el subpath de despliegue relativo:
```javascript
export default defineConfig({
  base: '/zn-apps/mi-app/',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mi App',
        short_name: 'MiApp',
        start_url: '/zn-apps/mi-app/',
        scope: '/zn-apps/mi-app/',
        display: 'standalone',
        icons: [
          { src: 'pwa-icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'pwa-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})
```

### Paso 4: Registrar en el monorepo
1. Añade `"mi-app"` a `workspaces` en el `package.json` raíz.
2. Añade los scripts de escaneo y generación de iconos si la app usa `ZnIcon`.
3. Añade la orden de compilación a `build:production` en el `package.json` raíz.
4. Verifica según el alcance del cambio. Para una modificación de esta app, ejecuta sus tests y build; reserva la suite completa y el build del monorepo para cambios transversales o verificación de release:
   ```bash
   npm run test:kitchensink
   npm run build:kitchensink
   ```

---

## 6. Testing

Tests en `kitchensink/src/__tests__/router.spec.js`.
Ejecutar tests:
```bash
npm run test:kitchensink
```
