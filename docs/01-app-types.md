# Lineamientos de Tipos de Aplicaciones en el Monorepo

> Ubicación: `docs/01-app-types.md`  
> Propósito: Guía arquitectónica para clasificar aplicaciones, elegir su stack interno y tomar decisiones de override respetando los principios del monorepo.

---

## 1. Taxonomía de Aplicaciones

El monorepo `zn-apps` alberga diversas aplicaciones web progresivas (PWAs). Para mantener consistencia y evitar sobreingeniería, cada aplicación se clasifica dentro de uno de los siguientes arquetipos:

```
                  ┌─────────────────────────────────────┐
                  │          Arquetipos de App          │
                  └──────────────────┬──────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ 1. Single-Screen    │   │ 2. Multi-Screen     │   │ 3. Developer /      │
│    Utility PWA      │   │    Routed PWA       │   │    Catalog PWA      │
│ (ej. zound-box)     │   │ (ej. apps de flujo) │   │ (ej. kitchensink)   │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘
```

### 1.1. Arquetipo 1: Single-Screen Utility PWA
- **Ejemplo en el monorepo**: `zound-box`.
- **Propósito**: Apps enfocadas en una tarea directa (reproductor de sonido, temporizador, conversor, calculadora, herramienta especializada).
- **Características arquitectónicas**:
  - **Sin Vue Router**: Toda la experiencia vive en una única pantalla o modal. Agregar `vue-router` añadiría peso innecesario al bundle.
  - **Estado Local con `ref()` / `reactive()`**: No requiere Pinia. El estado vive en el componente orquestador (`App.vue`) o composables locales.
  - **Composición con Primitivas MD3**: Utiliza `ZnApp`, `ZnScreen`, `ZnSection`, `ZnCard`, `ZnButton`, `ZnSwitch`.
  - **Diálogos Modales**: Para configuraciones o información ("Acerca de"), se utiliza `ZnDialog` o el sistema `useDialogs()`.

### 1.2. Arquetipo 2: Multi-Screen Routed PWA
- **Ejemplo en el monorepo**: Blueprint derivado de `kitchensink`.
- **Propósito**: Apps con múltiples vistas, paneles de control, flujos de pasos o secciones diferenciadas navegables por URL.
- **Características arquitectónicas**:
  - **Enrutamiento con `vue-router`**: `createRouter({ history: createWebHistory(), routes })` configurado con la base `/zn-apps/<nombre-app>/`.
  - **Layout Maestro-Esclavo (`ZnMasterSlaveLayout`)**:
    - En escritorio: Menú de navegación lateral (`#master`) y área de contenido principal (`default`).
    - En móvil: Navegación colapsable con deslizamiento horizontal y botón de regreso automático.
  - **Gestión de Estado**: Composition API o Pinia **estrictamente aislado dentro de la app** (nunca compartido entre proyectos).
  - **Deep Linking**: Cada vista posee su URL única dentro del subpath de la aplicación.

### 1.3. Arquetipo 3: Developer / Showroom / Catalog PWA
- **Ejemplo en el monorepo**: `kitchensink`.
- **Propósito**: Demostración de componentes, catálogo exhaustivo de recursos (iconos, tokens) y entorno de prueba interactivo.
- **Características arquitectónicas**:
  - Catálogo de iconos completo mediante `manual` en `icon-profile.json` (~2100 glifos).
  - Vistas de prueba para cada variante de componente y composable.
  - Sirve como plantilla viva para copiar y arrancar nuevas aplicaciones.

---

## 2. Matriz de Decisiones Arquitectónicas

Usa esta matriz al planificar una nueva app en el monorepo:

