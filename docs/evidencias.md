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

### [2026-04-09] Cierre de la feature `feat/layout-base`

- Objetivo: construir la primera maqueta real del producto y dejar cerrada la arquitectura visual base de `EXPERTECH CV`.
- Trabajo realizado: se sustituyó el placeholder inicial por una pantalla completa con flujo visual claro, se consolidó una estructura `editor + preview`, se trabajó con enfoque mobile-first, se añadió adaptación a escritorio, se pulieron estados vacíos, badges y microcopy, y se ajustó la preview para que sea sticky solo en desktop.
- Trabajo realizado por el usuario: implementación de la maqueta base en `index.html` y `styles/main.css`, revisión visual de la feature, cierre funcional de la rama y apertura de la PR hacia `dev`.
- Trabajo realizado por Codex: revisión del cierre de feature, ajuste puntual del comportamiento sticky de la preview, comentarios explicativos en HTML y CSS para facilitar lectura y mantenimiento, y actualización de la documentación del proyecto.
- Archivos afectados: `index.html`, `styles/main.css`, `README.md`, `docs/evidencias.md` y `docs/roadmap.md`.
- Resultado: el proyecto ya no muestra una pantalla base vacía, sino una interfaz real con `header`, `hero`, `quick actions`, `editor`, `preview` y `final actions`, preparada para conectar lógica en las siguientes fases del MVP.
- Validación: comprobación visual manual del layout en móvil y escritorio, verificación del apilado de bloques en pequeño formato, confirmación de la disposición `editor` izquierda / `preview` derecha en desktop, y validación de que la preview solo queda sticky en escritorio.
- Próximo paso: empezar `feat/domain-model` para definir entidades, estado base del CV y preparar la persistencia local sin mezclar todavía lógica de GitHub ni render dinámico completo.

### [2026-04-09] Cierre de la feature `feat/domain-model`

- Objetivo: definir el núcleo de datos del CV y dejar una estructura inicial estable para las siguientes features.
- Trabajo realizado: se crearon las factories `CandidateProfile`, `Project` y `PortfolioCV`, se añadió `createInitialCVState()` como punto de partida consistente del estado de la app y se conectó temporalmente el modelo desde `js/app.js` para validar la estructura inicial.
- Trabajo realizado por el usuario: implementación del modelo de dominio, preparación del estado inicial, revisión de la salida en consola y apertura de la PR hacia `dev`.
- Trabajo realizado por Codex: revisión del cierre de feature, comprobación del estado real de la PR en GitHub, sincronización de `dev` con el remoto y actualización de la documentación de proyecto para reflejar el nuevo estado del MVP.
- Archivos afectados: `js/models/CandidateProfile.js`, `js/models/Project.js`, `js/models/PortfolioCV.js`, `js/models/createInitialCVState.js`, `js/app.js`, `README.md`, `docs/evidencias.md` y `docs/roadmap.md`.
- Resultado: el proyecto ya no depende solo de una maqueta visual; ahora dispone también de un contrato de datos base del CV con perfil, proyectos y metadatos, listo para soportar persistencia local y evolución posterior.
- Validación: revisión manual del código del modelo, confirmación de que la PR `#2` quedó mergeada en `dev` en GitHub y verificación local de que `dev` incorpora los nuevos archivos del dominio mediante `git pull origin dev`.
- Próximo paso: arrancar `feat/local-storage` para guardar y recuperar el estado del CV desde el navegador sin mezclar aún edición completa ni live preview.

### [2026-04-09] Cierre de la feature `feat/local-storage`

