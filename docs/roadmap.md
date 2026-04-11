# Roadmap operativo · EXPERTECH CV

Este documento resume el orden previsto de trabajo del MVP actual del proyecto.

## Feature activa

- `feat/projects-visualization`

Objetivo actual:
- mejorar lectura y visualización de proyectos
- aprovechar la selección GitHub ya persistida como base del bloque de proyectos
- hacer más clara la presentación del portfolio para recruiters
- mantener separación limpia entre datos, selección y render visual

## Siguientes features previstas

1. `feat/login-screen`
   - preparar una pantalla de acceso clara y una base de identidad de usuario dentro del producto
   - sin obligar todavía a resolver autenticación externa compleja

2. `feat/github-project-sources`
   - ampliar la integración GitHub para múltiples cuentas, repositorios de otros owners y colaboraciones
   - dejar más clara la atribución del origen del proyecto sin prometer todavía OAuth

3. `feat/export-pdf-qr`
   - preparar salida PDF resumen y acceso mediante QR

4. `feat/polish-accessibility`
   - pulido visual, estados UX y accesibilidad básica

5. `feat/documentacion-final`
   - cierre documental final del proyecto y preparación de la entrega

## Feature cerrada recientemente

- `feat/github-integration`
  - consulta pública de perfil y repositorios desde GitHub API
  - render de perfil GitHub con badge de estado, feedback y fallback manual
  - selección manual de repositorios destacados conectada al estado del CV
  - persistencia de `githubUsername` y proyectos GitHub para rehidratación coherente en el MVP

## Fuera Deliberadamente

- `feat/github-integration` no resuelve todavía múltiples cuentas GitHub
- no cubre colaboraciones ni atribución avanzada del origen de proyectos
- no introduce OAuth ni autenticación GitHub

## Regla de trabajo

Se trabaja una sola feature cada vez.  
Cada feature debe cerrarse con validación mínima, documentación actualizada y una recomendación clara del siguiente paso.
