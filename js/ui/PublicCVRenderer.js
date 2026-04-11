import { createPortfolioCV } from "../models/PortfolioCV.js";
import { loadCV, hasStoredCV } from "../services/CVStorageService.js";
import { createPreviewRenderer } from "./PreviewRenderer.js";

/**
 * PublicCVRenderer
 * Se encarga de cargar los datos del CV desde el almacenamiento local
 * y renderizarlos simulando la vista previa interna de la aplicación.
 */
export function createPublicCVRenderer({
  rootSelector = "#public-cv-root"
} = {}) {
  let cvRenderer = null;

  function updateDocumentTitle(cvState = {}) {
    const normalizedCV = createPortfolioCV(cvState);
    const fullName = String(normalizedCV.profile?.fullName ?? "").trim();

    document.title = fullName
      ? `${fullName} | Expertech CV`
      : "Perfil Profesional | Expertech CV";
  }

  function init() {
    const root = document.querySelector(rootSelector);
    if (!root) {
      console.error("No se encontró el contenedor para la vista pública.");
      return;
    }

    if (!hasStoredCV()) {
      root.innerHTML = `
        <article class="preview-card">
          <div class="preview-card-body">
            <section class="preview-section">
              <h2 class="preview-section-title">Todavía no hay un CV listo para mostrar</h2>
              <p>
                Crea o guarda primero tu perfil en la aplicación principal y después vuelve
                a esta vista para revisarlo con aspecto de página pública.
              </p>
            </section>
          </div>
        </article>
      `;
      return;
    }

    const cvData = loadCV();
    updateDocumentTitle(cvData);

    cvRenderer = createPreviewRenderer({
      previewRootSelector: rootSelector,
      initialCVState: cvData
    });

    if (cvRenderer) {
      cvRenderer.init();
      console.log("Vista pública renderizada con éxito usando PreviewRenderer.");
    }
  }

  return { init };
}
