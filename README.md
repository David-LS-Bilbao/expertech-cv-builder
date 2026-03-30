# EXPERTECH CV

`EXPERTECH CV` es un proyecto frontend orientado a la creación de un currículum web interactivo para perfiles tech. Nace como MVP del módulo de JavaScript del bootcamp y se plantea como la base inicial de una evolución futura hacia `EXPERTECH JOB`.

## Estado del proyecto

Estado actual: `Bootcamp JavaScript MVP`

Fase actual: `feat/project-setup`

En este punto el repositorio ya cuenta con una base estática mínima y operativa: `index.html`, estilos separados en `reset.css` y `main.css`, y un punto de entrada JavaScript conectado mediante `js/app.js`.

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

- carga del HTML base del proyecto
- aplicación de estilos desde `styles/reset.css` y `styles/main.css`
- carga del script `js/app.js`
- validación básica de conexión JavaScript mediante `console.log`

## Roadmap resumido del MVP

1. `feat/project-setup`: preparar la base del proyecto
2. `feature/layout-base`: construir la arquitectura visual editor + preview
3. `feature/domain-model`: definir el modelo de datos
4. `feature/local-storage`: persistir el estado del CV
5. `feature/editor-profile`: crear formularios y edición del perfil
6. `feature/live-preview`: reflejar cambios en tiempo real
7. `feature/github-integration`: enriquecer el CV con datos de GitHub
8. `feature/projects-visualization`: mejorar lectura y visualización de proyectos
9. `feature/export-pdf-qr`: exportación resumida y acceso por QR
10. `feature/polish-accessibility`: pulido final, estados UX y accesibilidad

## Siguiente feature prevista

La siguiente fase natural del proyecto es `feature/layout-base`.

Su objetivo será construir la maqueta base de la aplicación con enfoque `editor + preview`, preparar la jerarquía visual principal y dejar la interfaz lista para conectar la lógica en las siguientes features.

## Nota de desarrollo

Durante la fase `feat/project-setup`, el objetivo no es resolver todavía la lógica de negocio del CV, sino garantizar que la base del repositorio, el flujo Git y la estructura inicial del frontend estén preparados para evolucionar sin deuda técnica innecesaria.

## Autor

David López Sotelo
