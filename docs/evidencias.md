# Evidencias del desarrollo

## Propósito del documento

Este archivo servirá como registro cronológico del proceso de desarrollo de `EXPERTECH CV`. La idea es documentar decisiones, tareas realizadas, cambios aplicados, validaciones y próximos pasos para facilitar la elaboración de la memoria técnica al finalizar el proyecto.

## Cómo se va a usar

- Añadir una entrada cada vez que se complete un avance relevante
- Registrar qué se ha hecho, por qué se ha hecho y qué resultado ha dejado
- Incluir, cuando tenga sentido, incidencias, decisiones técnicas y validaciones realizadas
- Mantener un formato simple y cronológico para que luego sea fácil reutilizarlo en la memoria final

## Formato base de las entradas

### [AAAA-MM-DD] Título del avance

- Objetivo:
- Trabajo realizado:
- Archivos afectados:
- Resultado:
- Validación:
- Próximo paso:

## Registro inicial

### [2026-03-30] Preparación del repositorio y documentación base

- Objetivo: dejar una base inicial del proyecto lista para empezar el desarrollo con una estructura mínima ordenada.
- Trabajo realizado: revisión de la estructura del repositorio, detección de carpetas principales y preparación de una documentación inicial para acompañar el arranque del proyecto.
- Archivos afectados: `README.md`, carpetas `assets`, `docs`, `js`, `js/models`, `js/services`, `js/ui`, `js/utils` y `styles`.
- Resultado: repositorio preparado con una estructura simple y válida para comenzar a trabajar y subir el proyecto a GitHub.
- Validación: comprobación manual de la estructura existente y del estado del repositorio.
- Próximo paso: definir y desarrollar la primera base funcional del proyecto.

### [2026-03-30] Redacción de la primera versión del README principal

- Objetivo: documentar el proyecto con una presentación profesional mínima desde el inicio.
- Trabajo realizado: creación de una primera versión del `README.md` principal con nombre del proyecto, descripción corta, estado del proyecto, objetivo, stack previsto, roadmap resumido y autor.
- Archivos afectados: `README.md`.
- Resultado: documento inicial disponible para presentar el proyecto de forma clara en GitHub.
- Validación: revisión manual del contenido generado y comprobación visual del archivo.
- Próximo paso: ampliar la documentación a medida que avance el desarrollo.

### [2026-03-30] Ajuste del remoto Git para autenticación SSH

- Objetivo: dejar configurado el acceso al repositorio remoto mediante SSH.
- Trabajo realizado: sustitución de la URL HTTPS del remoto `origin` por la URL SSH del repositorio.
- Archivos afectados: `.git/config`.
- Resultado: el repositorio queda preparado para operaciones `push` y `pull` mediante autenticación SSH.
- Validación: comprobación con `git remote -v`.
- Próximo paso: continuar con la implementación del proyecto ya sobre la configuración definitiva del repositorio.

### [2026-03-30] Creación del documento de evidencias de desarrollo

- Objetivo: establecer un registro continuo de avances para reutilizarlo en la memoria técnica final.
- Trabajo realizado: creación y estructuración del archivo `docs/evidencias.md` con propósito, normas de uso, plantilla base y primeras entradas del proyecto.
- Archivos afectados: `docs/evidencias.md`.
- Resultado: documento operativo preparado para ir registrando el proceso de programación durante todo el proyecto.
- Validación: revisión manual del contenido y de la estructura propuesta.
- Próximo paso: actualizar este archivo en cada hito relevante del desarrollo.

### [2026-03-30] Consolidación del flujo de trabajo inicial de la feature `feat/project-setup`

