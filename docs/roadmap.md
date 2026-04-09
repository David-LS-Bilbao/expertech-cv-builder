# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa

- `feat/domain-model`

Objetivo actual:
- definir las entidades principales del proyecto
- organizar el estado base del CV
- preparar una estructura de datos clara para conectar editor y preview
- dejar el terreno listo para la persistencia local en la siguiente fase

## Siguientes features previstas

1. `feat/local-storage`
   - persistir el estado del CV en el navegador

2. `feat/editor-profile`
   - permitir edición manual de los datos del perfil

3. `feat/live-preview`
   - reflejar cambios en tiempo real en la vista del CV

4. `feat/github-integration`
   - obtener datos básicos desde GitHub API

5. `feat/projects-visualization`
   - mejorar lectura y visualización de proyectos

6. `feat/export-pdf-qr`
   - preparar salida PDF resumen y acceso mediante QR

7. `feat/polish-accessibility`
   - pulido visual, estados UX y accesibilidad básica

## Feature cerrada recientemente

- `feat/layout-base`
  - maqueta base ya construida
  - estructura visual `editor + preview` ya validada
  - responsive móvil y desktop ya revisado
  - preview sticky solo en desktop

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
