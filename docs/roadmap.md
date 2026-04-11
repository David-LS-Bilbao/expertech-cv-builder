# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa

- `feat/github-integration`

Objetivo actual:
- obtener datos básicos desde GitHub API
- enriquecer el perfil con información pública útil para el CV
- permitir selección manual de repositorios o proyectos destacados
- mantener el flujo manual actual como base segura si la API falla

## Siguientes features previstas

1. `feat/projects-visualization`
   - mejorar lectura y visualización de proyectos

2. `feat/export-pdf-qr`
   - preparar salida PDF resumen y acceso mediante QR

3. `feat/polish-accessibility`
   - pulido visual, estados UX y accesibilidad básica

## Feature cerrada recientemente

- `feat/live-preview`
  - render reactivo de `fullName`, `headline` y `summary`
  - sincronización editor → preview mientras se escribe
  - sincronización de preview con el estado guardado tras cada submit
  - fallbacks visuales y control del empty state para una vista más estable

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
