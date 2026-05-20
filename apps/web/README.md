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

**Siguiente fase:** `feat/v2-backend-api-foundation` — backend TypeScript con endpoints mínimos.

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
│   ├── auth/             # AuthScreen (login/registro)
│   └── cv/               # AuthenticatedShell, ProfileForm, CVPreview
├── lib/
│   ├── auth/             # AuthStorageService, tipos de sesión
│   ├── domain/           # tipos PortfolioCV, Project, CandidateProfile + factories
│   ├── storage/          # SafeStorageService, CVStorageService
│   └── utils/            # isRenderableProject, getVisibleProjects
└── styles/               # index.css (reset + layout + componentes)
```

## Limitaciones temporales (antes del backend)

- **Auth local de demo**: contraseñas guardadas en texto plano en `localStorage`.
  No usar con datos reales. No apta para producción.
- **CV no aislado por usuario**: la clave de storage es fija (`expertech-cv:v2`).
  Pasa a ser session-scoped cuando se porte auth al backend (Fase 5).
- **Preview sincronizada al guardar**: la preview del CV se actualiza al pulsar
  "Guardar perfil", no mientras se escribe campo a campo.
- **Jooble y proxy local son legacy temporal**: el buscador de empleo sigue
  operando desde el servidor Express del legacy. Se sustituirá o rotará
  cuando exista un backend serio (Fase 5).
- **Sin GitHub OAuth real**: los botones de acceso social muestran un mensaje
  informativo. OAuth real llega con el backend.
- **Sin exportación PDF**: disponible en el legacy; no portada todavía a V2.
- **Sin integración GitHub en editor**: disponible en el legacy; pendiente de Fase 4+.

## Relación con el legacy

El legacy vanilla JS sigue operativo en la raíz del repositorio (`index.html`,
`js/`, `styles/`, `server/`). Esta carpeta `apps/web/` es el nuevo frontend V2
que lo irá sustituyendo por fases. El legacy se retirará cuando V2 alcance
equivalencia funcional verificada.