| Criterio / Decisión | Single-Screen Utility | Multi-Screen Routed | Showroom / Catalog |
|---|---|---|---|
| **¿Incluye `vue-router`?** | ❌ No (innecesario) | ✅ Sí (`createWebHistory`) | ✅ Sí |
| **¿Usa `ZnMasterSlaveLayout`?** | ❌ No (usa `ZnScreen` directo) | ✅ Sí (recomendado) | ✅ Sí |
| **Gestión de Estado** | `ref()` / `reactive()` local | `ref()` o Pinia local de app | `ref()` local |
| **Persistencia (`@zn-apps/settings-core`)** | Opcional (namespace propio) | Opcional (namespace propio) | Opcional |
| **Internacionalización** | Vue I18n (`en`/`es`) | Vue I18n (`en`/`es`) | Vue I18n (`en`/`es`) |
| **Perfil de Iconos (`icon-profile.json`)** | Solo `scanned` | Solo `scanned` + manual específico | `manual` completo (~2100 iconos) |
| **Panel Acerca de (`@zn-apps/ui-about`)** | ✅ Dentro de `ZnDialog` | ✅ Vista `/about` o diálogo | ✅ Vista `/about` |
| **Manifest PWA e Iconos** | ✅ Obligatorio (192 y 512 PNGs) | ✅ Obligatorio (192 y 512 PNGs) | ✅ Obligatorio (192 y 512 PNGs) |

---

## 3. Reglas de Herencia y Override de Arquitectura

Para preservar la coherencia y mantenibilidad del monorepo, existen reglas estrictas sobre qué elementos pueden modificarse o sobreescribirse (Override) y cuáles son mandatorios (Invariables):

### 🚫 Aspectos Invariables (NO se pueden sobreescribir)
1. **Aislamiento de Workspaces**: Cada app vive en su propia carpeta en la raíz, con su propio `package.json`, `vite.config.js` y `dist/`.
2. **Prohibido compartir Pinia cross-app**: Las apps jamás deben importar stores ni depender del estado reactivo de otra app.
3. **Subpath de Despliegue**: Toda app debe compilarse con base URL `/zn-apps/<nombre-app>/`.
4. **Envoltorio de Tema Obligatorio**: Toda app debe envolverse en `<ZnApp>` para sincronizar el tema MD3 (`zn-theme-light` / `zn-theme-dark`).
5. **Tokens de Diseño**: No modificar las variables globales `--md-*` de forma disruptiva. El esquema cromático base y la tipografía Roboto son compartidos.
6. **Validación PWA**: Toda app debe proveer `pwa-icon-192.png` y `pwa-icon-512.png` válidos con propósito `any maskable`.

### ✅ Aspectos Configurables / Sobre-escribibles (Overrides Permitidos)
1. **Presencia de Router**: Omitir `vue-router` en aplicaciones mono-pantalla o agregarlo en aplicaciones multi-vista.
2. **Diseño de Tarjetas y Controles Específicos**: Crear componentes locales (ej. `SoundToggle.vue` en `zound-box`) que compongan o adapten primitivas como `ZnCard` con efectos visuales propios (filtros de imagen, scrims, transiciones).
3. **Estrategia de Caché PWA**: Ajustar las opciones de Workbox en `vite.config.js` para precachear tipos de archivos específicos del dominio de la app (ej. `.ogg`, `.jpg`, fuentes personalizadas).
4. **Dominio de Datos y DTOs**: Cada app define sus propios esquemas JSON, modelos de dominio, contratos de eventos y lógica de negocio dentro de su carpeta `src/data/` o `src/models/`.

---

## 4. Dónde Documentar las Decisiones de cada App

Cada app debe mantener su propia carpeta `docs/` con su `README.md` detallando:
- Su arquetipo elegido y razones de override.
- Su modelo de dominio y DTOs.
- Sus reglas de negocio específicas.
- Su suite de tests unitarios.

Para consultar los lineamientos específicos de las apps existentes:
- [`zound-box/docs/README.md`](../zound-box/docs/README.md)
- [`kitchensink/docs/README.md`](../kitchensink/docs/README.md)
