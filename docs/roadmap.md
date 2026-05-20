# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa en la rama actual

- `chore/v2-fase-4-docs-and-polish`

Objetivo actual:
- micro-rama de auditoría post-Fase 4: pulido de metadata HTML, README propio de `apps/web/`, documentación de limitaciones temporales antes del backend y registro del cierre de Fases 2, 3 y 4 en roadmap y evidencias
- sin cambios de producto ni de lógica: solo documentación y metadatos

## Bloque de hardening y cierre documental (mayo 2026)

Estado real actual:
- todas las integraciones pesadas del MVP legacy (Auth local, Editor, Preview, Export, GitHub, Búsqueda de empleo) están resueltas arquitectónicamente
- bloque de hardening legacy cerrado sobre `dev` con PRs #22 a #30
- bloque documental V2 cerrado sobre `dev` con PRs #31 a #33
- sanitización de seguridad adicional con PR #34
- reconciliación `main ↔ dev` + promoción a `main` completadas con PRs #35 y #36
- **Fases 2, 3 y 4 del plan V2 cerradas sobre `dev`** con PRs #37, #38 y #39

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
- `chore/reconcile-main-before-v2` (#35): roadmap actualizado y auditoría pre-baseline V2
- `release: promote MVP baseline pre-V2` (#36): promoción `dev → main` con tag `mvp-baseline-pre-v2`
- `feat/v2-react-ts-scaffold` (#37): scaffold Vite + React + TypeScript en `apps/web/` (Fase 2)
- `feat/v2-domain-models-and-storage` (#38): modelos dominio y storage TypeScript en `apps/web/src/lib/` (Fase 3)
- `feat/v2-react-auth-and-editor-shell` (#39): auth local, editor de perfil y preview React (Fase 4)

## Última feature cerrada

- `feat/v2-react-auth-and-editor-shell` (#39) — Fase 4 del plan V2

Objetivo cubierto:
- pantalla de auth (login/registro con tabs) con auth local de demo, misma limitación explícita que el legacy
- layout autenticado con cabecera, logout y disposición editor+preview en dos columnas
- formulario de perfil controlado con guardado explícito (preview sincronizada al guardar)
- preview del CV con visibilidad de proyectos usando la misma regla que `js/utils/projects.js`
- port TypeScript de `AuthStorageService` e `isRenderableProject`/`getVisibleProjects`
- verificado: `typecheck` OK, `lint` OK, `build` OK (28 módulos, 86ms)

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

- PR `chore/v2-fase-4-docs-and-polish` → `dev` ← rama activa (pulido documental post-Fase 4)
- comenzar Fase 5: `feat/v2-backend-api-foundation` (backend TypeScript con endpoints mínimos, sin DB todavía)

Objetivo siguiente:
- cerrar esta micro-rama de documentación sin ampliar alcance de producto
- arrancar backend Express/Fastify TypeScript en `apps/api/` conviviendo con el proxy legacy de Jooble
- endpoints mínimos: `GET /health`, `POST /auth/register`, `POST /auth/login`, `GET/PUT /cvs/me`, `GET /jobs/search`
- conectar el frontend React a los endpoints sin URL hardcodeada (variable de entorno)

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

1. ✅ Fase 0: reconciliar `main ↔ dev` (PRs #35 y #36)
2. ✅ Fase 2: scaffold React + TypeScript en `apps/web/` (PR #37)
3. ✅ Fase 3: dominio y storage TypeScript (PR #38)
4. ✅ Fase 4: auth, editor de perfil y preview React (PR #39)
5. cerrar `chore/v2-fase-4-docs-and-polish` con docs al día ← rama activa
6. comenzar Fase 5: `feat/v2-backend-api-foundation`

## Limitaciones temporales antes del backend (Fase 5)

Quedan documentadas para no confundirlas con bugs:

- **Auth local no segura**: contraseñas guardadas en texto plano en `localStorage`.
  Funcional solo como demo MVP. No apta para producción ni datos reales.
- **CV no aislado por usuario**: la clave de storage es fija (`expertech-cv:v2`).
  Pasará a ser session-scoped cuando se integre el backend real (Fase 5/6).
- **Preview sincronizada al guardar**: la preview del CV se actualiza al pulsar
  "Guardar perfil", no en tiempo real mientras se escribe. El live-typing
  requiere gestión de estado más sofisticada prevista para Fase 4+/Fase 5.
- **Jooble y proxy local son legacy temporal**: el buscador de empleo opera
  desde `server/server.js` (Express legacy). Se sustituirá o la API key se
  rotará cuando exista backend serio en `apps/api/` (Fase 5).
- **GitHub OAuth y exportación PDF no portados**: disponibles en el legacy;
  pendientes de portado incremental en Fases siguientes.

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