- Objetivo: añadir persistencia mínima del estado del CV en el navegador sin mezclar todavía edición completa ni render dinámico real.
- Trabajo realizado: se creó `CVStorageService` con operaciones de guardado, carga, reset y comprobación de existencia previa, se integró el flujo en `js/app.js`, se evitó que la app destruyera la persistencia en cada carga y se dejaron utilidades mínimas accesibles desde consola para validación manual.
- Trabajo realizado por el usuario: implementación del servicio de `localStorage`, conexión del flujo base en `js/app.js`, revisión visual y funcional de la feature y preparación de la rama para PR posterior hacia `dev`.
- Trabajo realizado por Codex: revisión del diff de la feature, detección y corrección del problema que reseteaba el almacenamiento en cada arranque, restauración de `README.md` internos que se estaban borrando accidentalmente, y actualización de la documentación de proyecto para reflejar el nuevo estado de la rama.
- Archivos afectados: `js/services/CVStorageService.js`, `js/app.js`, `js/models/README.md`, `js/services/README.md`, `README.md`, `docs/evidencias.md` y `docs/roadmap.md`.
- Resultado: el proyecto ya puede guardar y recuperar un estado base del CV en `localStorage`, manteniendo una estructura normalizada y preparada para que la siguiente feature conecte edición real sobre persistencia existente.
- Validación: revisión manual del servicio y del punto de entrada, comprobación de que la rama queda limpia salvo los cambios esperados y verificación sintáctica prevista antes del push final.
- Próximo paso: arrancar `feat/editor-profile` para editar datos reales del candidato sobre el estado persistido y preparar la conexión posterior con la preview.

### [2026-04-09] Cierre de la feature `feat/editor-profile`

- Objetivo: permitir edición manual real de los datos principales del CV, conectando el formulario con el estado persistido.
- Trabajo realizado: se montó el formulario de perfil en `index.html`, se añadieron estilos específicos y feedback visual en `styles/main.css`, se creó `ProfileEditor.js` para rellenar, leer y enviar el formulario, y se conectó `js/app.js` con la persistencia existente para cargar, guardar y rehidratar el perfil.
- Trabajo realizado por el usuario: implementación del formulario, ajuste de estilos, conexión del módulo UI y validación manual del flujo de guardado, recarga y feedback visual.
- Trabajo realizado por Codex: revisión del working tree real de la rama, restauración de `README.md` borrados accidentalmente, verificación sintáctica de `js/app.js` y `js/ui/ProfileEditor.js`, y actualización de la documentación de cierre.
- Archivos afectados: `index.html`, `styles/main.css`, `js/ui/ProfileEditor.js`, `js/app.js`, `README.md`, `docs/evidencias.md` y `docs/roadmap.md`.
- Resultado: el proyecto ya permite editar manualmente el perfil principal del candidato, guardar los cambios en `localStorage` y rehidratar el formulario al recargar, dejando una base clara para conectar la preview en la siguiente feature.
- Validación: revisión manual del código, verificación de nombres de campos entre HTML y JS, comprobación sintáctica con `node --check` y confirmación de que el feedback visual permanece oculto cuando está vacío.
- Próximo paso: arrancar `feat/live-preview` para reflejar en tiempo real los cambios del perfil en la vista previa del CV.

### [2026-04-11] Cierre de la feature `feat/live-preview`

- Objetivo: conectar la edición del perfil con una vista previa recruiter-friendly que responda en tiempo real sin romper la persistencia existente.
- Trabajo realizado: se creó `PreviewRenderer.js` para renderizar nombre, titular y resumen del perfil, se amplió `ProfileEditor.js` para emitir cambios mientras el usuario escribe, y se conectó `js/app.js` para mantener sincronizados editor, preview y `localStorage` sin mezclar responsabilidades.
- Trabajo realizado por el usuario: implementación del renderizador de preview, conexión del flujo `editor -> estado -> preview`, ajuste del HTML de la tarjeta de vista previa y validación manual del comportamiento durante escritura y guardado.
- Trabajo realizado por Codex: revisión del cierre funcional de la feature, comprobación de coherencia entre módulos y actualización de la documentación del proyecto para dejar el estado del MVP alineado con lo ya implementado.
- Archivos afectados: `index.html`, `js/ui/PreviewRenderer.js`, `js/ui/ProfileEditor.js`, `js/app.js`, `README.md`, `docs/roadmap.md` y `docs/evidencias.md`.
- Resultado: el proyecto ya muestra en la preview los datos principales del perfil en tiempo real, mantiene fallbacks cuando faltan campos y conserva el flujo de guardado sobre `localStorage` como fuente persistente.
- Validación: revisión manual del código y del flujo de interfaz, comprobación de sincronización entre editor y preview, y validación sintáctica con `node --check` de `js/app.js`, `js/ui/ProfileEditor.js` y `js/ui/PreviewRenderer.js`.
- Próximo paso: arrancar `feat/github-integration` para consultar datos públicos básicos desde GitHub sin sustituir la edición manual ya disponible.

