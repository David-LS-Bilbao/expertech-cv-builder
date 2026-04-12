// Runtime principal de la aplicación.
// Responsabilidades de este módulo:
// 1. arrancar la capa de auth local,
// 2. arrancar la app autenticada cuando la sesión es válida,
// 3. conectar el botón visible de logout,
// 4. mantener el fallback si falla auth,
// 5. centralizar el composition runtime fuera de app.js.
//
// Importante:
// - aquí no vive la lógica interna del CV,
// - aquí no vive la lógica interna de auth storage,
// - este módulo solo coordina el arranque global de la app.

import { createAuthScreen } from "../ui/AuthScreen.js";
import { createAuthenticatedCVApp } from "./AuthenticatedCVApp.js";
import { resetCV } from "../services/CVStorageService.js";

// Factory principal del runtime.
export function createAppRuntime({
  profileFormSelector = "#profile-form",
  profileFeedbackSelector = "#profile-form-feedback",
  authScreenSelector = "#auth-screen",
  authenticatedAppSelector = "#app-shell-authenticated",
  logoutButtonSelector = "#logout-button",
} = {}) {
  let authScreen = null;
  let authenticatedCVApp = null;
  let logoutButtonElement = null;

  // Si por cualquier motivo falla AuthScreen, mostramos la app principal
  // para no dejar la pantalla bloqueada en desarrollo.
  function showAuthenticatedAppFallback() {
    const authScreenElement = document.querySelector(authScreenSelector);
    const authenticatedAppElement = document.querySelector(
      authenticatedAppSelector
    );

    if (authScreenElement) {
      authScreenElement.hidden = true;
    }

    if (authenticatedAppElement) {
      authenticatedAppElement.hidden = false;
    }
  }

  // Mantiene utilidades mínimas en window para validación manual.
  function syncDebugTools() {
    const cvState = authenticatedCVApp?.getCVState?.() ?? null;
    const modules = authenticatedCVApp?.getModules?.() ?? {};
    const stateHelpers = authenticatedCVApp?.getStateHelpers?.() ?? {};

    window.cvAppDebug = {
      ...(window.cvAppDebug ?? {}),
      resetCV,
      authScreen,
      authenticatedCVApp,
      getCVState: () => authenticatedCVApp?.getCVState?.() ?? null,
      profileEditor: modules.profileEditor ?? null,
      previewRenderer: modules.previewRenderer ?? null,
      githubIntegration: modules.githubIntegration ?? null,
      mergeGitHubProfileIntoCVState:
        stateHelpers.mergeGitHubProfileIntoCVState ?? null,
      mergeSelectedRepositoriesIntoCVState:
        stateHelpers.mergeSelectedRepositoriesIntoCVState ?? null,
      cvState,
    };
  }

  // Conecta el botón visible de logout con la capa de auth.
  // Regla MVP:
  // - cerrar sesión limpia solo la sesión activa,
  // - no borra usuarios registrados,
  // - no borra el estado del CV.
  function bindLogoutButton() {
    const button = document.querySelector(logoutButtonSelector);

    if (!button || !authScreen) {
      return;
    }

    // Evitamos volver a registrar el mismo listener varias veces.
    if (logoutButtonElement === button) {
      return;
    }

    logoutButtonElement = button;

    logoutButtonElement.addEventListener("click", () => {
      authScreen.signOut();
    });
  }

  // Inicializa la capa de acceso / identidad local.
  function initAuthLayer() {
    authenticatedCVApp = createAuthenticatedCVApp({
      profileFormSelector,
      profileFeedbackSelector,
    });

    const createdAuthScreen = createAuthScreen({
      onAuthSuccess: ({ action, session }) => {
        console.log("Auth OK:", action, session);

        // Cuando la auth local es válida:
        // - AuthScreen ya muestra la app principal
        // - aquí montamos el MVP real una sola vez
        authenticatedCVApp.init();
        syncDebugTools();
      },

      onLogout: () => {
        console.log("Sesión cerrada.");

        // En este MVP no destruimos el estado del CV al cerrar sesión.
        // Solo actualizamos debug y mantenemos la app preparada
        // para volver a entrar.
        syncDebugTools();
      },
    });

    if (!createdAuthScreen) {
      console.error(
        "No se pudo inicializar AuthScreen. Se hará fallback a la app principal."
      );
      showAuthenticatedAppFallback();
      authenticatedCVApp.init();
      syncDebugTools();
      return;
    }

    authScreen = createdAuthScreen;
    authScreen.init();

    // Conectamos el botón visible de cerrar sesión de la app autenticada.
    bindLogoutButton();

    // Dejamos también auth disponible en debug desde el principio.
    syncDebugTools();
  }

  function init() {
    initAuthLayer();
    return getPublicApi();
  }

  function getPublicApi() {
    return {
      init,
      getAuthScreen: () => authScreen,
      getAuthenticatedCVApp: () => authenticatedCVApp,
      syncDebugTools,
    };
  }

  return getPublicApi();
}