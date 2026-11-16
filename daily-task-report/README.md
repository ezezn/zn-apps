# Daily Task Report

PWA local para registrar, filtrar y editar las tareas reportadas desde un sistema externo de trabajo, con layout maestro-esclavo y datos en el dispositivo.

- **Documentación de usuario**: [English](./doc/en/README.md) · [Español](./doc/es/README.md) — entidad `Task`, filtros y orden, configuración y estrategia de nombres.
- **Contexto para agentes**: [`ai/README.md`](./ai/README.md)
- **Ruta de despliegue**: `/zn-apps/daily-task-report/`

## Scripts

```bash
# Desarrollo local (desde la raíz o dentro de daily-task-report)
npm run dev --workspace=daily-task-report

# Tests unitarios
npm run test:daily-task-report

# Compilación de producción
npm run build --workspace=daily-task-report
```
