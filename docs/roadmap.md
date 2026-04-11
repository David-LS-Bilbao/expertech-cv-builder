# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa en la rama actual

- `feat/export-pdf-qr`

Objetivo actual:
- preparar una salida PDF breve y más presentable del CV
- mantener sincronizada la exportación con el borrador visible
- dejar una vista local adicional (`public.html`) preparada para compartirse más adelante
- no mezclar todavía backend ni publicación real

## Consolidación arquitectónica reciente

- nueva capa `js/application/`
- `js/application/AppRuntime.js` como runtime global
- `js/application/AuthenticatedCVApp.js` para la app autenticada
- templates UI extraídos desde `index.html`
- `index.html` más cercano a shell base que a archivo monolítico
- separación más clara entre auth, sesión, estado del CV, integración GitHub y sincronización de UI

## Siguiente feature prevista tras esta rama

- `feat/github-pages-public-preview`

Objetivo siguiente:
- simular una URL pública real desplegando una versión estática en GitHub Pages
- preparar una experiencia pública demo separada del `localStorage` local
- generar un QR de demostración que apunte a la URL publicada en GitHub Pages

## Avance reciente dentro de la feature activa

- `feat/export-pdf-qr`
  - nueva vista de impresión con layout más limpio para exportación
  - sincronización del renderer de impresión con el borrador actual del editor
  - soporte de avatar híbrido con subida local optimizada y fallback GitHub
  - `public.html` como vista local adicional preparada para compartirse más adelante

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
- `feat/export-pdf-qr` no ofrece todavía URL pública real ni QR funcional
- no hay backend ni persistencia compartible fuera de `localStorage`

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
