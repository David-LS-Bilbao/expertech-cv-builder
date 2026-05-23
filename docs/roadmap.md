# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa en la rama actual

- `feat/v2-dashboard-and-editor` — Sprint UI 2: experiencia autenticada V2

Objetivo actual:
- portar Dashboard y Editor CV a Tailwind v3 usando los tokens Stitch ya introducidos en PR #46
- mantener intactos login/register/logout, carga y guardado de CV contra backend y preview sincronizada al guardar
- añadir navegación interna local `Dashboard / Editor CV` sin router ni rutas reales
- mostrar GitHub, Jobs, PDF y perfil público solo como placeholders visuales
- mantener fuera de alcance backend, Prisma, Docker, landing, legacy vanilla JS y features reales de integraciones

## Bloque de hardening y cierre documental (mayo 2026)

Estado real actual:
- todas las integraciones pesadas del MVP legacy están resueltas arquitectónicamente
- bloque de hardening legacy cerrado sobre `dev` con PRs #22 a #30
- bloque documental V2 cerrado sobre `dev` con PRs #31 a #33
- sanitización de seguridad adicional con PR #34
- reconciliación `main ↔ dev` + promoción a `main` completadas con PRs #35 y #36
- Fases 2, 3, 4 del plan V2 cerradas con PRs #37–#39
- pulido documental post-Fase 4 con PR #40
- **Fase 5 cerrada con PR #41**: backend Express + TypeScript en `apps/api/`
- **Fase 6 cerrada con PR #42**: PostgreSQL + Prisma + bcrypt + frontend rewire al backend

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
- `chore/v2-fase-4-docs-and-polish` (#40): pulido documental post-Fase 4, metadata HTML, limitaciones V2
- `feat/v2-backend-api-foundation` (#41): backend Express + TypeScript con endpoints mínimos, CORS, health, auth, users, cvs, jobs (Fase 5)
- `feat/v2-database-persistence` (#42): PostgreSQL + Prisma + bcrypt + sesiones en DB + frontend rewire (Fase 6)
- `chore/v2-fase-6-docs-and-safety-audit` (#43): documentación post-Fases 5 y 6

## Última feature cerrada

- `feat/v2-database-persistence` (#42) — Fase 6 del plan V2

Objetivo cubierto:
- PostgreSQL 16 en Docker Compose (puerto 5435 en host); schema Prisma con `User`, `CV`, `PublicProfile`, `Session`
- bcryptjs para hashing de contraseñas en registro y verificación en login
- sesiones persistidas en DB con token Bearer; aislamiento garantizado por `ownerId` en todas las queries de CV
- `health` endpoint pings DB y devuelve recuento de usuarios
- `public-profiles/:slug` resuelve con Prisma: devuelve CV si `isPublic = true`, 404 si no
- frontend rewire: `App.tsx` arranca con bootstrap async (token → `/users/me` + `/cvs/me`), `AuthScreen` llama backend, `AuthenticatedShell` recibe `PublicUser`
- eliminados `lib/auth/` y `lib/storage/` del frontend (dead code tras rewire)
- smoke test multi-usuario verificado: Alice y Bob nunca ven datos del otro
- verificado: `typecheck` OK, `lint` OK, `build` OK (ambos, `apps/api` y `apps/web`)

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

- PR `feat/v2-dashboard-and-editor` → `dev` ← rama activa
- comenzar `feat/v2-github-integration` — integración GitHub real para perfil y repositorios

## Sprints de paridad funcional V2 (post-infraestructura)

| Sprint | Rama | Contenido |
|---|---|---|
| UI 1 | `feat/v2-tailwind-design-system` ✅ PR #46 | Tailwind + tokens + AuthScreen |
| UI 2 | `feat/v2-dashboard-and-editor` ← activo | Dashboard + Editor acordeones + preview |
| UI 3 | `feat/v2-github-integration` | Sync GitHub: perfil + repos |
| UI 4 | `feat/v2-jobs-and-pdf` | Job search + exportar PDF |
| UI 5 | `feat/v2-public-profile` | Página pública + landing |

Objetivo siguiente:
- `feat/v2-github-integration`
- conectar GitHub real para enriquecer perfil/repositorios en V2
- mantener Jobs UI, PDF, perfil público y landing fuera hasta sus sprints correspondientes

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
5. ✅ Docs post-Fase 4 (PR #40)
6. ✅ Fase 5: backend API foundation (PR #41)
7. ✅ Fase 6: PostgreSQL + Prisma + frontend rewire (PR #42)
8. ✅ Docs post-Fase 6 (PR #43)
9. ✅ Fase 7: Docker Compose local (PR #44)
10. cerrar Fase 8: `feat/v2-deployment-readiness` ← rama activa

## Limitaciones conocidas post-Fase 6

Quedan documentadas para no confundirlas con bugs ni con trabajo no hecho:

- **Sesiones sin expiración automática**: el modelo `Session` en DB no tiene TTL.
  Cleanup manual o cron job previsto para Fase 8 (deployment readiness).
- **Sin rate limit en endpoints sensibles**: `/auth/register` y `/auth/login`
  son atacables sin límite de intentos. Rate limit en Fase 8.
- **Sin logs estructurados**: `console.log/error` por ahora. Logger con niveles y
  formato JSON en Fase 8.
- **Token Bearer en `localStorage`**: el token de sesión del frontend vive en
  `localStorage`. Migración a `httpOnly cookie` en Fase 8.
- **Tipos duplicados frontend/backend**: `PortfolioCV`, `Project`, etc. están en
  `apps/web/src/lib/domain/types.ts` y en `apps/api/src/types.ts`. Se moverán
  a un paquete compartido cuando el coste de duplicación crezca.
- **`PublicProfile` sin endpoint de gestión**: el modelo existe en DB pero no hay
  UI ni endpoint para que el usuario cree o active su slug. Pendiente de Fase 7+.
- **Preview sincronizada al guardar**: la preview del CV se actualiza al guardar,
  no en tiempo real al escribir. Live-typing requiere estado más sofisticado.
- **Jooble legacy temporal**: el buscador de empleo V2 proxea a Jooble desde
  `apps/api/src/services/joobleProxy.ts`. La API key debe rotarse antes de
  producción. Normalización definitiva en Fase 8.
- **GitHub OAuth y exportación PDF no portados a V2**: disponibles en el legacy;
  pendientes de portado en Fases siguientes.
- **Sin Docker Compose completo**: la DB está dockerizada (`apps/api/docker-compose.yml`);
  el frontend y el backend todavía no. Fase 7 resuelve esto.

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
