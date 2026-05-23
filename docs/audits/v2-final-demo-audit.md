# Auditoría final de demo V2

Fecha: 2026-05-23
Rama: `chore/v2-final-demo-audit`

## 1. Resumen ejecutivo

Estado global: **Lista con observaciones menores**.

La V2 está preparada para actuar como demo principal del producto: la landing pública en `/`, el flujo de autenticación, el dashboard/editor, GitHub Sync, Jobs Search, Export PDF/QR, PublicProfile `/p/:slug`, API y Docker local están presentes y las validaciones técnicas pasan.

La recomendación es tratar V2 como demo principal y mover el legacy a modo read-only en el siguiente sprint. No se recomienda borrar legacy todavía.

## 2. Alcance

Se valida:

- landing pública `/`
- auth login/register/logout
- dashboard autenticado
- editor CV y guardado de CV
- GitHub Sync público sin OAuth
- Jobs Search con Jooble o mock/fallback
- Export PDF por impresión nativa y QR local
- PublicProfile `/p/:slug`
- Docker local
- API health
- documentación viva
- que legacy sigue vivo y no se retira todavía

No se implementa código, no se corrigen bugs y no se toca legacy.

## 3. Validaciones técnicas ejecutadas

| Comando | Resultado | Evidencia relevante |
|---|---|---|
| `apps/api`: `npm run typecheck` | OK | `tsc --noEmit` sin errores |
| `apps/api`: `npm run lint` | OK | `eslint .` sin errores |
| `apps/api`: `npm run build` | OK | `prisma generate && tsc` completado |
| `apps/web`: `npm run typecheck` | OK | `tsc --noEmit` sin errores |
| `apps/web`: `npm run lint` | OK | `eslint .` sin errores |
| `apps/web`: `npm run build` | OK | Vite build completado; bundle generado |
| raíz: `docker compose build` | OK | imágenes `expertech-cv-builder-api` y `expertech-cv-builder-web` construidas |
| raíz: `docker compose up -d` | OK | postgres, api y web levantados |
| raíz: `docker compose ps` | OK | `web`, `api` y `postgres` en estado `healthy` |
| raíz: `curl http://localhost:8090` | OK | `HTTP/1.1 200 OK`, sirve SPA V2 |
| raíz: `curl http://localhost:8090/api/health` | OK | `status: ok`, `storage: postgres` |
| raíz: `curl http://localhost:8090/p/slug-inexistente` | OK | `HTTP/1.1 200 OK`, SPA fallback para ruta pública |
| raíz: `docker compose down` | OK | contenedores y red detenidos |

No hubo fallos técnicos bloqueantes.

## 4. Smoke test funcional

Smoke semi-automatizado por `curl` contra `http://localhost:8090/api` y revisión de wiring frontend.

| Paso | Estado | Evidencia |
|---|---|---|
| `/` muestra Landing V2 | Validado por build + `curl` + revisión de `App.tsx`/`LandingPage.tsx`; pendiente de navegador para inspección visual | `/` devuelve SPA; `App.tsx` muestra `LandingPage` si no hay sesión |
| CTA de Landing abre AuthScreen | Validado por revisión de código; pendiente de navegador | CTAs llaman `setPublicEntryView('auth')` |
| registro de usuario temporal funciona | OK | `POST /api/auth/register` devuelve token |
| login funciona | OK | `POST /api/auth/login` devuelve token |
| Dashboard carga | Validado por build + revisión de `AuthenticatedShell`; pendiente de navegador | tras auth se renderiza `AuthenticatedShell` |
| Editor permite guardar CV básico | OK por API; pendiente de navegador para formulario | `PUT /api/cvs/me` guardó `Audit Demo` |
| GitHub Sync busca `octocat` | OK por API pública GitHub; pendiente de navegador para selección UI | `GET https://api.github.com/users/octocat` y repos devuelven `200` |
| Jobs Search responde | OK | `/api/jobs/search?keywords=react&location=Bilbao` devolvió `2` resultados `source=mock` |
| Export PDF abre vista imprimible y genera QR | Validado por build + revisión de código; pendiente de navegador para `window.print()` | `ExportPdfPanel` usa `PrintableCV`, `createQrCodeDataUrl` y `window.print()` |
| Perfil público permite definir slug | OK | `PUT /api/public-profiles/me` con slug temporal |
| publicar perfil | OK | `GET /api/public-profiles/:slug` devolvió `200` tras publicar |
| abrir `/p/:slug` | Parcial | endpoint público OK; ruta SPA `/p/...` servida por Nginx; visual pendiente de navegador |
| despublicar perfil | OK | `PUT /api/public-profiles/me` con `isPublic=false` |
| confirmar que `/p/:slug` deja de mostrar CV público | OK por API | endpoint público devolvió `404` tras despublicar |
| logout vuelve a landing | API OK + revisión de código; pendiente de navegador | `POST /api/auth/logout` devolvió `200`; `handleLogout` vuelve a `landing` |

