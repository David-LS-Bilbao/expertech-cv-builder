# EXPERTECH CV V2 · Release notes demo

Fecha: 2026-05-24

## Estado

- V2 queda como demo principal.
- Legacy queda read-only.
- Esta release no elimina legacy.

## Resumen ejecutivo

EXPERTECH CV completa la migración funcional desde el MVP legacy vanilla JS hacia una V2 fullstack. La demo principal pasa a estar construida con React, TypeScript, Tailwind/Stitch, backend Express, PostgreSQL/Prisma y Docker local.

La experiencia cubre el flujo candidato completo: landing pública, auth, dashboard, edición de CV, preview, importación GitHub, búsqueda de empleo, exportación PDF/QR y perfil público `/p/:slug`.

## Funcionalidades incluidas

### Landing V2

- Entrada pública principal en `/`.
- Presentación de EXPERTECH CV como CV técnico vivo para candidatos tech.
- CTAs hacia login/registro sin router.
- Secciones de producto, flujo de uso, showcase y llamada final.

### Auth

- Login y registro contra backend V2.
- Contraseñas hasheadas con bcrypt.
- Sesiones Bearer persistidas en base de datos.
- Logout funcional desde la shell autenticada.

### Dashboard

- Layout V2 en Tailwind/Stitch.
- Métricas derivadas del CV.
- Acciones hacia editor, GitHub, jobs, exportación y perfil público.
- Estado de backend visible.

### Editor CV

- Edición de perfil, contacto, skills y proyectos.
- Paneles visuales tipo acordeón.
- Guardado contra `PUT /cvs/me`.
- Preview sincronizada al guardar.

### Preview

- Render recruiter-friendly del CV.
- Reglas de visibilidad de proyectos centralizadas.
- Soporte visual para proyectos importados desde GitHub.

### GitHub Sync

- Consulta pública de usuario y repositorios GitHub sin OAuth.
- Selección de repositorios destacados.
- Conversión de repos seleccionados a proyectos del CV.
- Prevención de duplicados por repositorio de origen.
- Manejo de errores y rate limit público.

### Jobs Search

- UI V2 para buscar ofertas por keywords y location.
- Consumo de `/jobs/search`.
- Soporte Jooble o mock/fallback controlado si no hay credencial.

### Export PDF/QR

- Exportación mediante impresión nativa del navegador.
- Vista imprimible del CV.
- QR generado localmente en frontend.
- QR conectado a `/p/:slug` si el perfil está publicado.

### Public Profile

- Panel autenticado para slug público.
- Publicar/despublicar CV.
- Ruta pública `/p/:slug` read-only.
- El perfil público solo responde si `isPublic = true`.

### Docker/API/DB

- Docker Compose raíz con web, API y PostgreSQL.
- Backend Express/TypeScript.
- PostgreSQL + Prisma.
- Health endpoint proxyado desde web en `/api/health`.

### Documentación/auditorías

- Auditoría de paridad V2 vs legacy.
- Auditoría final de demo V2.
- Legacy marcado como read-only.
- Release notes y checklist de demo.

## Arquitectura V2

- `apps/web`: frontend React + TypeScript + Tailwind/Stitch.
- `apps/api`: backend Express + TypeScript.
- PostgreSQL/Prisma: persistencia real de usuarios, CVs, sesiones y perfiles públicos.
- Docker Compose: stack local reproducible.
- Legacy read-only: `index.html`, `public.html`, `js/**`, `styles/**`, `server/**`, `data/**`.

## Validaciones realizadas

Basado en `docs/audits/v2-final-demo-audit.md`:

- `apps/api`: `npm run typecheck`, `npm run lint`, `npm run build`.
- `apps/web`: `npm run typecheck`, `npm run lint`, `npm run build`.
- raíz: `docker compose build`, `docker compose up -d`, `docker compose ps`.
- health: `curl http://localhost:8090/api/health`.
- SPA: `curl http://localhost:8090`.
- ruta pública SPA: `curl http://localhost:8090/p/slug-inexistente`.
- smoke API: register/login/logout, guardar CV, Jobs Search, publicar/despublicar PublicProfile.

Limitación de validación: la auditoría final no sustituyó una revisión visual manual completa en navegador. Esa pasada queda recomendada antes de una presentación formal.

## Limitaciones conocidas

- La preview se sincroniza al guardar, no con live typing exacto.
- GitHub puede rate-limitar al usar API pública sin token.
- Jobs puede usar mock/fallback si Jooble no está configurado.
- Export PDF depende del navegador y de `window.print()`.
- No hay SEO/OpenGraph avanzado.
- No hay OAuth GitHub real.
- Legacy sigue presente en modo read-only.
- Si el usuario publica su CV, los datos incluidos en el CV quedan visibles en `/p/:slug`.

## Decisión sobre legacy

Legacy queda read-only y se conserva en sitio como referencia histórica.

Referencias:

- `docs/legacy/legacy-readonly.md`
- `docs/decisions/ADR-legacy-readonly.md`

No se borra ni se mueve legacy en esta release.

## Próximos pasos recomendados

- Ejecutar revisión visual manual final en navegador.
- Preparar presentación/demo con `docs/releases/v2-demo-checklist.md`.
- Opcional: deploy público o staging.
- Opcional: SEO/OpenGraph básico para landing y perfiles públicos.
- Opcional: avatar upload completo en V2.
- Opcional: tests E2E con Playwright para el flujo demo.
- Opcional: retirar legacy solo con decisión explícita futura.
