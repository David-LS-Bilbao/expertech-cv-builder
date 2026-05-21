# EXPERTECH CV — Frontend V2 (`apps/web`)

Frontend React + TypeScript de la V2 del proyecto EXPERTECH CV Builder.
Convive con el legacy vanilla JS en la raíz del repositorio sin reemplazarlo todavía.

## Stack

- **Vite 8** — bundler y dev server
- **React 19** — framework de UI
- **TypeScript 6** — tipado estático
- **ESLint 10** — linting (flat config)

## Estado actual

| Fase | Descripción | PR |
|------|-------------|-----|
| Fase 2 | Scaffold Vite + React + TypeScript | #37 |
| Fase 3 | Modelos de dominio y storage TypeScript | #38 |
| Fase 4 | Auth local, editor de perfil y preview del CV | #39 |
| Fase 5 | Backend API en `apps/api/` + cliente HTTP | #41 |
| Fase 6 | Persistencia real (PostgreSQL + Prisma) y rewire frontend al backend | #42 |

**Siguiente fase:** `feat/v2-docker-compose-local` — Dockerizar frontend y backend para `docker compose up` completo.

## Comandos (ejecutar desde `apps/web/`)

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (HMR)
npm run build     # build de producción
npm run preview   # previsualizar el build
npm run typecheck # comprobación de tipos sin compilar
npm run lint      # linting con ESLint
```

## Estructura de `src/`

```
src/
├── app/                  # componente raíz (App.tsx)
├── features/
│   ├── auth/             # AuthScreen (login/registro contra backend)
│   └── cv/               # AuthenticatedShell, ProfileForm, CVPreview
├── lib/
│   ├── api/              # cliente HTTP (fetch wrapper + token) — VITE_API_URL
│   ├── domain/           # tipos PortfolioCV, Project, CandidateProfile + factories
│   └── utils/            # isRenderableProject, getVisibleProjects
└── styles/               # index.css (reset + layout + componentes)
```

## Variables de entorno

`apps/web/.env.example` define `VITE_API_URL` (default: `http://localhost:3002`).
Copiar a `.env.local` si necesitas apuntar a otro backend.

## Limitaciones temporales

- **Sesiones gestionadas con Bearer token**: el token vive en `localStorage`
  (`expertech-auth-token`). Migración a cookies httpOnly llega en Fase 8.
- **Preview sincronizada al guardar**: la preview del CV se actualiza al pulsar
  "Guardar perfil", no mientras se escribe campo a campo.
- **Jooble y proxy legacy** en `server/server.js` (puerto 3001) siguen
  operativos para el legacy. El frontend V2 consume `/jobs/search` del nuevo
  backend (`apps/api/`, puerto 3002).
- **Sin GitHub OAuth real**: los botones de acceso social muestran un mensaje
  informativo. OAuth real llega en una fase posterior.
- **Sin exportación PDF**: disponible en el legacy; no portada todavía a V2.
- **Sin integración GitHub en editor**: disponible en el legacy; pendiente.

## Relación con el legacy

El legacy vanilla JS sigue operativo en la raíz del repositorio (`index.html`,
`js/`, `styles/`, `server/`). Esta carpeta `apps/web/` es el nuevo frontend V2
que lo irá sustituyendo por fases. El legacy se retirará cuando V2 alcance
equivalencia funcional verificada.
