# EXPERTECH CV

`EXPERTECH CV` es un proyecto frontend orientado a la creación de un currículum web interactivo para perfiles tech. Nace como MVP del módulo de JavaScript del bootcamp y se plantea como la base inicial de una evolución futura hacia `EXPERTECH JOB`.

## Estado del proyecto

Estado actual: `MVP legacy estable + V2 en progreso (Fases 2–6 cerradas)`

Fase actual: `chore/v2-fase-6-docs-and-safety-audit` (auditoría documental post-Fase 6)

El MVP legacy en vanilla JS está completo y saneado (PRs #22–#30 de hardening). La V2 del proyecto ya ha cerrado seis fases de implementación real: scaffold React + TypeScript (`apps/web/`), modelos de dominio TypeScript, auth y preview React, backend Express + TypeScript (`apps/api/`), y persistencia real con PostgreSQL + Prisma + bcrypt (Fases 2–6, PRs #37–#42). `main` y `dev` están sincronizadas desde el tag `mvp-baseline-pre-v2` (PR #36). El siguiente bloque es la Dockerización completa del stack (Fase 7).

El comportamiento funcional del MVP sigue intacto: maqueta visual navegable, auth local básica para MVP con `login/register`, persistencia de usuarios y sesión en `localStorage` con fallback automático a `sessionStorage` o memoria, restauración de sesión al recargar, formulario funcional de perfil conectado al estado, preview recruiter-friendly sincronizada en tiempo real, integración pública básica con GitHub para enriquecer el CV con perfil y repositorios seleccionados manualmente, visualización dinámica de proyectos en la preview, trazabilidad mínima del origen de proyectos importados desde GitHub, sistema de avatar híbrido (local y GitHub) con límites de tamaño para evitar `QuotaExceededError`, exportación PDF basada en una vista específica de impresión con QR y una demo pública estática. Además, el bloque de búsqueda de empleo está conectado a Jooble mediante proxy local con degradación a mock cuando falla la API, contrato estable `{ results, fallbackWarning, source }` y URL del proxy parametrizable (sin `localhost:3001` hardcodeado en el frontend).

## Objetivo del MVP

La meta de esta primera versión es permitir que una persona pueda:

- introducir y editar sus datos profesionales
- organizar su perfil como CV digital
- visualizar el resultado en formato web
- persistir la información en `localStorage`
- enriquecer el CV con información básica de GitHub
- preparar una presentación clara para recruiters

Fuera de alcance en esta fase:

- backend
- base de datos
- autenticación real
- panel recruiter multiusuario
- despliegue full-stack

## Stack previsto

- HTML5
- CSS3
- JavaScript
- arquitectura modular por capas simples: `application`, `ui`, `services`, `models`, `utils`
- Git y GitHub como flujo de control de versiones

## Estructura actual del proyecto

```text
.
|-- assets/
|   |-- icons/
|   `-- images/
|-- data/
|   `-- public-cv.json
|-- docs/
|   |-- docs_V2/
|   |-- architecture-notes.md
|   |-- evidencias.md
|   |-- EXPERTECH_CV_hoja_de_ruta.md
|   |-- git_guia_practica.md
|   |-- roadmap.md
|   `-- v2-react-backend-docker-plan.md
|-- js/
|   |-- application/
|   |-- models/
|   |-- services/
|   |   `-- SafeStorageService.js
|   |-- ui/
|   |-- utils/
|   |   `-- projects.js
|   |-- README.md
|   |-- app.js
|   `-- public.js
|-- server/
|   |-- services/
|   |-- README.md
|   |-- package.json
|   `-- server.js
|-- styles/
|   |-- main.css
|   |-- reset.css
|   `-- README.md
|-- .gitattributes
|-- AGENTS.md
|-- index.html
|-- public.html
`-- README.md
```

## Documentación disponible

- [Hoja de ruta del proyecto](./docs/EXPERTECH_CV_hoja_de_ruta.md)
- [Evidencias de desarrollo](./docs/evidencias.md)
- [Guía práctica de Git](./docs/git_guia_practica.md)
- [Notas de arquitectura](./docs/architecture-notes.md)
- [Roadmap operativo](./docs/roadmap.md)
- [Plan V2 · React + TypeScript + Backend + Docker](./docs/v2-react-backend-docker-plan.md)

Documentación viva recomendada para seguir el estado real del repositorio:

- `README.md`
- `docs/roadmap.md`
- `docs/evidencias.md`
- `docs/v2-react-backend-docker-plan.md` para entender la dirección estratégica hacia V2

La hoja de ruta larga de `docs/EXPERTECH_CV_hoja_de_ruta.md` se mantiene como referencia estratégica del proyecto, no como fuente operativa principal del día a día.

## Flujo Git del proyecto

La estrategia de ramas busca mantener orden, trazabilidad y aprendizaje práctico:

- `main`: rama estable y publicable
- `dev`: rama de integración
- `feat/*` o `feature/*`: ramas de trabajo por funcionalidad

Flujo recomendado:

1. partir de `dev`
2. crear la rama de la feature activa
3. desarrollar, validar y documentar en esa rama
4. integrar en `dev`
5. pasar a `main` solo cuando el bloque esté estable

En este proyecto se está priorizando crear cada rama solo cuando vaya a utilizarse, para evitar ruido y mantener un proceso más didáctico.

## Cómo abrir el proyecto

La base actual es estática. Para revisarla en local puedes:

- abrir `index.html` directamente en el navegador
- o usar una extensión como Live Server en VS Code si quieres recarga automática

Importante para la demo pública:

- `public.html` carga `data/public-cv.json` mediante `fetch()`
- por eso debe validarse con servidor estático, Live Server o GitHub Pages
- abrir `public.html` con `file://` puede fallar aunque el código esté correcto

Comportamiento actual disponible:

- carga de una pantalla principal ya maquetada
- aplicación de estilos desde `styles/reset.css` y `styles/main.css`
- layout responsive con bloques apilados en móvil
- distribución `editor` izquierda / `preview` derecha en desktop
- preview sticky solo en escritorio
- carga del script `js/app.js` con estado inicial del CV
- factories base para `CandidateProfile`, `Project` y `PortfolioCV`
- creación de un estado inicial consistente mediante `createInitialCVState()`
- persistencia básica del CV en `localStorage`
- recuperación del CV guardado al volver a cargar la app
- utilidades mínimas de depuración expuestas en `window.cvAppDebug`
- formulario de perfil funcional en la columna de edición
- rehidratación del formulario al recargar la app
- feedback visual de guardado tras enviar el formulario
- render en vivo de nombre, titular y resumen en la preview
- sincronización inicial de la preview con el estado cargado desde `localStorage`
- fallbacks visuales cuando faltan datos del perfil
- ocultación automática del estado vacío de la preview cuando ya existe contenido real
- búsqueda de perfil público de GitHub desde un bloque independiente del formulario manual
- carga de perfil GitHub con avatar, nombre visible, bio y enlace público
- carga de repositorios candidatos y selección manual de repos destacados
- persistencia de `githubUsername` y de proyectos generados desde repositorios seleccionados
- rehidratación del bloque GitHub a partir del estado persistido, manteniendo el flujo manual como fallback si la API falla
- render dinámico de proyectos destacados en la preview a partir de `cvState.projects`
- priorización de proyectos marcados como `featured` cuando existen
- visualización de nombre, descripción, stack y enlaces dentro de cards de proyecto
- empty-state específico cuando no hay proyectos visibles en la preview
- persistencia de metadatos mínimos de origen para proyectos importados desde GitHub
- línea visual compacta de origen en la preview, por ejemplo `GitHub · owner/repo`
- limpieza del proyecto demo legado para que el bloque de proyectos no muestre contenido fantasma al quitar la selección GitHub
- pantalla de acceso con tabs de `login/register`
- registro local con email + contraseña y creación automática de sesión
- login local con email + contraseña
- persistencia de usuarios y sesión en `localStorage`
- restauración de sesión al recargar la aplicación
- logout visible y funcional desde la app autenticada
- botones visibles de Google y GitHub solo como preparación visual del siguiente MVP
- mensajes informativos en esos botones, sin OAuth real ni autenticación externa implementada
- sistema de avatar híbrido (subida de imagen local con resize por canvas o lectura desde GitHub)
- demo pública estática (`public.html`) alimentada por `data/public-cv.json`
- runtime público modular para desacoplar la demo del `localStorage` del editor

## Flujo actual del usuario

1. entra en la pantalla de acceso
2. crea una cuenta local o inicia sesión con email y contraseña
3. la sesión se restaura automáticamente si sigue existiendo en `localStorage`
4. una vez autenticado, accede a la app principal del CV
5. puede editar perfil, conectar GitHub, seleccionar repositorios y ver proyectos en la preview

## Arquitectura actual

La arquitectura actual ya no concentra toda la orquestación en `app.js`.

- `js/app.js`: entry point mínimo y composition root
- `js/application/AppRuntime.js`: coordina auth, sesión, arranque global y logout
- `js/application/AuthenticatedCVApp.js`: coordina la app autenticada, el estado del CV y la sincronización entre módulos
- `js/application/PublicPageRuntime.js`: coordina la demo pública estática del CV
- `js/services/`: persistencia del CV, auth local MVP y servicios externos como GitHub
- `js/ui/`: controladores UI y templates reutilizables

Templates UI ya extraídos del HTML principal:

- `js/ui/AuthScreenTemplate.js`
- `js/ui/PreviewTemplate.js`
- `js/ui/GitHubBlockTemplate.js`

Esto deja `index.html` más cerca de un shell base y hace más clara la separación entre:

- auth / sesión
- estado del CV
- integración GitHub
- render visual

## Roadmap resumido del MVP

1. `feat/project-setup`: preparar la base del proyecto
2. `feat/layout-base`: construir la arquitectura visual editor + preview
3. `feat/domain-model`: definir el modelo de datos
4. `feat/local-storage`: persistir el estado del CV
5. `feat/editor-profile`: crear formularios y edición del perfil
6. `feat/live-preview`: reflejar cambios en tiempo real
7. `feat/github-integration`: integrar perfil público y repositorios básicos desde GitHub
8. `feat/projects-visualization`: mejorar lectura y visualización de proyectos seleccionados
9. `feat/login-screen`: preparar una pantalla de acceso y base de identidad de usuario
10. `feat/github-project-sources`: ampliar fuentes GitHub y atribución de proyectos
11. `feat/export-pdf-qr`: exportación PDF con vista específica de impresión
12. `feat/github-pages-public-preview`: demo pública estática preparada para GitHub Pages
13. `feat/jooble-search-proxy-mvp`: buscador de ofertas con proxy local y fallback mock
14. Bloque de hardening sobre `dev` (PRs #22 a #30): listeners estables, proxy de jobs endurecido, fallback de storage, retirada de docs con secretos, refactor de utilidades de proyectos y `.gitattributes`
15. `docs/add-v2-react-backend-docker-plan`: contrato técnico de migración a V2

## Bloque de hardening cerrado sobre `dev`

Estado funcional adicional consolidado a partir del MVP base:

- PR #22 `fix/stabilize-authenticated-app-listeners`: separación limpia de listeners y soporte de re-login sin duplicar bindings
- PR #23/#24 limpieza de `.claude/` local en el repo
- PR #25 `fix/jobs-proxy-contract-and-security`: contrato estable de `JobOffersService`, eliminación de `_fallbackWarning` sobre arrays, supresión de `localhost:3001` hardcodeado en frontend, CORS configurable y rate limit en el backend
- PR #26 `security/remove-exposed-jooble-key-and-local-docs`: retirada de documentación local con API key
- PR #27 `fix/storage-fallback-and-quota-handling`: `SafeStorageService` con fallback `localStorage → sessionStorage → memoria` y límites de avatar en `ProfileEditor`
- PR #28 limpieza secundaria de docs locales reintroducidas
- PR #29 `refactor/extract-project-rendering-utils`: extracción de `isRenderableProject` y `getVisibleProjects` a `js/utils/projects.js` como única fuente de verdad
- PR #30 `chore/add-gitattributes-line-endings`: `.gitattributes` conservador y documentación viva al día

## Última feature documental

La última feature documental abierta sobre `dev` es `docs/add-v2-react-backend-docker-plan`, que añade el plan técnico explícito de la V2 del proyecto: migración a React + TypeScript, backend real con APIs, base de datos PostgreSQL, Dockerización y preparación de despliegue.

Sigue quedando fuera de este cierre:

- implementación real de cualquier fase V2
- backend serio con autenticación de producción
- base de datos y persistencia multiusuario
- Dockerización del stack
- despliegue real

## Nota de desarrollo

Las features `feat/github-integration`, `feat/projects-visualization`, `feat/login-screen`, `feat/github-project-sources`, `feat/export-pdf-qr`, `feat/github-pages-public-preview` y `feat/jooble-search-proxy-mvp` dejan una base MVP sólida que el bloque de hardening posterior ha endurecido en estabilidad, seguridad y limpieza: auth local de demostración, integración pública con GitHub, representación recruiter-friendly de proyectos, trazabilidad mínima del origen importado, avatar híbrido con límites, exportación PDF útil, demo pública estática y buscador de empleo con proxy local seguro y contrato estable.

Limitaciones del legacy (aplican al MVP vanilla JS en la raíz, no a V2):

- la auth del legacy es local y orientada a demo; las contraseñas del legacy se guardan en `localStorage` en texto plano (limitación explícita del MVP)
- Google y GitHub no implementan OAuth real todavía en ninguna versión
- el `server/` de la raíz es un proxy mínimo para Jooble; no es backend de producción
- no hay validación avanzada de autoría o atribución en proyectos GitHub en el legacy
- no hay soporte para múltiples cuentas GitHub ni colaboraciones en esta fase

Limitaciones del backend V2 (`apps/api/`) post-Fase 6:

- contraseñas hasheadas con bcrypt; backend no guarda texto plano
- persistencia real en PostgreSQL con aislamiento por usuario (`ownerId`)
- sesiones en DB sin expiración automática todavía (Fase 8)
- sin rate limit ni logs estructurados todavía (Fase 8)
- token Bearer del frontend en `localStorage` (migración a cookie httpOnly en Fase 8)
- Docker Compose solo tiene el servicio de DB; frontend y backend todavía no dockerizados (Fase 7)

Orden recomendado a partir del estado actual:

1. mergear el PR documental `docs/add-v2-react-backend-docker-plan` a `dev`
2. abrir rama `chore/reconcile-main-before-v2` para reconciliar la divergencia `main ↔ dev` y promocionar el MVP saneado a `main`
3. comenzar la Fase 2 del plan V2 (`feat/v2-react-ts-scaffold`) sobre la baseline ya alineada

Siguiente bloque de trabajo según el plan V2:

- `feat/v2-react-ts-scaffold`: scaffold inicial de Vite + React + TypeScript conviviendo con el legacy
- `feat/v2-domain-models-and-storage`: migración del dominio del CV a TypeScript
- `feat/v2-react-auth-and-editor-shell`: portado incremental de la UI
- `feat/v2-backend-api-foundation`: backend real en TypeScript con endpoints mínimos
- `feat/v2-database-persistence`: PostgreSQL y aislamiento por usuario
- `feat/v2-docker-compose-local`: Dockerización del stack
- `feat/v2-deployment-readiness`: build reproducible, variables dev/prod y checklist de seguridad pre-deploy

Cada fase se ejecuta en su rama, con PR contra `dev` y validación mínima documentada. Consulta `docs/v2-react-backend-docker-plan.md` para el detalle completo.

## Autor

David López Sotelo
