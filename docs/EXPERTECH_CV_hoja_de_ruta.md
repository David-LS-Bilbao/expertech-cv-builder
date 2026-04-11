# EXPERTECH CV · Hoja de ruta del proyecto

## 1. Propósito

Esta hoja de ruta define el plan de ejecución de **EXPERTECH CV** como proyecto del módulo de JavaScript del bootcamp y como base evolutiva de la iniciativa **EXPERTECH**.

Nota documental:

- este archivo se mantiene como hoja de ruta amplia y referencia estratégica
- para el estado operativo real del repositorio conviene usar primero `README.md`, `docs/roadmap.md` y `docs/evidencias.md`

La visión global del producto es:

- **EXPERTECH CV**: generador de currículum web interactivo para perfiles tech.
- **EXPERTECH JOB**: evolución futura con backend, base de datos y funcionalidades para recruiters.

El alcance de esta fase se alinea con el objetivo actual del repositorio: construir una primera versión funcional que permita estructurar, editar y presentar un CV digital de forma sencilla, dejando una base sólida para futuras mejoras.

---

## 2. Estrategia de ramas

### Ramas base
- `main` → rama estable y publicable.
- `dev` → rama de integración.
- `feature/*` → ramas de trabajo por funcionalidad.

### Regla de trabajo
1. `main` crea y protege la base estable.
2. `dev` parte de `main`.
3. Cada `feature/*` parte de `dev`.
4. Cada feature se implementa, valida y documenta en su rama.
5. Al terminar una feature:
   - merge a `dev`
   - validación de integración
   - actualización de roadmap o documentación si aplica
6. Solo cuando un bloque funcional esté estable, `dev` se integra en `main`.

### Convención de nombres
- `feature/project-setup`
- `feature/layout-base`
- `feature/domain-model`
- `feature/local-storage`
- `feature/editor-profile`
- `feature/live-preview`
- `feature/github-integration`
- `feature/projects-visualization`
- `feature/login-screen`
- `feature/github-project-sources`
- `feature/export-pdf-qr`
- `feature/polish-accessibility`
- `feature/documentacion-final`

---

## 3. Reglas de ejecución por feature

Cada feature se trabajará en un chat separado, con este flujo:

### Entrada del chat
- enlace al repo
- esta hoja de ruta
- objetivo exacto de la feature
- rama de trabajo
- estado actual del proyecto
- restricciones de alcance

### Salida esperada del chat
- plan breve de implementación
- checklist de validación
- estructura o cambios esperados
- criterios de aceptación
- riesgos y límites
- informe final de cierre de feature

### Regla importante
Cada chat debe centrarse **solo en la feature activa**. No debe abrir trabajo de otras features salvo dependencias mínimas claramente justificadas.

---

## 4. Objetivo funcional del MVP JavaScript

Construir una aplicación web que permita a un perfil tech:

- introducir y editar sus datos profesionales
- importar información básica desde GitHub
- seleccionar proyectos relevantes
- visualizar un CV web interactivo en tiempo real
- guardar el estado en `localStorage`
- exportar un resumen en PDF
- generar una presentación clara para recruiters

### Qué no entra en este MVP
- autenticación real
- base de datos
- panel recruiter multiusuario
- buscador real de candidatos
- URLs públicas persistentes por usuario
- backend
- Docker
- despliegue full-stack

---

## 5. Roadmap del MVP actual (módulo JavaScript)

## Feature 0 · Preparación del proyecto

### Rama
- `feature/project-setup`

### Objetivo
Dejar una base limpia de proyecto, estructura de carpetas, documentación mínima y flujo Git preparado.

### Alcance
- estructura inicial de carpetas
- `.gitignore`
- `README.md` base
- carpeta `docs/`
- normalización del arranque del proyecto
- validación del flujo `main` → `dev` → `feature/*`

### Entregables
- repositorio base ordenado
- roadmap añadido al proyecto
- criterios de trabajo definidos

### Criterio de cierre
El repo se puede clonar, entender y arrancar como base de trabajo sin ambigüedad.

---

## Feature 1 · Layout base y arquitectura visual

### Rama
- `feature/layout-base`

### Objetivo
Construir la maqueta base del producto con enfoque editor + preview.

