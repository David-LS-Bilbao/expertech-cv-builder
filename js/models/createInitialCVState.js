// Crea el estado inicial completo del CV.
// Sirve como punto de partida estable para el editor, la preview
// y futuras features como localStorage o render dinámico.

import { createPortfolioCV } from "./PortfolioCV.js";

export function createInitialCVState() {
  return createPortfolioCV({
    profile: {
      // Datos base vacíos del candidato al iniciar la app.
      fullName: "",
      headline: "",
      summary: "",
      email: "",
      phone: "",
      location: "",
      linkedinUrl: "",
      githubUsername: "",
      skills: [],
    },

    // Al inicio no hay proyectos cargados ni seleccionados.
    projects: [],

    // Metadatos base del documento CV.
    meta: {
      version: 1,
      lastUpdated: "",
      isDraft: true,
    },
  });
}