# Anexo V2 · Bocetos visuales de Stitch como referencia para Fase 4

> Anexo al documento [`v2-react-backend-docker-plan.md`](./v2-react-backend-docker-plan.md).
>
> Este anexo evalúa la carpeta
> [`docs/memoria/stitch_expertech_cv_tech_platform/`](./memoria/stitch_expertech_cv_tech_platform/)
> como fuente visual y de sistema de diseño para la migración a React.
>
> Propósito explícito de este archivo: permitir retomar el trabajo de
> adaptación de los bocetos desde cualquier dispositivo o sesión nueva
> del asistente, sin tener que reanalizar la carpeta desde cero.

---

## 1. Propósito del documento

La carpeta `docs/memoria/stitch_expertech_cv_tech_platform/` contiene
una serie de bocetos generados con **Google Stitch** para EXPERTECH CV.
Estos bocetos no forman parte del MVP legacy actual, pero son
referencia visual sólida para la **Fase 4 (UI React)** del plan V2.

Este anexo deja por escrito:

- qué hay en la carpeta;
- qué partes son portables casi tal cual;
- qué fricciones técnicas hay;
- cómo encaja con el plan V2 por fases;
- cómo retomar el trabajo en otra sesión.

---

## 2. Inventario de la carpeta

Estructura observada:

```
docs/memoria/stitch_expertech_cv_tech_platform/
├── cv_editor_expertech_cv/              code.html + screen.png
├── dashboard_expertech_cv/              code.html + screen.png
├── export_pdf_expertech_cv/             code.html + screen.png
├── github_sync_expertech_cv/            code.html + screen.png
├── job_search_expertech_cv/             code.html + screen.png
├── landing_page_expertech_cv/           code.html + screen.png
├── login_register_expertech_cv/         code.html + screen.png
├── public_profile_expertech_cv/         code.html + screen.png
├── precision_technical_saas/            DESIGN.md
└── high_quality_..._a_clean_desk/       screen.png (imagen de stock)
```

Mapeo de cada pantalla con su fase del plan V2:

| Pantalla | Cobre | Fase V2 relevante |
|----------|-------|-------------------|
| `landing_page` | Página pública de marketing | Nueva (no estaba en MVP) |
| `login_register` | Auth local con tabs | Fase 4 — Auth screen |
| `dashboard` | Hub con bento grid y preview | Fase 4 — layout autenticado |
| `cv_editor` | Editor con accordion + preview lateral | Fase 4 — editor shell |
| `github_sync` | Integración GitHub | Fase 4 (legacy ya lo tiene) |
| `public_profile` | Vista pública del CV | Fase 4 / equivalente `public.html` |
| `export_pdf` | Vista de exportación | Fase 4 / legacy ya lo tiene |
| `job_search` | Buscador de empleo | Fase 4 frontend + Fase 5 backend |
| `precision_technical_saas/DESIGN.md` | Sistema de diseño | **Fundacional para todas las fases** |

---

## 3. Sistema de diseño · `DESIGN.md`

El archivo `precision_technical_saas/DESIGN.md` es el activo más
valioso de toda la carpeta. Define un sistema de diseño completo bajo
el nombre **"Precision Technical SaaS"**.

Componentes del sistema:

- **Paleta de color** completa al estilo Material Design 3 con tokens
  semánticos:
  - Primary: Electric Blue (`#006591` / container `#0ea5e9`).
  - Secondary: Tech Green (`#006c49`) para estados de éxito.
  - Tertiary: Soft Coral (`#bc0b3b`) para CTAs críticos.
  - Neutral: Night Blue (`#131b2e`) para texto.
  - Background: Soft White (`#faf8ff`).
  - Tokens completos para `surface-*`, `on-*`, `inverse-*`, etc.
- **Tipografía** Inter con escala completa
  (`headline-xl`, `headline-lg`, `headline-md`, `body-lg`, `body-md`,
  `label-md`, `label-sm`).
