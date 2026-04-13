// Servicio para abstraer el origen de datos de ofertas de empleo.
// Responsabilidad: exponer un contrato consistente para búsqueda de ofertas.
// Soporta dos modos: "mock" y "proxy".
// Por defecto se encuentra en modo "mock" ya que no disponemos de proxy backend con credenciales.

const CONFIG = {
  // Modo base para entorno local de desarrollo.
  // En despliegue estático (ej. GitHub Pages) degradamos automáticamente a mock.
  mode: "proxy",
  proxyUrl: "http://localhost:3001/api/jobs/search",
};

function isLocalRuntime() {
  const hostname = String(window.location.hostname || "").toLowerCase();
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  );
}

function resolveRuntimeMode() {
  if (CONFIG.mode === "mock") {
    return "mock";
  }

  // En despliegue estático no existe proxy local, así que usamos mock
  // para evitar errores de red al usuario final.
  if (!isLocalRuntime()) {
    return "mock";
  }

  return "proxy";
}

/**
 * Petición al servidor local (Proxy).
 */
async function fetchFromProxy({ keyword, location }) {
  const urlParams = new URLSearchParams({ keyword });
  if (location) {
    urlParams.append('location', location);
  }

  const endpoint = `${CONFIG.proxyUrl}?${urlParams.toString()}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    let errorData = {};
    try {
      errorData = await response.json();
    } catch {
      errorData.message = `HTTP Error ${response.status}`;
    }
    
    // Si el proxy responde con un estado 503 (fallback sin credenciales de Jooble)
    if (response.status === 503) {
      throw new Error("El servicio Proxy no tiene configuradas las llaves reales de Jooble.");
    }
    
    throw new Error(errorData.error || errorData.message || "Error al conectar con el proxy.");
  }

  return await response.json();
}

/**
 * Petición al sistema simulado original (Mock).
 */
async function fetchFromMock({ keyword, location }) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  // Simulamos latencia de red (mock provider)
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Simulación explícita de error para validar la UI
  if (normalizedKeyword === "error-test") {
    throw new Error("Error simulado del proveedor de ofertas (Mock).");
  }

  // Simulación de estado vacío para validar la UI
  if (normalizedKeyword === "sinresultados") {
    return [];
  }

  // Resultados genéricos simulados
  return [
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
  ];
}


export async function searchOffers({ keyword, location = "" }) {
  if (!keyword || keyword.trim() === "") {
    throw new Error("La palabra clave es obligatoria.");
  }

  const runtimeMode = resolveRuntimeMode();

  if (runtimeMode === "proxy") {
    try {
      return await fetchFromProxy({ keyword, location });
    } catch (err) {
      console.warn("Proxy falló, devolviendo mock data. Error:", err.message);
      const mockResults = await fetchFromMock({ keyword, location });
      mockResults._fallbackWarning = err.message;
      return mockResults;
    }
  }

  const mockResults = await fetchFromMock({ keyword, location });
  mockResults._fallbackWarning =
    "Despliegue estático detectado: mostrando datos mock (sin backend proxy).";
  return mockResults;
}
