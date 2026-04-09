// Lógica UI del editor de perfil.
// Responsabilidades de este módulo:
// 1. localizar el formulario en el DOM,
// 2. rellenarlo con los datos actuales del CV,
// 3. leer los cambios del usuario,
// 4. devolver un nuevo estado actualizado al hacer submit,
// 5. mostrar feedback visual básico de guardado.
//
// Importante:
// - aquí no guardamos directamente en localStorage,
// - esa responsabilidad sigue en app.js / servicios,
// - así mantenemos separación clara entre UI y persistencia.

import { createPortfolioCV } from "../models/PortfolioCV.js";
import { createCandidateProfile } from "../models/CandidateProfile.js";

// Campos del formulario controlados por esta feature.
// Deben coincidir con los atributos name del HTML.
const PROFILE_FORM_FIELDS = [
  "fullName",
  "headline",
  "summary",
  "email",
  "location",
  "linkedinUrl",
  "githubUsername",
];

// Crea el editor de perfil.
// Recibe:
// - formSelector: selector del formulario
// - feedbackSelector: selector del nodo de feedback
// - initialCVState: estado inicial ya cargado
// - onSave: callback que recibirá el nuevo estado del CV al guardar
export function createProfileEditor({
  formSelector = "#profile-form",
  feedbackSelector = "#profile-form-feedback",
  initialCVState,
  onSave = () => {},
} = {}) {
  // Normalizamos el estado completo para trabajar siempre con una estructura estable.
  let currentCVState = createPortfolioCV(initialCVState);

  // Buscamos el formulario real en el DOM.
  const formElement = document.querySelector(formSelector);

  // Buscamos la zona de feedback visual del formulario.
  const feedbackElement = document.querySelector(feedbackSelector);

  // Si el formulario no existe, devolvemos null para que app.js lo detecte fácilmente.
  if (!formElement) {
    console.error(`No se encontró el formulario del perfil: ${formSelector}`);
    return null;
  }

  // Rellena el formulario con los datos actuales del perfil.
  function fillForm(profileData = {}) {
    PROFILE_FORM_FIELDS.forEach((fieldName) => {
      const fieldElement = formElement.elements[fieldName];

      // Si un campo no existe en el HTML, no rompemos la app.
      if (!fieldElement) {
        return;
      }

      fieldElement.value = profileData[fieldName] ?? "";
    });
  }

  // Lee los datos actuales del formulario y construye un perfil normalizado.
  function readProfileFromForm() {
    const formData = new FormData(formElement);

    // Construimos solo los campos que controla este formulario.
    const rawProfileData = Object.fromEntries(
      PROFILE_FORM_FIELDS.map((fieldName) => [fieldName, formData.get(fieldName) ?? ""])
    );

    // Mezclamos con el perfil actual para no perder propiedades
    // que esta feature todavía no edita, como phone o skills.
    return createCandidateProfile({
      ...currentCVState.profile,
      ...rawProfileData,
    });
  }

  // Construye el siguiente estado completo del CV usando el perfil editado.
  function buildNextCVState() {
    const nextProfile = readProfileFromForm();

    return createPortfolioCV({
      ...currentCVState,
      profile: nextProfile,
      meta: {
        ...currentCVState.meta,
      },
    });
  }

  // Limpia clases de estado del feedback para dejar una base consistente.
  function resetFeedbackState() {
    if (!feedbackElement) {
      return;
    }

    feedbackElement.classList.remove("is-error", "is-info");
  }

  // Muestra un mensaje de feedback simple.
  // type puede ser:
  // - success (estilo base)
  // - error
  // - info
  function showFeedback(message, type = "success") {
    if (!feedbackElement) {
      return;
    }

    resetFeedbackState();

    if (type === "error") {
      feedbackElement.classList.add("is-error");
    }

    if (type === "info") {
      feedbackElement.classList.add("is-info");
    }

    feedbackElement.textContent = message;
  }

  // Limpia el contenido visible del feedback.
  function clearFeedback() {
    if (!feedbackElement) {
      return;
    }

    resetFeedbackState();
    feedbackElement.textContent = "";
  }

  // Maneja el submit del formulario.
  // Aquí no persistimos directamente: delegamos en onSave.
  function handleSubmit(event) {
    event.preventDefault();

    try {
      const nextCVState = buildNextCVState();

      // Actualizamos la referencia interna para que el editor quede sincronizado.
      currentCVState = nextCVState;

      // Dejamos la persistencia fuera del módulo UI.
      onSave(nextCVState);

      // Feedback visual mínimo para esta feature.
      showFeedback("Perfil guardado correctamente.");

      // Log útil de desarrollo mientras esta feature está en construcción.
      console.log("Perfil guardado desde el editor:", nextCVState.profile);
    } catch (error) {
      console.error("No se pudo guardar el perfil:", error);
      showFeedback("No se pudo guardar el perfil. Revisa los datos e inténtalo otra vez.", "error");
    }
  }

  // Inicializa el editor:
  // - rellena el formulario
  // - limpia feedback inicial
  // - enlaza el submit
  function init() {
    fillForm(currentCVState.profile);
    clearFeedback();
    formElement.addEventListener("submit", handleSubmit);
  }

  // Permite desmontar el listener si en el futuro hiciera falta.
  function destroy() {
    formElement.removeEventListener("submit", handleSubmit);
  }

  // Permite actualizar el editor desde fuera con un nuevo estado.
  // Útil si en otra feature cambia el estado global y queremos rehidratar la UI.
  function updateCVState(nextCVState) {
    currentCVState = createPortfolioCV(nextCVState);
    fillForm(currentCVState.profile);
  }

  // API pública mínima del módulo.
  return {
    init,
    destroy,
    updateCVState,
    readProfileFromForm,
    showFeedback,
    clearFeedback,
    getCVState: () => createPortfolioCV(currentCVState),
    getFormElement: () => formElement,
    getFeedbackElement: () => feedbackElement,
  };
}