- **Spacing** 8px-base con `gutter` y `margin` específicos para
  desktop y móvil, además de `section-gap` 80px.
- **Radios** desde `sm` (0.25rem) hasta `xl` (1.5rem).
- **Elevación** en tres niveles (base / cards / modals) con sombras
  ambient y outlines de 1px.
- **Tono de marca**: corporativo / moderno / minimalista para
  perfiles tech de alto nivel.

Conclusión técnica: este `DESIGN.md` se convierte directamente en un
`tailwind.config.ts` extendido y/o un archivo `tokens.css` con
custom properties, ahorrando semanas de design system desde cero.

---

## 4. Qué es portable casi tal cual

- **`DESIGN.md` → `tailwind.config.ts` + `tokens.css`**: copia
  semántica de todos los tokens.
- **Paleta de color completa** como variables CSS o configuración de
  Tailwind. No requiere reinterpretación.
- **Tipografía Inter** vía `@fontsource/inter` (builds reproducibles)
  en vez del CDN de Google Fonts.
- **Estructura de layouts** del dashboard (sidebar fijo + topbar
  sticky + main) reescrita como composables React:
  `<DashboardLayout>`, `<Sidebar>`, `<TopBar>`.
- **Patrones de componentes** identificables y mapeables 1:1 a
  componentes React reutilizables:
  - Buttons (Primary / Critical CTA / Ghost).
  - Input fields con label encima y focus ring.
  - Cards elevadas con sombra suave.
  - Chips y status indicators con versión desaturada.
  - Progress bars.
  - Bento grid de métricas.
  - Accordions colapsables.
- **Iconografía Material Symbols Outlined** soportada en React
  (componente o webfont). Alternativa más liviana: `lucide-react`.

---

## 5. Fricciones reales y mitigaciones

| Fricción | Impacto | Mitigación |
|----------|---------|-----------|
| **Tailwind via CDN** (`cdn.tailwindcss.com`) | Bajo | Instalar Tailwind con PostCSS/Vite. El bloque `tailwind.config` inline de los `code.html` se porta tal cual a `tailwind.config.ts`. |
| **JavaScript inline** (`onclick="toggleAccordion(this)"`) | Bajo | Reescribir como `useState` en cada componente accordion/tab. |
| **Dark mode con `class="light"` en `<html>`** | Bajo | `ThemeProvider` propio o `next-themes` si se acaba usando Next. Tailwind ya tiene `darkMode: "class"`. |
| **Imágenes hardcodeadas** (`lh3.googleusercontent.com/aida-public/...`) | Crítico para producción | URLs servidas por Google con expiración y origen no controlado. **No deben quedar en producción**: reemplazar por avatares reales del usuario o fallback de GitHub. |
| **Mezcla EN/ES en copys** (`Sign In` junto a `Guardar cambios`) | Trivial | Unificar idioma desde el inicio del scaffold. |
| **Datos mock** (`Alex Tech`, métricas 85%, 5 proyectos…) | Bajo | Conectar a `cvState` real cuando exista el dominio TypeScript de la Fase 3. |
| **Material Symbols como webfont** (~28k iconos vía Google) | Medio | Si el peso preocupa, migrar a `lucide-react` (tree-shaking real, importas solo los iconos que uses). |
| **`data-icon` attributes** redundantes | Trivial | Son ruido del generador, no se usan. Eliminar al portar. |
| **HTML estático sin estado** | Medio | Cada pantalla es una foto fija. Hay que reinterpretarla como árbol de componentes con estado y eventos. |

---

## 6. Stack React recomendado para portar los bocetos

Sugerencia pragmática alineada con el plan V2:

- **Vite + React + TypeScript** (Fase 2 del plan V2).
- **Tailwind v3 o v4** con `tailwind.config.ts` poblado desde
  `DESIGN.md`.
