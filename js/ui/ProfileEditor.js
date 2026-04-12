// Lógica UI del editor de perfil.
// Responsabilidades de este módulo:
// 1. localizar el formulario en el DOM,
// 2. rellenarlo con los datos actuales del CV,
// 3. leer los cambios del usuario,
// 4. emitir cambios en tiempo real para la preview,
// 5. devolver un nuevo estado actualizado al hacer submit,
// 6. mostrar feedback visual básico de guardado.
//
// Importante:
// - aquí no guardamos directamente en localStorage,
// - esa responsabilidad sigue en app.js / servicios,
// - así mantenemos separación clara entre UI, preview y persistencia.

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

// Tiempo en milisegundos antes de ocultar el feedback automáticamente.
const FEEDBACK_HIDE_DELAY = 2500;

// Crea el editor de perfil.
// Recibe:
// - formSelector: selector del formulario
// - feedbackSelector: selector del nodo de feedback
// - initialCVState: estado inicial ya cargado
// - onSave: callback que recibirá el nuevo estado del CV al guardar
// - onChange: callback que recibirá el estado temporal del CV mientras se escribe
export function createProfileEditor({
  formSelector = "#profile-form",
  feedbackSelector = "#profile-form-feedback",
  initialCVState,
  onSave = () => {},
  onChange = () => {},
} = {}) {
  // Normalizamos el estado completo para trabajar siempre con una estructura estable.
  let currentCVState = createPortfolioCV(initialCVState);

  // Referencia al timeout activo del feedback.
  // Sirve para evitar que varios guardados se pisen entre sí.
  let feedbackTimeoutId = null;

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
    // que esta feature todavía no edita, como phone o skills,
    // ni variables de estado asíncronas como avatarBase64.
    return createCandidateProfile({
      ...currentCVState.profile,
      ...rawProfileData,
      avatarBase64: currentCVState.profile.avatarBase64,
      avatarUrl: currentCVState.profile.avatarUrl
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

  // Cancela el temporizador actual del feedback si existe.
  function clearFeedbackTimeout() {
    if (feedbackTimeoutId) {
      window.clearTimeout(feedbackTimeoutId);
      feedbackTimeoutId = null;
    }
  }

  // Limpia el contenido visible del feedback.
  function clearFeedback() {
    if (!feedbackElement) {
      return;
    }

    clearFeedbackTimeout();
    resetFeedbackState();
    feedbackElement.textContent = "";
  }

  // Oculta el feedback después de un tiempo.
  function scheduleFeedbackHide() {
    if (!feedbackElement) {
      return;
    }

    clearFeedbackTimeout();

    feedbackTimeoutId = window.setTimeout(() => {
      clearFeedback();
    }, FEEDBACK_HIDE_DELAY);
  }

  // Muestra un mensaje de feedback simple.
  // type puede ser:
  // - success (estilo base)
  // - error
  // - info
  //
  // Para que el usuario perciba el cambio aunque el texto sea el mismo:
  // 1. limpiamos primero el feedback,
  // 2. forzamos un reflow,
  // 3. volvemos a pintar el mensaje,
  // 4. programamos el auto-hide.
  function showFeedback(message, type = "success") {
    if (!feedbackElement) {
      return;
    }

    // Reiniciamos el feedback para que cada guardado se note.
    clearFeedback();

    // Fuerza al navegador a registrar el cambio visual antes de volver a pintar.
    void feedbackElement.offsetHeight;

    resetFeedbackState();

    if (type === "error") {
      feedbackElement.classList.add("is-error");
    }

    if (type === "info") {
      feedbackElement.classList.add("is-info");
    }

    feedbackElement.textContent = message;

    scheduleFeedbackHide();
  }

  // Emite el estado temporal del CV mientras el usuario escribe.
  // Esto permite que app.js actualice la preview en tiempo real
  // sin persistir todavía en localStorage.
  function emitLiveChange() {
    const nextCVState = buildNextCVState();

    // El editor mantiene una referencia interna al estado más reciente,
    // aunque todavía no esté persistido.
    currentCVState = nextCVState;

    onChange(nextCVState);
  }

  // Maneja los cambios en tiempo real del formulario.
  function handleInput() {
    // Si el usuario vuelve a escribir, quitamos el mensaje de "guardado"
    // para no dar la impresión de que esos cambios ya están persistidos.
    clearFeedback();

    emitLiveChange();
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

  // Redimensiona y codifica la imagen usando canvas para ahorrar espacio
  function handleAvatarChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Actualiza visualmente el nombre del archivo en la UI
    const fileNameElement = formElement.querySelector("#avatarFile-name");
    if (fileNameElement) {
      fileNameElement.textContent = file.name;
    }

    // Feedback rápido para imágenes muy pesadas
    showFeedback("Redimensionando imagen...", "info");

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const MAX_SIZE = 300;
        let width = img.width;
        let height = img.height;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Actualizamos directo en el currentCVState
        currentCVState.profile.avatarBase64 = canvas.toDataURL("image/jpeg", 0.85);
        showFeedback("Imagen capturada y lista para guardar.");
        emitLiveChange();
      };

      img.onerror = () => {
        showFeedback("Error procesando imagen.", "error");
      };

      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Inicializa el editor:
  // - rellena el formulario
  // - limpia feedback inicial
  // - enlaza input y submit
  function init() {
    fillForm(currentCVState.profile);
    clearFeedback();

    // El 'input' asume cambios de texto
    formElement.addEventListener("input", handleInput);
    formElement.addEventListener("submit", handleSubmit);

    const avatarInput = formElement.querySelector("#avatarFile");
    if (avatarInput) {
      avatarInput.addEventListener("change", handleAvatarChange);
    }
  }

  // Permite desmontar los listeners si en el futuro hiciera falta.
  function destroy() {
    clearFeedbackTimeout();
    formElement.removeEventListener("input", handleInput);
    formElement.removeEventListener("submit", handleSubmit);

    const avatarInput = formElement.querySelector("#avatarFile");
    if (avatarInput) {
      avatarInput.removeEventListener("change", handleAvatarChange);
    }
  }

  // Permite actualizar el editor desde fuera con un nuevo estado.
  // Útil cuando app.js persiste y devuelve un estado normalizado.
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