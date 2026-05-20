# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa en la rama actual

- `chore/add-gitattributes-line-endings`

Objetivo actual:
- añadir un `.gitattributes` conservador para evitar diffs ruidosos por finales de línea (CRLF/LF) entre Windows/macOS/Linux
- no renormalizar EOL del repo completo en este PR
- preparar el cierre documental del bloque de hardening

## Bloque de hardening recién cerrado (mayo 2026)

Estado real actual:
- todas las integraciones pesadas del MVP (Auth local, Editor, Preview, Export, GitHub, Búsqueda de empleo) están resueltas arquitectónicamente
- se ha cerrado una tanda de hardening sobre `dev` con PRs #22 a #29
- queda pendiente promocionar el conjunto a `main`

Ramas cerradas en este bloque:
- `fix/stabilize-authenticated-app-listeners` (#22): listeners separados y re-login sin duplicar bindings
- `chore/remove-claude-local-settings` (#23/#24): ignorar settings locales del asistente
- `fix/jobs-proxy-contract-and-security` (#25): endurecer el contrato y la seguridad del proxy de empleo
- `security/remove-exposed-jooble-key-and-local-docs` (#26): retirada de docs locales con API key expuesta
- `fix/storage-fallback-and-quota-handling` (#27): `SafeStorageService` con fallback `localStorage → sessionStorage → memoria` y límites de avatar
- `security/remove-reintroduced-local-docs` (#28): limpieza secundaria de docs reintroducidos
- `refactor/extract-project-rendering-utils` (#29): extracción de `js/utils/projects.js` y consumo desde los tres renderers

## Última feature cerrada

- `refactor/extract-project-rendering-utils` (#29)

Objetivo cubierto:
- eliminar la duplicación de `isRenderableProject` y `getVisibleProjects` entre `PreviewRenderer`, `PrintCVRenderer` y `PublicCVRenderer`
- crear `js/utils/projects.js` como única fuente de verdad para la regla de visibilidad de proyectos
- mantener el comportamiento visual idéntico (mismo criterio, mismo orden, mismos textos)
- limpieza de imports no utilizados en los renderers

## Feature anterior cerrada

- `feat/jooble-search-proxy-mvp`

Objetivo cubierto:
- añadir un buscador de ofertas en la app autenticada.
- conectar el frontend a un backend proxy local (Express Server).
- consumir la API pública real de Jooble, manteniendo las API Keys completamente ocultas del navegador web.
- aplicar el patrón "Graceful Degradation": en caso de fallo, WAF o límite alcanzado en la API real, el frontend atrapa el error devuelto por la Request silenciosamente e inyecta respuestas "Mock" o clonadas añadiendo un aviso de color naranja debajo de la solicitud para que el sistema del portfolio nunca ceda la experiencia web principal de cara al usuario final.

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

- promocionar `dev` → `main` con todo el bloque de hardening
- después, retomar (o descartar) `feat/visual-polish-final`

Objetivo siguiente:
- abrir PR `chore/add-gitattributes-line-endings` → `dev`
- abrir PR `dev` → `main` para llevar el hardening a producción del MVP
- decidir si se mantiene el polish visual como feature separada o se cierra el MVP aquí

## Validación técnica reciente (Jooble)

- API key validada con respuesta real `HTTP 200` desde el proxy local
- configuración esperada de entorno en `server/.env` (`JOOBLE_API_KEY=...`)
- comportamiento de respaldo confirmado: si falta credencial, el backend responde `503` y el frontend degrada a mock

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

1. cerrar `chore/add-gitattributes-line-endings` con documentación al día
2. abrir PR `chore/add-gitattributes-line-endings` -> `dev`
3. tras validar `dev`, abrir PR `dev` -> `main` con el bloque de hardening completo
4. decidir si se reabre `feat/visual-polish-final` o se cierra el MVP en este punto

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
