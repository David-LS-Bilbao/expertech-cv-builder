# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa en la rama actual

- `feat/infojobs-search-proxy-mvp`

Objetivo actual:
- añadir un buscador de ofertas en la app autenticada
- conectar frontend con un proxy local mínimo
- mantener fallback a mock cuando la API real no está disponible
- no abrir backend completo ni base de datos en esta fase

Estado real actual:
- bloque de búsqueda ya integrado en UI
- servicio frontend de ofertas ya creado
- proxy local base ya creado y migrado a Jooble
- integración real todavía no estable (se mantiene fallback a mock)

## Última feature cerrada

- `feat/github-pages-public-preview`

Objetivo cubierto:
- simular una base pública real del CV con una demo estática preparada para GitHub Pages
- desacoplar la demo pública de la dependencia directa del `localStorage` local
- dejar una base clara para una futura URL publicada y un QR funcional
- mantener esta fase dentro de frontend/demo estática
- no abrir todavía backend serio ni base de datos

## Consolidación arquitectónica reciente

- nueva capa `js/application/`
- `js/application/AppRuntime.js` como runtime global
- `js/application/AuthenticatedCVApp.js` para la app autenticada
- templates UI extraídos desde `index.html`
- `index.html` más cercano a shell base que a archivo monolítico
- separación más clara entre auth, sesión, estado del CV, integración GitHub y sincronización de UI
- renderer específico para impresión PDF
- soporte de avatar híbrido
- `public.html` como vista local adicional preparada para futura publicación compartible

## Siguiente feature prevista

- `feat/polish-accessibility` o `feat/visual-polish-final`

Objetivo siguiente:
- cerrar pulido visual, estados UX y accesibilidad base tras estabilizar el buscador de empleo
- mantener el alcance en frontend MVP sin reabrir arquitectura

## Avance reciente dentro de la feature cerrada más reciente

- `feat/export-pdf-qr`
  - nueva vista específica de impresión para exportación PDF
  - sincronización del renderer de impresión con el borrador actual del editor
  - soporte de avatar híbrido con subida local optimizada y fallback GitHub
  - `public.html` como vista local adicional preparada para compartirse más adelante
  - preparación del terreno para una futura publicación pública real con GitHub Pages y QR

## Resultado principal del cierre reciente

- `feat/github-pages-public-preview`
  - `public.html` ya desacoplada del `localStorage` del editor
  - snapshot público estático en `data/public-cv.json`
  - runtime público modular con `js/public.js` y `js/application/PublicPageRuntime.js`
  - hero pública conectada a datos reales del CV demo
  - avatar visible, tecnologías con iconos y proyectos destacados en una página más cercana a una demo pública real

## Feature cerrada recientemente

- `feat/export-pdf-qr`
  - nueva vista específica de impresión para exportación PDF
  - sincronización del renderer de impresión con el borrador actual del editor
  - soporte de avatar híbrido con subida local optimizada y fallback GitHub
  - preparación del terreno para una futura publicación pública real con GitHub Pages y QR

- `feat/github-project-sources`
  - persistencia de metadatos mínimos del origen de proyectos importados desde GitHub
  - señal visual compacta del origen del proyecto en la preview
  - compatibilidad con proyectos manuales y con estado persistido existente
  - limpieza del proyecto demo legado para que el empty-state de proyectos sea coherente

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

## Orden funcional acordado para esta fase

1. estabilizar y cerrar `feat/infojobs-search-proxy-mvp`
2. `feat/polish-accessibility` o `feat/visual-polish-final`
3. `feat/documentacion-final`

## Fase siguiente

- backend serio
- base de datos
- publicación real multiusuario
- integraciones más ricas

## Fuera deliberadamente en la fase actual

- la auth actual del MVP no es auth real ni segura para producción
- no hay backend serio ni PostgreSQL en esta fase
- Google y GitHub no implementan OAuth real todavía
- `feat/github-pages-public-preview` no debe abrir todavía persistencia real compartida ni publicación multiusuario
- la feature de buscador de empleo no debe convertirse todavía en backend completo
- si la API de empleo elegida requiere secreto, solo se permitirá un proxy mínimo o función serverless, no una arquitectura backend completa
- no hay base de datos ni persistencia compartible real fuera de `localStorage` en esta fase
- las integraciones externas más ricas quedan para la siguiente etapa del proyecto

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
