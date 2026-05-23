# Auditoría de paridad V2 vs Legacy

Fecha: 2026-05-23  
Rama: `chore/v2-legacy-parity-audit`

Actualización en `feat/v2-landing-page`: este sprint cierra el gap principal de landing V2 en `/` cuando se mergee a `dev`. La recomendación posterior pasa a ejecutar `chore/v2-final-demo-audit` antes de archivar o retirar legacy.

## 1. Resumen ejecutivo

Estado global: **Casi lista, quedan gaps menores**.

La V2 ya cubre el núcleo funcional del legacy vanilla JS y lo supera en arquitectura: frontend React/TypeScript, backend Express, persistencia real con PostgreSQL/Prisma, Docker local, autenticación con sesiones en backend, dashboard, editor, preview, GitHub Sync público, Jobs Search, exportación por impresión con QR local y perfil público real en `/p/:slug`.

No obstante, **no recomiendo retirar el legacy todavía** porque `public.html` puede seguir teniendo valor como referencia histórica o enlace usado en demos previas. Con `feat/v2-landing-page`, la V2 ya cubre la entrada pública principal en `/`, pero debe ejecutarse una auditoría final de demo antes de archivar o retirar legacy.

## 2. Alcance de la auditoría

Se revisa:

- legacy vanilla JS: `index.html`, `public.html`, `js/application/**`, `js/ui/**`, `js/services/**`, `js/models/**`, `styles/reset.css` y archivos legacy relacionados con jobs, PDF, QR y perfil público.
- V2 React/TypeScript: `apps/web/src/app/App.tsx`, features auth/cv/github/jobs/export/public-profile y cliente API.
- backend V2: rutas Express, Prisma schema, auth, CV, jobs y public profiles.
- documentación actual: `docs/roadmap.md`, `docs/evidencias.md`, `apps/web/README.md`, `apps/api/README.md`.

No se implementa nada. Esta auditoría solo documenta estado, gaps, riesgos y recomendación.

## 3. Tabla de paridad funcional

