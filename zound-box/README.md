# Zound Box

PWA de relajación, reproducción y mezcla de audio ambiental (ruido blanco, lluvia, viento, canción de cuna y seseo rítmico).

- **Documentación de usuario**: [English](./doc/en/README.md) · [Español](./doc/es/README.md) — arquitectura, modelo de dominio (`SoundChannel`, `SoundItem`), overrides (sin router, estado reactivo local) y reglas de negocio.
- **Contexto para agentes**: [`ai/README.md`](./ai/README.md)
- **Ruta de Despliegue**: `/zn-apps/zound-box/`

## Scripts

```bash
# Desarrollo local (desde la raíz o dentro de zound-box)
npm run dev --workspace=zound-box

# Tests unitarios
npm run test:zound-box

# Compilación de producción
npm run build
```
