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

  function init() {
    const root = document.querySelector(rootSelector);
    if (!root) {
      console.error("No se encontró el contenedor para la vista pública.");
      return;
    }

    if (!hasStoredCV()) {
      root.innerHTML = `<div class="p-8 text-center"><p>No hay datos de CV guardados. Por favor, crea tu perfil primero.</p></div>`;
      return;
    }

    const cvData = loadCV();
    
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

