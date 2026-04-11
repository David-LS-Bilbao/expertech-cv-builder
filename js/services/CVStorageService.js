// Servicio de persistencia del CV en localStorage.
// Centraliza guardar, cargar y resetear el estado del CV
// sin mezclar esta lógica con los modelos ni con la UI.

import { createPortfolioCV } from "../models/PortfolioCV.js";
import { createInitialCVState } from "../models/createInitialCVState.js";

// Clave única de almacenamiento para el proyecto.
const CV_STORAGE_KEY = "expertech-cv";

// Firma exacta del proyecto demo antiguo que se sembraba en versiones previas.
// La usamos para limpiar el dato legado sin tocar proyectos manuales reales.
function isLegacySeededDemoProject(project = {}) {
  const normalizedStack = Array.isArray(project.stack) ? project.stack : [];

  return (
    project.id === "project-1" &&
    project.name === "EXPERTECH CV" &&
    project.description ===
      "MVP de currículum web interactivo para perfiles tech." &&
    project.repoUrl ===
      "https://github.com/David-LS-Bilbao/expertech-cv-builder" &&
    project.demoUrl === "" &&
    Boolean(project.featured) === true &&
    normalizedStack.length === 3 &&
    normalizedStack[0] === "HTML" &&
    normalizedStack[1] === "CSS" &&
    normalizedStack[2] === "JavaScript" &&
    !String(project.sourceProvider ?? "").trim()
  );
}

function removeLegacySeededDemoProject(cvState) {
  const normalizedCV = createPortfolioCV(cvState);
  const nextProjects = normalizedCV.projects.filter(
    (project) => !isLegacySeededDemoProject(project)
  );

  const hasRemovedLegacyDemo =
    nextProjects.length !== normalizedCV.projects.length;

  return {
    hasRemovedLegacyDemo,
    cvState: hasRemovedLegacyDemo
      ? createPortfolioCV({
          ...normalizedCV,
          projects: nextProjects,
        })
      : normalizedCV,
  };
}

// Indica si ya existe un CV persistido en el navegador.
export function hasStoredCV() {
  return localStorage.getItem(CV_STORAGE_KEY) !== null;
}

// Guarda el estado completo del CV en localStorage.
export function saveCV(cvState) {
  // Normalizamos antes de guardar para asegurar una estructura estable.
  const normalizedCV = createPortfolioCV({
    ...cvState,
    meta: {
      ...cvState?.meta,
      lastUpdated: new Date().toISOString(),
    },
  });

  localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(normalizedCV));

  return normalizedCV;
}

// Carga el estado del CV desde localStorage.
export function loadCV() {
  const storedCV = localStorage.getItem(CV_STORAGE_KEY);

  // Si no hay nada guardado, devolvemos el estado inicial del proyecto.
  if (!storedCV) {
    return createInitialCVState();
  }

  try {
    // Parseamos el contenido guardado.
    const parsedCV = JSON.parse(storedCV);

    // Normalizamos el resultado para evitar shapes rotas o incompletas.
    const { cvState, hasRemovedLegacyDemo } =
      removeLegacySeededDemoProject(parsedCV);

    // Si limpiamos el proyecto demo legado, dejamos también persistido
    // el estado saneado para que no vuelva a reaparecer al recargar.
    if (hasRemovedLegacyDemo) {
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(cvState));
    }

    return cvState;
  } catch (error) {
    // Si el JSON está corrupto, evitamos romper la app.
    console.error("Error al cargar el CV desde localStorage:", error);

    return createInitialCVState();
  }
}

// Elimina el estado guardado del CV.
export function resetCV() {
  localStorage.removeItem(CV_STORAGE_KEY);
}
