// Modelo raíz del estado del CV.
// Agrupa el perfil del candidato, la lista de proyectos
// y la información meta del documento.

import { createCandidateProfile } from "./CandidateProfile.js";
import { createProject } from "./Project.js";

export function createPortfolioCV(data = {}) {
  return {
    // Perfil principal del candidato.
    // Siempre se normaliza con su factory para asegurar estructura estable.
    profile: createCandidateProfile(data.profile),

    // Lista de proyectos del CV.
    // Cada elemento se transforma con createProject para mantener consistencia.
    projects: Array.isArray(data.projects)
      ? data.projects.map((project) => createProject(project))
      : [],

    // Información auxiliar del estado del CV.
    meta: {
      // Versión del contrato de datos del CV.
      version: data.meta?.version ?? 1,

      // Fecha de última actualización.
      // Por ahora queda vacía hasta que la gestione otra feature.
      lastUpdated: data.meta?.lastUpdated ?? "",

      // Indica si el CV está en modo borrador.
      isDraft: data.meta?.isDraft ?? true,
    },
  };
}