### [2026-04-11] Cierre de la feature `feat/github-integration`

- Objetivo: enriquecer el CV con una integración pública básica de GitHub sin romper el flujo manual ya existente del perfil.
- Trabajo realizado: se añadió un bloque independiente para búsqueda de usuario GitHub, se creó `GitHubProfileService.js` para consultar perfil y repositorios públicos, se implementó `GitHubIntegration.js` para renderizar perfil, candidatos y selección manual, y se conectó `js/app.js` para persistir `githubUsername` y proyectos derivados de repositorios seleccionados dentro del estado actual del CV.
- Trabajo realizado por el usuario: implementación del bloque GitHub en HTML y CSS, construcción del servicio y del módulo UI, validación manual del flujo de búsqueda y selección, y cierre del ajuste visual del empty-state para que responda correctamente al atributo `hidden`.
- Trabajo realizado por Codex: auditoría del flujo de carga y rehidratación, identificación de la causa raíz del empty-state visible, aplicación del fix mínimo en estilos, revisión de coherencia visual de la feature y actualización de la documentación de cierre.
- Archivos afectados: `index.html`, `styles/main.css`, `js/app.js`, `js/ui/GitHubIntegration.js`, `js/services/GitHubProfileService.js`, `README.md`, `docs/roadmap.md` y `docs/evidencias.md`.
- Resultado: el proyecto ya puede consultar datos públicos de GitHub, mostrar perfil y repositorios candidatos, permitir selección manual de repos destacados, persistir esa selección dentro del estado del CV y rehidratar el bloque de forma coherente dentro del alcance MVP actual.
- Validación: revisión manual del flujo UI, comprobación de que el empty-state GitHub se oculta tras una carga correcta, confirmación de que el badge cambia a `Conectado`, validación del fallback manual cuando la API falla y verificación sintáctica con `node --check` de `js/app.js`, `js/ui/GitHubIntegration.js` y `js/services/GitHubProfileService.js`.
- Próximo paso: arrancar `feat/projects-visualization` para representar de forma más clara en el CV los proyectos ya seleccionados y mejorar la lectura recruiter-friendly del portfolio.
- Orden posterior recomendado: `feat/login-screen` para preparar identidad de usuario sin autenticación externa compleja, `feat/github-project-sources` para ampliar orígenes y atribución de proyectos GitHub, y después `feat/export-pdf-qr`, `feat/polish-accessibility` y `feat/documentacion-final`.

### [2026-04-11] Cierre de la feature `feat/projects-visualization`

- Objetivo: mejorar la lectura y visualización de proyectos dentro del CV, aprovechando la selección GitHub ya persistida como base del bloque de proyectos.
- Trabajo realizado: se adaptó la preview para incluir un contenedor dinámico de proyectos, se amplió `PreviewRenderer.js` para renderizar cards desde `cvState.projects`, se priorizaron proyectos marcados como `featured`, se añadió un empty-state específico y se incorporaron estilos para nombre, descripción, stack y enlaces.
- Trabajo realizado por el usuario: implementación y validación visual del bloque de proyectos en la preview, revisión manual del resultado recruiter-friendly y comprobación de que la selección GitHub ya persistida se refleja correctamente en el CV.
- Trabajo realizado por Codex: revisión del estado real de la base tras la integración completa de GitHub en `dev`, validación de que la preview ya no dependía de contenido estático, comprobación del cumplimiento de objetivos de la feature y actualización de la documentación de cierre.
- Archivos afectados: `index.html`, `styles/main.css`, `js/ui/PreviewRenderer.js`, `README.md`, `docs/roadmap.md`, `docs/evidencias.md` y `docs/EXPERTECH_contexto_actualizado.md`.
- Resultado: el proyecto ya representa proyectos destacados dentro de la preview con una presentación más clara para recruiters, reutilizando el estado persistido del CV y manteniendo separación limpia entre datos, selección GitHub y render visual.
- Validación: revisión visual manual de la preview con varios proyectos, comprobación de cards con nombre, descripción, stack y enlaces, verificación del empty-state específico y comprobación sintáctica con `node --check js/ui/PreviewRenderer.js`.
- Próximo paso: arrancar `feat/login-screen` para preparar una pantalla de acceso clara y una base de identidad de usuario sin introducir todavía autenticación externa compleja.

