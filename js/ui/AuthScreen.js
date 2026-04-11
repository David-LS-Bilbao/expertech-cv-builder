// UI de autenticación local para el MVP.
// Responsabilidades de este módulo:
// 1. renderizar el auth screen desde AuthScreenTemplate,
// 2. alternar entre login y register,
// 3. conectar ambos formularios con AuthStorageService,
// 4. mostrar feedback de error / éxito,
// 5. mostrar mensaje informativo en Google y GitHub,
// 6. permitir a app.js mostrar u ocultar auth y la app principal.
//
// Importante:
// - no implementa OAuth real,
// - no conoce nada del estado del CV,
// - solo gestiona la capa de acceso local.

import {
  loginUser,
  registerUser,
  loadSession,
  logoutUser,
} from "../services/AuthStorageService.js";
import { renderAuthScreenTemplate } from "./AuthScreenTemplate.js";

// Crea el controlador UI de la pantalla auth.
export function createAuthScreen({
  screenSelector = "#auth-screen",
  authenticatedAppSelector = "#app-shell-authenticated",
  loginTabSelector = "#auth-tab-login",
  registerTabSelector = "#auth-tab-register",
  loginPanelSelector = "#auth-panel-login",
  registerPanelSelector = "#auth-panel-register",
  loginFormSelector = "#login-form",
  registerFormSelector = "#register-form",
  loginFeedbackSelector = "#login-form-feedback",
  registerFeedbackSelector = "#register-form-feedback",
  socialFeedbackSelector = "#auth-social-feedback",
  googleButtonSelector = "#auth-google-button",
  githubButtonSelector = "#auth-github-button",
  onAuthSuccess,
  onLogout,
} = {}) {
  // Nodos raíz mínimos que sí deben existir en index.html.
  const screenElement = document.querySelector(screenSelector);
  const authenticatedAppElement = document.querySelector(authenticatedAppSelector);

  if (!screenElement || !authenticatedAppElement) {
    console.error("No se pudo inicializar AuthScreen: faltan roots principales.");
    return null;
  }

  // Renderizamos el template dentro del root auth.
  // A partir de aquí ya existen los nodos internos de login/register.
  renderAuthScreenTemplate(screenElement);

  // Ahora sí buscamos los nodos internos del auth screen.
  const loginTabElement = document.querySelector(loginTabSelector);
  const registerTabElement = document.querySelector(registerTabSelector);

  const loginPanelElement = document.querySelector(loginPanelSelector);
  const registerPanelElement = document.querySelector(registerPanelSelector);

  const loginFormElement = document.querySelector(loginFormSelector);
  const registerFormElement = document.querySelector(registerFormSelector);

  const loginFeedbackElement = document.querySelector(loginFeedbackSelector);
  const registerFeedbackElement = document.querySelector(registerFeedbackSelector);
  const socialFeedbackElement = document.querySelector(socialFeedbackSelector);

  const googleButtonElement = document.querySelector(googleButtonSelector);
  const githubButtonElement = document.querySelector(githubButtonSelector);

  if (
    !loginTabElement ||
    !registerTabElement ||
    !loginPanelElement ||
    !registerPanelElement ||
    !loginFormElement ||
    !registerFormElement
  ) {
    console.error("No se pudo inicializar AuthScreen: faltan nodos internos del auth screen.");
    return null;
  }

  // Aplica texto y estado visual a un feedback.
  function setFeedback(element, message = "", type = "info") {
    if (!element) {
      return;
    }

    element.textContent = String(message ?? "").trim();
    element.classList.remove("is-error", "is-info");

    if (!element.textContent) {
      return;
    }

    if (type === "error") {
      element.classList.add("is-error");
      return;
    }

    element.classList.add("is-info");
  }

  // Limpia todos los mensajes visibles.
  function clearFeedbacks() {
    setFeedback(loginFeedbackElement, "");
    setFeedback(registerFeedbackElement, "");
    setFeedback(socialFeedbackElement, "");
  }

  // Resetea solo los formularios, sin tocar la sesión.
  function resetForms() {
    loginFormElement.reset();
    registerFormElement.reset();
  }

  // Cambia a la pestaña de login.
  function showLoginView() {
    loginTabElement.classList.add("auth-tab-active");
    registerTabElement.classList.remove("auth-tab-active");

    loginTabElement.setAttribute("aria-selected", "true");
    registerTabElement.setAttribute("aria-selected", "false");

    loginPanelElement.hidden = false;
    registerPanelElement.hidden = true;

    clearFeedbacks();
  }

  // Cambia a la pestaña de registro.
  function showRegisterView() {
    registerTabElement.classList.add("auth-tab-active");
    loginTabElement.classList.remove("auth-tab-active");

    registerTabElement.setAttribute("aria-selected", "true");
    loginTabElement.setAttribute("aria-selected", "false");

    registerPanelElement.hidden = false;
    loginPanelElement.hidden = true;

    clearFeedbacks();
  }

  // Muestra la pantalla auth y oculta la app principal.
  function showAuthScreen() {
    screenElement.hidden = false;
    authenticatedAppElement.hidden = true;
  }

  // Oculta la pantalla auth y muestra la app principal.
  function showAuthenticatedApp() {
    screenElement.hidden = true;
    authenticatedAppElement.hidden = false;
  }

  // Recoge datos del formulario de login.
  function getLoginFormData() {
    const formData = new FormData(loginFormElement);

    return {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
  }

  // Recoge datos del formulario de registro.
  function getRegisterFormData() {
    const formData = new FormData(registerFormElement);

    return {
      displayName: String(formData.get("displayName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    };
  }

  // Gestiona submit del login.
  function handleLoginSubmit(event) {
    event.preventDefault();

    clearFeedbacks();

    const credentials = getLoginFormData();
    const result = loginUser(credentials);

    if (!result.ok) {
      setFeedback(loginFeedbackElement, result.error, "error");
      return;
    }

    setFeedback(loginFeedbackElement, "Sesión iniciada correctamente.", "info");
    showAuthenticatedApp();

    if (typeof onAuthSuccess === "function") {
      onAuthSuccess({
        action: "login",
        user: result.user,
        session: result.session,
      });
    }
  }

  // Gestiona submit del registro.
  function handleRegisterSubmit(event) {
    event.preventDefault();

    clearFeedbacks();

    const userData = getRegisterFormData();
    const result = registerUser(userData);

    if (!result.ok) {
      setFeedback(registerFeedbackElement, result.error, "error");
      return;
    }

    setFeedback(registerFeedbackElement, "Cuenta creada correctamente.", "info");
    showAuthenticatedApp();

    if (typeof onAuthSuccess === "function") {
      onAuthSuccess({
        action: "register",
        user: result.user,
        session: result.session,
      });
    }
  }

  // Muestra un mensaje informativo para auth social futura.
  function handleSocialButtonClick(providerName) {
    setFeedback(
      socialFeedbackElement,
      `El acceso con ${providerName} llegará en el siguiente MVP con autenticación real.`,
      "info"
    );
  }

  // Permite a app.js sincronizar la UI cuando cambie la sesión.
  function updateSession(session) {
    if (session) {
      showAuthenticatedApp();
      return;
    }

    showAuthScreen();
    showLoginView();
  }

  // Cierra sesión desde la capa auth.
  // No borra usuarios, solo la sesión activa.
  function signOut() {
    logoutUser();
    resetForms();
    clearFeedbacks();
    showAuthScreen();
    showLoginView();

    if (typeof onLogout === "function") {
      onLogout();
    }
  }

  function bindEvents() {
    loginTabElement.addEventListener("click", showLoginView);
    registerTabElement.addEventListener("click", showRegisterView);

    loginFormElement.addEventListener("submit", handleLoginSubmit);
    registerFormElement.addEventListener("submit", handleRegisterSubmit);

    if (googleButtonElement) {
      googleButtonElement.addEventListener("click", () =>
        handleSocialButtonClick("Google")
      );
    }

    if (githubButtonElement) {
      githubButtonElement.addEventListener("click", () =>
        handleSocialButtonClick("GitHub")
      );
    }
  }

  function init() {
    bindEvents();

    // Vista inicial por defecto.
    showLoginView();

    // Si ya existe sesión local, entramos directamente a la app.
    const existingSession = loadSession();

    if (existingSession) {
      showAuthenticatedApp();

      if (typeof onAuthSuccess === "function") {
        onAuthSuccess({
          action: "restore-session",
          user: null,
          session: existingSession,
        });
      }

      return;
    }

    showAuthScreen();
  }

  return {
    init,
    showLoginView,
    showRegisterView,
    showAuthScreen,
    showAuthenticatedApp,
    updateSession,
    signOut,
    getElements: () => ({
      screenElement,
      authenticatedAppElement,
      loginTabElement,
      registerTabElement,
      loginPanelElement,
      registerPanelElement,
      loginFormElement,
      registerFormElement,
      loginFeedbackElement,
      registerFeedbackElement,
      socialFeedbackElement,
      googleButtonElement,
      githubButtonElement,
    }),
  };
}