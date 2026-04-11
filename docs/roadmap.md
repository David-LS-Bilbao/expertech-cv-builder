# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa en la rama actual

- `feat/github-project-sources`

Objetivo actual:
- conservar metadatos mínimos del origen de proyectos importados desde GitHub
- mostrar una señal visual compacta de origen en la preview
- mantener intacta la protección de proyectos manuales reales
- eliminar la confusión del proyecto demo legado al quitar la selección GitHub

## Consolidación arquitectónica reciente

- nueva capa `js/application/`
- `js/application/AppRuntime.js` como runtime global
- `js/application/AuthenticatedCVApp.js` para la app autenticada
- templates UI extraídos desde `index.html`
- `index.html` más cercano a shell base que a archivo monolítico
- separación más clara entre auth, sesión, estado del CV, integración GitHub y sincronización de UI

## Siguiente feature prevista tras esta rama

- `feat/export-pdf-qr`

Objetivo siguiente:
- preparar una salida PDF breve del CV
- explorar un acceso compartible mediante QR sin abrir todavía backend
- mantener el MVP actual estable mientras se añade una salida más presentable

## Avance reciente dentro de la feature activa

- `feat/github-project-sources`
  - proyectos GitHub conservan trazabilidad mínima dentro del estado del CV
  - la preview muestra origen compacto tipo `GitHub · owner/repo`
  - fallback seguro cuando faltan datos de origen
  - limpieza del proyecto demo legado para que el empty-state sea coherente

## Feature cerrada recientemente

- `feat/login-screen`
  - auth local básica para MVP con email + contraseña
  - sesión persistida y restaurada desde `localStorage`
  - logout funcional y acceso social todavía no implementado
  - consolidación de `app.js` como composition root mínimo

- `feat/projects-visualization`
  - preview de proyectos conectada a `cvState.projects`
  - cards con nombre, descripción, stack y enlaces visibles
  - priorización de proyectos `featured` y empty-state específico
  - separación limpia entre datos, selección GitHub y render visual

- `feat/github-integration`
  - consulta pública de perfil y repositorios desde GitHub API
  - render de perfil GitHub con badge de estado, feedback y fallback manual
  - selección manual de repositorios destacados conectada al estado del CV
  - persistencia de `githubUsername` y proyectos GitHub para rehidratación coherente en el MVP

## Fuera Deliberadamente

- la auth actual del MVP no es auth real ni segura para producción
- no hay backend ni PostgreSQL en esta fase
- Google y GitHub no implementan OAuth real todavía
- `feat/github-project-sources` no resuelve todavía múltiples cuentas GitHub
- no cubre colaboraciones ni atribución avanzada del origen de proyectos

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