### [2026-04-11] Cierre funcional de `feat/login-screen` y consolidación del runtime

- Objetivo: añadir una pantalla de acceso `login/register` para el MVP, introducir una capa básica de identidad local y reducir la responsabilidad de `app.js` mediante una organización más clara de la aplicación.
- Trabajo realizado: se implementó una auth local básica con registro y login por email + contraseña, persistencia de usuarios y sesión en `localStorage`, restauración automática de sesión al recargar y logout visible dentro de la app autenticada. Además, se extrajeron templates de UI para auth, preview y bloque GitHub, se creó la carpeta `js/application/` y se movió la orquestación principal a `AppRuntime.js` y `AuthenticatedCVApp.js`.
- Trabajo realizado por el usuario: implementación del flujo `login/register/logout`, refactor del arranque general de la app, extracción de templates reutilizables y adaptación de los módulos existentes para trabajar con roots más limpios en `index.html`.
- Trabajo realizado por Codex: auditoría del estado real de la rama, detección de incoherencias documentales frente al código, validación mínima de sintaxis de los nuevos módulos y actualización de la documentación viva del proyecto para reflejar el estado actual del MVP.
- Archivos afectados: `index.html`, `js/app.js`, `js/application/AppRuntime.js`, `js/application/AuthenticatedCVApp.js`, `js/services/AuthStorageService.js`, `js/ui/AuthScreen.js`, `js/ui/AuthScreenTemplate.js`, `js/ui/PreviewTemplate.js`, `js/ui/GitHubBlockTemplate.js`, `README.md`, `docs/roadmap.md`, `docs/evidencias.md` y `docs/EXPERTECH_contexto_actualizado.md`.
- Resultado: el proyecto ya obliga a pasar por una pantalla de acceso local antes de entrar a la app principal, mantiene sesión activa entre recargas, conserva el flujo del CV una vez autenticado y presenta una arquitectura más clara para evolucionar después hacia backend y PostgreSQL.
- Validación: lectura del flujo implementado en runtime y auth, verificación de que Google y GitHub solo muestran mensajes informativos en esta fase, y comprobación sintáctica con `node --check` de `js/app.js`, `js/application/AppRuntime.js`, `js/application/AuthenticatedCVApp.js`, `js/ui/AuthScreen.js` y `js/services/AuthStorageService.js`.
- Próximo paso: arrancar `feat/github-project-sources` para ampliar la atribución y el origen de proyectos GitHub sin mezclar todavía OAuth real ni backend.

### [2026-04-11] Avance funcional de `feat/github-project-sources`

