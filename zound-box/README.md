# Zound Box

PWA de relajación, reproducción y mezcla de audio ambiental (ruido blanco, lluvia, viento, canción de cuna y seseo rítmico).

- **Documentación Completa**: Consulta [`docs/README.md`](./docs/README.md) para detalles sobre arquitectura, modelo de dominio (`SoundChannel`, `SoundItem`), decisiones de override (sin router, estado reactivo local) y reglas de negocio.
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
