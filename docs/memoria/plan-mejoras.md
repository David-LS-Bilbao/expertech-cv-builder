# Auditoría en profundidad · EXPERTECH CV

## 1. Bugs y errores funcionales reales

### 1.1 `bindExportPdfButton` mezcla 5 responsabilidades y aborta listeners si falta el botón PDF

En `AuthenticatedCVApp.js:213-269`, si no existe `#export-pdf-button`, la función hace `return` temprano y nunca se enlazan los listeners de "Ver demo pública" ni las 3 quick actions.

**Bug latente:** si en algún flujo se oculta el botón PDF, se rompen también la navegación rápida y el botón "Ver demo".

### 1.2 `handlePendingUrlActions` depende del orden, no del estado

`AuthenticatedCVApp.js:271-289` revisa `exportPdfButtonElement`, pero solo se llama tras `bindExportPdfButton`.

Si en el futuro alguien llama `init()` desde otro lugar, por ejemplo tras `logout + login` en la misma sesión, no se reenlaza el botón porque `isInitialized = true` queda permanente. La acción `?action=export-pdf` solo funciona en el primer arranque.

### 1.3 Re-login no funciona realmente

`AuthenticatedCVApp.js:292-295`: `isInitialized` se queda en `true` para siempre.

Tras `logout`, que mantiene la app montada en `AppRuntime.js:112-119`, y nuevo login con otro usuario, no se vuelve a inicializar nada. Los listeners siguen apuntando al usuario anterior.

Además, como no hay aislamiento por usuario en `localStorage`, el siguiente usuario ve el CV del anterior.

### 1.4 `searchOffers` devuelve un array y le pega una propiedad `_fallbackWarning`

`JobOffersService.js:99-105` hace:

```js
mockResults._fallbackWarning = err.message;
```

Funciona porque JavaScript lo permite, pero si ese array pasa por copias, spread o `JSON.stringify`, la propiedad se pierde.

En `JobSearchIntegration.js:71-73` sí funciona porque se lee directamente, pero es código frágil.

**Refactor recomendado:** devolver un objeto con forma explícita:

```js
{
  results,
  fallbackWarning,
}
```

### 1.5 `searchOffers` lanza con `keyword.trim() === ""` antes de comprobar que `keyword` exista

`JobOffersService.js:93`: si `keyword` es `undefined`, `keyword.trim()` lanza `TypeError` antes del check.

Cambiar por:

```js
if (!keyword || String(keyword).trim() === "") {
  // ...
}
```

### 1.6 `getStorage()` lanza en SSR, iframes o modo privado Safari sin sesión

`AuthStorageService.js:20-26`: si `localStorage` no existe, se lanza error al cargar el módulo y no hay `catch` superior.

El resultado es que la app queda en blanco. En producción debería degradar a `sessionStorage` o memoria.

### 1.7 Lectura de avatar desde GitHub usando `<username>.png` sin encodear el username

`PrintCVRenderer.js:197` y `PublicCVRenderer.js:216-218` construyen la URL así:

```js
`https://github.com/${profileData.githubUsername}.png`
```

Un username con caracteres especiales rompe la URL. Debería usarse `encodeURIComponent`.

### 1.8 XSS potencial en `PrintCVRenderer`

`PrintCVRenderer.js:143-150` y `PrintCVRenderer.js:228-241` interpolan `repoUrl`, `demoUrl`, `email`, `linkedinUrl`, `location` y `skills` con `innerHTML`.

Hoy estos datos vienen de la API de GitHub y del usuario autenticado, pero si mañana se importan datos de otra fuente o se publica un perfil multiusuario, es XSS directo.

El mismo riesgo existe en `PublicCVRenderer.js:341-350`.

### 1.9 `JobOffersService` está hard-coded a `localhost:3001`

`JobOffersService.js:7-10`:

```js
proxyUrl: "http://localhost:3001/api/jobs/search"
```

En cuanto se despliegue a un dominio real, el navegador llamará a `http://localhost:3001` del usuario. Romperá silenciosamente y caerá siempre al mock.

### 1.10 CORS abierto en el proxy

`server.js:13`:

```js
app.use(cors());
```

No hay lista blanca de orígenes. Esto permite que cualquier dominio consuma tu cuota de Jooble.

### 1.11 Sin rate limiting ni validación del proxy

`server.js:15-38`: no hay validación de longitud para `keyword` o `location`, ni `rate limiting`.

Esto abre un vector de abuso de la cuota de Jooble desde cualquier cliente.

### 1.12 `.env` committeada