Datos del smoke API:

- usuario temporal: `audit-1779555433@example.com`
- CV guardado: `Audit Demo`
- Jobs: `jobs_count=2`, `jobs_source=mock`
- perfil público temporal: `audit-demo-1779555433`
- publicación: `public_get=200`
- despublicación: `public_after_unpublish=404`
- logout: `200`

## 5. Tabla final de demo

| Área | Estado | Evidencia | Bloqueante |
|---|---|---|---|
| Landing | OK con observaciones | `/` sirve SPA; `LandingPage.tsx` revisado; visual pendiente navegador | No |
| Auth | OK | register/login/logout por API; `AuthScreen.tsx` revisado | No |
| Dashboard | OK con observaciones | wiring `AuthenticatedShell` revisado; pendiente navegador | No |
| Editor CV | OK con observaciones | `PUT /cvs/me` guarda CV; formulario pendiente navegador | No |
| Preview | OK con observaciones | build OK; preview sincronizada al guardar, no live typing | No |
| GitHub Sync | OK con observaciones | GitHub API `octocat` responde `200`; selección UI pendiente navegador | No |
| Jobs Search | OK | `/jobs/search` responde con mock/fallback controlado | No |
| Export PDF/QR | OK con observaciones | build y wiring OK; diálogo `window.print()` pendiente navegador | No |
| PublicProfile | OK | publicar devuelve `200`; despublicar oculta con `404` | No |
| Docker | OK | build/up/ps/health/down completados | No |
| API | OK | health `status=ok`, `storage=postgres` | No |
| Documentación | OK | roadmap/evidencias/READMEs actualizados en esta rama | No |
| Legacy read-only | OK con observaciones | legacy no se toca ni se retira | No |

## 6. Hallazgos

### Bloqueantes

No se detectan bloqueantes para usar V2 como demo principal.

### Observaciones menores

- No se ejecutó una prueba visual manual en navegador dentro de esta auditoría; las acciones de click/print quedan documentadas como pendientes de navegador.
- La preview V2 se sincroniza al guardar, no con live typing exacto como parte del legacy.
- GitHub Sync depende de la API pública de GitHub y puede fallar por rate limit; la UI tiene estado `rate_limited`.
- Jobs Search puede devolver mock/fallback si Jooble no está configurado; en esta validación respondió `source=mock`.
- Export PDF depende del diálogo nativo del navegador para guardar como PDF.
- Si el usuario publica su CV, los datos de contacto incluidos en el CV se muestran públicamente.
- El legacy sigue presente y debe archivarse read-only, no eliminarse todavía.
- Puede existir ruido EOL local en `styles/reset.css`; no se toca en este sprint.

### Backlog recomendado

- Prueba manual final en navegador antes o durante el sprint de archivado.
- Documentar enlaces históricos a `index.html` y `public.html` antes de marcarlos como legacy/read-only.
- Valorar avatar upload completo en V2 si se exige paridad visual exacta con legacy.
- Mantener OAuth GitHub real, SEO/OpenGraph avanzado, analytics y dominio personalizado fuera del cierre de paridad.

## 7. Decisión recomendada

Recomendación: **A. V2 lista como demo principal; archivar legacy read-only**.

Justificación: las validaciones técnicas pasan, Docker local funciona, los endpoints críticos responden y el flujo funcional principal se puede demostrar desde V2. Las observaciones detectadas no bloquean la demo principal y pueden quedar como checklist del sprint de archivado.

## 8. Siguiente sprint recomendado

Si esta auditoría se mergea sin nuevos hallazgos:

1. `chore/archive-legacy-readonly`

Si durante una revisión manual de navegador aparece un bloqueo real:

1. `fix/v2-final-demo-blockers`

## 9. Criterios para archivar legacy read-only

- [x] V2 landing funciona.
- [x] V2 auth funciona.
- [x] V2 dashboard/editor funciona.
- [x] V2 GitHub funciona o falla de forma controlada por rate limit.
- [x] V2 jobs funciona con Jooble o fallback.
- [x] V2 PDF/QR funciona a nivel de build y wiring; impresión pendiente de navegador real.
- [x] V2 PublicProfile funciona.
- [x] Docker local funciona.
- [x] README indica V2 como candidata a demo principal.
- [x] legacy no se borra, solo se marca como legacy/read-only en el siguiente sprint.
- [ ] enlaces históricos quedan documentados en el sprint de archivado.

## 10. Decisión propuesta

- **Estado final:** V2 lista como demo principal con observaciones menores.
- **Decisión recomendada:** archivar legacy como read-only en el siguiente sprint, sin borrarlo.
- **Siguiente rama:** `chore/archive-legacy-readonly`.
- **Qué NO hacer todavía:** no borrar legacy, no mover archivos legacy, no tocar Docker/Prisma/backend/frontend, no crear `/docs/specs`, no implementar SEO avanzado, analytics, OAuth ni nuevas features.
