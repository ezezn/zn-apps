# Kitchensink

Showroom de componentes Material Design 3, catálogo exhaustivo de iconos y **blueprint** para nuevas aplicaciones en el monorepo `zn-apps`.

- **Documentación de usuario**: [English](./doc/en/README.md) · [Español](./doc/es/README.md) — arquitectura maestro-esclavo, rutas de demo, catálogo de iconos y guía paso a paso para crear nuevas apps.
- **Contexto para agentes**: [`ai/README.md`](./ai/README.md)
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