### Sprint 1.1 · Estructura visual inicial
- layout principal
- cabecera
- columna de edición
- columna de vista previa
- zonas reservadas para perfil, proyectos y exportación

### Sprint 1.2 · Responsive base
- adaptación móvil/tablet/escritorio
- jerarquía visual clara
- estructura limpia sin lógica compleja todavía

### Entregables
- HTML semántico base
- CSS base del layout
- estructura visual navegable

### Criterio de cierre
La app se entiende visualmente y la arquitectura UI está preparada para conectar la lógica.

---

## Feature 2 · Modelo de dominio y persistencia local

### Rama
- `feature/domain-model`
- `feature/local-storage`

### Objetivo
Definir el núcleo de datos del proyecto y dejar listo el almacenamiento local.

### Sprint 2.1 · Modelo de dominio
Entidades previstas:
- `CandidateProfile`
- `Project`
- `PortfolioCV`

Servicios previstos:
- `StorageService`

### Sprint 2.2 · Persistencia local
- guardar estado del CV
- recuperar datos al recargar
- reset controlado
- estructura estable de datos

### Entregables
- contrato de datos definido
- estructura lista para evolución
- persistencia real en `localStorage`

### Criterio de cierre
El proyecto mantiene datos al refrescar y la estructura es consistente.

---

## Feature 3 · Editor del perfil y formularios dinámicos

### Rama
- `feature/editor-profile`

### Objetivo
Permitir que el usuario edite la información principal del CV desde la interfaz.

### Sprint 3.1 · Datos base del perfil
- nombre
- rol
- bio o resumen profesional
- email
- teléfono
- ubicación
- LinkedIn
- GitHub

### Sprint 3.2 · Bloques dinámicos del CV
- experiencia
- formación
- skills
- proyectos manuales

### Entregables
- formulario funcional
- validaciones básicas
- actualización del estado interno

### Criterio de cierre
El usuario puede introducir y editar su información sin recargar la página.

---

## Feature 4 · Vista previa en vivo del CV

### Rama
- `feature/live-preview`

### Objetivo
Reflejar en tiempo real los cambios del editor en una vista recruiter-friendly.

### Sprint 4.1 · Render del CV
- perfil
- resumen
- skills
- proyectos
- experiencia y formación

### Sprint 4.2 · Modo recruiter
- vista más limpia
- ocultar controles de edición
- priorizar lectura rápida y claridad

### Entregables
- preview funcional
- render reactivo manual
- separación clara editor / preview

### Criterio de cierre
Todo cambio relevante se refleja en la preview sin recarga.

---

## Feature 5 · Integración pública básica con GitHub API

### Rama
- `feature/github-integration`

### Objetivo
Traer datos útiles del perfil técnico desde GitHub para enriquecer el CV.

### Sprint 5.1 · Perfil GitHub
- consulta por nombre de usuario
- avatar
- nombre visible
- bio
- enlace al perfil

### Sprint 5.2 · Repositorios y selección
- lista de repositorios públicos
- selección de proyectos a mostrar
- orden básico o filtro sencillo
- manejo de estados: loading, error, no results

### Entregables
- integración con `fetch`
- datos reales pintados en UI
- selección manual de repos destacados

### Criterio de cierre
La app obtiene datos de GitHub y el usuario puede incorporarlos al CV.

### Fuera de alcance en esta feature
- múltiples cuentas GitHub
- repositorios de otros owners o atribución avanzada
- colaboraciones
- OAuth o autenticación GitHub

---

## Feature 6 · Gestión de proyectos y visualización

### Rama
- `feature/projects-visualization`

### Objetivo
Mejorar la lectura del portfolio para recruiters y cumplir el requisito de visualización de datos.

### Sprint 6.1 · Listado y filtros
- filtro por nombre
- filtro por stack o lenguaje
- selección de proyectos destacados

### Sprint 6.2 · Visualización simple
Opciones válidas:
- lista enriquecida
- tabla de proyectos
- contador por tecnologías
- gráfico simple de stacks

### Entregables
- visualización clara de proyectos
- filtro funcional
- jerarquía de información útil para recruiter

