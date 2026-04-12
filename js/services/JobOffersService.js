// Servicio para abstraer el origen de datos de ofertas de empleo.
// Responsabilidad: exponer un contrato consistente para búsqueda de ofertas.
// Actualmente usa un Mock Provider honesto para el MVP.

export async function searchOffers({ keyword, location = "" }) {
  if (!keyword || keyword.trim() === "") {
    throw new Error("La palabra clave es obligatoria.");
  }

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
