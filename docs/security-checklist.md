# Checklist de seguridad pre-deploy · EXPERTECH CV V2

> Revisar antes de hacer público cualquier despliegue de la V2.
> Estado documentado a fecha 2026-05-21.

---

## Secretos y credenciales

- [x] No hay secretos en archivos trackeados (auditado en PRs #26, #28, #34)
- [x] `.env` excluido en `.gitignore` y en `.dockerignore` de cada servicio
- [x] `apps/api/.env.example` y `apps/web/.env.example` solo contienen placeholders
- [x] La clave de Jooble no está en el código fuente
- [ ] **PENDIENTE**: Rotar la clave de Jooble antes de producción
      (la clave de desarrollo estuvo expuesta en el commit histórico `727f9e0`)

## CORS

- [x] CORS con allowlist explícita (`ALLOWED_ORIGINS` configurable via env)
- [x] No hay `app.use(cors())` abierto sin restricciones
- [ ] En producción: `ALLOWED_ORIGINS` debe contener **solo** la URL del frontend
      (no `http://localhost:*`)

## Hashing de contraseñas

- [x] bcryptjs activo desde Fase 6 (PR #42)
- [x] No hay contraseñas en texto plano en la base de datos
- [x] `BCRYPT_ROUNDS` configurable via env (añadido en Fase 8)
- [ ] En producción: usar `BCRYPT_ROUNDS=12` (mayor coste computacional)
- [ ] **PENDIENTE**: migrar los hash de usuarios de dev (10 rounds) a 12 rounds
      si los datos de desarrollo llegan a producción — o simplemente re-registrar

## Autenticación y sesiones

- [x] Tokens Bearer opacos (no JWT; sin secreto de firma que gestionar)
- [x] Sesiones persistidas en DB (modelo `Session`)
- [ ] **PENDIENTE**: sesiones sin TTL — añadir expiración automática (cron job
      o campo `expiresAt` en el modelo `Session`)
- [ ] **PENDIENTE**: migrar token de `localStorage` a cookie `httpOnly` + `Secure`
      para protección contra XSS
- [ ] **PENDIENTE**: añadir CSRF protection si se migra a cookies

## Rate limiting

- [x] Rate limit en `POST /auth/register` y `POST /auth/login`
      (20 req/IP/15min, añadido en Fase 8)
- [ ] **PENDIENTE**: rate limit en `GET /jobs/search` (puede agotar cuota de Jooble)
- [ ] **PENDIENTE**: rate limit global o por endpoint más granular

## Headers HTTP

- [x] `helmet()` activo desde Fase 8 (Content-Security-Policy, X-Frame-Options,
      X-Content-Type-Options, Strict-Transport-Security, etc.)

## Logs

- [x] No se loguean contraseñas, tokens ni datos sensibles en `console.log/error`
- [x] Prisma configurado para loguear solo `warn` y `error` (no queries SQL)
- [ ] **PENDIENTE**: logger estructurado (JSON, niveles) para producción
- [ ] **PENDIENTE**: asegurar que los errores de Prisma no filtran stack traces al cliente

## HTTPS

- [ ] **PENDIENTE**: en producción, todo el tráfico debe ir por HTTPS
      - Railway y Vercel lo proveen automáticamente
      - En VPS propio: Let's Encrypt + nginx o Caddy como reverse proxy

## Base de datos

- [x] Aislamiento por usuario en todas las queries (`ownerId` en CV, PublicProfile)
- [x] Contraseña de la DB no hardcodeada — viene de `DATABASE_URL` env var
- [ ] **PENDIENTE**: en producción, la DB NO debe estar expuesta al exterior
      (usar URL interna de Railway, no la URL pública con puerto)
- [ ] **PENDIENTE**: backups automáticos (Railway paid plan o pg_dump manual)

## Build reproducibilidad

- [x] `package-lock.json` commitado para `apps/api` y `apps/web`
- [x] `npm ci` (no `npm install`) en los Dockerfiles — respeta el lockfile
- [x] Versión de Node fijada en `node:22-alpine` en los Dockerfiles

## Variables de entorno

- [x] `NODE_ENV=production` documentado en `.env.example` (sección producción)
- [x] Sección dev/prod separada en `apps/api/.env.example`
- [ ] En producción: verificar que `NODE_ENV=production` está configurado
      (Express activa optimizaciones, Prisma reduce logging)

---

## Resumen de estado

| Área | Estado |
|---|---|
| Secretos en repo | ✅ limpio |
| CORS | ✅ allowlist activa |
| Hashing contraseñas | ✅ bcrypt activo |
| Rate limit (auth) | ✅ activo |
| Headers HTTP | ✅ helmet activo |
| Sesiones con TTL | ⚠️ pendiente |
| Token en httpOnly cookie | ⚠️ pendiente |
| HTTPS | ⚠️ depende de plataforma |
| Rate limit (jobs) | ⚠️ pendiente |
| Logs estructurados | ⚠️ pendiente |
| Backups DB | ⚠️ pendiente |
