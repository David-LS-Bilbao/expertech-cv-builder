# EXPERTECH CV — Backend API (`apps/api`)

Backend Express + TypeScript de la V2 del proyecto, con persistencia
real en PostgreSQL via Prisma. Convive con el legacy proxy de Jooble
(`server/server.js`, puerto 3001) en una carpeta separada y un puerto
distinto.

## Stack

- **Express 4** — framework HTTP
- **TypeScript 6** — tipado estático
- **PostgreSQL 16** — base de datos
- **Prisma 6** — ORM y migraciones declarativas
- **bcryptjs** — hashing de contraseñas
- **tsx** — runtime de desarrollo (watch mode)
- **dotenv** — variables de entorno
- **cors** — política CORS con allowlist explícita

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | — | Liveness + ping a la DB |
| `POST` | `/auth/register` | — | Crear cuenta (bcrypt hash) |
| `POST` | `/auth/login` | — | Iniciar sesión (verifica hash) |
| `POST` | `/auth/logout` | Bearer | Cerrar sesión activa |
| `GET` | `/users/me` | Bearer | Datos del usuario autenticado |
| `PUT` | `/users/me` | Bearer | Actualizar `displayName` |
| `GET` | `/cvs/me` | Bearer | CV del usuario (aislado por `ownerId`) |
| `PUT` | `/cvs/me` | Bearer | Persistir CV del usuario (upsert por `ownerId`) |
| `GET` | `/public-profiles/me` | Bearer | Configuración pública del usuario autenticado |
| `PUT` | `/public-profiles/me` | Bearer | Crear/actualizar slug y publicar/despublicar |
| `GET` | `/public-profiles/:slug` | — | Vista pública si `isPublic = true` |
| `GET` | `/jobs/search?keywords&location` | — | Proxy Jooble con contrato `{ results, fallbackWarning, source }` |

## Setup local

Requisitos: Node 22+, Docker.

```bash
# desde apps/api/
cp .env.example .env       # ajustar JOOBLE_API_KEY si quieres datos reales
npm install
npm run db:up              # levanta PostgreSQL en Docker (puerto 5435 en host)
npm run db:migrate         # aplica migraciones (Prisma)
npm run dev                # backend en http://localhost:3002
```

## Comandos (desde `apps/api/`)

| Script | Descripción |
|---|---|
| `npm run dev` | `tsx watch src/server.ts` (recarga al cambiar `src/`) |
| `npm run build` | `prisma generate && tsc` → `dist/` |
| `npm run start` | `node dist/server.js` (producción) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | `eslint .` |
| `npm run db:up` | Levanta el contenedor PostgreSQL |
| `npm run db:down` | Detiene y elimina el contenedor (conserva el volumen) |
| `npm run db:migrate` | `prisma migrate dev` (genera y aplica migración) |
| `npm run db:deploy` | `prisma migrate deploy` (aplica en producción) |
| `npm run db:generate` | `prisma generate` (regenera el cliente) |
| `npm run db:studio` | Abre Prisma Studio en el navegador |

## Variables de entorno (`.env.example`)

```
PORT=3002
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
JOOBLE_API_KEY=YOUR_REAL_KEY_HERE
DATABASE_URL=postgresql://expertech:devpassword@localhost:5435/expertech_cv_dev?schema=public
```

> **Nota sobre el puerto 5435:** se usa en el host para no chocar con
> otras instancias PostgreSQL (Homebrew en 5432, otros proyectos en
> 5433/5434). Dentro del contenedor, PostgreSQL sigue en su 5432
> estándar.

## Schema de DB (Prisma)

```
User   ─┬─ id, email (unique), hashedPassword, displayName, provider, createdAt, updatedAt
        ├─→ CV (1:0..1)   profile, projects, meta como JSON, updatedAt
        ├─→ PublicProfile (1:0..1)   slug (unique), isPublic
        └─→ Session[] (1:N)   token (PK), userId, loggedAt

Aislamiento: todas las queries CV/PublicProfile filtran por
ownerId/userId. Sin posibilidad de leer datos cruzados entre usuarios.
```

## Smoke test verificado (Fase 6)

- Register Alice + Bob: ✅ ambos creados con hashedPassword distinto
- Save CV de Alice y de Bob (datos diferentes)
- GET /cvs/me con token de Alice → devuelve CV de Alice
- GET /cvs/me con token de Bob → devuelve CV de Bob
- Login de Bob con bcrypt verifica contraseña correctamente

## Limitaciones actuales (Fase 6)

- **Sesiones en DB** (modelo `Session`): cleanup manual; auto-expiry
  llega en Fase 8 (deployment readiness checklist).
- **Sin rate limit** en endpoints sensibles: Fase 8.
- **Sin logs estructurados**: Fase 8.
- **Tipos duplicados** con el frontend (`apps/web/src/lib/domain/types.ts`).
  Se moverá a un paquete compartido si el coste de duplicación crece.
- **Coexiste con el proxy legacy** en `server/server.js` (puerto 3001).
  El frontend legacy sigue usándolo; el V2 usa este backend (puerto 3002).
- **PublicProfile activo**: usa el modelo Prisma existente con `slug` único,
  `ownerId` aislado por usuario e `isPublic`. La ruta pública solo devuelve CV
  cuando `isPublic = true`; si el CV contiene email/teléfono, se publican como
  parte explícita del contenido del CV.

## Próximos pasos (Fase 7+)

- Fase 7: Dockerizar también frontend y backend para `docker compose up`
  completo. La DB ya está dockerizada — solo falta envolver Node+Vite.
- Fase 8: build reproducible, rate limit, hashing config seguro,
  cookies con flags, checklist de seguridad pre-deploy.
