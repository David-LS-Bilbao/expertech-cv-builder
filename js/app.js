// Punto de entrada principal de la app.
// En esta fase coordina 3 responsabilidades:
// 1. cargar el estado del CV desde localStorage,
// 2. inicializar el editor del perfil,
// 3. inicializar y actualizar la preview en vivo.
//
// Importante:
// - la persistencia sigue centralizada aquí,
// - el editor solo gestiona UI del formulario,
// - la preview solo renderiza datos ya existentes del estado.

import { createInitialCVState } from "./models/createInitialCVState.js";
import { createPortfolioCV } from "./models/PortfolioCV.js";
import { createProfileEditor } from "./ui/ProfileEditor.js";
import { createPreviewRenderer } from "./ui/PreviewRenderer.js";
import { saveCV, loadCV, resetCV, hasStoredCV } from "./services/CVStorageService.js";

console.log("EXPERTECH CV · app inicializada");

// Estado global mínimo de la aplicación.
// app.js sigue siendo el punto de composición.
let cvState = null;

// Crea un estado demo solo la primera vez, si aún no existe nada en localStorage.
// Esto ayuda a probar el editor y la preview con contenido realista.
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

  // 2. Creamos la preview y la hidratamos con el estado actual.
  //    Esta feature solo renderiza:
  //    - fullName
  //    - headline
  //    - summary
  const previewRenderer = createPreviewRenderer({
    initialCVState: cvState,
  });

  if (!previewRenderer) {
    console.error("No se pudo inicializar PreviewRenderer.");
  } else {
    previewRenderer.init();
  }

  // 3. Creamos el editor del perfil.
  //    Mientras el usuario escribe:
  //    - actualizamos la preview en tiempo real
  //    - no persistimos todavía en localStorage
  //
  //    Al guardar:
  //    - persistimos el nuevo estado,
  //    - rehidratamos el editor con el estado normalizado,
  //    - actualizamos también la preview con el estado guardado.
  const profileEditor = createProfileEditor({
    formSelector: "#profile-form",
    feedbackSelector: "#profile-form-feedback",
    initialCVState: cvState,

    onChange: (draftCVState) => {
      // Render en tiempo real sin guardar todavía.
      if (previewRenderer) {
        previewRenderer.updateCVState(draftCVState);
      }
    },

    onSave: (nextCVState) => {
      const savedCV = persistCVState(nextCVState);

      // Mantiene el editor sincronizado con el estado guardado.
      profileEditor.updateCVState(savedCV);

      // Mantiene la preview sincronizada con el estado guardado.
      if (previewRenderer) {
        previewRenderer.updateCVState(savedCV);
      }
    },
  });

  // Si el formulario no existe, no seguimos rompiendo la app silenciosamente.
  if (!profileEditor) {
    console.error("No se pudo inicializar ProfileEditor.");
    return;
  }

  // 4. Inicializamos el editor para rellenar el formulario y escuchar eventos.
  profileEditor.init();

  // 5. Dejamos utilidades mínimas en window para validación manual durante desarrollo.
  window.cvAppDebug = {
    loadCV,
    saveCV,
    resetCV,
    getCVState: () => cvState,
    profileEditor,
    previewRenderer,
  };
}

// Ejecutamos el arranque.
initApp();