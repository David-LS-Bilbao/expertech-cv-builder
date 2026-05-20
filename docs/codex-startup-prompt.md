# Prompt de arranque · Continuar EXPERTECH CV con Codex en VS Code

> Documento pensado para retomar el trabajo del proyecto
> `expertech-cv-builder` desde **otro dispositivo** (en concreto Mac
> con VS Code + extensión de OpenAI Codex), sin tener que reanalizar
> el repo desde cero.
>
> Mantenlo actualizado cuando cambie la fase activa o las reglas de
> trabajo.

---

## 1. Cómo usar este documento

1. Clonar el repo en la máquina destino y abrirlo en VS Code.
2. Abrir Codex en VS Code.
3. Copiar el bloque de la sección **"Prompt para pegar a Codex"** y
   pegarlo como primer mensaje de la nueva sesión.
4. Codex tendrá entonces contexto suficiente para retomar el trabajo
   sin reinventar el plan.

---

## 2. Setup mínimo en Mac (zsh + VS Code)

Comandos sugeridos en terminal zsh (Mac):

```bash
cd ~/Code   # o la ruta donde guardes tus repos
git clone git@github.com:David-LS-Bilbao/expertech-cv-builder.git
cd expertech-cv-builder
git switch dev
git pull origin dev
code .
```

Notas de entorno Mac:

