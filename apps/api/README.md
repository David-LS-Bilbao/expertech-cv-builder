# EXPERTECH CV — Backend API (`apps/api`)

Backend Express + TypeScript de la V2 del proyecto.
Convive con el legacy proxy de Jooble (`server/server.js`, puerto 3001)
en una carpeta separada y un puerto distinto.

## Stack

- **Express 4** — framework HTTP
- **TypeScript 6** — tipado estático
- **tsx** — runtime de desarrollo (watch mode)
- **dotenv** — variables de entorno
- **cors** — política CORS con allowlist explícita

## Endpoints

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/health` | — | Liveness/readiness check |
| `POST` | `/auth/register` | — | Crear cuenta local (texto plano MVP) |
| `POST` | `/auth/login` | — | Iniciar sesión local |
| `POST` | `/auth/logout` | Bearer | Cerrar sesión activa |
| `GET` | `/users/me` | Bearer | Datos del usuario autenticado |
| `PUT` | `/users/me` | Bearer | Actualizar `displayName` |
| `GET` | `/cvs/me` | Bearer | CV del usuario autenticado |
| `PUT` | `/cvs/me` | Bearer | Persistir CV del usuario |
| `GET` | `/public-profiles/:slug` | — | Stub (404 hasta Fase 6) |
| `GET` | `/jobs/search?keywords&location` | — | Proxy Jooble con contrato `{ results, fallbackWarning, source }` |

## Comandos (desde `apps/api/`)

```bash
npm install
npm run dev        # tsx watch (recarga al cambiar src)
npm run build      # tsc → dist/
npm run start      # node dist/server.js
npm run typecheck
npm run lint
```

## Variables de entorno (ver `.env.example`)

```
PORT=3002
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
JOOBLE_API_KEY=YOUR_REAL_KEY_HERE
```

## Limitaciones temporales (Fase 5)

- **Storage en memoria**: los `Map`s se vacían en cada reinicio del servidor.
  Persistencia real con PostgreSQL + Prisma llega en Fase 6.
- **Passwords en texto plano**: igual que el legacy y el frontend V2.
  Hashing con `bcrypt` previsto para Fase 6/8.
- **Sin rate limit**: el legacy ya lo tiene; aquí se añade cuando llegue tráfico
  real en Fase 8 (deployment readiness).
- **Sin logs estructurados**: `console.log/error` por ahora.
- **Tipos duplicados** con el frontend (`apps/web/src/lib/domain/types.ts`).
  Se moverá a un paquete compartido cuando aporte valor real.
- **Coexiste con el proxy legacy** en `server/server.js` (puerto 3001).
  El frontend legacy sigue usándolo; el V2 usa este backend (puerto 3002).

## Próximos pasos (Fase 6 y siguientes)

- Persistencia real con PostgreSQL + Prisma
- Hashing de contraseñas (bcrypt)
- Aislamiento por usuario garantizado en todas las queries
- Migraciones versionadas
- Rate limit en endpoints sensibles
- Logs estructurados
