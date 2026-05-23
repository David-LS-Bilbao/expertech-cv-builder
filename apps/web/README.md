# EXPERTECH CV — Frontend V2 (`apps/web`)

Frontend React + TypeScript de la V2 del proyecto EXPERTECH CV Builder.
Convive con el legacy vanilla JS en la raíz del repositorio sin reemplazarlo todavía.

## Stack

- **Vite 8** — bundler y dev server
- **React 19** — framework de UI
- **TypeScript 6** — tipado estático
- **Tailwind CSS 3** — capa visual V2 con tokens Stitch
- **lucide-react** — iconografía lineal
- **qrcode** — generación local de QR para exportación imprimible
- **ESLint 10** — linting (flat config)

## Estado actual

| Fase | Descripción | PR |
|------|-------------|-----|
| Fase 2 | Scaffold Vite + React + TypeScript | #37 |
| Fase 3 | Modelos de dominio y storage TypeScript | #38 |
| Fase 4 | Auth local, editor de perfil y preview del CV | #39 |
| Fase 5 | Backend API en `apps/api/` + cliente HTTP | #41 |
| Fase 6 | Persistencia real (PostgreSQL + Prisma) y rewire frontend al backend | #42 |
| Sprint UI 1 | Tailwind v3 + design system Stitch + AuthScreen rediseñado | #46 |
| Sprint UI 2 | Dashboard + Editor CV + Preview portados a Tailwind/Stitch | #47 |
| Sprint UI 3 | Integración GitHub pública sin OAuth para importar repos como proyectos | #48 |
| Sprint UI 4a | Jobs Search V2 contra endpoint `/jobs/search` existente | #49 |
| Sprint UI 4b | Exportación PDF por impresión nativa con QR local | #50 |
| Sprint UI 5 | Perfil público V2 con slug gestionable y ruta `/p/:slug` | #51 |
| Sprint UI 6 | Landing Page V2 como entrada pública `/` | #53 |

**Sprint actual:** `chore/v2-final-demo-audit` — auditoría final de demo V2.

**Siguiente sprint recomendado:** `chore/archive-legacy-readonly` — marcar legacy como referencia read-only sin borrarlo.

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
│   └── cv/               # Dashboard, AuthenticatedShell, ProfileForm, CVPreview
│   └── export/           # Export PDF: panel, preview imprimible y QR
│   └── github/           # GitHub Sync público: búsqueda, perfil, repos y selección
│   └── jobs/             # Jobs Search: formulario, estados y tarjetas de ofertas
│   └── landing/          # Landing pública V2 en /
│   └── public-profile/   # ruta pública /p/:slug y panel de publicación
├── lib/
│   ├── api/              # cliente HTTP (fetch wrapper + token) — VITE_API_URL
│   ├── domain/           # tipos PortfolioCV, Project, CandidateProfile + factories
│   ├── github/           # cliente público GitHub + transformación repo → Project
│   ├── qr/               # helpers puros para QR y URL pública planificada
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
- **Jobs Search V2** consume el endpoint backend existente `/jobs/search`.
  Si `JOOBLE_API_KEY` no está configurada, el backend devuelve resultados
  mock/fallback con `fallbackWarning`; la UI lo muestra como aviso.
- **GitHub Sync público sin OAuth**: la V2 consulta `api.github.com` desde el frontend
  sin token ni backend proxy. Permite seleccionar repos públicos e importarlos como
  proyectos del CV; no implementa login con GitHub.
- **Exportación PDF V2**: usa `window.print()` y CSS `@media print`; el navegador permite guardar como PDF. No hay generación PDF binaria ni `jsPDF`.
- **Perfil público V2**: `/p/:slug` renderiza un CV read-only si el usuario lo ha publicado. El slug se gestiona desde la zona autenticada.
- **Landing V2**: `/` muestra la entrada pública del producto para usuarios no autenticados y sus CTAs abren AuthScreen sin usar router.
- **QR local**: se genera en frontend con `qrcode`, sin servicios externos. Apunta al perfil público real cuando está publicado y a una ruta planificada si está privado.
- **Fuera de alcance Landing**: analytics, SEO avanzado, OpenGraph avanzado, CMS, dominio personalizado y retirada de legacy.

## Relación con el legacy

El legacy vanilla JS sigue operativo en la raíz del repositorio (`index.html`,
`js/`, `styles/`, `server/`). Esta carpeta `apps/web/` es el nuevo frontend V2
que lo irá sustituyendo por fases. El legacy se retirará cuando V2 alcance
equivalencia funcional verificada.
