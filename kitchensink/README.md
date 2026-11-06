# Kitchensink

Showroom de componentes Material Design 3, catálogo exhaustivo de iconos y **blueprint** para nuevas aplicaciones en el monorepo `zn-apps`.

- **Documentación Completa**: Consulta [`docs/README.md`](./docs/README.md) para detalles sobre arquitectura maestro-esclavo, `vue-router`, integración del catálogo completo de iconos y guía paso a paso para crear nuevas apps.
- **Ruta de Despliegue**: `/zn-apps/kitchensink/`

## Scripts

```bash
# Desarrollo local
npm run dev --workspace=kitchensink

# Tests unitarios
npm run test:kitchensink

# Escanear y generar iconos
npm run scan:icons
npm run generate:icons

# Compilación de producción
npm run build
```
