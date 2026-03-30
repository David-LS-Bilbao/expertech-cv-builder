# Guía práctica de Git para EXPERTECH CV

## Objetivo

Este documento reúne los comandos de Git más útiles para el flujo de trabajo de este proyecto. La idea es usarlo como referencia rápida mientras desarrollas cada feature sin tener que memorizarlo todo desde el principio.

## Flujo recomendado en este proyecto

- `main`: rama estable y publicable
- `dev`: rama de integración
- `feature/*`: rama de trabajo para una tarea concreta

Recomendación práctica:
- crear cada rama feature solo cuando realmente vayas a empezar esa feature
- trabajar una sola feature cada vez
- validar y cerrar la feature antes de abrir la siguiente

## Consultar el estado del repositorio

Ver rama actual y estado resumido:

```bash
git status --short --branch
```

Ver ramas locales:

```bash
git branch --list
```

Ver remoto configurado:

```bash
git remote -v
```

Ver historial resumido:

```bash
git log --oneline --graph --decorate --all
```

## Guardar cambios

Añadir archivos concretos:

```bash
git add README.md
git add docs/evidencias.md
```

Añadir archivos modificados y eliminados ya seguidos por Git:

```bash
git add -u
```

Añadir todo:

```bash
git add .
```

Crear un commit:

```bash
git commit -m "feat: descripcion breve del cambio"
```

## Crear y cambiar ramas

Crear una rama sin cambiarte a ella:

```bash
git branch feature/nombre-de-la-feature
```

Crear una rama y cambiarte en el mismo paso:

```bash
git switch -c feature/nombre-de-la-feature
```

Cambiar a una rama existente:

```bash
git switch dev
git switch main
git switch feature/layout-base
```

## Flujo típico de una nueva feature

Partiendo de `dev` actualizado:

```bash
git switch dev
git status --short --branch
git switch -c feature/layout-base
```

Trabajas, guardas cambios y haces commit:

```bash
git add .
git commit -m "feat: crear layout base del editor y preview"
```

Subes la rama al remoto:

```bash
git push -u origin feature/layout-base
```

## Integrar una feature en dev

Volver a `dev`:

```bash
git switch dev
```

Hacer merge de la feature:

```bash
git merge feature/layout-base
```

Subir `dev`:

```bash
git push origin dev
```

## Subir ramas al remoto

Subir la rama actual y dejar seguimiento:

```bash
git push -u origin nombre-de-la-rama
```

Ejemplos:

```bash
git push -u origin dev
git push -u origin feature/project-setup
```

## Comprobar diferencias

Ver cambios sin preparar:

```bash
git diff
```

Ver cambios ya preparados con `git add`:

```bash
git diff --cached
```

Ver diferencias entre ramas:

```bash
git diff dev..feature/layout-base
```

## Deshacer con cuidado

Quitar un archivo del área de staging:

```bash
git restore --staged README.md
```

Recuperar un archivo modificado al último commit:

```bash
git restore README.md
```

Importante:
- usa estos comandos con cuidado
- no los uses si no tienes claro si quieres conservar tus cambios

## Resolver situaciones comunes

Ver en qué ramas está un commit o rama:

```bash
git branch --contains
```

Eliminar una rama local ya fusionada:

```bash
git branch -d feature/layout-base
```

Eliminar una rama remota:

```bash
git push origin --delete feature/layout-base
```

## Convención sugerida de commits

Ejemplos útiles para este proyecto:

- `chore: preparar estructura inicial del proyecto`
- `docs: añadir hoja de ruta del proyecto`
- `feat: crear layout base del editor`
- `feat: implementar persistencia en localStorage`
- `fix: corregir render de la preview`
- `style: ajustar estilos responsive`

## Consejo práctico para aprendizaje

Como este proyecto también es de práctica, lo más recomendable es no crear todas las ramas de golpe. Es mejor crear cada `feature/*` cuando vayas a empezar esa parte del roadmap. Así reduces confusión, entiendes mejor el flujo y practicas Git de forma más realista.
