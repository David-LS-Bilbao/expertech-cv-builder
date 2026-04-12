import { createPortfolioCV } from "../models/PortfolioCV.js";
import { createPreviewRenderer } from "./PreviewRenderer.js";

/**
 * PublicCVRenderer
 * Se encarga de renderizar la demo pública del CV
 * a partir de un estado ya cargado por la capa superior.
 */
export function createPublicCVRenderer({
  rootSelector = "#public-cv-root"
} = {}) {
  let cvRenderer = null;

  function getRootElement() {
    return document.querySelector(rootSelector);
  }

  function updateDocumentTitle(cvState = {}) {
    const normalizedCV = createPortfolioCV(cvState);
    const fullName = String(normalizedCV.profile?.fullName ?? "").trim();

    document.title = fullName
      ? `${fullName} | Expertech CV`
      : "Perfil Profesional | Expertech CV";
  }

  function renderUnavailableState({
    title = "La vista pública todavía no está disponible",
    message = "No se ha podido cargar el contenido público del CV.",
  } = {}) {
    const root = getRootElement();

    if (!root) {
      console.error("No se encontró el contenedor para la vista pública.");
      return;
    }

    document.title = "Perfil Profesional | Expertech CV";
    root.innerHTML = `
      <article class="preview-card">
        <div class="preview-card-body">
          <section class="preview-section">
            <h2 class="preview-section-title">${title}</h2>
            <p>${message}</p>
          </section>
        </div>
      </article>
    `;
  }

  function init(initialCVState = {}) {
    const root = getRootElement();
    if (!root) {
      console.error("No se encontró el contenedor para la vista pública.");
      return;
    }

    const cvData = createPortfolioCV(initialCVState);
    updateDocumentTitle(cvData);

    cvRenderer = createPreviewRenderer({
      previewRootSelector: rootSelector,
      initialCVState: cvData
    });

    if (cvRenderer) {
      cvRenderer.init();
      console.log("Vista pública demo renderizada con éxito.");
    }
  }

  function updateCVState(nextCVState = {}) {
    const cvData = createPortfolioCV(nextCVState);
    updateDocumentTitle(cvData);

    if (!cvRenderer) {
      init(cvData);
      return;
    }

    cvRenderer.updateCVState(cvData);
  }

  return {
    init,
    updateCVState,
    renderUnavailableState,
  };
}