- Terminal por defecto: **zsh**.
- Rutas con `/` (no `\`).
- `.gitattributes` ya está versionado y fuerza **LF** para `.js`,
  `.css`, `.html`, `.json`, `.md`, `.yml`, `.yaml` y `.env.example`.
  En Mac esto es natural, no hace falta configuración adicional.
- Si VS Code muestra avisos de EOL en archivos existentes,
  **ignorarlos**: se irán normalizando a LF cuando esos archivos se
  editen en una feature futura. No ejecutar
  `git add --renormalize .`.

---

## 3. Estado actual del proyecto

Última información estable conocida en este documento:

- **Rama base operativa:** `dev`.
- **Fase actual:** documental V2.
  - PR #31 ya mergeado: plan V2 + README alineado.
  - PR pendiente (donde vive también este prompt):
    `docs/add-v2-stitch-mockups-anexo`. Suma el anexo de bocetos de
    Stitch, los mockups versionados y este propio prompt.
- **MVP legacy vanilla JS** funcional con auth local, storage con
  fallback, proxy de empleo Jooble endurecido, integración GitHub,
  exportación PDF y demo pública estática.
- **Bloque de hardening cerrado** (PRs #22 a #30) sobre `dev`.
- **Pendiente operacional:** reconciliar `main ↔ dev` antes de
  empezar Fase 2 del plan V2.

---

## 4. Documentos vivos a leer antes de tocar nada

Orden recomendado de lectura al arrancar la sesión:

1. [`README.md`](../README.md) — visión general y estado declarado.
2. [`docs/roadmap.md`](./roadmap.md) — orden funcional acordado.
3. [`docs/evidencias.md`](./evidencias.md) — bitácora cronológica.
4. [`docs/v2-react-backend-docker-plan.md`](./v2-react-backend-docker-plan.md)
   — plan técnico explícito de la migración a V2.
5. [`docs/v2-stitch-mockups-anexo.md`](./v2-stitch-mockups-anexo.md)
   — evaluación de los bocetos de Stitch como referencia visual para
   Fase 4.
6. [`docs/memoria/stitch_expertech_cv_tech_platform/precision_technical_saas/DESIGN.md`](./memoria/stitch_expertech_cv_tech_platform/precision_technical_saas/DESIGN.md)
   — sistema de diseño completo a portar a `tailwind.config.ts`.

Apoyos secundarios:

- [`docs/architecture-notes.md`](./architecture-notes.md)
- [`docs/git_guia_practica.md`](./git_guia_practica.md)
- [`docs/EXPERTECH_CV_hoja_de_ruta.md`](./EXPERTECH_CV_hoja_de_ruta.md)

---

## 5. Reglas de trabajo (resumen ejecutable)

Estas reglas son innegociables salvo que se acuerde lo contrario en
la propia sesión:

- **Una feature por rama.** Ramas desde `dev`. PRs contra `dev`.
- **`main` solo para releases** validadas en `dev`.
- **Nunca `git add .` ni `git add -A`.** Añadir archivos
  explícitamente por path.
- Antes de cada commit, revisar **siempre**:
  - `git status --short`
  - `git diff --name-only`
- **Nunca commitear** secretos, API keys, tokens, archivos `.env`
  reales ni datos sensibles.
- **No renormalizar EOL del repo completo.** Los archivos con ruido
  EOL se limpian solo cuando se editan en una feature.
- **No tocar `main` directamente** desde el asistente.
- **No usar `--no-verify`** ni saltarse hooks.
- Si una acción es destructiva o visible a terceros (push,
  comentarios PR, force-push, reset --hard, etc.), **confirmar antes
  con el usuario**.
- Si el asistente detecta un commit en la rama equivocada, **no
  ocultar el error**: aplicar cirugía de ramas con consentimiento del
  usuario.

---

## 6. Próximo paso operativo

Cuando arranques la sesión en el Mac, el siguiente paso natural
según el plan V2 es:

1. Mergear el PR `docs/add-v2-stitch-mockups-anexo` si todavía está
   abierto.
2. Abrir rama `chore/reconcile-main-before-v2` desde `dev` para
   reconciliar la divergencia `main ↔ dev`.
3. PR `chore/reconcile-main-before-v2 → dev`.
4. PR `dev → main` para dejar baseline estable promocionable.
5. **Solo entonces** abrir `feat/v2-react-ts-scaffold` (Fase 2 del
   plan V2): scaffold Vite + React + TypeScript en carpeta separada
   del legacy. Traer tokens de
   `precision_technical_saas/DESIGN.md` al `tailwind.config.ts`.

---

## 7. Prompt para pegar a Codex

Copia el bloque siguiente literal como primer mensaje de la sesión
de Codex en VS Code. Codex leerá los docs referenciados y entenderá
el contexto.

```text
Hola Codex. Vamos a continuar el desarrollo del proyecto
EXPERTECH CV Builder desde donde lo dejó el equipo en la otra
máquina.

Repositorio: git@github.com:David-LS-Bilbao/expertech-cv-builder.git
Rama base operativa: dev
Plataforma actual: macOS (zsh) en VS Code con Codex.

Antes de proponer nada, lee en este orden y resúmeme lo esencial
en menos de 200 palabras por archivo:

1. README.md
2. docs/roadmap.md
3. docs/v2-react-backend-docker-plan.md
4. docs/v2-stitch-mockups-anexo.md
5. docs/codex-startup-prompt.md  (este mismo documento)

Después dime cuál es el siguiente paso operativo según el plan V2,
y espera mi confirmación antes de tocar nada. No abras ramas, no
hagas commits y no instales dependencias sin permiso explícito.

Reglas de trabajo (no negociables salvo acuerdo en sesión):
- una feature por rama, desde dev, PR contra dev
- nunca `git add .` ni `git add -A`
- nunca secretos, API keys, tokens ni `.env` reales en commits
- antes de commit: `git status --short` y `git diff --name-only`
- no tocar main directamente
- no usar `--no-verify`
- no renormalizar EOL del repo completo
- confirmar antes de acciones destructivas o visibles a terceros

Cuando me respondas, hazlo en español. Empieza con un resumen del
estado actual y luego propón el siguiente paso operativo.
```

---

## 8. Notas para mantener este documento al día

Actualizar este archivo cuando:

- Cambie la rama o fase activa del plan V2.
- Se cierre un bloque de PRs relevante en `dev`.
- Se introduzca una herramienta nueva (Tailwind, Prisma, Docker,
  etc.) que afecte el setup en otra máquina.
- Cambien las reglas de trabajo.

No actualizarlo cuando solo se cierran features incrementales sin
impacto en el flujo de arranque desde otro dispositivo.

---

*Documento de continuidad mantenido junto al plan V2.
Última actualización: 2026-05-20.*