- Objetivo: añadir trazabilidad mínima a los proyectos importados desde GitHub y evitar la confusión del proyecto demo legado en la preview.
- Trabajo realizado: se amplió la normalización de repositorios GitHub para conservar datos básicos de origen, se extendió el modelo `Project` con metadatos mínimos de trazabilidad, se adaptó la transformación GitHub -> proyectos del CV para persistir ese origen, se añadió una línea visual compacta de origen en la preview y se retiró la siembra de proyectos demo nuevos. Además, se incorporó una limpieza de migración en `CVStorageService` para eliminar el proyecto demo legado `EXPERTECH CV` cuando coincide exactamente con la semilla antigua.
- Trabajo realizado por el usuario: validación visual de la línea de origen en la preview, confirmación de que los proyectos manuales siguen diferenciándose de los importados y comprobación manual del comportamiento al seleccionar y deseleccionar repositorios desde el bloque GitHub.
- Trabajo realizado por Codex: auditoría del flujo de estado para distinguir dato demo de bug real, implementación del fix mínimo sobre el estado inicial y `localStorage`, refuerzo del fallback visual de origen y validación sintáctica de los módulos tocados.
- Archivos afectados: `js/services/GitHubProfileService.js`, `js/models/Project.js`, `js/application/AuthenticatedCVApp.js`, `js/ui/PreviewRenderer.js`, `js/services/CVStorageService.js`, `styles/main.css`, `README.md`, `docs/roadmap.md`, `docs/evidencias.md`, `docs/EXPERTECH_contexto_actualizado.md` y `docs/architecture-notes.md`.
- Resultado: los proyectos importados desde GitHub ya conservan una trazabilidad básica visible en la preview, los proyectos manuales siguen protegidos y el bloque de proyectos vuelve al empty-state cuando no hay proyectos reales ni selección GitHub activa.
- Validación: revisión manual de la preview con proyectos GitHub y manuales, comprobación de que al deseleccionar todos los repos ya no queda el proyecto demo `EXPERTECH CV`, y comprobación sintáctica con `node --check` de `js/services/GitHubProfileService.js`, `js/application/AuthenticatedCVApp.js`, `js/ui/PreviewRenderer.js` y `js/services/CVStorageService.js`.
- Próximo paso: arrancar `feat/export-pdf-qr` o iterar sobre el perfil híbrido.

### [2026-04-12] Implementación de Avatar Híbrido y Vista Local Web

- Objetivo: añadir soporte para avatares (sincronizados desde GitHub o subidos localmente con resize por canvas) y crear una vista local adicional (`public.html`) preparada para una futura publicación compartible.
- Trabajo realizado: se implementó un sistema híbrido que prioriza imágenes subidas localmente (redimensionadas vía canvas para no saturar `localStorage`), luego URL manual externa y finalmente de GitHub. También se creó `public.html` con su respectivo `PublicCVRenderer.js` reutilizando el motor de `PreviewRenderer` para montar una versión navegable y responsiva idéntica a la vista previa del dashboard, apoyada en el mismo estado persistido del navegador.
- Archivos afectados: `index.html`, `public.html`, `styles/main.css`, `js/application/AuthenticatedCVApp.js`, `js/models/CandidateProfile.js`, `js/ui/ProfileEditor.js`, `js/ui/PublicCVRenderer.js`.
- Resultado: el usuario puede elegir cómo gestionar su avatar y revisar su CV desde una vista local separada, útil para preparar una futura experiencia compartible cuando exista persistencia/publicación real fuera de `localStorage`.
- Validación: comprobada la sincronización correcta de la imagen local redimensionada en el preview interactivo y la correcta renderización visual del `public.html` utilizando el mismo estilo base de previsualización.
- Próximo paso: cerrar `feat/export-pdf-qr` y abrir `feat/github-pages-public-preview` para simular una publicación real con GitHub Pages y QR de demo sin mezclar todavía backend ni base de datos.

### [2026-04-12] Cierre funcional de `feat/github-pages-public-preview`

