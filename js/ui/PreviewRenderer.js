// Renderizador mínimo de la preview del CV.
// Responsabilidades de este módulo:
// 1. localizar los nodos del preview en el DOM,
// 2. pintar nombre, titular y resumen a partir del estado,
// 3. permitir re-render cuando cambie el perfil.
//
// Importante:
// - no guarda nada en localStorage,
// - no lee directamente del formulario,
// - no toca skills ni proyectos todavía,
// - su única misión es reflejar datos ya existentes del estado.

import { createPortfolioCV } from "../models/PortfolioCV.js";

// Textos fallback por si algún campo todavía está vacío.
// Así evitamos que el preview quede roto o con huecos raros.
const PREVIEW_FALLBACKS = {
  fullName: "Nombre Apellido",
  headline: "Titular profesional",
  summary: "Añade un resumen profesional para ver aquí una vista previa recruiter-friendly.",
};

// Crea el renderizador de preview.
// Recibe selectores configurables por si en el futuro cambia el HTML.
export function createPreviewRenderer({
  fullNameSelector = "#preview-full-name",
  headlineSelector = "#preview-headline",
  summarySelector = "#preview-summary",
  initialCVState,
} = {}) {
  // Normalizamos el estado para trabajar siempre con la misma estructura.
  let currentCVState = createPortfolioCV(initialCVState);

  // Buscamos los nodos reales de la preview.
  const fullNameElement = document.querySelector(fullNameSelector);
  const headlineElement = document.querySelector(headlineSelector);
  const summaryElement = document.querySelector(summarySelector);

  // Si falta alguno, devolvemos null para que app.js lo gestione de forma clara.
  if (!fullNameElement || !headlineElement || !summaryElement) {
    console.error("No se pudo inicializar PreviewRenderer: faltan nodos del preview.");
    return null;
  }

  // Devuelve texto útil para preview:
  // - si hay valor, usa el valor real
  // - si no, usa el fallback visual
  function getDisplayValue(value, fallback) {
    const normalizedValue = String(value ?? "").trim();
    return normalizedValue || fallback;
  }

  // Pinta solo el bloque de perfil en la preview.
  function renderProfile(profileData = {}) {
    fullNameElement.textContent = getDisplayValue(
      profileData.fullName,
      PREVIEW_FALLBACKS.fullName
    );

    headlineElement.textContent = getDisplayValue(
      profileData.headline,
      PREVIEW_FALLBACKS.headline
    );

    summaryElement.textContent = getDisplayValue(
      profileData.summary,
      PREVIEW_FALLBACKS.summary
    );
  }

  // Render principal de esta feature.
  // Ahora mismo solo renderiza profile.
  function render() {
    renderProfile(currentCVState.profile);
  }

  // Permite actualizar el estado desde fuera y volver a pintar.
  // Esto será lo normal cuando app.js guarde cambios del formulario.
  function updateCVState(nextCVState) {
    currentCVState = createPortfolioCV(nextCVState);
    render();
  }

  // Inicializa el renderizador pintando el estado inicial.
  function init() {
    render();
  }

  // API pública mínima del módulo.
  return {
    init,
    render,
    updateCVState,
    getCVState: () => createPortfolioCV(currentCVState),
    getElements: () => ({
      fullNameElement,
      headlineElement,
      summaryElement,
    }),
  };
}