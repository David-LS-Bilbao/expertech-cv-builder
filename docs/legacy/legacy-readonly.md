# Legacy read-only

## Estado

El legacy vanilla JS queda formalmente en modo **read-only**.

- V2 React/TypeScript es la demo principal del proyecto.
- El legacy se conserva como referencia histórica y respaldo de comparación.
- No se borra, no se mueve y no se modifica en este sprint.

## Archivos/carpetas legacy

Se consideran parte del legacy:

- `index.html`
- `public.html`
- `js/**`
- `styles/**`
- `server/**`
- `data/**`

También deben tratarse como contexto legacy los documentos que describen el MVP vanilla JS histórico, aunque la documentación viva del proyecto siga pudiendo actualizarse.

## Qué significa read-only

Read-only significa:

- no implementar nuevas features en legacy
- no corregir estilos legacy salvo emergencia documentada
- no tocar `js/**` ni `styles/**` por ruido EOL/CRLF
- no usar legacy como fuente principal de producto
- no borrar legacy todavía
- no mover legacy a otra carpeta sin una decisión explícita posterior

Las nuevas features, fixes y mejoras funcionales deben vivir en:

- `apps/web`
- `apps/api`
- Docker Compose raíz cuando proceda
- documentación operativa actual

## Qué sí está permitido

Está permitido:

- consultar legacy como referencia histórica
- comparar comportamiento legacy vs V2
- documentar gaps si aparecen
- citar legacy en memoria técnica o auditorías
- crear una rama específica si un fix de seguridad urgente fuese imprescindible

Si se detecta un problema crítico de seguridad en legacy, la corrección debe hacerse en una rama explícita, con alcance mínimo y dejando evidencia documental.

## Qué queda como demo principal

La demo principal queda en V2:

- frontend V2: `apps/web`
- backend V2: `apps/api`
- Docker Compose raíz
- landing V2: `/`
- perfil público V2: `/p/:slug`
- API proxyada desde el frontend Docker en `http://localhost:8090/api`

## Motivo de la decisión

La decisión se basa en:

- `docs/audits/v2-legacy-parity-audit.md`
- `docs/audits/v2-final-demo-audit.md`
- `docs/releases/v2-demo-release-notes.md`
- cierre de PR #53 con Landing Page V2
- resultado de auditoría final: V2 lista como demo principal con observaciones menores

V2 cubre el flujo demo principal: landing, auth, dashboard, editor, GitHub Sync, Jobs Search, Export PDF/QR, PublicProfile, backend real, PostgreSQL/Prisma y Docker local.

## Próxima decisión futura

La retirada completa del legacy requiere una decisión explícita posterior.

Opciones futuras:

- mantener legacy archivado indefinidamente como referencia histórica
- crear `chore/remove-legacy-after-v2-parity` para retirar legacy si ya no aporta valor

Hasta que exista esa decisión, legacy permanece en el repositorio como read-only.
