# App: Zound Box — Resumen y Enlaces

> ⚠️ **Documentación Reubicada**: La documentación detallada de arquitectura, modelo de dominio, DTOs, motor de audio y decisiones de override de Zound Box reside en su propia carpeta:
> - 👉 [**`zound-box/docs/README.md`**](../zound-box/docs/README.md)

---

## Resumen Ejecutivo

- **Ubicación**: `zound-box/`
- **Ruta de Despliegue**: `/zn-apps/zound-box/`
- **Tipo de Aplicación**: Single-Screen Utility PWA.
- **Función Principal**: Reproductor y mezclador de audio ambiental para descanso, enfoque y relajación infantil (sonidos de fondo continuos + seseo rítmico).
- **Stack**: Vue 3 (`<script setup>`), Vite 5, `vite-plugin-pwa`, `@zn-apps/ui-core`, `@zn-apps/ui-about`.
- **Overrides Clave**:
  - **Sin Vue Router**: Aplicación mono-pantalla para optimizar tamaño y carga.
  - **Sin Pinia**: Estado local en `App.vue` con `ref()`.
  - **Tarjetas Personalizadas**: `SoundToggle.vue` con filtros visuales grayscale/brillo para estado inactivo.

Consulta la [documentación completa en `zound-box/docs/README.md`](../zound-box/docs/README.md).
