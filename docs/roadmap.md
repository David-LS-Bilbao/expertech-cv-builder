# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa

- `feat/local-storage`

Objetivo actual:
- persistir el estado del CV en el navegador
- recuperar los datos al recargar la app
- preparar un flujo mínimo de guardado estable
- dejar la base lista para conectar el editor real

## Siguientes features previstas

1. `feat/editor-profile`
   - permitir edición manual de los datos del perfil

2. `feat/live-preview`
   - reflejar cambios en tiempo real en la vista del CV

3. `feat/github-integration`
   - obtener datos básicos desde GitHub API

4. `feat/projects-visualization`
   - mejorar lectura y visualización de proyectos

5. `feat/export-pdf-qr`
   - preparar salida PDF resumen y acceso mediante QR

6. `feat/polish-accessibility`
   - pulido visual, estados UX y accesibilidad básica

## Feature cerrada recientemente

- `feat/domain-model`
  - entidades principales del CV ya definidas
  - estado inicial estable ya preparado
  - integración temporal en `js/app.js` ya validada
  - base lista para persistencia local

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
