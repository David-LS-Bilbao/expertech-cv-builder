// Servicio de persistencia del CV en localStorage.
// Centraliza guardar, cargar y resetear el estado del CV
// sin mezclar esta lógica con los modelos ni con la UI.

import { createPortfolioCV } from "../models/PortfolioCV.js";
import { createInitialCVState } from "../models/createInitialCVState.js";

// Clave única de almacenamiento para el proyecto.
const CV_STORAGE_KEY = "expertech-cv";

// Guarda el estado completo del CV en localStorage.
export function saveCV(cvState) {
  // Normalizamos antes de guardar para asegurar una estructura estable.
  const normalizedCV = createPortfolioCV(cvState);

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
    return createPortfolioCV(parsedCV);
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