`server/.env` aparece en `git status` como modificada, pero `server/.env` está en `.gitignore` (`gitignore:21`).

Comprobar con:

```bash
git ls-files server/.env
```

Si está trackeado, hay que purgarla del histórico.

### 1.13 `feat/visual-polish-final` tiene 13 archivos modificados sin commitear

Riesgo de pérdida de trabajo, y la rama lleva mucho sin merge.

### 1.14 `data/public-cv.json` contiene proyectos con IDs ficticios

IDs como `github-repo-1`, `github-repo-2` y `sourceRepositoryId: "1"` no corresponden con IDs reales de GitHub.

Si en algún flujo se hace match por `id`, no encajará.

### 1.15 La preview pública pone título `David López Sotelo` en el `<h1>` hard-codeado

`public.html:481`: si falla la carga del JSON antes del render, queda visible un nombre real hard-codeado en el HTML.

### 1.16 `getJobSearchBlockTemplateMarkup` se inyecta como sibling de `#github-block-root`

`JobSearchBlockTemplate.js:113-118`:

```js
insertAdjacentHTML("afterend", ...)
```

Acopla el bloque de empleo a la existencia y posición del bloque GitHub. Si alguien mueve GitHub, el bloque de empleo aparece en otro lugar.

### 1.17 `loadCV` devuelve un `createInitialCVState()` no normalizado por `createPortfolioCV`

`CVStorageService.js:79-81`: técnicamente sí lo normaliza porque `createInitialCVState` lo llama internamente, pero el retorno es inconsistente con la rama `try`, que devuelve `cvState` ya saneado.

Conviene unificar la salida.

### 1.18 `loadCV` parsea JSON pero no aplica `createPortfolioCV` al resultado

`CVStorageService.js:85-89`: `JSON.parse(storedCV)` se pasa a `removeLegacySeededDemoProject`, que solo normaliza si encuentra demo legacy.

Si un cliente guardó datos viejos sin esos campos demo, no se normalizan y los consumidores reciben objetos posiblemente incompletos.

### 1.19 `avatarBase64` engorda `localStorage`

`ProfileEditor.js:239-287`: la imagen redimensionada se guarda como JPEG base64.

Con varios cambios y múltiples campos editados, se puede saturar la cuota aproximada de 5 MB. Falta detección de `QuotaExceededError` en `saveCV`.

### 1.20 No hay manejo de errores de red en `PublicCVDataService`

`PublicCVDataService.js:12-22`: si `fetch` falla por red, no por `404`, `loadPublicCVData` lanza.

`PublicPageRuntime.js:21-34` lo captura y renderiza el estado unavailable.

Esto funciona, pero el error original se pierde en `console.error`.

## 2. Calidad de código y arquitectura

### 2.1 Arquitectura factory-based muy verbosa

Cada módulo es una factory que devuelve un closure con `getPublicApi()`.

Funciona, pero genera código repetitivo:

- Docstrings de 6 líneas en cada archivo.
- Objetos `getElements()` de debug en producción.
- Muchos selectores configurables que nunca se cambian.

### 2.2 Selectores DOM duplicados en JS y HTML

Los selectores como `#preview-full-name` o `#github-form` viven en HTML y como strings en JS.

Sin TypeScript, una errata es invisible hasta runtime.

### 2.3 Mutación directa de `currentCVState.profile.avatarBase64`

`ProfileEditor.js:275`:

```js
currentCVState.profile.avatarBase64 = canvas.toDataURL(...);
```

Esta mutación rompe la inmutabilidad implícita del resto del módulo.

### 2.4 Lógica de filtrado de proyectos duplicada 3 veces

`isRenderableProject` y `getVisibleProjects` aparecen casi igual en:

- `PreviewRenderer.js:136-164`
- `PrintCVRenderer.js:64-88`
- `PublicCVRenderer.js:54-78`

**Refactor recomendado:** extraer a `js/utils/projects.js`.

### 2.5 `window.cvAppDebug` y `window.cvPublicDebug` en producción

Referencias:

- `AppRuntime.js:53-67`
- `app.js:29-31`

Exponen todo el estado y referencias internas. Es útil en desarrollo, pero no debería estar activo en producción.

### 2.6 Mensajes y textos hardcoded en JS

Faltan claves de i18n. Añadir inglés implicaría tocar muchos archivos.

### 2.7 Sin tests unitarios, integración ni E2E

No hay carpeta `tests/` ni framework configurado.

Cualquier refactor se haría a ciegas.

### 2.8 `server/test_jooble.js` parece script ad-hoc, no test automatizable

