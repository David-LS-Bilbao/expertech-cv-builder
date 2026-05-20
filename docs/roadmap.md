# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa en la rama actual

- `chore/reconcile-main-before-v2`

Objetivo actual:
- Fase 0 del plan V2: reconciliar `main ↔ dev` y dejar la baseline estable antes de arrancar la Fase 2 (scaffold React + TypeScript)
- actualizar este roadmap para reflejar el estado real del proyecto
- auditoría de los patrones peligrosos del plan V2 sección 4 (todos limpios — ver más abajo)
- abrir PR `chore/reconcile-main-before-v2 → dev` y luego PR `dev → main` con tag `mvp-baseline-pre-v2`

## Bloque de hardening y cierre documental (mayo 2026)

Estado real actual:
- todas las integraciones pesadas del MVP (Auth local, Editor, Preview, Export, GitHub, Búsqueda de empleo) están resueltas arquitectónicamente
- bloque de hardening cerrado sobre `dev` con PRs #22 a #30
- bloque documental V2 cerrado sobre `dev` con PRs #31 a #33
- sanitización de seguridad adicional con PR #34
- pendiente: promocionar el conjunto a `main` (Fase 0 del plan V2, rama activa)

Ramas cerradas en este bloque:
- `fix/stabilize-authenticated-app-listeners` (#22): listeners separados y re-login sin duplicar bindings
- `chore/remove-claude-local-settings` (#23/#24): ignorar settings locales del asistente
- `fix/jobs-proxy-contract-and-security` (#25): endurecer el contrato y la seguridad del proxy de empleo
- `security/remove-exposed-jooble-key-and-local-docs` (#26): retirada de docs locales con API key expuesta
- `fix/storage-fallback-and-quota-handling` (#27): `SafeStorageService` con fallback `localStorage → sessionStorage → memoria` y límites de avatar
- `security/remove-reintroduced-local-docs` (#28): limpieza secundaria de docs reintroducidos
- `refactor/extract-project-rendering-utils` (#29): extracción de `js/utils/projects.js` y consumo desde los tres renderers
- `chore/add-gitattributes-line-endings` (#30): `.gitattributes` conservador con `eol=lf` para archivos de texto
- `docs/add-v2-react-backend-docker-plan` (#31): plan técnico explícito de la migración a V2 + README alineado
- `fix/remove-merge-conflict-from-job-offers-service` (#32): eliminar conflicto de merge pendiente en el servicio de ofertas
- `docs/add-v2-stitch-mockups-anexo` (#33): anexo de bocetos Stitch, mockups versionados y prompt de arranque
- `security/sanitize-reintroduced-jooble-key` (#34): sanitización de la API key de Jooble reintroducida por error en `docs/memoria/`

## Última feature cerrada

- `security/sanitize-reintroduced-jooble-key` (#34)

Objetivo cubierto:
- detectar y sanitizar la API key real de Jooble reintroducida por error en `docs/memoria/features/feature-jobs-proxy-security.md:396` por el commit `727f9e0`
- sustituir el UUID real por el placeholder `YOUR_REAL_KEY_HERE`, coherente con el resto del documento
- cero impacto en código de la app; cambio acotado a un único archivo de documentación
- cierra la brecha de seguridad que el PR #26 y el PR #28 habían dejado parcialmente abierta

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

- PR `chore/reconcile-main-before-v2` → `dev` (esta misma rama, roadmap actualizado)
- PR `dev` → `main` con tag `mvp-baseline-pre-v2` para cerrar Fase 0 del plan V2
- comenzar Fase 2: `feat/v2-react-ts-scaffold` (scaffold Vite + React + TypeScript en carpeta separada del legacy)

Objetivo siguiente:
- dejar `main` y `dev` en el mismo commit saneado (baseline estable pre-V2)
- verificar que los patrones peligrosos del plan V2 sección 4 están limpios antes del merge a `main` (auditado en esta rama — resultado: todos limpios)
- arrancar el scaffold React + TypeScript sin arrastrar deuda de la divergencia `main ↔ dev`

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

1. cerrar `chore/reconcile-main-before-v2` con roadmap al día ← rama activa
2. abrir PR `chore/reconcile-main-before-v2` → `dev`
3. tras validar `dev`, abrir PR `dev` → `main` con tag `mvp-baseline-pre-v2`
4. comenzar Fase 2 del plan V2: `feat/v2-react-ts-scaffold`

## Auditoría pre-baseline (plan V2 sección 4 · realizada 2026-05-21)

Verificación de los patrones peligrosos del bloque de hardening antes de promocionar a `main`:

- ✅ `localhost:3001` hardcodeado en frontend: no encontrado
- ✅ `_fallbackWarning` mutado sobre arrays: no encontrado
- ✅ `app.use(cors())` abierto sin allowlist: no encontrado (configuración explícita en `server/server.js:21`)
- ✅ secretos o API keys en archivos trackeados: no encontrados (sanitizado en PR #34)
- ✅ archivos `.env` reales trackeados: no encontrados
- ✅ documentación local con datos sensibles reintroducida: no encontrada

Resultado: baseline apta para promoción a `main`.

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
