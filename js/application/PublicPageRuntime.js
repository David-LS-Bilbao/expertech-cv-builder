// Runtime específico de la página pública demo.
// Responsabilidades:
// 1. cargar el snapshot público del CV,
// 2. montar la vista pública con el mismo estado normalizado,
// 3. mantener public.html libre de lógica inline.

import { loadPublicCVData } from "../services/PublicCVDataService.js";
import { createPublicCVRenderer } from "../ui/PublicCVRenderer.js";

export function createPublicPageRuntime({
  rootSelector = "#public-cv-root",
  publicDataUrl = "./data/public-cv.json",
} = {}) {
  let publicCVRenderer = null;

  async function init() {
    publicCVRenderer = createPublicCVRenderer({
      rootSelector,
    });

    try {
      const publicCVData = await loadPublicCVData({
        publicDataUrl,
      });

      publicCVRenderer.init(publicCVData);
    } catch (error) {
      console.error("No se pudo inicializar la vista pública demo:", error);
      publicCVRenderer.renderUnavailableState({
        title: "La demo pública todavía no está disponible",
        message:
          "No se ha podido cargar el snapshot estático del CV. Revisa que el archivo público exista y vuelve a intentarlo.",
      });
    }

    return getPublicApi();
  }

  function getPublicApi() {
    return {
      init,
      getRenderer: () => publicCVRenderer,
    };
  }

  return getPublicApi();
}