Conviene borrarlo o convertirlo en un test real.

### 2.9 `public.html` tiene 442 líneas de CSS inline

`public.html:8-442`: debería extraerse a `styles/public.css`.

### 2.10 Acoplamiento alto entre `GitHubIntegration` y el shape `cvState.projects`

El código filtra por prefijo `github-repo-` para identificar proyectos GitHub.

Es frágil si se renombra la convención.

## 3. Seguridad

| ID | Riesgo | Severidad | Ubicación |
| --- | --- | --- | --- |
| S1 | Contraseñas en texto plano en `localStorage` | Crítico para producción | `AuthStorageService.js:249-250` |
| S2 | Sin throttle ni captcha en login/registro local | Alto | `AuthScreen.js:179-228` |
| S3 | XSS via `innerHTML` con datos externos | Alto si hay multiusuario | `PrintCVRenderer`, `PublicCVRenderer` |
| S4 | CORS abierto en proxy | Medio | `server.js:13` |
| S5 | Sin rate limiting en proxy | Medio | `server.js:15` |
| S6 | API key Jooble en `.env` sin rotación documentada | Bajo | `server/.env` |
| S7 | Sin CSP ni headers de seguridad | Medio | `index.html`, `public.html` |
| S8 | Sin Subresource Integrity para Google Fonts | Bajo | `index.html:11-13` |
| S9 | URLs externas en `<a target="_blank">` sí tienen `rel="noopener noreferrer"` | Correcto | — |

## 4. Accesibilidad

ARIA y `aria-live` están bien usados.

Aspectos a revisar:

- El `<form>` de login no captura `preventDefault` antes de validar email/password. El navegador permite submit con campos vacíos sin que JS bloquee la navegación si falla la validación HTML5, ya que no tiene `required`.
- Faltan `<label for>` en algunos campos del bloque GitHub avatar.
- Falta gestión de foco al cambiar de tab login/register.
- Los colores de `--public-accent` (`#a61d24`) sobre fondos claros tienen contraste aceptable, pero conviene auditar con axe.
- Falta `skip-to-content`.

## 5. Performance

- Sin minificación ni bundling: cada módulo es un request HTTP en producción, con unos 25 archivos JS y unos 28 KB de CSS sin minificar.
- Fuentes de Google Fonts cargadas sin `font-display: swap`.
- `PublicCVRenderer` carga 5 iconos SVG desde `cdn.jsdelivr.net` sin cache control propio.
- Sin lazy load de bloques: GitHub y JobSearch se montan siempre, aunque el usuario no los use.

## 6. Dependencias

- `server/package-lock.json` está committeado correctamente.
- `express ^4.19.2`, `cors ^2.8.5` y `dotenv ^16.4.5` están en uso.
- Express 5.x ya es estable.
- Falta auditoría de vulnerabilidades automatizada con `npm audit`.

## 7. Documentación

- La documentación interna en español es clara y está bien comentada.
- El `README` es muy extenso, con unas 262 líneas. Empieza a difuminar el qué del proyecto.
- Conviene reducir el `README` a la mitad y mover el resto a `docs/`.
- Falta una sección clara de cómo arrancar el proyecto en local con proxy.
- Falta `LICENSE`.

## 8. Plan de migración a React + TypeScript

### Filosofía

Hacerlo en 3 fases incrementales sin perder el MVP funcional.

No reescribir todo de golpe. La arquitectura factory-based actual mapea casi 1:1 a hooks y contextos de React.

### Fase 0 · Preparación

**Duración estimada:** medio día.

Pasos:

1. Decidir stack:
   - Vite + React 18 + TypeScript.
   - Recomendado: Vite, porque es una SPA simple y todavía no necesita SSR.
2. Crear rama `feat/react-migration`.
3. Instalar herramientas:
   - `vitest`
   - `@testing-library/react`
   - `eslint`
   - `prettier`
4. Mantener carpeta `legacy/` con el código actual durante la migración.

Comando inicial:

```bash
npm create vite@latest expertech-cv-builder -- --template react-ts
```

### Fase 1 · Andamiaje y modelos

**Duración estimada:** 1-2 días.

Migrar modelos a TypeScript. Los factories actuales se convierten en interfaces y funciones puras.

Ejemplo:

