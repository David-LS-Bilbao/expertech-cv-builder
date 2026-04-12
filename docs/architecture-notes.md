# Notas de arquitectura

## Estado arquitectónico actual

La arquitectura ya no está en fase de preparación inicial. El proyecto funciona como un MVP frontend modular con auth local de demostración, estado persistido del CV, integración pública básica con GitHub y una capa visual separada por templates y renderizadores.

## Estructura actual

- `index.html`: shell base de la aplicación
- `styles/reset.css`: normalización visual
- `styles/main.css`: estilos globales y componentes visuales
- `js/app.js`: entry point mínimo y composition root
- `js/application/`: runtime global y coordinación de la app autenticada
- `js/models/`: factories y normalización del contrato de datos
- `js/services/`: persistencia local, auth MVP e integración GitHub
- `js/ui/`: controladores UI y templates reutilizables
- `js/utils/`: utilidades compartidas

## Decisiones vigentes

- mantener `app.js` lo más pequeño posible
- separar auth/sesión de la app autenticada
- centralizar la normalización del estado en `models`
- dejar GitHub como integración pública, sin OAuth ni backend en esta fase
- conservar compatibilidad con `localStorage` al introducir nuevos campos en proyectos
- proteger proyectos manuales reales cuando se mezclan con proyectos importados desde GitHub

## Piezas clave de la arquitectura actual

- `js/application/AppRuntime.js`
  - decide si se muestra auth o app autenticada
  - restaura sesión y gestiona logout

- `js/application/AuthenticatedCVApp.js`
  - coordina el estado del CV
  - sincroniza editor, preview y bloque GitHub
  - transforma repositorios seleccionados en proyectos persistidos

- `js/application/PublicPageRuntime.js`
  - coordina la demo pública estática
  - carga un snapshot público del CV
  - mantiene `public.html` libre de lógica inline

- `js/services/CVStorageService.js`
  - guarda y carga el CV desde `localStorage`
  - normaliza el estado y sanea datos demo legacy cuando corresponde

- `js/services/PublicCVDataService.js`
  - carga el snapshot público desde `data/public-cv.json`
  - desacopla la demo pública del `localStorage` del editor

- `js/services/GitHubProfileService.js`
  - consulta perfil y repos públicos
  - devuelve datos ya normalizados para la UI

- `js/services/JobOffersService.js`
  - expone búsqueda de ofertas en dos modos: `proxy` y `mock`
  - mantiene fallback controlado a mock cuando la llamada real falla

- `js/ui/PreviewRenderer.js`
  - renderiza perfil y proyectos desde `cvState`
  - muestra trazabilidad mínima del origen GitHub cuando existe

- `js/ui/PublicCVRenderer.js`
  - reutiliza el mismo contrato de datos del CV para la demo pública
  - alimenta hero, metadatos visibles y documento central sin depender del editor

- `js/ui/JobSearchIntegration.js` + `js/ui/JobSearchBlockTemplate.js`
  - inyectan y controlan el bloque de búsqueda de empleo en la app autenticada
  - gestionan estados de UI de búsqueda (loading, éxito, vacío y error)

- `server/server.js` + `server/services/JoobleProxyService.js`
  - base de proxy local para ocultar credenciales de proveedor de empleo
  - estado actual: MVP inicial, integración real aún no estable

## Riesgos a vigilar

- mezclar en una misma feature auth, GitHub y exportación
- hacer crecer demasiado `AuthenticatedCVApp.js` sin extraer coordinación cuando de verdad haga falta
- romper compatibilidad con proyectos ya persistidos en `localStorage`
- ampliar GitHub hacia múltiples cuentas o colaboraciones sin definir antes el contrato de datos que lo soporte
- mezclar la demo pública estática con la lógica del editor en lugar de mantener un runtime separado
- dar por cerrada la integración real de ofertas cuando aún depende de fallback mock
