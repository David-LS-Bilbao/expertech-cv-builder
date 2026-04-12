// Entry point mínimo de la demo pública.
// Mantiene la misma idea que app.js:
// - composition root pequeño
// - runtime separado
// - sin lógica inline en public.html

import { createPublicPageRuntime } from "./application/PublicPageRuntime.js";

console.log("EXPERTECH CV · demo pública inicializada");

function initPublicPage() {
  const publicPageRuntime = createPublicPageRuntime({
    rootSelector: "#public-cv-root",
    publicDataUrl: "./data/public-cv.json",
  });

  publicPageRuntime.init();

  window.cvPublicDebug = {
    ...(window.cvPublicDebug ?? {}),
    publicPageRuntime,
  };
}

initPublicPage();