```ts
// src/models/PortfolioCV.ts
export interface CandidateProfile {
  fullName: string;
  headline: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  githubUsername: string;
  avatarUrl: string;
  avatarBase64: string;
  skills: string[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repoUrl: string;
  demoUrl: string;
  stack: string[];
  featured: boolean;
  sourceProvider: "github" | "manual" | "";
  // ... resto de campos source*
}

export interface PortfolioCV {
  profile: CandidateProfile;
  projects: Project[];
  meta: {
    version: number;
    lastUpdated: string;
    isDraft: boolean;
  };
}
```

Añadir validación runtime con Zod en las fronteras:

- Carga desde `localStorage`.
- API.
- JSON externo.

Servicios a convertir a módulos TypeScript puros:

| Servicio actual | Nuevo módulo recomendado |
| --- | --- |
| `CVStorageService` | `storage/cvStorage.ts` |
| `AuthStorageService` | `auth/authStorage.ts` |
| `GitHubProfileService` | `services/github.ts` |
| `JobOffersService` | `services/jobs.ts` |

### Fase 2 · UI a componentes React

**Duración estimada:** 3-5 días.

Mapeo directo de la arquitectura actual:

| Hoy, vanilla JS | Mañana, React |
| --- | --- |
| `AppRuntime.js` | `<App />` + `<AuthProvider />` |
| `AuthenticatedCVApp.js` | `<CVAppShell />` + `<CVStateContext>` |
| `AuthScreen.js` + template | `<AuthScreen />` |
| `ProfileEditor.js` | `<ProfileEditor />` con `react-hook-form` + Zod |
| `GitHubIntegration.js` | `<GitHubBlock />` + hook `useGitHubProfile(username)` con TanStack Query |
| `JobSearchIntegration.js` | `<JobSearchBlock />` + `useJobSearch()` |
| `PreviewRenderer.js` | `<CVPreview />` reactivo a `cvState` |
| `PrintCVRenderer.js` | `<PrintableCV />` con `@react-pdf/renderer` o `react-to-print` |
| `PublicCVRenderer.js` | Ruta `/public/:slug` o `<PublicCV />` |

Estructura propuesta:

```text
src/
├── main.tsx
├── App.tsx
├── routes.tsx                # react-router con rutas /, /public/:slug, /print
├── models/
│   ├── PortfolioCV.ts
│   └── schemas.ts            # Zod
├── state/
│   ├── CVStateContext.tsx    # Provider con useReducer
│   └── AuthContext.tsx
├── services/
│   ├── github.ts
│   ├── jobs.ts
│   ├── cvStorage.ts
│   └── auth.ts
├── hooks/
│   ├── useCVState.ts
│   ├── useGitHubProfile.ts
│   ├── useJobSearch.ts
│   └── useDebounce.ts
├── components/
│   ├── auth/
│   ├── editor/
│   │   ├── ProfileEditor.tsx
│   │   ├── GitHubBlock.tsx
│   │   ├── JobSearchBlock.tsx
│   │   └── SkillsEditor.tsx
│   ├── preview/
│   │   └── CVPreview.tsx
│   ├── print/
│   │   └── PrintableCV.tsx
│   └── ui/                   # botones, badges, empty-state, feedback
├── styles/
│   ├── globals.css
│   └── tokens.css            # CSS custom properties
└── tests/
```

### Fase 3 · Mejoras técnicas

**Duración estimada:** 2-3 días.

- TanStack Query para GitHub API y Jobs: cache, retries y deduplicación.
- `react-hook-form` + Zod para el formulario de perfil con validación tipo-segura.
- Tailwind CSS o CSS Modules. Sustitución gradual del CSS actual, manteniéndolo como `globals.css` mientras tanto.
- Vitest + Testing Library para tests de hooks y componentes críticos.
- MSW (Mock Service Worker) para mockear GitHub/Jooble en tests.
- `react-router-dom` con rutas `/`, `/login`, `/public/:username` y `/print`.

### Decisiones técnicas recomendadas

| Decisión | Recomendación | Razón |
| --- | --- | --- |
| Estado global | `useReducer` + Context | El estado del CV cabe sobradamente |
| Server state | TanStack Query | Caching nativo para GitHub/Jobs |
| Formularios | `react-hook-form` + Zod | Type-safe y buena DX |
| Estilos | Mantener CSS actual + CSS Modules | Evita reescribir CSS de 1500 líneas |
| Routing | `react-router-dom` v7 | Estable y tipado |
| Build | Vite | Más rápido que Next para SPA |
| Tests | Vitest + RTL + MSW | Estándar actual |
| PDF | `react-to-print` o `@react-pdf/renderer` | Continuidad con el enfoque actual |

### Migración del CSS

El CSS actual, `main.css` con unas 1477 líneas, se mantiene como `globals.css`.

