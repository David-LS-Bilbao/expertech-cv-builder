# Legacy

Esta carpeta documenta el estado del legacy vanilla JS de `EXPERTECH CV`.

## Estado actual

El legacy queda marcado como **read-only**. La demo principal del proyecto es V2:

- frontend: `apps/web`
- backend: `apps/api`
- entrada pública: `/`
- perfil público: `/p/:slug`

## Documentos

- [Legacy read-only](./legacy-readonly.md)

## Regla práctica

No tocar `index.html`, `public.html`, `js/**`, `styles/**`, `server/**` ni `data/**` sin una rama y una decisión específica.

Legacy puede consultarse como referencia histórica o comparativa, pero no debe recibir nuevas features.