- Objetivo: dejar definida la base de trabajo de la primera feature con reglas claras de colaboración, control básico de Git y una validación inicial de la estructura del proyecto.
- Trabajo realizado: se revisó la hoja de ruta del proyecto para alinear el trabajo con el roadmap del MVP, se decidió trabajar creando las ramas según se vayan necesitando y no todas de golpe, y se dejó fijada como rama activa `feat/project-setup`. También se preparó una guía práctica de Git para consulta rápida y se creó un archivo `AGENTS.md` en la raíz del repositorio para definir cómo debe colaborar Codex en este proyecto.
- Trabajo realizado por el usuario: creación y actualización de la rama `feat/project-setup`, ejecución de los comandos Git para commit y push del archivo `AGENTS.md`, sincronización de la rama con GitHub y mantenimiento del control directo sobre el flujo de ramas y commits.
- Trabajo realizado por Codex: análisis del estado del repositorio, propuesta del flujo más limpio para ramas y sincronización con GitHub, redacción del contenido de `AGENTS.md`, actualización de `.gitignore` con una configuración mínima y prudente, y revisión del checklist del primer bloque de preparación.
- Archivos afectados: `AGENTS.md`, `.gitignore`, `docs/git_guia_practica.md`, `docs/EXPERTECH_CV_hoja_de_ruta.md` y `docs/evidencias.md`.
- Resultado: queda establecida una forma de trabajo explícita entre usuario y asistente, el repositorio dispone de una base documental más sólida y la feature `feat/project-setup` avanza con un criterio más claro de organización y aprendizaje.
- Validación: comprobación manual del estado de Git, confirmación de que la rama `feat/project-setup` existe y está sincronizada con su remoto, revisión del checklist de estructura inicial y verificación de que `.gitignore` ya no está vacío.
- Próximo paso: cerrar los puntos pendientes de preparación de la feature `feat/project-setup`, subir los commits necesarios y decidir cuándo se da por concluida esta fase para integrarla en `dev`.

### [2026-03-30] Conexión de la base estática inicial del frontend

- Objetivo: dejar una base visible y ejecutable en navegador para comprobar que la estructura inicial del frontend está correctamente conectada.
- Trabajo realizado: se añadió la carga de `js/app.js` desde `index.html` y se consolidó una base mínima de presentación con `styles/reset.css` y `styles/main.css`.
- Trabajo realizado por el usuario: edición de `index.html`, `js/app.js`, `styles/reset.css` y `styles/main.css` para dejar una primera pantalla base y verificar el arranque del script en el navegador.
- Trabajo realizado por Codex: revisión de los cambios realizados, comprobación de la conexión entre HTML, CSS y JavaScript, y actualización de la documentación para reflejar el estado real del proyecto.
- Archivos afectados: `index.html`, `js/app.js`, `styles/reset.css`, `styles/main.css`, `README.md`, `docs/evidencias.md`, `docs/roadmap.md` y `docs/architecture-notes.md`.
- Resultado: el proyecto ya dispone de una base estática mínima cargable en navegador, con HTML inicial, estilos enlazados y script JavaScript ejecutándose correctamente.
- Validación: revisión de la carga del script desde `index.html` y comprobación de que el `console.log` de `js/app.js` puede mostrarse en la consola del navegador.
- Próximo paso: dejar cerrada la documentación de `feat/project-setup` y preparar la transición hacia `feature/layout-base`.

### [2026-03-30] Cierre documental y preparación del repositorio para continuar

- Objetivo: dejar el trabajo del día documentado, coherente y listo para retomarlo en la siguiente sesión sin perder contexto.
- Trabajo realizado: se revisó y rehizo el `README.md` con un enfoque más profesional, se actualizaron `docs/roadmap.md` y `docs/architecture-notes.md` para alinearlos con la base real del proyecto, y se corrigió la `meta description` de `index.html`.
- Trabajo realizado por el usuario: ajuste del roadmap operativo con la convención actual de features y consolidación de la base visual y JavaScript del arranque del proyecto.
- Trabajo realizado por Codex: revisión de la documentación, corrección puntual de `index.html`, actualización del registro de evidencias y preparación del cierre de la sesión de trabajo.
- Archivos afectados: `README.md`, `docs/roadmap.md`, `docs/architecture-notes.md`, `docs/evidencias.md` e `index.html`.
- Resultado: el repositorio queda mejor documentado, con una dirección de trabajo más clara y con una base inicial más fácil de retomar en la siguiente sesión.
- Validación: revisión manual del contenido de los documentos, del estado actual de la rama `feat/project-setup` y de la coherencia entre HTML, CSS, JavaScript y documentación.
- Próximo paso: subir todos los cambios a GitHub y continuar la siguiente sesión desde esta misma feature o preparar su cierre hacia `dev`.
