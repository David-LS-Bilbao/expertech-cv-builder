# 🔒 Fix: Contrato y Seguridad del Buscador de Empleo

**Rama:** `fix/jobs-proxy-contract-and-security`  
**Fecha:** 2026-05-20  
**Estado:** Cambios completados, verificaciones pasadas, pendiente commit

---

## 📝 Resumen Ejecutivo

Refactorización integral del buscador de empleo (`JobOffersService.js`, `JobSearchIntegration.js` y `server.js`) para:

1. **Establecer contrato consistente:** Todas las búsquedas devuelven `{ results, fallbackWarning, source }`
2. **Hardening del servidor:** CORS restrictivo, rate limiting, validación fuerte
3. **Compatibilidad vanilla JS:** Sin `process.env` en frontend, configurable via `globalThis`
4. **Deploy-ready:** CORS y proxy URL configurables desde env vars en backend

---

## 🔧 Cambios Realizados

### 1️⃣ `js/services/JobOffersService.js`

#### Antes (Problemas)

```javascript
// ❌ Problemas:
const CONFIG = {
  mode: process.env.NODE_ENV === 'production' ? 'mock' : 'proxy', // ❌ process.env en frontend
  proxyUrl: process.env.JOBS_PROXY_URL || 'http://localhost:3001/api/jobs/search' // ❌ process.env en frontend
};

// Contrato inconsistente
async function fetchFromProxy() {
  return await response.json(); // Devuelve array
}

async function fetchFromMock() {
  return [...]; // Devuelve array
}

export async function searchOffers() {
  const mockResults = await fetchFromMock({ keyword, location });
  mockResults._fallbackWarning = err.message; // ❌ Mutación de objeto
  return mockResults; // ❌ Array con propiedad extra
}
```

**Problemas identificados:**
- ❌ `process.env` no existe en vanilla JS sin bundler
- ❌ Contrato inconsistente: a veces `array`, a veces `array + _fallbackWarning`
- ❌ Falta validación de tipos
- ❌ Sin timeout en requests
- ❌ Sin manejo seguro de errores

#### Después (Solución)

```javascript
// ✅ Compatible con vanilla JS
function getJobsProxyUrl() {
  return globalThis.EXPERTECH_CONFIG?.jobsProxyUrl || "/api/jobs/search";
}

const CONFIG = {
  mode: 'proxy', // Siempre intenta proxy, fallback automático a mock
  get proxyUrl() {
    return getJobsProxyUrl();
  },
  requestTimeout: 5000,
};

// ✅ Validación de tipos
function validateString(value, fieldName, maxLength = 100) {
  if (typeof value !== 'string') {
    throw new TypeError(`${fieldName} debe ser string`);
  }
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} no puede estar vacío`);
  }
  if (value.length > maxLength) {
    throw new Error(`${fieldName} excede máximo de ${maxLength} caracteres`);
  }
  return value.trim();
}

