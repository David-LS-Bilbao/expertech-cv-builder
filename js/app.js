// Entry point mínimo de la aplicación.
// Responsabilidades de este archivo:
// 1. crear el runtime global,
// 2. ejecutar el arranque,
// 3. dejar app.js como composition root limpio.
//
// Importante:
// - la auth runtime ya vive en AppRuntime,
// - la app autenticada ya vive en AuthenticatedCVApp,
// - este archivo no debería volver a crecer con lógica de producto.

import { createAppRuntime } from "./application/AppRuntime.js";

console.log("EXPERTECH CV · app inicializada");

function initApp() {
  const appRuntime = createAppRuntime({
    profileFormSelector: "#profile-form",
    profileFeedbackSelector: "#profile-form-feedback",
    authScreenSelector: "#auth-screen",
    authenticatedAppSelector: "#app-shell-authenticated",
    logoutButtonSelector: "#logout-button",
  });

  appRuntime.init();

  // Debug mínimo opcional para desarrollo.
  window.cvAppDebug = {
    ...(window.cvAppDebug ?? {}),
    appRuntime,
  };
}

initApp();