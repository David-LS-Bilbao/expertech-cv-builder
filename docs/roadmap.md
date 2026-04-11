# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa

- `feat/editor-profile`

Objetivo actual:
- permitir edición manual real de los datos principales del CV
- conectar formulario y estado persistido
- preparar la base para reflejar cambios en la preview
- mantener una estructura simple y evolutiva

## Siguientes features previstas

1. `feat/live-preview`
   - reflejar cambios en tiempo real en la vista del CV

2. `feat/github-integration`
   - obtener datos básicos desde GitHub API

3. `feat/projects-visualization`
   - mejorar lectura y visualización de proyectos

4. `feat/export-pdf-qr`
   - preparar salida PDF resumen y acceso mediante QR

5. `feat/polish-accessibility`
   - pulido visual, estados UX y accesibilidad básica

## Feature cerrada recientemente

- `feat/local-storage`
  - persistencia mínima en navegador ya implementada
  - recuperación del estado al recargar ya resuelta
  - servicio dedicado de almacenamiento ya creado
  - base lista para conectar edición real

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