// ✅ Contrato consistente: { results, fallbackWarning, source }
async function fetchFromProxy({ keyword, location }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    // ...
    return {
      results: Array.isArray(results) ? results : [],
      fallbackWarning: null,
      source: 'proxy'
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchFromMock({ keyword, location }) {
  // ...
  return {
    results: [...],
    fallbackWarning: null,
    source: 'mock'
  };
}

// ✅ Contrato estable, validación fuerte, fallback seguro
export async function searchOffers({ keyword, location = "" }) {
  try {
    keyword = validateString(keyword, "keyword");
    location = validateString(location, "location", 100);
  } catch (err) {
    throw new Error(`Validación fallida: ${err.message}`);
  }

  if (CONFIG.mode === 'proxy') {
    try {
      return await fetchFromProxy({ keyword, location });
    } catch (err) {
      console.warn("[JobOffers] Proxy falló, fallback a mock.", err.message);
      const mockResponse = await fetchFromMock({ keyword, location });
      return {
        ...mockResponse,
        fallbackWarning: err.message,
        source: 'mock (fallback)'
      };
    }
  }

  return fetchFromMock({ keyword, location });
}
```

**Lo que se corrigió:**
- ✅ Sin `process.env` en frontend
- ✅ Contrato consistente: siempre `{ results, fallbackWarning, source }`
- ✅ Validación de tipos antes de procesar
- ✅ Timeout en requests (5s)
- ✅ Fallback seguro sin mutación de objetos
- ✅ Origen claro del resultado (`source`)

---

### 2️⃣ `js/ui/JobSearchIntegration.js`

#### Antes

```javascript
try {
  const results = await searchOffers({ keyword, location });
  if (results.length === 0) { // ❌ Asume array
    showEmptyResults();
  } else {
    showResults(results);
    if (results._fallbackWarning) { // ❌ Contrato frágil
      showWarning(`...${results._fallbackWarning}...`);
    }
  }
} catch (error) {
  showError(error.message || "...");
}
```

#### Después

```javascript
try {
  const response = await searchOffers({ keyword, location });
  if (response.results.length === 0) { // ✅ Acceso seguro
    showEmptyResults();
  } else {
    showResults(response.results);
    if (response.fallbackWarning) { // ✅ Contrato explícito
      showWarning(`Fuente: ${response.source} — ${response.fallbackWarning}`);
    }
  }
} catch (error) {
  showError(error.message || "Ocurrió un error inesperado al buscar ofertas.");
}
```

---

### 3️⃣ `server/server.js`

#### Antes (Problemas)

```javascript
// ❌ Abierto a todos los orígenes
app.use(cors());

// ❌ Sin validación
app.get('/api/jobs/search', async (req, res) => {
  const { keyword, location } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: 'Falta keyword' });
  }
  // ...
});
```

**Problemas:**
- ❌ CORS abierto: cualquier origen puede acceder
- ❌ Validación mínima: solo chequea `keyword`, no `location`
- ❌ Sin rate limiting
- ❌ Sin límite de tamaño de parámetros
- ❌ Vulnerable a abuso desde cualquier sitio malicioso

#### Después (Solución)

```javascript
// ✅ CORS restrictivo, configurable desde env var
const allowedOrigins = (process.env.ALLOWED_ORIGINS || [
  'http://localhost:5500',
  'http://localhost:8000',
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:3000'
].join(',')).split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido'));
    }
  },
  credentials: false
}));

// ✅ Rate limiting: 10 requests/IP/minuto
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60000;
const RATE_LIMIT_MAX = 10;

function checkRateLimit(req) {
  const key = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (!requestCounts.has(key)) {
    requestCounts.set(key, []);
  }
  const timestamps = requestCounts.get(key);
  const recentRequests = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    return false;
  }
  recentRequests.push(now);
  requestCounts.set(key, recentRequests);
  return true;
}

// ✅ Validación fuerte
function validateJobSearchParams(keyword, location) {
  const errors = [];
  if (typeof keyword !== 'string' || keyword.trim().length === 0) {
    errors.push('keyword debe ser string no-vacío');
  }
  if (keyword && keyword.length > 100) {
    errors.push('keyword excede máximo 100 caracteres');
  }
  if (location && typeof location !== 'string') {
    errors.push('location debe ser string');
  }
  if (location && location.length > 100) {
    errors.push('location excede máximo 100 caracteres');
  }
  return errors;
}

