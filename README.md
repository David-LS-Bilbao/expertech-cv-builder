# EXPERTECH CV

`EXPERTECH CV` es un proyecto frontend orientado a la creación de un currículum web interactivo para perfiles tech. Nace como MVP del módulo de JavaScript del bootcamp y se plantea como la base inicial de una evolución futura hacia `EXPERTECH JOB`.

## Estado del proyecto

Estado actual: `Bootcamp JavaScript MVP`

Fase actual: `feat/projects-visualization` cerrada a nivel funcional y siguiente paso enfocado en `feat/login-screen`

En este punto el repositorio ya cuenta con una maqueta visual real y navegable, estilos separados en `reset.css` y `main.css`, una base JavaScript con modelo de dominio inicial, persistencia en `localStorage`, formulario funcional de perfil conectado al estado, una preview recruiter-friendly sincronizada en tiempo real, una integración pública básica con GitHub para enriquecer el CV con perfil y repositorios seleccionados manualmente, y un bloque de proyectos ya conectado a la preview como cards dinámicas orientadas a recruiters.

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
- arquitectura modular por capas simples: `ui`, `services`, `models`, `utils`
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
|-- AGENTS.md
|-- index.html
`-- README.md
```

## Documentación disponible

- [Hoja de ruta del proyecto](./docs/EXPERTECH_CV_hoja_de_ruta.md)
- [Evidencias de desarrollo](./docs/evidencias.md)
- [Guía práctica de Git](./docs/git_guia_practica.md)
- [Notas de arquitectura](./docs/architecture-notes.md)
- [Roadmap operativo](./docs/roadmap.md)

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
11. `feat/export-pdf-qr`: exportación resumida y acceso por QR
12. `feat/polish-accessibility`: pulido final, estados UX y accesibilidad
13. `feat/documentacion-final`: cierre documental final del proyecto

## Siguiente feature prevista

La siguiente fase natural del proyecto es `feat/login-screen`.

Su objetivo será preparar una pantalla de acceso clara y una base de identidad de usuario dentro del producto, sin obligar todavía a resolver autenticación externa compleja ni OAuth.

## Nota de desarrollo

Las features `feat/github-integration` y `feat/projects-visualization` ya dejan resuelta la integración pública básica con GitHub y la representación visual recruiter-friendly de los proyectos dentro del alcance MVP. La selección de repositorios sigue siendo manual y el flujo manual del perfil continúa como base segura. Siguen fuera de esta fase la autenticación OAuth, la gestión de múltiples cuentas, las colaboraciones, los repositorios privados y la validación avanzada de autoría o atribución.

Orden recomendado a partir del estado actual:

1. `feat/login-screen`
2. `feat/github-project-sources`
3. `feat/export-pdf-qr`
4. `feat/polish-accessibility`
5. `feat/documentacion-final`

## Autor

David López Sotelo
