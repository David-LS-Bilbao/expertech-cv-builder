# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature cerrada funcionalmente en la rama actual

- `feat/login-screen`

Objetivo cubierto:
- pantalla de acceso `login/register`
- registro y login local con email + contraseña
- persistencia de usuarios y sesión en `localStorage`
- restauración de sesión al recargar
- logout visible y funcional
- botones Google y GitHub visibles solo como preparación visual del siguiente MVP
- arranque global reorganizado para que `app.js` quede como entry point mínimo

## Consolidación arquitectónica reciente

- nueva capa `js/application/`
- `js/application/AppRuntime.js` como runtime global
- `js/application/AuthenticatedCVApp.js` para la app autenticada
- templates UI extraídos desde `index.html`
- `index.html` más cercano a shell base que a archivo monolítico
- separación más clara entre auth, sesión, estado del CV, integración GitHub y sincronización de UI

## Siguiente feature prevista

- `feat/github-project-sources`

Objetivo siguiente:
- ampliar la integración GitHub para múltiples cuentas, repositorios de otros owners y colaboraciones
- dejar más clara la atribución del origen del proyecto sin prometer todavía OAuth
- mantener separadas la auth local MVP y la futura auth real

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
- `feat/github-integration` no resuelve todavía múltiples cuentas GitHub
- no cubre colaboraciones ni atribución avanzada del origen de proyectos

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