- Objetivo: transformar la vista pública local en una demo estática preparada para evolucionar a GitHub Pages sin depender del `localStorage` del editor.
- Trabajo realizado: se creó un runtime público modular con `js/public.js` y `js/application/PublicPageRuntime.js`, se añadió `js/services/PublicCVDataService.js` para cargar un snapshot estático desde `data/public-cv.json` y se adaptó `PublicCVRenderer.js` para renderizar la demo pública a partir de ese estado. Además, se pulió `public.html` para que la página se sintiera más cercana a una publicación real: avatar visible, hero más limpia, card propia de tecnologías con iconos y documento central sin helper copy de app.
- Trabajo realizado por el usuario: revisión visual iterativa de la demo pública, validación del encaje del avatar, ajuste del contenido del snapshot público y decisión de orientar la siguiente fase hacia una publicación real con GitHub Pages.
- Trabajo realizado por Codex: desacople de la demo respecto a `localStorage`, creación de la capa modular pública, preparación del snapshot `public-cv.json`, pulido de copy y jerarquía visual, y alineación de la documentación viva con el nuevo estado del proyecto.
- Archivos afectados: `public.html`, `index.html`, `js/public.js`, `js/application/PublicPageRuntime.js`, `js/services/PublicCVDataService.js`, `js/ui/PublicCVRenderer.js`, `data/public-cv.json`, `README.md`, `docs/roadmap.md`, `docs/evidencias.md`, `docs/EXPERTECH_contexto_actualizado.md` y `docs/architecture-notes.md`.
- Resultado: el proyecto ya dispone de una demo pública estática, modular y coherente visualmente, con datos propios del CV y preparada para pasar a una URL pública real mediante GitHub Pages.
- Validación: comprobación sintáctica con `node --check js/public.js`, `node --check js/application/PublicPageRuntime.js`, `node --check js/services/PublicCVDataService.js` y `node --check js/ui/PublicCVRenderer.js`; revisión manual del hero, avatar, tecnologías con iconos y proyectos visibles en `public.html`.
- Próximo paso: abrir PR de `feat/github-pages-public-preview` contra `dev`, revisar el diff final y, tras el merge, activar GitHub Pages y preparar el QR apuntando a la URL publicada.

### [2026-04-12] Cierre funcional de `feat/jooble-search-proxy-mvp` (Integración proxy real)

- Objetivo: implementar el bloque de búsqueda de empleo conectado a una API real (Jooble) a través de un proxy local, sin exponer credenciales en el frontend y con soporte total a degradación elegante (Fallback Mode).
- Trabajo realizado: se iteró sobre la base de la feature de InfoJobs para apuntar definitivamente al backend de Jooble. Se consolidó el proxy Express en `server/server.js`, y durante las pruebas se depuró un error 403 modificando la URL correcta hacia `es.jooble.org`. Adicionalmente, se escribió una lógica robusta en el Frontend (`JobSearchIntegration.js` y `JobOffersService.js`) que logra atrapar cualquier caída de la API devolviendo resultados de Mock locales acompañados de un Warning en UI debajo del botón, para que el usuario nunca perciba una rotura total.
- Trabajo realizado por el usuario: validación iterativa del entorno local, inyección de la llave Jooble en .env, comprobación del flujo real (Status 200) tras las correcciones de dominio.
- Trabajo realizado por Codex: migración completa de la lógica desde InfoJobs a Jooble, investigación y fix del error de WAF cambiando a dominio regional `es.jooble.org`, flexibilización del CORS local, creación del sistema de degradación elegante y actualización de la bitácora técnica.
- Archivos afectados: `js/application/AuthenticatedCVApp.js`, `js/ui/JobSearchBlockTemplate.js`, `js/ui/JobSearchIntegration.js`, `js/services/JobOffersService.js`, `server/server.js`, `server/services/JoobleProxyService.js`, `server/README.md`, `server/.env.example`, `server/package.json`, `.gitignore`, `README.md`, `docs/roadmap.md` y `docs/evidencias.md`.
- Resultado: el buscador web es capaz de alimentarse en 100% de datos reales desde una API remota a través de un backend local actuando de proxy ciego. Si el backend falla o la Key caduca, la UI resiste de forma autónoma degradando al escenario estático Mock con su propio aviso visual en color naranja, permitiendo demostrar en la práctica el principio Clean Architecture de separación de responsabilidades.
- Validación: ejecución en el servidor local de Node.js mediante fetch real a la API, recibiendo payload `{ jobs: [...] }`. Validado en local que el click sobre un link redirige exitosamente a la oferta de su origen.
- Próximo paso: cerrar PR de la feature `feat/jooble-search-proxy-mvp` sobre `dev` y mover el foco de desarrollo hacia las próximas piezas, como la generación final del CV (Exportar PDF) que clausura el MVP.