- **shadcn/ui** o **Radix UI** como base de primitivas accesibles
  (Dropdown, Dialog, Tabs, Accordion, Tooltip). Aporta accesibilidad
  de teclado y focus management; tú lo vistes con los tokens del
  DESIGN.
- **lucide-react** o `@material-symbols/svg-400` para iconografía con
  tree-shaking real.
- **`@fontsource/inter`** para que el build no dependa de Google
  Fonts en runtime.
- **CSS variables** con los tokens semánticos del DESIGN, para que el
  mismo componente sirva en light y dark sin duplicar clases.
- Considerar **`clsx`** o **`cva` (class-variance-authority)** para
  variantes de componentes (button primary/critical/ghost, etc).

Sin sobrearquitectura. Solo lo anterior es suficiente para portar las
9 pantallas con calidad SaaS profesional.

---

## 7. Licencia, origen y advertencias

- Los `code.html` provienen de **Google Stitch**. Antes de publicar la
  app, **verificar los términos de uso de Stitch** para uso comercial
  del output. En general lo permite, pero conviene confirmarlo si la
  app se publica de forma pública o monetizada.
- Las imágenes de stock (`lh3.googleusercontent.com/aida-public/...`)
  **no son propias** y **no deben quedar en producción**. Son URLs
  servidas por Google que pueden cambiar o expirar.
- El nombre del directorio `high_quality_professional_photography_...`
  parece un prompt de generación de imagen residual. Considerar
  renombrarlo si se mantiene en el repo.
- Ningún archivo de esta carpeta contiene secretos detectables, pero
  conviene una revisión final con grep antes de mergear cualquier
  cosa que se base en ellos.

---

## 8. Cómo encajan los bocetos en el plan V2

Sin necesidad de modificar el `v2-react-backend-docker-plan.md`, los
bocetos encajan de forma natural en estas fases:

