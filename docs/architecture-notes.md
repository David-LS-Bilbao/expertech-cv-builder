# Notas de arquitectura

## Estado arquitectónico actual

El proyecto se encuentra en una fase de preparación. La arquitectura todavía es simple, pero ya está organizada para crecer de forma modular.

## Estructura base prevista

- `index.html`: punto de entrada principal
- `styles/reset.css`: normalización visual mínima
- `styles/main.css`: estilos base del proyecto
- `js/app.js`: punto de entrada JavaScript
- `js/models/`: futuros modelos de datos
- `js/services/`: futuros servicios como persistencia o integración externa
- `js/ui/`: futura lógica de interfaz y render
- `js/utils/`: utilidades compartidas

## Decisiones actuales

- empezar con una base estática simple antes de introducir lógica compleja
- separar estilos de reseteo y estilos principales desde el inicio
- mantener JavaScript en un punto de entrada único mientras el proyecto está arrancando
- reservar carpetas por responsabilidad para facilitar la evolución del MVP

## Siguiente decisión arquitectónica relevante

La siguiente feature debería definir la estructura visual principal de la aplicación y preparar la separación entre:

- zona de edición
- zona de vista previa
- componentes visuales base

## Riesgos a vigilar

- mezclar demasiado pronto lógica de datos y presentación
- sobrediseñar la arquitectura antes de tener la UI base
- duplicar responsabilidades entre `ui`, `services` y `utils`
