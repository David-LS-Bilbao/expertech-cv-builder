# CONTEXTO ACTUALIZADO · EXPERTECH CV

## Propósito del documento

Este archivo sustituye al antiguo informe maestro como **contexto operativo principal** para abrir nuevos chats de feature.

Su función es reflejar el **estado real y actual** del proyecto, evitando contradicciones entre la visión inicial y la implementación ya realizada.

---

## 1. Estado real del proyecto

**Proyecto:** EXPERTECH CV  
**Marca paraguas:** EXPERTECH  
**Tipo de proyecto actual:** MVP frontend en JavaScript para bootcamp  
**Estado actual:** base funcional del CV ya construida, con perfil editable, preview reactiva e integración pública básica con GitHub.

Según la documentación operativa vigente del proyecto, la fase ya cerrada más reciente es `feat/github-integration` y el siguiente paso natural es `feat/projects-visualization`. El proyecto ya cuenta con layout real, persistencia en `localStorage`, formulario funcional del perfil, preview sincronizada y enriquecimiento del CV con datos públicos de GitHub y repositorios seleccionados manualmente.

---

## 2. Qué ya está resuelto

### 2.1. Base del proyecto
- repositorio consolidado
- flujo Git con `main`, `dev` y ramas `feat/*`
- remoto SSH configurado
- documentación base y documentación viva disponibles
- estructura de carpetas estable
- base HTML/CSS/JS conectada correctamente

### 2.2. Layout y UX base
- pantalla principal real ya construida
- enfoque mobile-first aplicado
- adaptación desktop aplicada
- disposición `editor` izquierda / `preview` derecha en escritorio
- `preview` sticky solo en desktop
- estados vacíos, helper notes, badges y microcopy añadidos

### 2.3. Modelo de dominio
- `CandidateProfile`
- `Project`
- `PortfolioCV`
- `createInitialCVState()`

### 2.4. Persistencia
- servicio `CVStorageService.js`
- guardado en `localStorage`
- carga y rehidratación del estado
- reset controlado
- actualización de `lastUpdated`
- utilidades mínimas de depuración

### 2.5. Perfil editable
- formulario de perfil funcional
- rehidratación al recargar
- feedback visual de guardado

### 2.6. Live preview
- render reactivo de:
  - `fullName`
  - `headline`
  - `summary`
- sincronización editor → preview
- fallbacks visuales
- control de `empty-state`

### 2.7. Integración pública básica con GitHub
- búsqueda manual de perfil público
- carga de datos básicos del perfil público:
  - `login`
  - `name`
  - `avatar_url`
  - `bio`
  - `html_url`
- carga de repositorios públicos candidatos
- selección y deselección manual de repositorios
- persistencia de proyectos derivados de selección GitHub
- rehidratación básica del bloque GitHub al recargar
- mantenimiento del flujo manual como fallback si la API falla

---

## 3. Qué NO está resuelto todavía

A día de hoy siguen fuera de alcance o pendientes:

- visualización recruiter-friendly consolidada de proyectos
- exportación PDF
- QR al CV
- accesibilidad más profunda
- login real
- backend
- base de datos
- múltiples cuentas GitHub
- atribución avanzada de autoría o colaboración
- panel recruiter real
- sharing persistente multiusuario

---

## 4. Fuente de verdad actual

A partir de este punto, la fuente principal de verdad del proyecto debe ser:

1. el repositorio actual
2. `docs/roadmap.md`
3. `docs/EXPERTECH_CV_hoja_de_ruta.md`
4. `docs/evidencias.md`
5. el informe final de la última feature cerrada
6. `README.md` como resumen general, no como única referencia operativa

### Importante
El archivo `EXPERTECH_informe_maestro.md` inicial **ya no debe usarse como documento operativo principal**.

Ese documento se conserva solo como:
- visión estratégica inicial
- explicación de marca y roadmap largo
- referencia de producto futuro (`EXPERTECH JOB`)

---

## 5. Estado documental detectado

### README
El `README.md` puede quedarse desalineado temporalmente respecto al estado real del repo o del roadmap operativo.

