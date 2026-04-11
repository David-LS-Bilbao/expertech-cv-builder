// Punto de entrada principal de la app.
// En esta fase coordina 4 responsabilidades:
// 1. cargar el estado del CV desde localStorage,
// 2. inicializar el editor del perfil,
// 3. inicializar y actualizar la preview en vivo,
// 4. conectar la integración de GitHub con el estado global.
//
// Importante:
// - la persistencia sigue centralizada aquí,
// - el editor del perfil sigue siendo la base manual segura,
// - GitHub solo enriquece el estado y nunca debe romper el flujo manual.

import { createInitialCVState } from "./models/createInitialCVState.js";
import { createPortfolioCV } from "./models/PortfolioCV.js";
import { createProfileEditor } from "./ui/ProfileEditor.js";
import { createPreviewRenderer } from "./ui/PreviewRenderer.js";
import { createGitHubIntegration } from "./ui/GitHubIntegration.js";
import { saveCV, loadCV, resetCV, hasStoredCV } from "./services/CVStorageService.js";

console.log("EXPERTECH CV · app inicializada");

// Prefijo para identificar proyectos creados a partir de repositorios GitHub.
// Esto nos permite reemplazarlos después sin tocar proyectos manuales.
const GITHUB_PROJECT_ID_PREFIX = "github-repo-";

// Estado global mínimo de la aplicación.
// app.js sigue siendo el punto de composición.
let cvState = null;

// Crea un estado demo solo la primera vez, si aún no existe nada en localStorage.
// Esto ayuda a probar editor, preview y futura integración GitHub con contenido realista.
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

// Enriquece el perfil con información pública de GitHub sin pisar
// el trabajo manual que ya haya hecho el usuario.
// Regla MVP:
// - githubUsername se sincroniza siempre con el login encontrado
// - fullName solo se rellena si está vacío
// - summary solo se rellena si está vacía
// - location solo se rellena si está vacía
function mergeGitHubProfileIntoCVState(currentState, githubData) {
  const normalizedCVState = createPortfolioCV(currentState);
  const profile = normalizedCVState.profile;
  const githubProfile = githubData?.profile ?? {};

  const nextProfile = {
    ...profile,
    githubUsername: githubProfile.login || profile.githubUsername,
    fullName: profile.fullName || githubProfile.name || "",
    summary: profile.summary || githubProfile.bio || "",
    location: profile.location || githubProfile.location || "",
  };

  return createPortfolioCV({
    ...normalizedCVState,
    profile: nextProfile,
  });
}

// Convierte repositorios seleccionados en proyectos del CV.
// En este MVP usamos:
// - name -> nombre del proyecto
// - description -> descripción
// - repositoryUrl -> repoUrl
// - homepageUrl -> demoUrl
// - language -> stack[0] si existe
// - featured -> true
function mapSelectedRepositoriesToProjects(selectedRepositories = []) {
  return selectedRepositories.map((repository) => ({
    id: `${GITHUB_PROJECT_ID_PREFIX}${repository.id}`,
    name: repository.name || "",
    description: repository.description || "",
    repoUrl: repository.repositoryUrl || "",
    demoUrl: repository.homepageUrl || "",
    stack: repository.language ? [repository.language] : [],
    featured: true,
  }));
}

// Mezcla la selección manual de repositorios GitHub con el estado del CV.
// Regla importante:
// - preserva proyectos manuales existentes
// - reemplaza únicamente proyectos previamente generados desde GitHub
function mergeSelectedRepositoriesIntoCVState(currentState, selectedRepositories = []) {
  const normalizedCVState = createPortfolioCV(currentState);

  const manualProjects = normalizedCVState.projects.filter(
    (project) => !String(project.id ?? "").startsWith(GITHUB_PROJECT_ID_PREFIX)
  );

  const githubProjects = mapSelectedRepositoriesToProjects(selectedRepositories);

  return createPortfolioCV({
    ...normalizedCVState,
    projects: [...manualProjects, ...githubProjects],
  });
}

// Rehidrata todas las piezas UI relevantes cuando el estado global cambia.
function syncUIWithCVState({
  savedCV,
  profileEditor,
  previewRenderer,
  githubIntegration,
}) {
  if (profileEditor) {
    profileEditor.updateCVState(savedCV);
  }

  if (previewRenderer) {
    previewRenderer.updateCVState(savedCV);
  }

  if (githubIntegration) {
    githubIntegration.updateCVState(savedCV);
  }
}

// Arranque principal de la app.
function initApp() {
  // 1. Cargamos el estado inicial.
  cvState = bootstrapCVState();

  console.log("CV cargado al arrancar la app:", cvState);

  // 2. Creamos la preview y la hidratamos con el estado actual.
  //    Esta feature sigue renderizando:
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

  // 3. Creamos la integración GitHub.
  //    - carga perfil público y repos candidatos
  //    - enriquece el estado del CV sin romper el flujo manual
  //    - convierte selección manual en proyectos del CV
  const githubIntegration = createGitHubIntegration({
    initialCVState: cvState,

    onProfileLoaded: (githubData) => {
      const enrichedCVState = mergeGitHubProfileIntoCVState(cvState, githubData);
      const savedCV = persistCVState(enrichedCVState);

      syncUIWithCVState({
        savedCV,
        profileEditor,
        previewRenderer,
        githubIntegration,
      });
    },

    onRepositoriesSelectionChange: (selectedRepositories) => {
      const nextCVState = mergeSelectedRepositoriesIntoCVState(cvState, selectedRepositories);
      const savedCV = persistCVState(nextCVState);

      syncUIWithCVState({
        savedCV,
        profileEditor,
        previewRenderer,
        githubIntegration,
      });
    },
  });

  if (!githubIntegration) {
    console.error("No se pudo inicializar GitHubIntegration.");
  } else {
    githubIntegration.init();
  }

  // 4. Creamos el editor del perfil.
  //    Mientras el usuario escribe:
  //    - actualizamos la preview en tiempo real
  //    - no persistimos todavía en localStorage
  //
  //    Al guardar:
  //    - persistimos el nuevo estado,
  //    - rehidratamos editor, preview y GitHub block
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

      syncUIWithCVState({
        savedCV,
        profileEditor,
        previewRenderer,
        githubIntegration,
      });
    },
  });

  if (!profileEditor) {
    console.error("No se pudo inicializar ProfileEditor.");
    return;
  }

  // 5. Inicializamos el editor para rellenar el formulario y escuchar eventos.
  profileEditor.init();

  // 6. Dejamos utilidades mínimas en window para validación manual durante desarrollo.
  window.cvAppDebug = {
    loadCV,
    saveCV,
    resetCV,
    getCVState: () => cvState,
    profileEditor,
    previewRenderer,
    githubIntegration,
    mergeGitHubProfileIntoCVState,
    mergeSelectedRepositoriesIntoCVState,
  };
}

// Ejecutamos el arranque.
initApp();