| Feature | Legacy | V2 | Estado | Evidencia / archivos | Bloqueante para retirar legacy |
|---|---|---|---|---|---|
| Login/registro | Auth local con `localStorage`; contraseña en texto plano para MVP. | Auth contra backend con bcrypt y sesión Bearer persistida en DB. | Mejorado en V2 | `js/ui/AuthScreen.js`, `js/services/AuthStorageService.js`; `apps/web/src/features/auth/AuthScreen.tsx`, `apps/api/src/routes/auth.ts` | No |
| Logout | Limpia sesión local sin borrar usuarios. | `POST /auth/logout` elimina sesión activa en DB y limpia token frontend. | Mejorado en V2 | `js/application/AppRuntime.js`; `apps/api/src/routes/auth.ts`, `apps/web/src/app/App.tsx` | No |
| Persistencia de usuario | Usuarios en storage local. | Usuarios en PostgreSQL con Prisma. | Mejorado en V2 | `js/services/AuthStorageService.js`; `apps/api/prisma/schema.prisma` | No |
| Persistencia CV | CV local en storage seguro/fallback. | CV por usuario en PostgreSQL, aislado por `ownerId`. | Mejorado en V2 | `js/models/PortfolioCV.js`; `apps/api/src/routes/cvs.ts`, `apps/api/prisma/schema.prisma` | No |
| Editor de perfil | Form HTML vanilla con campos principales, avatar y feedback. | `ProfileForm` React con secciones plegables; preview sincronizada al guardar. | Cubierto | `index.html`; `apps/web/src/features/cv/ProfileForm.tsx` | No |
| Skills | Campo y render en preview/print/public. | Campo skills, chips en editor/preview/public/print. | Cubierto | `js/ui/PreviewTemplate.js`, `js/ui/PrintCVTemplate.js`; `apps/web/src/features/cv/ProfileForm.tsx`, `CVPreview.tsx` | No |
| Proyectos | Modelo `Project`, render en preview, print y public; selección GitHub. | Modelo TS equivalente, importación GitHub, preview y público. | Cubierto | `js/models/Project.js`, `js/utils/projects.js`; `apps/web/src/lib/domain/types.ts`, `apps/web/src/lib/utils/projects.ts` | No |
| Preview CV | Preview vanilla en tiempo real del estado actual. | Preview React integrada; se actualiza al guardar. | Parcial | `js/ui/PreviewRenderer.js`; `apps/web/src/features/cv/CVPreview.tsx` | No, salvo que se exija live typing exacto |
| GitHub profile sync | Consulta perfil público y fusiona datos sin OAuth. | Consulta perfil público y muestra card/estado; guarda username al importar. | Cubierto | `js/services/GitHubProfileService.js`, `js/ui/GitHubIntegration.js`; `apps/web/src/lib/github/githubClient.ts`, `apps/web/src/features/github/**` | No |
| GitHub repos sync | Trae repos públicos, permite selección manual. | Trae repos públicos, selección/deselección e importación. | Cubierto | `js/ui/GitHubIntegration.js`; `apps/web/src/features/github/GitHubSyncPanel.tsx` | No |
| Selección/importación de proyectos | Convierte selección GitHub a proyectos y reemplaza proyectos GitHub previos. | Convierte repos seleccionados a `Project`, evita duplicados por `sourceRepositoryFullName`, conserva proyectos existentes. | Mejorado en V2 | `js/application/AuthenticatedCVApp.js`; `apps/web/src/lib/github/githubToProject.ts`, `AuthenticatedShell.tsx` | No |
| Jobs search / Jooble | UI legacy con proxy/fallback mock; contrato antiguo usa `keyword`. | UI V2 consume backend `/jobs/search?keywords&location` con Jooble/mock fallback. | Cubierto | `js/services/JobOffersService.js`, `js/ui/JobSearchIntegration.js`; `apps/api/src/routes/jobs.ts`, `apps/web/src/features/jobs/**` | No |
| Exportación PDF | `window.print()` con vista print específica. | `window.print()` con panel Export PDF, `PrintableCV` y CSS print. | Cubierto | `js/ui/PrintCVRenderer.js`, `styles/main.css`; `apps/web/src/features/export/**`, `apps/web/src/styles/index.css` | No |
| QR | Legacy usa servicio externo `api.qrserver.com` hacia `public.html`. | V2 genera QR local con `qrcode`; apunta a `/p/:slug` real si está publicado. | Mejorado en V2 | `js/ui/PrintCVRenderer.js`; `apps/web/src/lib/qr/**`, `ExportPdfPanel.tsx` | No |
| Public profile | `public.html` estático cargando `data/public-cv.json`. | `/p/:slug` real, gestionable por usuario, solo visible si `isPublic = true`. | Mejorado en V2 | `public.html`, `js/application/PublicPageRuntime.js`; `apps/web/src/features/public-profile/**`, `apps/api/src/routes/publicProfiles.ts` | No |
| Ruta pública | `public.html` estático. | SPA detecta `/p/:slug` sin router y consulta backend. | Mejorado en V2 | `public.html`; `apps/web/src/app/App.tsx` | No |
| Landing page | `index.html` legacy funciona como entrada principal auth/app y demo visual. | Landing V2 en `/` para usuarios no autenticados, con CTAs hacia AuthScreen y preservando `/p/:slug`. | Cubierto | `index.html`; `apps/web/src/features/landing/LandingPage.tsx`, `apps/web/src/app/App.tsx` | No tras merge de `feat/v2-landing-page` |
| Diseño visual | CSS manual legacy, dark mode y layouts propios. | Tailwind/Stitch en Auth, Dashboard, Editor, GitHub, Jobs, Export y PublicProfile. | Mejorado en V2 | `styles/main.css`; `apps/web/tailwind.config.ts`, features V2 | No |
| Responsive | Legacy tiene CSS responsive manual. | V2 usa Tailwind responsive en pantallas portadas. | Cubierto | `styles/main.css`; `apps/web/src/features/**` | No |
| Docker/local deploy | Legacy depende de archivos estáticos y server/proxy separado. | Docker Compose levanta web + api + postgres. | Mejorado en V2 | `server/server.js`; `docker-compose.yml`, `apps/*/Dockerfile` | No |
| Backend real | Legacy tiene proxy Jooble parcial y storage local frontend. | Backend Express con auth, users, CV, jobs, public profiles, health. | Mejorado en V2 | `server/**`; `apps/api/src/routes/**` | No |
| Base de datos real | No hay DB real para CV/auth. | PostgreSQL + Prisma. | Mejorado en V2 | `js/services/*Storage*`; `apps/api/prisma/schema.prisma` | No |
| Seguridad básica | Auth local insegura por diseño MVP; Jooble proxy protege API key legacy. | bcrypt, sesiones DB, helmet, CORS allowlist, rate limit auth. | Mejorado en V2 | `js/services/AuthStorageService.js`; `apps/api/src/app.ts`, `apps/api/src/lib/password.ts` | No |
| Documentación | Docs evolutivas del MVP legacy y V2. | Roadmap/evidencias/READMEs actualizados por sprint. | Mejorado en V2 | `docs/roadmap.md`, `docs/evidencias.md`, `apps/*/README.md` | No |
| Tests/build/lint | Validación principalmente manual en legacy. | Typecheck/lint/build para API y Web; Docker smoke por sprint. | Mejorado en V2 | `package.json` legacy parcial; `apps/api/package.json`, `apps/web/package.json` | No |

## 4. Features donde V2 supera al legacy

