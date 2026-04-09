// Punto de entrada temporal para probar la persistencia del CV.
// Aquí validamos saveCV, loadCV y resetCV antes de conectar la UI.

import { createInitialCVState } from "./models/createInitialCVState.js";
import { saveCV, loadCV, resetCV } from "./services/CVStorageService.js";

// 1. Creamos un estado inicial del CV.
const initialCVState = createInitialCVState();

console.log("EXPERTECH CV · app inicializada");
console.log("Estado inicial generado:", initialCVState);

// 2. Preparamos un ejemplo simple para comprobar que el guardado funciona.
const demoCVState = {
  ...initialCVState,
  profile: {
    ...initialCVState.profile,
    fullName: "David López Sotelo",
    headline: "Frontend Developer",
    summary: "Perfil tech en construcción con foco en JavaScript y proyectos prácticos.",
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

// 3. Guardamos el CV en localStorage.
const savedCV = saveCV(demoCVState);
console.log("CV guardado en localStorage:", savedCV);

// 4. Lo cargamos desde localStorage para comprobar que se recupera bien.
const loadedCV = loadCV();
console.log("CV cargado desde localStorage:", loadedCV);

// 5. Reseteamos el almacenamiento para comprobar el borrado.
resetCV();
console.log("CV eliminado de localStorage");

// 6. Volvemos a cargar después del reset.
// Debe devolver el estado inicial del proyecto.
const resetLoadedCV = loadCV();
console.log("Estado después de resetear:", resetLoadedCV);