- **Fase 1 — Documentación V2** (cerrada con PR #31):
  - este anexo se añade como referencia visual estable y citable.
- **Fase 2 — Scaffold React + TypeScript**
  (`feat/v2-react-ts-scaffold`):
  - al configurar Tailwind, traer los tokens de `DESIGN.md` al
    `tailwind.config.ts`;
  - registrar `Inter` vía `@fontsource/inter`;
  - dejar listo el `ThemeProvider` y el switch light/dark.
- **Fase 3 — Modelos y servicios TypeScript**
  (`feat/v2-domain-models-and-storage`):
  - sin impacto directo: el sistema de diseño es independiente del
    dominio.
- **Fase 4 — UI React**
  (`feat/v2-react-auth-and-editor-shell`):
  - usar los `code.html` como **contrato visual** de cada pantalla;
  - descomponer cada uno en componentes React reutilizables;
  - reemplazar markup estático por componentes con estado;
  - eliminar imágenes y datos mock;
  - unificar idioma de copys.
- **Fase 5 — Backend API**
  (`feat/v2-backend-api-foundation`):
  - sin impacto visual directo.
- **Fases 6 / 7 / 8**:
  - sin impacto en los bocetos.

---

## 9. Cómo retomar este trabajo en otra sesión o dispositivo

Pasos mínimos para que un agente nuevo (o tú en otro equipo) pueda
seguir desde donde lo dejamos:

1. Leer este anexo (`docs/v2-stitch-mockups-anexo.md`) para entender
   qué hay en la carpeta y por qué importa.
2. Leer
   [`v2-react-backend-docker-plan.md`](./v2-react-backend-docker-plan.md)
   para entender el plan global y la fase activa.
3. Revisar
   [`memoria/stitch_expertech_cv_tech_platform/precision_technical_saas/DESIGN.md`](./memoria/stitch_expertech_cv_tech_platform/precision_technical_saas/DESIGN.md)
   como contrato del sistema de diseño.
4. Abrir las `screen.png` de cada pantalla para entender la
   experiencia objetivo.
5. Consultar los `code.html` **solo como referencia de markup**, no
   como código a importar literalmente: hay que reinterpretar a React.
6. Cuando se aborde Fase 2, traer los tokens de `DESIGN.md` al
   `tailwind.config.ts` del nuevo scaffold.
7. Cuando se aborde Fase 4, portar pantalla a pantalla siguiendo el
   checklist de la sección 10 de este anexo.

---

## 10. Checklist de adaptación al portar a React

Lista accionable para cada pantalla que se porte de Stitch a React:

- [ ] Identificar el árbol de componentes (layout, secciones,
      primitivas).
- [ ] Sustituir Tailwind CDN por Tailwind configurado en el proyecto.
- [ ] Quitar `tailwind.config` inline del `<script>` y trasladarlo a
      `tailwind.config.ts` (una sola vez para todo el proyecto).
- [ ] Sustituir `<link>` a Google Fonts por `@fontsource/inter`.
- [ ] Decidir iconografía: Material Symbols como componente o
      `lucide-react`. Documentar la decisión una sola vez.
- [ ] Reemplazar `onclick="..."` inline por handlers React (`useState`
      para accordions y tabs).
- [ ] Quitar `data-icon` redundantes.
- [ ] Eliminar imágenes `lh3.googleusercontent.com/aida-public/...`
      y conectar a avatares reales del usuario.
- [ ] Eliminar datos mock (`Alex Tech`, métricas inventadas) y
      conectar al estado real del CV cuando exista.
- [ ] Unificar idioma de los copys (ES por defecto).
- [ ] Validar accesibilidad de teclado en componentes interactivos
      (idealmente apoyándose en Radix / shadcn/ui).
- [ ] Verificar contraste de color con los tokens del DESIGN
      (WCAG AA mínimo).
- [ ] Confirmar responsive desktop / tablet / móvil según los grids
      definidos en `DESIGN.md`.

---

## 11. Apéndice · Referencia rápida de tokens del DESIGN

Solo a modo de cheatsheet rápido. La fuente de verdad sigue siendo
`memoria/stitch_expertech_cv_tech_platform/precision_technical_saas/DESIGN.md`.

**Color clave:**

- `--primary: #006591` (Electric Blue, acciones primarias).
- `--primary-container: #0ea5e9` (variante clara).
- `--secondary: #006c49` (Tech Green, éxito).
- `--tertiary: #bc0b3b` (Soft Coral, CTAs críticos).
- `--on-surface: #131b2e` (Night Blue, texto principal).
- `--surface: #faf8ff` (Soft White, canvas).
- `--outline-variant: #bec8d2` (bordes neutros 1px).

**Tipografía:**

- Familia única: **Inter**.
- Escala: `headline-xl 48/56`, `headline-lg 32/40`,
  `headline-md 24/32`, `body-lg 18/28`, `body-md 16/24`,
  `label-md 14/20`, `label-sm 12/16`.

**Spacing 8px-base:**

- Desktop: 12 columnas, 48px márgenes, 24px gutters.
- Tablet: 8 columnas, 32px márgenes, 20px gutters.
- Mobile: 4 columnas, 20px márgenes, 16px gutters.
- `section-gap`: 80px entre bloques funcionales.

**Radios:**

- `sm 4px`, `DEFAULT 8px`, `md 12px`, `lg 16px`, `xl 24px`,
  `full 9999px`.

**Elevación:**

- Level 0: fondo plano `#faf8ff`.
- Level 1: cards `#ffffff` + sombra `0 4px 12px rgba(15,23,42,0.05)`.
- Level 2: modals/dropdowns `#ffffff` + sombra
  `0 12px 24px rgba(15,23,42,0.1)`.
- Outlines neutros: 1px `#E2E8F0`.

---

*Documento de referencia mantenido junto al plan V2.
Última actualización: 2026-05-20.*
