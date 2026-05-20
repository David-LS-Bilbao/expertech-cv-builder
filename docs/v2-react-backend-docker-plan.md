# Plan V2 · React + TypeScript + Backend + Docker

> Documento de contrato técnico para la evolución del proyecto EXPERTECH CV
> Builder desde el MVP legacy vanilla JS hacia una arquitectura V2 con
> frontend React + TypeScript, backend real con APIs, base de datos,
> Dockerización y despliegue.

---

## 1. Resumen ejecutivo

El MVP actual del repositorio es una aplicación vanilla JS con
auth local, storage en `localStorage` (con fallback) y un proxy
local para búsqueda de empleo. Tras una tanda de hardening cerrada
sobre `dev` (PRs #22 a #30), el MVP queda como **baseline saneado**
pero **no es la misión grande**: solo es Fase 0.

V2 debe llegar **por fases pequeñas y PRs independientes**, nunca como
un big bang:

- migrar el frontend a **React + TypeScript** con Vite;
- construir un **backend real** en TypeScript con APIs;
- añadir **base de datos** y persistencia multiusuario real;
- **Dockerizar** frontend, backend y base de datos para desarrollo y
  despliegue;
- preparar el proyecto para un **despliegue real** verificable.

Cada fase del plan se cierra con una rama, un PR contra `dev`, una
validación mínima y documentación actualizada. El legacy vanilla JS
se mantiene en el repo hasta que V2 alcance equivalencia funcional.

---

## 2. Estado actual

- **Legacy vanilla JS** funcional con app autenticada, editor de CV,
  preview, exportación PDF, integración GitHub, vista pública estática
  y buscador de empleo con proxy.
- **Auth local** con email + contraseña en texto plano. **No apto para
  producción**: queda explícito que solo es un soporte de MVP.
- **Storage local** con `SafeStorageService` y fallback
  `localStorage → sessionStorage → memoria`, además de límites de
  avatar en `ProfileEditor` para evitar `QuotaExceededError`.
- **Proxy de jobs endurecido**: contrato estable
  `{ results, fallbackWarning, source }`, CORS configurable,
  validación, rate limit y sin URL hardcodeada en el frontend.
- **Documentación parcialmente actualizada**: `docs/roadmap.md` y
  `docs/evidencias.md` reflejan el bloque de hardening; este documento
  añade el plan V2 explícito.
- **Pendiente resolver divergencia `main ↔ dev`** antes de arrancar V2
  para tener una baseline estable, atómica y promocionable.

---

## 3. Riesgo Git actual

- `dev` y `main` han divergido durante la fase de hardening: `dev`
  acumula múltiples PRs cerrados (#22–#30) que aún no se han
  promocionado de forma limpia a `main`.
- Empezar V2 sobre una baseline divergida significa arrastrar
  conflictos imprevisibles durante toda la migración.

**Acción propuesta antes de V2:**

- crear rama `chore/reconcile-main-before-v2` partiendo de `dev`;
- traer al día cualquier cambio quirúrgico aún presente en `main`;
- revisar el diff con `git diff --name-only main..dev` y
  `git diff --name-only dev..main`;
- abrir PR `chore/reconcile-main-before-v2 → dev`;
- tras validar `dev`, abrir PR `dev → main` para dejar la baseline
  estable y promocionable al estado real del MVP saneado.

Sin este paso, todas las fases posteriores quedan inseguras: cualquier
hotfix sobre `main` reabriría conflictos contra V2.

---

## 4. Fase 0 · Baseline estable

Objetivo: dejar `main` y `dev` perfectamente alineadas y verificadas
antes de tocar nada de V2.

Tareas:

- reconciliar `main ↔ dev` con la rama `chore/reconcile-main-before-v2`;
- verificar que no han vuelto patrones peligrosos cerrados durante el
  hardening:
  - `localhost:3001` hardcodeado en el frontend;
  - `_fallbackWarning` mutado sobre arrays;
  - `app.use(cors())` abierto sin allowlist;
  - secretos, API keys o tokens en `docs/`, `server/.env` o cualquier
    archivo trackeado;
  - documentación local con datos sensibles reintroducida.
- merge final a `main` con etiqueta sugerida tipo
  `mvp-baseline-pre-v2`.

Criterio de cierre de fase: `dev` y `main` apuntan al mismo commit
saneado, sin patrones peligrosos detectables con `grep` o revisión
manual.

---

## 5. Fase 1 · Documentación V2

Objetivo: cerrar el contrato técnico de V2 antes de tocar código.

Rama: `docs/define-v2-react-backend-docker-roadmap`.

Tareas:

- consolidar este documento como referencia única del plan V2;
- mantener anexos visuales y de sistema de diseño junto a este plan,
  como
  [`v2-stitch-mockups-anexo.md`](./v2-stitch-mockups-anexo.md), que
  evalúa los bocetos de Google Stitch en
  `docs/memoria/stitch_expertech_cv_tech_platform/` como referencia
  para Fase 4;
- actualizar `docs/roadmap.md` si procede para enlazar V2 y dejar
  claro que el legacy vanilla JS queda como baseline mientras se
  ejecutan las fases siguientes;
- mantener cualquier decisión arquitectónica futura referenciada
  desde este archivo.

Criterio de cierre: el repositorio contiene un plan V2 explícito,
versionado y revisable en PR, sin que ningún archivo de código haya
cambiado.

---

## 6. Fase 2 · React + TypeScript scaffold

Objetivo: introducir el stack del nuevo frontend sin romper el legacy.

Rama: `feat/v2-react-ts-scaffold`.

Tareas:

- crear el scaffold con **Vite + React + TypeScript** en una carpeta
  separada del legacy (por ejemplo, `web/` o `apps/web/`);
- mantener `index.html`, `public.html` y los módulos legacy en el repo
  sin tocarlos;
- configurar scripts básicos (`dev`, `build`, `preview`, `typecheck`,
  `lint`);
- preparar la estructura `src/` con convenciones explícitas
  (`src/app`, `src/features`, `src/lib`, `src/components`, `src/styles`,
  etc.);
- no integrar todavía la lógica del legacy: solo arrancar la base.

Criterio de cierre: el nuevo frontend levanta con `npm run dev` en su
propia carpeta, hace `build` correcto y convive con el legacy sin
conflictos.

---

## 7. Fase 3 · Modelos y servicios TypeScript

Objetivo: portar el dominio del CV a TypeScript con tipos sólidos.

Rama: `feat/v2-domain-models-and-storage`.

Tareas:

- migrar los modelos de `CV`, `Profile`, `Project` desde
  `js/models/*` a equivalentes TypeScript dentro del nuevo frontend;
- definir tipos exhaustivos (`type` o `interface`) para cada entidad;
- añadir validación runtime con una librería ligera (Zod o Valibot)
  **solo si aporta valor** en frontera de datos (formularios, carga
  desde storage, futuras respuestas de API);
- adaptar un storage temporal análogo al actual `SafeStorageService`,
  con su fallback `localStorage → sessionStorage → memoria`;
- preparar el terreno para que estos modelos se reutilicen también en
  el backend (Fase 5/6).

Criterio de cierre: existe un dominio TypeScript funcional y testeable
para CV, Profile y Project; el storage temporal permite ya iterar sobre
la UI React.

---

## 8. Fase 4 · UI React

Objetivo: alcanzar equivalencia funcional mínima con el legacy.

Rama: `feat/v2-react-auth-and-editor-shell`.

Tareas:

- portar la **Auth screen** (login/registro local), manteniendo
  explícita la nota de que no es auth de producción;
- portar el **layout autenticado** y la cabecera/acciones globales;
- portar el **editor shell** con los campos clave del perfil;
- portar la **preview** del CV con la misma regla de visibilidad de
  proyectos que vive en `js/utils/projects.js`;
- migración **incremental**: feature por feature, validando cada vista
  contra el legacy.

Criterio de cierre: un usuario puede registrarse, iniciar sesión,
editar su perfil y ver la preview en la nueva app React, con
equivalencia visual y funcional razonable respecto al MVP.

---

## 9. Fase 5 · Backend API

Objetivo: dejar de depender de `localStorage` como única fuente de
verdad.

Rama: `feat/v2-backend-api-foundation`.

Tareas:

- crear un backend **TypeScript** independiente
  (por ejemplo en `apps/api/` o `server/`);
- elegir framework con criterio **pragmático**: Express, Fastify o
  Nest **solo si aporta valor**. No sobrearquitecturar;
- definir endpoints mínimos viables:
  - `GET /health` para liveness/readiness;
  - `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`;
  - `GET/PUT /users/me`;
  - `GET/PUT /cvs/me`;
  - `GET /public-profiles/:slug`;
  - `GET /jobs/search` (proxy con el contrato ya estabilizado:
    `{ results, fallbackWarning, source }`);
- compartir tipos con el frontend (paquete compartido o monorepo
  ligero) si reduce duplicación real;
- no implementar todavía DB: usar storage en memoria o JSON local
  hasta la Fase 6.

Criterio de cierre: el backend responde a los endpoints mínimos y el
frontend React puede consumirlos contra `http://localhost:<port>` en
desarrollo, sin URL hardcodeada (variable de entorno).

---

## 10. Fase 6 · Base de datos

Objetivo: persistencia real, multiusuario, aislada por usuario.

Rama: `feat/v2-database-persistence`.

Tareas:

- elegir **PostgreSQL** como base recomendada por simplicidad y
  ecosistema;
- elegir **Prisma** como ORM recomendado **si encaja con el equipo y
  el tamaño del proyecto**, valorando alternativas (Drizzle,
  Kysely);
- definir entidades mínimas:
  - `User` (id, email, hashedPassword, displayName, createdAt);
  - `CV` (id, ownerUserId, profile, projects, meta, updatedAt);
  - `Project` si conviene normalizarse o se mantiene como JSON dentro
    de `CV`;
  - `PublicProfile` para la vista pública compartible;
- garantizar **aislamiento por usuario** en todas las queries:
  ningún endpoint puede devolver datos de otro usuario por error;
- migraciones versionadas y reproducibles;
- seeds opcionales solo para desarrollo, nunca con datos reales.

Criterio de cierre: dos usuarios distintos pueden registrarse, editar
su CV y leerlo sin que se mezclen sus datos en ningún caso.

---

## 11. Fase 7 · Dockerización

Objetivo: levantar el stack completo en local con un solo comando.

Rama: `feat/v2-docker-compose-local`.

Tareas:

- definir `docker-compose.yml` con tres servicios:
  - `frontend` (Vite build/preview o un Nginx que sirva el build);
  - `backend` (Node + TypeScript build);
  - `database` (PostgreSQL);
- añadir `Dockerfile` por servicio, optimizado para capas y caché;
- crear `.env.example` por servicio, **sin secretos reales**, listando
  todas las variables esperadas y sus valores por defecto seguros;
- añadir **healthchecks** explícitos (`pg_isready`, `GET /health`,
  etc.);
- volúmenes nombrados para persistencia de la base de datos en local;
- redes internas mínimas y exposición controlada de puertos;
- documentar arranque y parada en el README correspondiente.

Criterio de cierre: con `docker compose up` el equipo puede levantar
frontend + backend + DB y usar la app de extremo a extremo sin
configuración manual adicional.

---

## 12. Fase 8 · Preparación de despliegue

Objetivo: dejar el proyecto listo para un despliegue real verificable.

Rama: `feat/v2-deployment-readiness`.

Tareas:

- asegurar un **build reproducible** del frontend y del backend
  (mismo input → mismo artefacto);
- separar variables de entorno **dev/prod** con valores por defecto
  seguros y placeholders claros en `.env.example`;
- redactar un **README de despliegue** con pasos concretos para al
  menos un destino concreto entre:
  - VPS con Docker;
  - Render o Railway o Fly.io para backend + DB;
  - Vercel para frontend con backend separado;
- añadir un **checklist de seguridad pre-deploy**:
  - sin secretos en el repo;
  - cookies/JWT con flags adecuados;
  - CORS con allowlist;
  - rate limit en endpoints sensibles;
  - hashing seguro de contraseñas;
  - logs sin información sensible;
- documentar el proceso de **rollback** mínimo viable.

Criterio de cierre: una persona ajena al proyecto puede desplegar V2
siguiendo el README sin tener que adivinar pasos ni descubrir secretos
implícitos.

---

## 13. Reglas de trabajo

- **una feature por rama**;
- **ramas desde `dev`**;
- **PRs contra `dev`**, nunca contra `main` directamente;
- **`main` solo para releases** validadas en `dev`;
- **commits pequeños** y con mensaje claro (`tipo: descripción`);
- antes de cada commit, revisar:
  - `git status --short`;
  - `git diff --name-only`;
- **no usar `git add .`** ni `git add -A`: añadir archivos
  explícitamente;
- **no tocar archivos fuera del alcance** declarado de la rama;
- **no meter secretos**, API keys, tokens ni `.env` reales en ningún
  archivo trackeado;
- mantener `docs/roadmap.md` y `docs/evidencias.md` alineados con la
  realidad al cierre de cada fase.

---

## 14. Criterios de aceptación de este documento

- ✅ existe el archivo `docs/v2-react-backend-docker-plan.md`;
- ✅ no hay cambios en código fuente como parte de su creación;
- ✅ no hay cambios en `.env` ni en archivos de configuración runtime;
- ✅ no se han introducido secretos en este archivo;
- ✅ el plan deja claro que React, TypeScript, backend y Docker son
  **trabajo pendiente**, no realizado;
- ✅ el plan recomienda **resolver primero la divergencia `main ↔ dev`**
  antes de iniciar cualquier fase de V2.

---

## 15. Resumen del orden recomendado

1. Fase 0 — reconciliar `main ↔ dev` (`chore/reconcile-main-before-v2`).
2. Fase 1 — documentar V2 (esta misma rama).
3. Fase 2 — scaffold React + TypeScript.
4. Fase 3 — dominio y storage TypeScript.
5. Fase 4 — UI React con equivalencia funcional mínima.
6. Fase 5 — backend API en TypeScript.
7. Fase 6 — base de datos PostgreSQL.
8. Fase 7 — Dockerización del stack.
9. Fase 8 — preparación de despliegue.

Cada fase se cierra con PR contra `dev`, revisión, validación mínima
y documentación al día. El legacy vanilla JS se retira solo cuando V2
alcance equivalencia funcional verificada.
