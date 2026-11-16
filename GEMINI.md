# Reglas y contexto para Gemini / Antigravity

> Archivo de descubrimiento automático para **Antigravity** y **Gemini CLI**.

## Punto de entrada

[`ai/README.md`](./ai/README.md) enruta cada tarea al conjunto mínimo de archivos a leer. Carga el contexto de un proyecto sólo si el cambio lo toca.

- Global: [`ai/architecture.md`](./ai/architecture.md), [`ai/workflow.md`](./ai/workflow.md), [`ai/testing.md`](./ai/testing.md), [`ai/app-types.md`](./ai/app-types.md), [`ai/versioning.md`](./ai/versioning.md), [`ai/docs-maintenance.md`](./ai/docs-maintenance.md).
- Por proyecto: `shared/<lib>/ai/README.md`, `zound-box/ai/README.md`, `kitchensink/ai/README.md`.
- Documentación de usuario (EN + ES): [`doc/en/README.md`](./doc/en/README.md) y [`doc/es/README.md`](./doc/es/README.md).

## Reglas clave

1. **Librerías compartidas aisladas**: `shared/` contiene librerías independientes. Todo componente compartido vive en `shared/ui-core/src/components/` con prefijo `Zn` y tokens `--md-*`. Las librerías no se importan entre sí salvo las composiciones documentadas.
2. **Independencia de aplicaciones**: no acoplar apps ni compartir stores de Pinia entre ellas; cada app se compila con base `/zn-apps/<nombre>/`.
3. **Paridad de campos**: toda feature de un campo de datos debe existir en formulario, vista y editor.
4. **Verificación acotada**: usa el test/build mínimo útil; la suite completa y `build:all` son para cambios transversales o de release. Las tareas sólo de Markdown no ejecutan tests ni builds.
5. **Documentación**: actualiza `ai/` (inglés, compacta) y `doc/{en,es}/` (usuario, bilingüe) en el mismo cambio que la feature o decisión.
