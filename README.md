# EXPERTECH CV

`EXPERTECH CV` es un proyecto frontend orientado a la creación de un currículum web interactivo para perfiles tech. Nace como MVP del módulo de JavaScript del bootcamp y se plantea como la base inicial de una evolución futura hacia `EXPERTECH JOB`.

## Estado del proyecto

Estado actual: `Bootcamp JavaScript MVP`

Fase actual: cierre funcional de `feat/github-pages-public-preview` sobre la base ya cerrada de `feat/export-pdf-qr`

En este punto el repositorio ya cuenta con una maqueta visual real y navegable, auth local básica para MVP con `login/register`, persistencia de usuarios y sesión en `localStorage`, restauración de sesión al recargar, formulario funcional de perfil conectado al estado, preview recruiter-friendly sincronizada en tiempo real, integración pública básica con GitHub para enriquecer el CV con perfil y repositorios seleccionados manualmente, visualización dinámica de proyectos en la preview, trazabilidad mínima del origen de proyectos importados desde GitHub, sistema de avatar híbrido (local y GitHub), exportación PDF basada en una vista específica de impresión y una demo pública estática (`public.html`) desacoplada de `localStorage`, preparada para evolucionar a publicación real con GitHub Pages.

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
|-- docs/
|   |-- architecture-notes.md
|   |-- evidencias.md
|   |-- EXPERTECH_CV_hoja_de_ruta.md
|   |-- git_guia_practica.md
|   `-- roadmap.md
|-- js/
|   |-- application/
|   |-- models/
|   |-- services/
|   |-- ui/
|   |-- utils/
|   |-- README.md
|   `-- app.js
|-- styles/
|   |-- main.css
|   |-- reset.css
|   `-- README.md
|-- data/
|   `-- public-cv.json
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

Documentación viva recomendada para seguir el estado real del repositorio:

- `README.md`
- `docs/roadmap.md`
- `docs/evidencias.md`

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
13. `feat/infojobs-search-proxy-mvp`: buscador de ofertas con integración real y proxy mínimo
14. `feat/polish-accessibility` o `feat/visual-polish-final`: pulido final, estados UX y accesibilidad
15. `feat/documentacion-final`: cierre documental final del proyecto

## Feature activa

La rama de trabajo actual es `feat/github-pages-public-preview`.

En esta fase ya se ha dejado resuelto este bloque funcional:

- `public.html` ya no depende del `localStorage` del mismo navegador
- la demo pública se alimenta desde `data/public-cv.json`
- existe un runtime público modular (`js/public.js` + `js/application/PublicPageRuntime.js`)
- la hero pública reutiliza nombre, titular, resumen y avatar del snapshot del CV
- la demo pública ya muestra proyectos destacados y una card específica de tecnologías

Todavía queda fuera de esta rama:

- publicación real ya servida en GitHub Pages
- QR funcional apuntando a una URL pública estable
- backend y base de datos
- sharing multiusuario real

## Nota de desarrollo

Las features `feat/github-integration`, `feat/projects-visualization`, `feat/login-screen`, `feat/github-project-sources` y `feat/export-pdf-qr` ya dejan resuelta una base MVP con auth local de demostración, integración pública básica con GitHub, representación recruiter-friendly de los proyectos, trazabilidad mínima del origen importado, avatar híbrido y exportación PDF útil. Sobre esa base, `feat/github-pages-public-preview` se centra en convertir la vista pública en una demo estática modular y preparada para una futura publicación real sin introducir todavía backend ni base de datos.

Limitaciones actuales importantes:

- la auth actual es local y orientada a demo, no auth real de producción
- las contraseñas se guardan en `localStorage` en texto plano como limitación explícita de este MVP
- Google y GitHub no implementan OAuth real todavía
- no hay backend ni PostgreSQL en esta fase
- no existe aislamiento real por usuario para el estado del CV
- no hay validación avanzada de autoría o atribución en proyectos GitHub
- no hay soporte real para múltiples cuentas GitHub ni colaboraciones en esta fase
- `public.html` ya usa un snapshot estático y no depende del `localStorage` del editor, pero todavía no está desplegada en una URL pública real
- el QR sigue pendiente hasta que exista una URL pública estable

Orden recomendado a partir del estado actual:

1. cerrar `feat/github-pages-public-preview`
2. `feat/infojobs-search-proxy-mvp`
3. `feat/polish-accessibility` o `feat/visual-polish-final`
4. `feat/documentacion-final`

Siguiente feature recomendada tras cerrar esta rama:

- `feat/infojobs-search-proxy-mvp`
- objetivo: incorporar un buscador de ofertas con una integración real y útil dentro del portfolio
- alcance: integración con API de empleo, priorizando InfoJobs si encaja, y proxy mínimo o función serverless si la API requiere secreto
- fuera de alcance: backend completo, base de datos y panel recruiter real

## Autor

David López Sotelo
