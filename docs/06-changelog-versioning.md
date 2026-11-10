# Versionado Semántico y Generación de CHANGELOGs

Este documento define la política obligatoria para la generación de archivos `CHANGELOG.md` y la actualización de versiones en los `package.json` de cada proyecto (aplicaciones y librerías compartidas) del monorepo `zn-apps`.

---

## 1. Principio Operativo y Disparador

> [!IMPORTANT]
> **Generación a pedido del usuario**: Los archivos `CHANGELOG.md` y la actualización de versiones se generan **únicamente cuando el usuario lo solicite explícitamente**.

Al solicitarlo, el usuario indicará la naturaleza del cambio en la branch o sesión de trabajo:
- **Rediseño de aplicación / breaking change / cambio mayor**
- **Nueva feature / funcionalidad**
- **Bugfixing / corrección de errores**

---

## 2. Reglas de Versionado Semántico (`SemVer`)

Cada aplicación (`zound-box`, `kitchensink`, etc.) y librería (`@zn-apps/ui-core`, `@zn-apps/settings-core`, `@zn-apps/ui-about`, `@zn-apps/pwa-integration`) gestiona su propia versión en su respectivo `package.json` siguiendo el esquema `MAJOR.MINOR.PATCH`:

| Tipo de Solicitud | Impacto en Versión | Ejemplo (desde `0.0.0`) | Ejemplo (desde `1.2.3`) |
|---|---|---|---|
| **"Rediseño de aplicación"** (Major) | Incrementa `MAJOR`, reinicia `MINOR=0` y `PATCH=0` | `0.0.0` → `1.0.0` | `1.2.3` → `2.0.0` |
| **"Nueva feature"** (Minor) | Incrementa `MINOR`, reinicia `PATCH=0` | `0.0.0` → `0.1.0` | `1.2.3` → `1.3.0` |
| **"Bugfixing"** (Patch) | Incrementa `PATCH` | `0.0.0` → `0.0.1` | `1.2.3` → `1.2.4` |

---

## 3. Estructura y Ubicación del `CHANGELOG.md`

Cada proyecto afectado tiene su propio archivo `CHANGELOG.md` ubicado en su raíz:
- `zound-box/CHANGELOG.md`
- `kitchensink/CHANGELOG.md`
- `shared/ui-core/CHANGELOG.md`
- `shared/settings-core/CHANGELOG.md`
- `shared/ui-about/CHANGELOG.md`
- `shared/pwa-integration/CHANGELOG.md`

### Formato Bilingüe (Español / Inglés)

El archivo debe documentar cada versión con un resumen conciso de los cambios en ambos idiomas:

````markdown
# Changelog

## [1.0.0] - 2026-11-10

### Español
#### Tipo de cambio: Rediseño de aplicación
- **Resumen**: Rediseño integral de la interfaz de usuario adaptada a Material Design 3.
- **Detalles**:
  - Reemplazo del layout tradicional por navegación desacoplada.
  - Nueva paleta de colores y componentes reactivos.
  - Corrección de desbordamientos en pantallas pequeñas.

### English
#### Change type: Application Redesign
- **Summary**: Comprehensive UI redesign following Material Design 3 guidelines.
- **Details**:
  - Replaced legacy layout with decoupled navigation.
  - New color palette and reactive components.
  - Fixed viewport overflow issues on small screens.
````

Si el archivo `CHANGELOG.md` ya existe, las nuevas versiones se insertan **en la parte superior** (orden cronológico inverso).

---

## 4. Script Auxiliar Automatizado

Para garantizar la precisión en el cálculo de SemVer y la actualización de `package.json`, el monorepo cuenta con un script auxiliar ejecutable:

```bash
# Uso:
node scripts/bump-version.mjs <directorio-proyecto> <major|minor|patch>
```

Ejemplos:
```bash
# Rediseño en zound-box (0.0.0 -> 1.0.0)
node scripts/bump-version.mjs zound-box major

# Nueva feature en ui-core (0.0.0 -> 0.1.0)
node scripts/bump-version.mjs shared/ui-core minor

# Bugfixing en settings-core (0.0.0 -> 0.0.1)
node scripts/bump-version.mjs shared/settings-core patch
```
