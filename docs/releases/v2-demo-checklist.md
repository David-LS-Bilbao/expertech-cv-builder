# EXPERTECH CV V2 · Checklist de demo

Fecha: 2026-05-24

## Antes de la demo

- [ ] `git switch dev`
- [ ] `git pull origin dev`
- [ ] comprobar `.env` si aplica
- [ ] `docker compose build`
- [ ] `docker compose up -d`
- [ ] `docker compose ps`
- [ ] abrir `http://localhost:8090`
- [ ] comprobar `http://localhost:8090/api/health`

## Flujo de demo recomendado

1. Landing `/`
2. Registro/login
3. Dashboard
4. Editor CV
5. GitHub Sync
6. Jobs Search
7. Export PDF/QR
8. Public Profile `/p/:slug`
9. Logout
10. Explicar legacy read-only

## Datos demo sugeridos

- Nombre demo: `Alex Demo`
- Email demo local: `alex.demo@example.com`
- Skills: `React`, `TypeScript`, `Node.js`, `PostgreSQL`, `Docker`
- GitHub username público sugerido: `octocat`
- Keywords Jobs: `react`
- Location Jobs: `Bilbao`
- Slug público demo: `alex-demo-tech`

No incluir contraseñas reales ni datos personales reales en la demo.

## Comandos útiles

```bash
docker compose up -d
docker compose down
curl http://localhost:8090/api/health
```

No hay proceso documentado de limpieza de usuario demo desde la UI/API pública actual. Si hace falta resetear datos locales, usar procedimientos de desarrollo ya conocidos para Docker/DB y documentarlo aparte.

## Qué enseñar técnicamente

- Monorepo con separación V2 y legacy read-only.
- `apps/web` como frontend React/TypeScript.
- `apps/api` como backend Express/TypeScript.
- Prisma schema y PostgreSQL.
- Docker Compose raíz.
- Tailwind/Stitch aplicado a la UI V2.
- Legacy read-only documentado en `docs/legacy/legacy-readonly.md`.

## Riesgos durante la demo

- GitHub puede responder rate limit si se usa API pública sin token.
- Jobs puede devolver mock/fallback si Jooble no está configurado.
- Impresión PDF depende del navegador y del diálogo nativo.
- Los datos del CV publicado quedan visibles si se activa PublicProfile.
- Si se reutiliza un email demo ya registrado, el registro puede devolver conflicto.

## Checklist final

### Antes de empezar

- [ ] Docker Desktop abierto.
- [ ] Rama `dev` actualizada.
- [ ] Stack levantado con `docker compose up -d`.
- [ ] `docker compose ps` muestra web, api y postgres healthy.
- [ ] `curl http://localhost:8090/api/health` responde `status: ok`.
- [ ] Navegador abierto en `http://localhost:8090`.

### Durante la demo

- [ ] Enseñar Landing V2.
- [ ] Crear usuario demo o iniciar sesión.
- [ ] Enseñar Dashboard.
- [ ] Guardar CV básico en Editor.
- [ ] Buscar `octocat` en GitHub Sync.
- [ ] Importar o explicar selección de repositorios.
- [ ] Buscar jobs con `react` + `Bilbao`.
- [ ] Abrir Export PDF y explicar QR.
- [ ] Publicar slug demo.
- [ ] Abrir `/p/:slug`.
- [ ] Despublicar o explicar privacidad.
- [ ] Logout.
- [ ] Explicar legacy read-only y dónde está documentado.

### Después de la demo

- [ ] `docker compose down`
- [ ] Anotar incidencias o preguntas.
- [ ] Registrar cualquier gap nuevo en `docs/evidencias.md` o en una rama específica.
