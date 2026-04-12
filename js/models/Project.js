// Factory de un proyecto del portfolio.
// Devuelve una estructura estable para poder mostrar, filtrar
// y guardar proyectos del CV sin depender todavía de la UI.

export function createProject(data = {}) {
  return {
    // Identificador del proyecto.
    // Por ahora se deja vacío si no llega uno.
    id: data.id ?? "",

    // Nombre visible del proyecto.
    name: data.name ?? "",

    // Descripción breve orientada a recruiter.
    description: data.description ?? "",

    // Enlace al repositorio del proyecto.
    repoUrl: data.repoUrl ?? "",

    // Enlace a demo o despliegue si existe.
    demoUrl: data.demoUrl ?? "",

    // Stack tecnológico del proyecto.
    // Siempre debe ser un array para evitar errores posteriores.
    stack: Array.isArray(data.stack) ? data.stack : [],

    // Indica si el proyecto está marcado como destacado.
    // Se fuerza a booleano para mantener consistencia.
    featured: Boolean(data.featured),

    // Metadatos mínimos del origen del proyecto.
    // En este MVP sirven para mantener trazabilidad básica
    // sin abrir todavía verificación avanzada de autoría.
    sourceProvider: data.sourceProvider ?? "",
    sourceRepositoryId: data.sourceRepositoryId ?? "",
    sourceRepositoryName: data.sourceRepositoryName ?? "",
    sourceRepositoryFullName: data.sourceRepositoryFullName ?? "",
    sourceRepositoryUrl: data.sourceRepositoryUrl ?? "",
    sourceOwnerLogin: data.sourceOwnerLogin ?? "",
    sourceOwnerType: data.sourceOwnerType ?? "",
    sourceImportedAt: data.sourceImportedAt ?? "",
    sourceRelation: data.sourceRelation ?? "",
  };
}
