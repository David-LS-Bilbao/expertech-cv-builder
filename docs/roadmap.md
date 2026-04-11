# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa

- `feat/live-preview`

Objetivo actual:
- reflejar en tiempo real los cambios del editor en la preview
- conectar el perfil persistido con la vista previa recruiter-friendly
- mantener separación clara entre UI, estado y render
- preparar la base para siguientes bloques dinámicos del CV

## Siguientes features previstas

1. `feat/github-integration`
   - obtener datos básicos desde GitHub API

2. `feat/projects-visualization`
   - mejorar lectura y visualización de proyectos

3. `feat/export-pdf-qr`
   - preparar salida PDF resumen y acceso mediante QR

4. `feat/polish-accessibility`
   - pulido visual, estados UX y accesibilidad básica

## Feature cerrada recientemente

- `feat/editor-profile`
  - formulario de perfil ya implementado
  - guardado conectado al estado persistido
  - rehidratación al recargar ya validada
  - feedback visual de guardado ya disponible

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