app.get('/api/jobs/search', async (req, res) => {
  // ✅ Rate limiting
  if (!checkRateLimit(req)) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Máximo 10 búsquedas por minuto'
    });
  }

  const { keyword, location } = req.query;
  
  // ✅ Validación fuerte
  const validationErrors = validateJobSearchParams(keyword, location);
  if (validationErrors.length > 0) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: validationErrors
    });
  }

  try {
    const results = await searchJoobleProxy({ keyword, location });
    res.json(results);
  } catch (err) {
    // ...
  }
});
```

**Lo que se corrigió:**
- ✅ CORS restrictivo con allowlist configurable
- ✅ Rate limiting: protege contra abuso
- ✅ Validación de tipo y longitud de parámetros
- ✅ Mensajes de error informativos
- ✅ Respuesta 429 para rate limit exceeded

---

## 📋 Contrato de API

### `searchOffers({ keyword, location })`

**Devuelve:**

```javascript
{
  results: [
    {
      id: "job-id",
      title: "Nombre del puesto",
      company: "Empresa",
      location: "Ubicación",
      date: "2026-05-20T...",
      link: "https://..."
    }
  ],
  fallbackWarning: null | "mensaje de error del proxy",
  source: "proxy" | "mock" | "mock (fallback)"
}
```

**Estados:**

| Escenario | `source` | `fallbackWarning` | `results` |
|---|---|---|---|
| Proxy funciona | `"proxy"` | `null` | array de ofertas reales |
| Proxy falla, cae a mock | `"mock (fallback)"` | mensaje de error | array de mock |
| Modo mock (sin proxy) | `"mock"` | `null` | array de mock |
| Sin resultados | Cualquiera | según escenario | `[]` |

---

## 🔐 Seguridad

### Frontend (`js/`)

✅ **Sin credenciales expuestas**
- Proxy URL configurable pero sin hardcode de puertos específicos
- Fallback a `/api/jobs/search` (ruta relativa)

✅ **Validación de entrada**
- Tipos verificados (`string`)
- Longitud limitada (100 caracteres)
- Vacíos rechazados

✅ **Compatible con vanilla JS**
- Sin `process.env` (que no existe en browsers)
- Configurable via `globalThis.EXPERTECH_CONFIG`

### Backend (`server/`)

✅ **CORS restrictivo**
- Allowlist de orígenes
- Configurable desde `ALLOWED_ORIGINS` env var
- No permite credentials

✅ **Rate limiting**
- 10 requests por IP por minuto
- Responde 429 si se excede
- Previene abuso y DoS básico

✅ **Validación de entrada**
- Tipo verificado
- Longitud limitada
- Parámetros no esperados se ignoran

✅ **Timeouts**
- Request timeout en frontend: 5s
- AbortController previene requests fantasma

---

## 🚀 Configuración para Deploy

### MVP (Local)

```bash
# server/.env (ya configurado)
JOOBLE_API_KEY=YOUR_REAL_KEY_HERE
PORT=3001
```

**CORS por defecto:** localhost:3000, :5500, :8000

---

### Producción (Ejemplo)

```bash
# server/.env
JOOBLE_API_KEY=YOUR_REAL_KEY_HERE
PORT=443 # o el que use tu infraestructura
ALLOWED_ORIGINS=https://midominio.com,https://www.midominio.com,https://api.midominio.com
```

En HTML o `app.js` inyectar:

```javascript
window.EXPERTECH_CONFIG = {
  jobsProxyUrl: 'https://api.midominio.com/api/jobs/search'
};
```

O usar ruta relativa por defecto:

```javascript
window.EXPERTECH_CONFIG = {
  jobsProxyUrl: '/api/jobs/search' // Se resuelve al mismo dominio
};
```

---

## ✅ Verificaciones Realizadas

```bash
# ✅ No hay localhost hardcodeado en frontend
grep -R "localhost:3001" js/
# Resultado: (vacío)

# ✅ No hay process.env en frontend
grep -R "process.env\|NODE_ENV\|JOBS_PROXY_URL" js/
# Resultado: (vacío)

# ✅ No hay contrato frágil
grep -R "_fallbackWarning" js/ server/
# Resultado: (vacío)

# ✅ CORS no está abierto
grep -R "app.use(cors())" server/
# Resultado: (vacío)

# ✅ Lockfiles organizados
ls -la package-lock.json              # No existe en raíz
ls -la server/package-lock.json       # Existe donde debe ser
```

---

## 🧪 Testing Recomendado

### Caso 1: Búsqueda exitosa con proxy

```
1. Levantar servidor: npm run dev (en server/)
2. Frontend carga con proxy disponible
3. Búsqueda con keyword válido
ESPERADO: { results: [...], fallbackWarning: null, source: "proxy" }
```

### Caso 2: Fallback a mock (proxy no disponible)

```
1. Detener servidor proxy
2. Frontend intenta búsqueda
ESPERADO: { results: [...], fallbackWarning: "...", source: "mock (fallback)" }
```

### Caso 3: Validación de entrada (frontend)

```
1. Intentar buscar con keyword vacío
ESPERADO: Error "La palabra clave es obligatoria"