- Backend real Express separado del frontend.
- PostgreSQL + Prisma con modelos `User`, `CV`, `PublicProfile` y `Session`.
- Multiusuario real con aislamiento por `ownerId`.
- Autenticación local con bcrypt y sesiones persistidas en DB.
- Docker Compose local para levantar web, API y DB.
- Tailwind/Stitch aplicado a la experiencia autenticada V2.
- Dashboard autenticado con métricas del CV.
- GitHub Sync con transformación tipada repo -> `Project` y prevención de duplicados.
- Jobs Search conectada al backend V2 `/jobs/search`.
- Export PDF sin servicios externos de QR.
- QR conectado a perfil publicado real cuando existe.
- Perfil público real `/p/:slug`, publicable/despublicable y protegido por `isPublic`.
- Separación más clara frontend/backend/domain/client.
- Documentación de sprint más madura y trazable.

## 5. Features todavía no equivalentes o dudosas

- **Landing page V2:** cerrada en `feat/v2-landing-page` como entrada pública `/`, pendiente de merge y auditoría final de demo.
- **Preview live typing:** el legacy actualiza preview mientras cambia el estado del formulario; V2 sincroniza preview al guardar. No parece bloqueante, pero no es equivalencia exacta.
- **Avatar/local upload:** legacy conserva flujo de avatar híbrido y subida local en el formulario. En V2 el modelo soporta `avatarUrl` y `avatarBase64`, pero el editor actual no ofrece un control completo de subida.
- **Dark mode legacy:** `index.html` legacy incluye toggle de modo oscuro. V2 tiene tokens y `darkMode: class`, pero no se ha implementado toggle global equivalente.
- **PDF visual:** ambos usan impresión nativa, pero las plantillas no son idénticas. V2 es suficiente funcionalmente, aunque no replica la composición legacy exacta.
- **`public.html`:** legacy mantiene una vista pública estática basada en `data/public-cv.json`; V2 la supera con `/p/:slug`, pero los enlaces existentes a `public.html` podrían seguir circulando.
- **OAuth real:** legacy no tenía OAuth real, solo placeholders; V2 tampoco lo implementa. No es gap de paridad, sí backlog de producto si se decide crecer.
- **SEO/OpenGraph avanzado:** fuera de alcance en ambos para este corte.

## 6. Riesgos antes de retirar legacy

- Borrar funcionalidades no detectadas por estar acopladas a DOM/CSS legacy.
- Romper enlaces existentes a `public.html`, especialmente si se compartió en una demo previa o memoria.
- Que usuario, docente o evaluador siga usando la demo legacy como referencia visual.
- Perder referencia histórica útil para explicar la migración del MVP vanilla JS a V2.
- Introducir ruido CRLF/LF en `styles/**` o `js/**` al mover/archivar legacy desde Windows.
- Confundir retirada técnica con cierre de producto: tras landing, todavía falta una auditoría final de demo y una decisión explícita de archivo o retirada.

## 7. Recomendación

Recomendación actualizada: **D. Mantener legacy hasta una demo final comparativa**.

Justificación: V2 cubre y mejora casi todo el flujo autenticado y público, y `feat/v2-landing-page` cubre el reemplazo de entrada pública. Aun así, el legacy debe mantenerse read-only hasta verificar una demo final comparativa y decidir explícitamente si se archiva o se retira.

No recomiendo retirar legacy ya. Tampoco recomiendo archivarlo dentro del sprint de landing, porque la decisión debe llegar tras validar la demo V2 completa.

## 8. Próximos sprints recomendados

1. `chore/v2-final-demo-audit`
2. `chore/archive-legacy-readonly`
3. `chore/remove-legacy-after-v2-parity` solo si procede y con decisión explícita

## 9. Criterios para retirar legacy

- [x] V2 tiene landing funcional en `feat/v2-landing-page` pendiente de merge.
- [x] V2 tiene auth.
- [x] V2 tiene editor.
- [x] V2 tiene GitHub Sync.
- [x] V2 tiene Jobs Search.
- [x] V2 tiene PDF/QR.
- [x] V2 tiene perfil público.
- [x] V2 pasa typecheck/lint/build en API y Web según últimos sprints.
- [x] Docker Compose funciona según últimos sprints.
- [x] README raíz apunta claramente a V2 como entrada principal en `feat/v2-landing-page`.
- [ ] Demo pública documentada y validada en auditoría final.
- [ ] Decisión explícita tomada: archivar o retirar legacy.
- [ ] Plan de compatibilidad para enlaces a `public.html`.
- [ ] Auditoría final confirma que no hay uso activo de `js/**`, `styles/**` o `server/**` por la demo V2.

## 10. Decisión propuesta

- **Estado actual:** V2 casi lista para sustituir legacy; landing V2 queda cubierta en `feat/v2-landing-page` pendiente de merge.
- **Decisión recomendada:** mantener legacy vivo y read-only hasta una auditoría final de demo.
- **Siguiente rama:** `chore/v2-final-demo-audit`.
- **Qué NO hacer todavía:** no borrar `index.html`, `public.html`, `js/**`, `styles/**` ni `server/**`; no mover legacy; no crear `/docs/specs`; no declarar paridad final hasta la auditoría de demo.