Por eso conviene usarlo como resumen general del proyecto, pero no como única referencia para decidir la siguiente feature.

### Roadmap
`docs/roadmap.md` y `docs/EXPERTECH_CV_hoja_de_ruta.md` deben marcar el orden operativo real de las siguientes features.

### Regla recomendada
Antes de abrir cada nuevo chat de feature:
- revisar `README.md`
- revisar `docs/roadmap.md`
- revisar `docs/EXPERTECH_CV_hoja_de_ruta.md`
- revisar el informe de la última feature cerrada
- usar este documento como contexto operativo de arranque

---

## 6. Siguiente feature recomendada

## `feat/projects-visualization`

### Motivo
La arquitectura ya permite:
- editar perfil
- previsualizar perfil
- enriquecer con GitHub
- seleccionar repositorios
- persistir proyectos

Por tanto, el siguiente paso lógico no es añadir más fuentes ni login, sino **hacer visible y útil para recruiters la selección actual de proyectos**.

### Objetivo funcional
Reflejar de forma más clara en el CV los proyectos ya seleccionados, mejorar su lectura para recruiters y consolidar la parte visual del portfolio.

### Qué debería incluir
- mejorar el bloque “Proyectos destacados”
- representar proyectos seleccionados en preview o bloque visual equivalente
- mostrar con claridad:
  - nombre
  - descripción
  - stack
  - repo
  - demo si existe
- contemplar estados:
  - sin proyectos
  - un proyecto
  - varios proyectos
- mantener consistencia entre:
  - estado del CV
  - selección GitHub
  - persistencia
  - render visual

### Qué no debería incluir
- login screen
- múltiples cuentas GitHub
- nuevas fuentes GitHub complejas
- exportación PDF/QR
- rediseño completo del producto
- backend o auth

---

## 7. Riesgos actuales del proyecto

### Riesgo 1
Mezclar demasiadas responsabilidades en una sola feature.

**Mitigación:** mantener features pequeñas y enfocadas.

### Riesgo 2
Usar documentación vieja como si fuera estado actual.

**Mitigación:** apoyarse en repo + README + evidencias + informe más reciente.

### Riesgo 3
Hacer visualizaciones bonitas pero poco útiles para recruiters.

**Mitigación:** priorizar lectura rápida, claridad y valor comunicativo.

### Riesgo 4
Romper persistencia o selección GitHub al tocar proyectos.

**Mitigación:** la siguiente feature debe apoyarse en el estado actual, no reinventarlo.

---

## 8. Orden recomendado a partir de ahora

1. `feat/projects-visualization`
2. `feat/login-screen`
3. `feat/github-project-sources`
4. `feat/export-pdf-qr`
5. `feat/polish-accessibility`
6. `feat/documentacion-final`

### Nota
El siguiente paso inmediato sigue siendo `feat/projects-visualization`, pero el orden posterior debe mantenerse coherente con el roadmap operativo actual del proyecto.

---

## 9. Qué pasar a los próximos chats de feature

### Contexto principal
- URL del repo
- `README.md`
- `docs/roadmap.md`
- `docs/evidencias.md`
- informe de la última feature cerrada
- este documento: `EXPERTECH_contexto_actualizado.md`

### Contexto secundario opcional
- `EXPERTECH_informe_maestro.md` solo como visión estratégica
- mockups o capturas
- checklist de progreso

---

## 10. Decisión operativa

A partir de ahora, este documento debe servir como:

- **contexto puente**
- **estado operativo actualizado**
- **base de arranque para nuevos chats de feature**
- **referencia para validar coherencia entre roadmap y repo**

No sustituye a la documentación viva del repositorio, pero sí evita depender de un informe maestro inicial que ya no representa el estado actual del producto.

---

## 11. Resumen corto para apertura de chats

**EXPERTECH CV** ya dispone de:
- layout base
- dominio
- persistencia
- editor de perfil
- live preview
- integración pública básica con GitHub

El siguiente paso natural es:

**`feat/projects-visualization`**

porque ahora toca convertir la selección actual de proyectos en una representación visual clara, recruiter-friendly y coherente con el resto del CV.