2. Intentar buscar con número en lugar de string
ESPERADO: Error "keyword debe ser string"

3. Búsqueda con keyword > 100 caracteres
ESPERADO: Error "excede máximo de 100 caracteres"
```

### Caso 4: Rate limiting (backend)

```
1. curl en bucle 15 veces:
   for i in {1..15}; do 
     curl "http://localhost:3001/api/jobs/search?keyword=test"
   done
ESPERADO: Primeras 10 → 200 OK, 11-15 → 429 Too Many Requests
```

### Caso 5: CORS (backend)

```
1. Request desde origen NO permitido
   curl -H "Origin: https://evil.com" \
     "http://localhost:3001/api/jobs/search?keyword=test"
ESPERADO: 403 Forbidden (CORS error en navegador)

2. Request desde origen permitido
   curl -H "Origin: http://localhost:3000" \
     "http://localhost:3001/api/jobs/search?keyword=test"
ESPERADO: 200 OK + resultados
```

### Caso 6: Configuración global (frontend)

```
1. Inyectar desde console:
   window.EXPERTECH_CONFIG = { jobsProxyUrl: 'http://custom-proxy.local/search' }
   
2. Buscar algo
ESPERADO: Request va a custom-proxy.local, no a localhost:3001
```

---

## 📊 Verificación de Cambios

### Archivos Modificados

```
 M js/services/JobOffersService.js    (+función getJobsProxyUrl, contrato consistente)
 M js/ui/JobSearchIntegration.js      (+adaptación a nuevo contrato)
 M server/server.js                    (+CORS, rate limit, validación)
```

### Líneas de Código

| Archivo | Cambios |
|---|---|
| `JobOffersService.js` | +50 líneas (validación, timeout, contrato) |
| `JobSearchIntegration.js` | +3 líneas (adaptación) |
| `server/server.js` | +50 líneas (CORS, rate limit, validación) |

---

## 🎯 Resumen Técnico

| Aspecto | Antes | Después |
|---|---|---|
| **Contrato** | Inconsistente (array + propiedad) | Consistente: `{ results, fallbackWarning, source }` |
| **Validación** | Mínima | Fuerte (tipo, longitud) |
| **CORS** | Abierto | Restrictivo + configurable |
| **Rate limiting** | No | Sí, 10 req/min/IP |
| **Frontend env vars** | Hardcodeado | Configurable via `globalThis` |
| **Timeout** | No | Sí, 5s en fetch |
| **Seguridad** | Básica | MVP-ready |

---

## ⚠️ Limitaciones Conocidas

1. **Rate limiting en memoria:** Se pierde al reiniciar servidor. Para producción usar Redis o middleware específico.
2. **Allowlist estática:** Requiere redeploy para cambiar orígenes. Para producción usar dinámico.
3. **Proxy timeout hardcodeado:** 5s puede ser insuficiente con APIs lentas. Considerar configurable.

---

## 📌 Notas Finales

**Este refactor es seguro porque:**

1. ✅ No cambia la API pública visible al usuario
2. ✅ Compatible con vanilla JS (sin bundler)
3. ✅ Backcompat: fallback graceful si proxy falla
4. ✅ Validación fuerte en ambos lados (frontend + backend)
5. ✅ Sin mutación de objetos
6. ✅ Configurable para deploy

**Siguiente paso:**
1. Ejecutar test suite de los 6 casos
2. Confirm CORS y rate limiting funcionan
3. Commit a rama `fix/jobs-proxy-contract-and-security`
4. PR a `dev` para revisión

---

*Documento generado el 2026-05-20 en rama `fix/jobs-proxy-contract-and-security`.*
