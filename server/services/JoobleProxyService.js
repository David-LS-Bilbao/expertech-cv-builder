/**
 * Servicio proxy local para Jooble.
 * Evolucionará de Fallback Honesto -> Request Real usando la API KEY en el próximo paso.
 */

export async function searchJoobleProxy({ keyword, location }) {
  const apiKey = process.env.JOOBLE_API_KEY;

  if (!apiKey) {
    // Si no hay credenciales lanzamos el error esperado por el middleware del express
    throw new Error('CREDENTIALS_MISSING');
  }

  try {
    const url = `https://es.jooble.org/api/${apiKey}`;
    
    // Payload de Jooble
    const payload = {
      keywords: keyword,
      ...(location ? { location } : {})
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Error de Jooble API. Status: ${res.status}`);
    }

    const data = await res.json();

    if (!data || !data.jobs) {
      return [];
    }

    // Normalizar a formato interno del Frontend
    return data.jobs.map((job) => ({
      id: String(job.id),
      // Jooble devuelve algo de HTML a veces en el title, limpiaremos con precaución o dejaremos suelto
      title: job.title || "Sin título",
      company: job.company || "Empresa Confidencial",
      location: job.location || "Remoto/Desconocido",
      date: job.updated || new Date().toISOString(),
      link: job.link || "#"
    }));
  } catch (error) {
    console.error("Error en el servicio Proxy de Jooble (fetch real):", error);
    throw new Error("Fallo la llamada a Jooble Real: " + error.message);
  }
}
