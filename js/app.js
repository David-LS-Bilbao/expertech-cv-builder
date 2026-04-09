// Punto de entrada temporal para comprobar que el modelo del CV
// se construye bien antes de conectarlo a la UI o a localStorage.

import { createInitialCVState } from "./models/createInitialCVState.js";

// Creamos el estado inicial completo del CV.
const cvState = createInitialCVState();

// Verificación rápida en consola.
console.log("EXPERTECH CV · app inicializada");
console.log("Estado inicial del CV:", cvState);

// Comprobaciones útiles para validar la estructura.
console.log("Perfil:", cvState.profile);
console.log("Proyectos:", cvState.projects);
console.log("Meta:", cvState.meta);
