# EXPERTECH CV

`EXPERTECH CV` es un proyecto frontend orientado a la creación de un currículum web interactivo para perfiles tech. Nace como MVP del módulo de JavaScript del bootcamp y se plantea como la base inicial de una evolución futura hacia `EXPERTECH JOB`.

## Estado del proyecto

Estado actual: `Bootcamp JavaScript MVP`

Fase actual: `feat/live-preview` cerrada a nivel funcional y siguiente paso enfocado en `feat/github-integration`

En este punto el repositorio ya cuenta con una maqueta visual real y navegable, estilos separados en `reset.css` y `main.css`, una base JavaScript con modelo de dominio inicial, persistencia en `localStorage`, formulario funcional de perfil conectado al estado y una preview recruiter-friendly sincronizada en tiempo real para los datos principales del perfil. La base actual ya muestra una pantalla principal con `header`, `hero`, acciones rápidas, columna de edición, columna de preview y acciones finales, además de un flujo real de edición, guardado y render reactivo del bloque de perfil.

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

## Roadmap resumido del MVP

1. `feat/project-setup`: preparar la base del proyecto
2. `feat/layout-base`: construir la arquitectura visual editor + preview
3. `feat/domain-model`: definir el modelo de datos
4. `feat/local-storage`: persistir el estado del CV
5. `feat/editor-profile`: crear formularios y edición del perfil
6. `feat/live-preview`: reflejar cambios en tiempo real
7. `feat/github-integration`: enriquecer el CV con datos de GitHub
8. `feat/projects-visualization`: mejorar lectura y visualización de proyectos
9. `feat/export-pdf-qr`: exportación resumida y acceso por QR
10. `feat/polish-accessibility`: pulido final, estados UX y accesibilidad

## Siguiente feature prevista

La siguiente fase natural del proyecto es `feat/github-integration`.

Su objetivo será consultar datos básicos desde GitHub, mostrarlos en la interfaz y permitir al usuario decidir qué información incorpora al CV sin romper el flujo actual de edición manual.

## Nota de desarrollo

La feature `feat/live-preview` ya deja resuelto el render en tiempo real del bloque principal de perfil, pero todavía quedan pendientes la integración de proyectos y skills dinámicos en la preview, la conexión con GitHub, la exportación PDF y una revisión más profunda de accesibilidad.

## Autor

David López Sotelo