Las clases usadas en JSX siguen funcionando. La limpieza puede hacerse después.

## 9. Mejoras de producto para MVP desplegable

### A. Bloqueantes para deploy real

- Backend de auth real: Supabase, Clerk o Auth.js. Necesario para multiusuario.
- Base de datos: Supabase Postgres o Neon. Almacenar perfiles por `userId`.
- Eliminar contraseñas en texto plano.
- URL del proxy configurable vía `VITE_JOBS_PROXY_URL`.
- CORS estricto en el proxy + rate limiting con `express-rate-limit`.
- Sanitizar HTML con DOMPurify antes de `innerHTML`, o usar React directamente.
- `.env.example` actualizada con todas las claves necesarias.

### B. Funcionalidades MVP que harían el producto mucho más útil

| Feature | Esfuerzo | Impacto |
| --- | --- | --- |
| OAuth real con GitHub, sustituyendo username manual | Medio | Alto |
| CV multi-template, con 3-4 plantillas: clásica, moderna, minimalista | Medio | Alto |
| URL pública única por usuario, `/u/:slug` | Alto, requiere BD | Alto |
| QR code en PDF apuntando a la URL pública | Bajo | Medio |
| Editor de skills con autocomplete desde una lista curada | Bajo | Medio |
| Editor de experiencia laboral | Medio | Crítico: un CV sin experiencia no es CV |
| Editor de educación / formación | Medio | Crítico |
| Soporte multi-idioma del CV, ES/EN | Alto | Alto |
| Export en JSON + import para portabilidad | Bajo | Medio |
| Versiones del CV, varias versiones por usuario | Medio | Medio |
| Compartir como link con expiración y view-count | Medio | Alto |
| Job matching real: cruzar skills del CV con resultados Jooble | Medio | Alto: es el diferencial |
| Modo oscuro | Bajo | Medio |
| Onboarding guiado primera vez | Bajo | Alto retención |

### C. Despliegue

#### Frontend

Build con Vite:

- Vercel, Netlify o Cloudflare Pages.
- Despliegue automático desde `main`.

#### Backend proxy

- Vercel Serverless Functions, recomendado y con capa gratuita.
- Railway o Fly.io si el proyecto crece.
- Mismo dominio que el frontend para evitar CORS innecesario.

#### Base de datos

- Supabase, con Postgres, auth y storage en capa gratuita.
- Alternativa: Neon + Auth.js.

#### Storage de avatares

- Supabase Storage.
- Cloudflare R2.

#### Dominio

Opciones:

- `expertech.app`
- `cv.expertech.dev`

### D. Checklist mínimo pre-deploy

- [ ] Migrar a React + TS, fases 1-2.
- [ ] Auth real con Supabase o Clerk.
- [ ] BD con aislamiento por usuario.
- [ ] Sanitización de HTML inyectado.
- [ ] CSP + headers de seguridad.
- [ ] Rate limit en proxy.
- [ ] CORS estricto.
- [ ] Variables de entorno separadas para dev/prod.
- [ ] Sentry o equivalente para errores en producción.
- [ ] Analytics básica con Plausible o Umami.
- [ ] Política de privacidad y términos.
- [ ] `LICENSE`.
- [ ] CI con tests + typecheck mediante GitHub Actions.
- [ ] Lighthouse > 90 en Performance, A11y y SEO.
- [ ] `robots.txt` y sitemap para vistas públicas.
- [ ] Open Graph + Twitter cards para preview compartido.

## 10. Resumen ejecutivo

El proyecto tiene una arquitectura muy limpia y bien comentada para ser vanilla JS, lo cual lo hace candidato ideal para migrar a React + TypeScript de forma incremental.

Los problemas principales no son arquitectónicos, sino de producto y seguridad:

- La auth en texto plano y sin base de datos bloquea cualquier despliegue serio.
- Faltan secciones críticas de un CV real, como experiencia y educación.
- El proxy de jobs tiene riesgos de abuso si se despliega tal cual.

Orden recomendado:

1. **Sprint 1:** migrar modelos y servicios a TypeScript sin React todavía. Esto saca a la luz inconsistencias del shape de datos.
2. **Sprint 2:** migrar UI a componentes React, manteniendo todo lo demás igual.
3. **Sprint 3:** sustituir auth local por Supabase Auth + BD.
4. **Sprint 4:** añadir editor de experiencia/educación, multi-template y URLs públicas con slug.
5. **Sprint 5:** endurecimiento con CSP, sanitización, rate limit, tests E2E y deploy.