### Criterio de cierre
Los proyectos se pueden explorar y entender rápidamente.

---

## Feature 7 · Pantalla de acceso

### Rama
- `feature/login-screen`

### Objetivo
Preparar una pantalla de acceso clara y una base de identidad de usuario dentro del producto sin obligar todavía a resolver autenticación externa compleja.

### Alcance
- pantalla de entrada o acceso
- microcopy claro sobre el valor del producto
- estructura preparada para un futuro flujo de identidad
- separación limpia respecto a la integración GitHub actual

### Entregables
- pantalla de acceso coherente con el producto
- base visual y funcional para la futura identidad de usuario
- documentación clara de límites de esta fase

### Criterio de cierre
El proyecto dispone de una pantalla de acceso comprensible y lista para soportar evolución posterior sin introducir todavía autenticación compleja.

---

## Feature 8 · Fuentes avanzadas de proyectos GitHub

### Rama
- `feature/github-project-sources`

### Objetivo
Ampliar la integración GitHub para soportar mejor varias cuentas, repositorios de otros owners, colaboraciones y atribución clara del origen del proyecto.

### Alcance
- soporte documental y técnico para múltiples orígenes GitHub
- diferenciación entre repos propios y externos
- reglas de atribución del origen del proyecto
- base para ampliación futura sin prometer todavía OAuth

### Entregables
- estrategia clara de orígenes GitHub ampliados
- UI y estado preparados para distinguir fuentes de proyecto
- atribución visible y comprensible dentro del producto

### Criterio de cierre
El sistema puede representar con más claridad de dónde viene cada proyecto GitHub sin depender aún de autenticación avanzada.

---

## Feature 9 · Exportación PDF y QR

### Rama
- `feature/export-pdf-qr`

### Objetivo
Cerrar el caso de uso práctico para entrevista o envío por email.

### Sprint 7.1 · Exportación PDF
- versión resumen de una página
- salida limpia y legible
- enfoque recruiter

### Sprint 7.2 · QR y enlace web
- QR que apunte a la versión publicada
- integración visual en el CV exportable
- mensaje claro de uso

### Entregables
- exportación funcional
- CV resumen descargable
- QR visible y útil

### Criterio de cierre
El usuario puede generar un CV corto presentable con acceso a la versión web.

---

## Feature 10 · Pulido, accesibilidad y estados UX

### Rama
- `feature/polish-accessibility`

### Objetivo
Mejorar robustez, claridad y presentación final del MVP.

### Alcance
- mensajes vacíos y errores
- estados de carga
- responsive final
- revisión visual
- accesibilidad básica
- consistencia de textos

### Opcional si entra en tiempo
- modo oscuro
- pequeñas mejoras estéticas de bajo riesgo

### Entregables
- app más sólida y presentable
- reducción de errores de uso
- mejor experiencia final

### Criterio de cierre
El MVP se puede enseñar y probar con confianza.

---

## Feature 11 · Documentación y entrega

### Rama
- `feature/documentacion-final`

### Objetivo
Dejar el proyecto listo para revisión académica y portfolio.

### Alcance
- `README.md` final
- memoria técnica
- capturas
- bitácora breve de decisiones
- guía de demo
- checklist de entrega

### Entregables
- documentación completa
- explicación técnica del proyecto
- material para presentación

### Criterio de cierre
El proyecto se puede entregar, explicar y defender con claridad.

---

## 6. Orden recomendado de ejecución

1. Feature 0 · Preparación del proyecto
2. Feature 1 · Layout base y arquitectura visual
3. Feature 2 · Modelo de dominio y persistencia local
4. Feature 3 · Editor del perfil y formularios dinámicos
5. Feature 4 · Vista previa en vivo del CV
6. Feature 5 · Integración pública básica con GitHub API
7. Feature 6 · Gestión de proyectos y visualización
8. Feature 7 · Pantalla de acceso
9. Feature 8 · Fuentes avanzadas de proyectos GitHub
10. Feature 9 · Exportación PDF y QR
11. Feature 10 · Pulido, accesibilidad y estados UX
12. Feature 11 · Documentación y entrega

---

## 7. Definition of Done por feature

Una feature se considerará cerrada cuando cumpla:

