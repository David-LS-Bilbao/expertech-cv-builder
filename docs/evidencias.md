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
