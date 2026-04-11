# CONTEXTO ACTUALIZADO · EXPERTECH CV

## Propósito del documento

Este archivo sustituye al antiguo informe maestro como **contexto operativo principal** para abrir nuevos chats de feature.

Su función es reflejar el **estado real y actual** del proyecto, evitando contradicciones entre la visión inicial y la implementación ya realizada.

---

## 1. Estado real del proyecto

**Proyecto:** EXPERTECH CV  
**Marca paraguas:** EXPERTECH  
**Tipo de proyecto actual:** MVP frontend en JavaScript para bootcamp  
**Estado actual:** base funcional del CV ya construida, con auth local básica para MVP, perfil editable, preview reactiva, integración pública básica con GitHub, visualización dinámica de proyectos, trazabilidad mínima del origen importado y una primera salida de impresión más cuidada para exportación.

Según la base actual del repositorio, la rama activa pasa a ser `feat/export-pdf-qr`. El proyecto ya cuenta con layout real, auth local de demostración, persistencia en `localStorage`, formulario funcional del perfil, preview sincronizada, enriquecimiento del CV con datos públicos de GitHub, render recruiter-friendly de proyectos seleccionados, avatar híbrido y una vista local adicional (`public.html`) preparada para una futura publicación compartible.

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

### 2.5. Auth local MVP
- pantalla de acceso `login/register`
- registro con email + contraseña
- login con email + contraseña
- persistencia de usuarios y sesión en `localStorage`
- restauración de sesión al recargar
- logout visible y funcional
- botones de Google y GitHub solo como preparación visual del siguiente MVP
- sin OAuth real ni autenticación segura de producción

### 2.6. Perfil editable
- formulario de perfil funcional
- rehidratación al recargar
- feedback visual de guardado

### 2.7. Live preview
- render reactivo de:
  - `fullName`
  - `headline`
  - `summary`
- sincronización editor → preview
- fallbacks visuales
- control de `empty-state`

### 2.8. Integración pública básica con GitHub
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

### 2.9. Visualización de proyectos
- bloque de proyectos de la preview ya preparado para render dinámico
- cards de proyecto conectadas a `cvState.projects`
- priorización de proyectos marcados como `featured`
- visualización de:
  - nombre
  - descripción
  - stack
- enlaces disponibles
- empty-state específico cuando no hay proyectos visibles

### 2.10. Trazabilidad básica de proyectos GitHub
- persistencia de metadatos mínimos del origen del proyecto importado
- línea visual compacta en preview tipo `GitHub · owner/repo`
- fallback seguro cuando faltan datos de origen
- limpieza del proyecto demo legado para que no reaparezca al quitar toda la selección GitHub

---

## 3. Qué NO está resuelto todavía

A día de hoy siguen fuera de alcance o pendientes:

- exportación PDF
- QR al CV
- accesibilidad más profunda
- auth real o segura de producción
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
2. `README.md`
3. `docs/roadmap.md`
4. `docs/evidencias.md`
5. el informe final de la última feature cerrada

### Importante
El archivo `EXPERTECH_informe_maestro.md` inicial **ya no debe usarse como documento operativo principal**.

Ese documento se conserva solo como:
- visión estratégica inicial
- explicación de marca y roadmap largo
- referencia de producto futuro (`EXPERTECH JOB`)

---

## 5. Estado documental detectado

### README
El `README.md` debe reflejar:
- `feat/export-pdf-qr` como rama activa
- la auth local MVP ya cerrada
- que `public.html` es una vista local adicional, no una URL pública real todavía

### Roadmap
`docs/roadmap.md` puede quedar desalineado en algunos momentos respecto al README o al estado real del repo.

### Regla recomendada
Antes de abrir cada nuevo chat de feature:
- revisar `README.md`
- revisar `docs/roadmap.md`
- revisar el informe de la última feature cerrada
- usar este documento como contexto operativo de arranque

---

## 6. Feature activa recomendada

## `feat/export-pdf-qr`

### Motivo
La arquitectura ya permite:
- acceso local al producto
- editar perfil
- previsualizar perfil
- enriquecer con GitHub
- seleccionar repositorios
- persistir proyectos
- representarlos visualmente en la preview
- preparar una salida de impresión específica
- mostrar una vista local adicional del CV

Por tanto, el trabajo actual ya no consiste en construir login básico ni en ampliar la trazabilidad GitHub, sino en **cerrar una salida PDF más presentable y dejar preparada una vista local adicional del CV sin mezclar todavía backend, base de datos ni publicación real**.

### Objetivo funcional
Permitir una exportación más clara para recruiters y dejar lista una vista local separada que más adelante pueda evolucionar a experiencia compartible cuando exista persistencia/publicación real fuera de `localStorage`.

### Qué ya cubre en su slice actual
- renderer específico de impresión
- sincronización del borrador visible con la exportación PDF
- soporte de avatar híbrido con imagen local optimizada y fallback GitHub
- `public.html` como vista local adicional apoyada en el estado persistido del navegador

### Qué sigue pendiente dentro del área
- QR funcional
- publicación real del CV para terceros
- persistencia compartible fuera de `localStorage`

### Qué no debería incluir
- OAuth o login GitHub
- backend real
- base de datos
- rediseño completo del producto

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

## 8. Orden recomendado a partir del cierre de esta rama

1. cerrar `feat/export-pdf-qr`
2. `feat/github-pages-public-preview`
3. `feat/polish-accessibility`
4. `feat/documentacion-final`

### Siguiente feature sugerida

**`feat/github-pages-public-preview`**

Objetivo:
- simular una URL pública real del CV usando GitHub Pages
- desacoplar esa demo pública del `localStorage` local
- generar un QR de demostración apuntando a la URL publicada

Fuera de alcance:
- backend
- base de datos
- publicación real multiusuario

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
- auth local básica para MVP
- layout base
- dominio
- persistencia
- editor de perfil
- live preview
- integración pública básica con GitHub
- visualización recruiter-friendly de proyectos
- trazabilidad mínima del origen de proyectos GitHub
- exportación PDF inicial con vista de impresión específica
- vista local adicional del CV preparada para compartirse más adelante

La rama activa natural sigue siendo:

**`feat/export-pdf-qr`**

porque ahora toca cerrar de forma limpia la salida de exportación y dejar bien acotada la futura transición hacia una publicación compartible cuando exista base de datos.