- objetivo funcional alcanzado
- alcance respetado
- cambios integrados sin romper flujo previo
- validación manual realizada
- checklist de cierre cumplido
- informe final de feature generado
- propuesta clara de siguiente paso

---

## 8. Plantilla de cierre por feature

Cada chat de feature deberá devolver un informe final con:

1. Resumen de lo realizado
2. Archivos afectados
3. Validaciones realizadas
4. Riesgos o deuda pendiente
5. Qué no se ha tocado
6. Recomendación para la siguiente feature

---

## 9. Roadmap de evolución para siguientes módulos del bootcamp

## Fase futura A · Bases de datos

### Objetivo
Persistir currículums, proyectos y configuraciones fuera del navegador.

### Épicas previstas
- `db/schema-design`
- `db/candidate-profile-persistence`
- `db/project-catalog`
- `db/cv-versioning`

### Resultado esperado
- modelo de datos formal
- persistencia real
- base para multiusuario futuro

---

## Fase futura B · Backend

### Objetivo
Convertir EXPERTECH CV en una aplicación con API y preparar la transición a EXPERTECH JOB.

### Épicas previstas
- `backend/api-foundation`
- `backend/authentication`
- `backend/cv-crud`
- `backend/public-profile-routes`
- `backend/recruiter-search-base`

### Resultado esperado
- API para perfiles y CVs
- autenticación de usuario
- rutas públicas y privadas
- base funcional de la futura parte recruiter

---

## Fase futura C · Docker

### Objetivo
Contenerizar frontend, backend y base de datos para entorno reproducible.

### Épicas previstas
- `docker/frontend-container`
- `docker/backend-container`
- `docker/database-container`
- `docker/local-orchestration`

### Resultado esperado
- entorno local consistente
- despliegue más predecible
- base para DevOps

---

## Fase futura D · DevOps

### Objetivo
Desplegar una versión profesional y automatizada del producto.

### Épicas previstas
- `devops/ci-pipeline`
- `devops/cd-staging`
- `devops/production-deploy`
- `devops/monitoring-logging`
- `devops/domain-https`

### Resultado esperado
- integración continua
- despliegue automático
- entorno staging y producción
- observabilidad básica

---

## Fase futura E · EXPERTECH JOB

### Objetivo
Evolucionar de generador de CV a plataforma de visibilidad y búsqueda de talento tech.

### Épicas previstas
- `job/recruiter-dashboard`
- `job/candidate-search`
- `job/filter-by-stack`
- `job/public-candidate-pages`
- `job/matching-and-bookmarks`

### Resultado esperado
- recruiters consultando perfiles
- candidatos accesibles por criterios útiles
- inicio real de la plataforma global `EXPERTECH`

---

## 10. Riesgos principales

### Riesgo 1 · Alcance excesivo
Querer construir EXPERTECH CV y EXPERTECH JOB a la vez.

### Riesgo 2 · Mezcla de responsabilidades
No separar datos, servicios y UI.

### Riesgo 3 · Dependencia excesiva de GitHub API
La integración debe enriquecer el CV, no bloquear todo el proyecto.

### Riesgo 4 · Sobrepeso visual prematuro
Primero funcionalidad, luego refinado visual.

### Riesgo 5 · Documentación al final
La documentación debe construirse durante el proceso, no solo al cierre.

---

## 11. Regla de trabajo acordada

A partir de esta hoja de ruta:

1. se abrirá un chat específico por feature
2. ese chat trabajará solo sobre la rama y alcance asignados
3. al cerrar la feature devolverá un informe final
4. ese informe se validará en el chat maestro
5. solo entonces se pasará a la siguiente feature

---

## 12. Resumen ejecutivo

La primera meta no es construir toda la plataforma EXPERTECH, sino cerrar un **MVP fuerte y defendible de EXPERTECH CV** que:

- cumpla el proyecto del módulo JavaScript
- sea presentable en revisión académica
- se pueda enseñar en portfolio
- sirva como base real para módulos posteriores de bases de datos, backend, Docker y DevOps

La hoja de ruta queda dividida en features pequeñas o medianas, con sprints internos cuando la complejidad lo requiere, para mantener control de alcance, calidad y trazabilidad.
