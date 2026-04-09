// Punto de entrada principal de la app.
// En esta feature su responsabilidad es:
// 1. cargar el estado actual del CV desde localStorage,
// 2. inicializar el editor de perfil,
// 3. guardar el estado cuando el usuario envía el formulario.
//
// Importante:
// - no conectamos todavía la preview dinámica,
// - no tocamos otras features como GitHub o proyectos,
// - mantenemos una integración mínima, clara y trazable.

import { createInitialCVState } from "./models/createInitialCVState.js";
import { createPortfolioCV } from "./models/PortfolioCV.js";
import { createProfileEditor } from "./ui/ProfileEditor.js";
import { saveCV, loadCV, resetCV, hasStoredCV } from "./services/CVStorageService.js";

console.log("EXPERTECH CV · app inicializada");

// Estado global mínimo de la aplicación.
// Lo mantenemos aquí para que app.js siga siendo el punto de composición.
let cvState = null;

// Crea un estado demo solo la primera vez, si aún no existe nada en localStorage.
// Esto ayuda a que el formulario no arranque completamente vacío durante desarrollo.
function seedInitialCVState() {
  const initialCVState = createInitialCVState();

  const demoCVState = {
    ...initialCVState,
    profile: {
      ...initialCVState.profile,
      fullName: "David López Sotelo",
      headline: "Frontend Developer",
      summary:
        "Perfil tech en construcción con foco en JavaScript y proyectos prácticos.",
      email: "david@example.com",
      location: "Bilbao, España",
      linkedinUrl: "https://www.linkedin.com/in/david-lopez-sotelo",
      githubUsername: "David-LS-Bilbao",
      skills: ["HTML", "CSS", "JavaScript"],
    },
    projects: [
      {
        id: "project-1",
        name: "EXPERTECH CV",
        description: "MVP de currículum web interactivo para perfiles tech.",
        repoUrl: "https://github.com/David-LS-Bilbao/expertech-cv-builder",
        demoUrl: "",
        stack: ["HTML", "CSS", "JavaScript"],
        featured: true,
      },
    ],
  };

  const savedCV = saveCV(demoCVState);

  console.log("Se ha creado un estado demo inicial:", savedCV);

  return savedCV;
}

// Carga el estado base de la aplicación.
// Si no hay datos guardados, sembramos uno inicial para facilitar la prueba manual.
function bootstrapCVState() {
  const hasExistingCV = hasStoredCV();

  console.log("¿Hay un CV ya guardado?", hasExistingCV);

  if (!hasExistingCV) {
    return seedInitialCVState();
  }

  return loadCV();
}

// Guarda el estado global y lo persiste.
function persistCVState(nextCVState) {
  cvState = createPortfolioCV(nextCVState);

  const savedCV = saveCV(cvState);

  console.log("CV guardado en localStorage:", savedCV);

  return savedCV;
}

// Arranque principal de la app.
function initApp() {
  // 1. Cargamos el estado inicial.
  cvState = bootstrapCVState();

  console.log("CV cargado al arrancar la app:", cvState);

  // 2. Creamos el editor del perfil y le pasamos:
  //    - el estado inicial,
  //    - qué hacer al guardar.
  const profileEditor = createProfileEditor({
    formSelector: "#profile-form",
    initialCVState: cvState,
    onSave: (nextCVState) => {
      const savedCV = persistCVState(nextCVState);

      // Dejamos sincronizado el editor con el estado normalizado/persistido.
      profileEditor.updateCVState(savedCV);
    },
  });

  // Si el formulario no existe, no seguimos rompiendo la app silenciosamente.
  if (!profileEditor) {
    console.error("No se pudo inicializar ProfileEditor.");
    return;
  }

  // 3. Inicializamos el editor para rellenar el formulario y escuchar el submit.
  profileEditor.init();

  // 4. Dejamos utilidades mínimas en window para validación manual durante desarrollo.
  window.cvAppDebug = {
    loadCV,
    saveCV,
    resetCV,
    getCVState: () => cvState,
    profileEditor,
  };
}

// Ejecutamos el arranque.
initApp();