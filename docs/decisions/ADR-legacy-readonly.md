# ADR: Legacy vanilla JS en modo read-only

Fecha: 2026-05-24

## Contexto

EXPERTECH CV nació como MVP legacy en vanilla JS, con entrada en `index.html`, vista pública `public.html`, módulos en `js/**`, estilos en `styles/**`, proxy legacy en `server/**` y datos demo en `data/**`.

Después de los sprints V2:

- PR #46: Tailwind + design system + AuthScreen
- PR #47: Dashboard + Editor CV + Preview
- PR #48: GitHub Sync público sin OAuth
- PR #49: Jobs Search V2
- PR #50: Export PDF por impresión nativa con QR
- PR #51: Public Profile V2 con `/p/:slug`
- PR #52: auditoría de paridad V2 vs legacy
- PR #53: Landing Page V2 en `/`
- PR #54: auditoría final de demo V2

La auditoría final concluye que V2 está lista como demo principal con observaciones menores.

## Decisión

Mantener el legacy en su ubicación actual y marcarlo documentalmente como read-only.

La demo principal pasa a ser V2:

- `apps/web`
- `apps/api`
- Docker Compose raíz
- landing `/`
- perfil público `/p/:slug`

## Consecuencias

- No se implementan nuevas features en legacy.
- No se modifican `index.html`, `public.html`, `js/**`, `styles/**`, `server/**` ni `data/**` salvo decisión específica.
- Legacy se conserva como referencia histórica para memoria técnica, comparación o auditorías.
- La retirada completa queda aplazada a una decisión explícita posterior.
- Futuras features deben trabajar sobre V2.

## Alternativas consideradas

### Borrar legacy ya

Descartado. Aunque V2 ya puede actuar como demo principal, borrar legacy en este punto elimina referencia histórica y puede romper enlaces o materiales previos.

### Mover legacy a una carpeta `archive/`

Descartado por ahora. Mover archivos puede introducir ruido grande, afectar rutas históricas y mezclar la decisión documental con cambios estructurales.

### Dejar legacy sin documentar

Descartado. Mantener legacy sin una decisión explícita aumenta el riesgo de que futuras ramas lo modifiquen por error.

## Decisión final

Mantener legacy en sitio y marcarlo read-only documentalmente.

La posible retirada futura deberá hacerse en una rama explícita, por ejemplo:

- `chore/remove-legacy-after-v2-parity`

Hasta entonces, legacy no se borra ni se mueve.
