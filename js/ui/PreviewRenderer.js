// Renderizador mínimo de la preview del CV.
// Responsabilidades de este módulo:
// 1. localizar los nodos del preview en el DOM,
// 2. pintar nombre, titular y resumen a partir del estado,
// 3. mostrar u ocultar el empty-state de ayuda,
// 4. permitir re-render cuando cambie el perfil.
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
  emptyStateSelector = "#preview-empty-state",
  initialCVState,
} = {}) {
  // Normalizamos el estado para trabajar siempre con la misma estructura.
  let currentCVState = createPortfolioCV(initialCVState);

  // Buscamos los nodos reales de la preview.
  const fullNameElement = document.querySelector(fullNameSelector);
  const headlineElement = document.querySelector(headlineSelector);
  const summaryElement = document.querySelector(summarySelector);
  const emptyStateElement = document.querySelector(emptyStateSelector);

  // Los tres nodos principales sí son obligatorios para esta feature.
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

  // Indica si el perfil tiene contenido real suficiente
  // como para considerar que la preview ya no está vacía.
  // Regla MVP:
  // si hay al menos uno de estos campos con texto, ocultamos la ayuda.
  function hasPreviewContent(profileData = {}) {
    const fullName = String(profileData.fullName ?? "").trim();
    const headline = String(profileData.headline ?? "").trim();
    const summary = String(profileData.summary ?? "").trim();

    return Boolean(fullName || headline || summary);
  }

  // Muestra u oculta el empty-state del preview.
  // Si no existe el nodo en el HTML, no rompemos la app.
  function renderEmptyState(profileData = {}) {
    if (!emptyStateElement) {
      return;
    }

    const shouldShowEmptyState = !hasPreviewContent(profileData);

    // Usamos la propiedad hidden porque es simple, semántica y suficiente para este MVP.
    emptyStateElement.hidden = !shouldShowEmptyState;
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

    renderEmptyState(profileData);
  }

  // Render principal de esta feature.
  // Ahora mismo solo renderiza profile.
  function render() {
    renderProfile(currentCVState.profile);
  }

  // Permite actualizar el estado desde fuera y volver a pintar.
  // Esto será lo normal cuando app.js reciba cambios del formulario.
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
      emptyStateElement,
    }),
  };
}