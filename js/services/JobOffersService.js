// Servicio para abstraer el origen de datos de ofertas de empleo.
// Responsabilidad: exponer un contrato consistente para búsqueda de ofertas.
// Devuelve siempre: { results: [], fallbackWarning: null, source: "proxy"|"mock" }

function getJobsProxyUrl() {
  return globalThis.EXPERTECH_CONFIG?.jobsProxyUrl || "/api/jobs/search";
}

const CONFIG = {
  mode: 'proxy', // Siempre intenta proxy primero, fallback automático a mock si falla.
  get proxyUrl() {
    return getJobsProxyUrl();
  },
  requestTimeout: 5000,
};

function validateString(value, fieldName, maxLength = 100) {
  if (typeof value !== 'string') {
    throw new TypeError(`${fieldName} debe ser string, recibido: ${typeof value}`);
  }
  if (value.trim().length === 0) {
    throw new Error(`${fieldName} no puede estar vacío.`);
  }
  if (value.length > maxLength) {
    throw new Error(`${fieldName} excede máximo de ${maxLength} caracteres.`);
  }
  return value.trim();
}

/**
 * Petición al servidor local (Proxy).
 * Retorna contrato consistente: { results, fallbackWarning, source }
 */
async function fetchFromProxy({ keyword, location }) {
  const urlParams = new URLSearchParams({ keyword });
  if (location) {
    urlParams.append('location', location);
  }

  const endpoint = `${CONFIG.proxyUrl}?${urlParams.toString()}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

  try {
    const response = await fetch(endpoint, { signal: controller.signal });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData.message = `HTTP Error ${response.status}`;
      }

      if (response.status === 503) {
        throw new Error("Proxy: credenciales de Jooble no configuradas.");
      }

      throw new Error(errorData.error || errorData.message || "Error al conectar con proxy.");
    }

    const results = await response.json();
    return {
      results: Array.isArray(results) ? results : [],
      fallbackWarning: null,
      source: 'proxy'
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Sistema simulado (Mock).
 * Retorna contrato consistente: { results, fallbackWarning, source }
 */
async function fetchFromMock({ keyword, location }) {
  const normalizedKeyword = keyword.toLowerCase();

  await new Promise((resolve) => setTimeout(resolve, 800));

  if (normalizedKeyword === "error-test") {
    throw new Error("Error simulado del proveedor (Mock).");
  }

  if (normalizedKeyword === "sinresultados") {
    return {
      results: [],
      fallbackWarning: null,
      source: 'mock'
    };
  }

  return {
    results: [
      {
        id: "mock-job-1",
        title: "Senior Developer - " + keyword,
        company: "Tech Corp Innovations",
        location: location || "Remoto",
        date: new Date().toISOString(),
        link: "#"
      },
      {
        id: "mock-job-2",
        title: "Frontend Engineer - Experto en " + keyword,
        company: "Startup XYZ",
        location: location || "Madrid, España",
        date: new Date().toISOString(),
        link: "#"
      },
      {
        id: "mock-job-3",
        title: "Desarrollador Web (" + keyword + ")",
        company: "Agencia Digital",
        location: location || "Barcelona, España",
        date: new Date().toISOString(),
        link: "#"
      }
    ],
    fallbackWarning: null,
    source: 'mock'
  };
}


/**
 * Busca ofertas de empleo.
 * Retorna siempre: { results: [], fallbackWarning: null|string, source: "proxy"|"mock" }
 */
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
