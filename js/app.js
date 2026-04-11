// Punto de entrada temporal para probar la persistencia del CV.
// Aquí validamos saveCV, loadCV y resetCV antes de conectar la UI.

import { createInitialCVState } from "./models/createInitialCVState.js";
import {
  saveCV,
  loadCV,
  resetCV,
  hasStoredCV,
} from "./services/CVStorageService.js";

// 1. Comprobamos si ya existe un CV guardado en localStorage.
const hasExistingCV = hasStoredCV();

console.log("EXPERTECH CV · app inicializada");
console.log("¿Hay un CV ya guardado?", hasExistingCV);

// 2. Si no existe aún, sembramos un ejemplo base para probar la persistencia.
if (!hasExistingCV) {
  const initialCVState = createInitialCVState();

  const demoCVState = {
    ...initialCVState,
    profile: {
      ...initialCVState.profile,
      fullName: "David López Sotelo",
      headline: "Frontend Developer",
      summary:
        "Perfil tech en construcción con foco en JavaScript y proyectos prácticos.",
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

  console.log("Estado de prueba antes de guardar:", demoCVState);

  const savedCV = saveCV(demoCVState);
  console.log("CV guardado en localStorage:", savedCV);
}

// 3. Cargamos el estado persistido para comprobar que se recupera bien.
const persistedCV = loadCV();
console.log("CV cargado desde localStorage:", persistedCV);

// 4. Dejamos utilidades mínimas accesibles desde consola para validación manual.
window.cvStorageDebug = {
  loadCV,
  saveCV,
  resetCV,
};
