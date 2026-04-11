// Punto de entrada principal de la app.
// En esta fase coordina 5 responsabilidades:
//
// 1. gestionar la capa de acceso local (login / register),
// 2. decidir si se muestra auth-screen o la app principal,
// 3. cargar el estado del CV desde localStorage cuando la sesión es válida,
// 4. inicializar editor, preview y GitHub sobre la app autenticada,
// 5. mantener separados:
//    - auth local,
//    - estado del CV,
//    - integración GitHub.
//
// Importante:
// - la autenticación en este MVP es local y simple,
// - no implementa OAuth real todavía,
// - la persistencia del CV sigue separada de la persistencia de auth.

import { createInitialCVState } from "./models/createInitialCVState.js";
import { createPortfolioCV } from "./models/PortfolioCV.js";
import { createProfileEditor } from "./ui/ProfileEditor.js";
import { createPreviewRenderer } from "./ui/PreviewRenderer.js";
import { createGitHubIntegration } from "./ui/GitHubIntegration.js";
import { createAuthScreen } from "./ui/AuthScreen.js";
import { saveCV, loadCV, resetCV, hasStoredCV } from "./services/CVStorageService.js";

console.log("EXPERTECH CV · app inicializada");

// Prefijo para identificar proyectos creados a partir de repositorios GitHub.
// Esto nos permite reemplazarlos después sin tocar proyectos manuales.
const GITHUB_PROJECT_ID_PREFIX = "github-repo-";

// Estado global mínimo del CV.
// La auth local se gestiona aparte, desde AuthScreen + AuthStorageService.
let cvState = null;

// Referencias a módulos UI de la zona autenticada.
// Empiezan a null y solo se crean cuando la sesión permite entrar.
let profileEditor = null;
let previewRenderer = null;
let githubIntegration = null;
let authScreen = null;
let logoutButtonElement = null;
// Indica si la app principal ya fue montada.
// Así evitamos reinicializar toda la interfaz varias veces.
let isAuthenticatedAppInitialized = false;

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

// Carga el estado base del CV.
// Si no hay datos guardados, sembramos uno inicial para facilitar la prueba manual.
function bootstrapCVState() {
  const hasExistingCV = hasStoredCV();

  console.log("¿Hay un CV ya guardado?", hasExistingCV);

  if (!hasExistingCV) {
    return seedInitialCVState();
  }

  return loadCV();
}

// Guarda el estado global del CV y lo persiste.
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

// Rehidrata todas las piezas UI relevantes cuando cambia el estado del CV.
function syncUIWithCVState(savedCV) {
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

// Si por cualquier motivo falla AuthScreen, mostramos la app principal
// para no dejar la pantalla bloqueada en desarrollo.
function showAuthenticatedAppFallback() {
  const authScreenElement = document.querySelector("#auth-screen");
  const authenticatedAppElement = document.querySelector("#app-shell-authenticated");

  if (authScreenElement) {
    authScreenElement.hidden = true;
  }

  if (authenticatedAppElement) {
    authenticatedAppElement.hidden = false;
  }
}




// Conecta el botón visible de logout con la capa de auth.
// Regla MVP:
// - cerrar sesión limpia solo la sesión activa,
// - no borra usuarios registrados,
// - no borra el estado del CV.
function bindLogoutButton() {
  const button = document.querySelector("#logout-button");

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











// Inicializa la app principal autenticada.
// Esta función solo debe ejecutarse cuando la sesión local sea válida.
function bootstrapAuthenticatedApp() {
  // Evitamos reinicializar si ya está montada.
  if (isAuthenticatedAppInitialized) {
    return;
  }

  // 1. Cargamos el estado inicial del CV.
  cvState = bootstrapCVState();

  console.log("CV cargado al arrancar la app autenticada:", cvState);

  // 2. Creamos la preview y la hidratamos con el estado actual.
  const createdPreviewRenderer = createPreviewRenderer({
    initialCVState: cvState,
  });

  if (!createdPreviewRenderer) {
    console.error("No se pudo inicializar PreviewRenderer.");
  } else {
    previewRenderer = createdPreviewRenderer;
    previewRenderer.init();
  }

  // 3. Creamos la integración GitHub.
  const createdGitHubIntegration = createGitHubIntegration({
    initialCVState: cvState,

    onProfileLoaded: (githubData) => {
      const enrichedCVState = mergeGitHubProfileIntoCVState(cvState, githubData);
      const savedCV = persistCVState(enrichedCVState);

      syncUIWithCVState(savedCV);
    },

    onRepositoriesSelectionChange: (selectedRepositories) => {
      const nextCVState = mergeSelectedRepositoriesIntoCVState(
        cvState,
        selectedRepositories
      );
      const savedCV = persistCVState(nextCVState);

      syncUIWithCVState(savedCV);
    },
  });

  if (!createdGitHubIntegration) {
    console.error("No se pudo inicializar GitHubIntegration.");
  } else {
    githubIntegration = createdGitHubIntegration;
    githubIntegration.init();
  }

  // 4. Creamos el editor del perfil.
  const createdProfileEditor = createProfileEditor({
    formSelector: "#profile-form",
    feedbackSelector: "#profile-form-feedback",
    initialCVState: cvState,

    onChange: (draftCVState) => {
      if (previewRenderer) {
        previewRenderer.updateCVState(draftCVState);
      }
    },

    onSave: (nextCVState) => {
      const savedCV = persistCVState(nextCVState);
      syncUIWithCVState(savedCV);
    },
  });

  if (!createdProfileEditor) {
    console.error("No se pudo inicializar ProfileEditor.");
    return;
  }

  profileEditor = createdProfileEditor;
  profileEditor.init();

  // Marcamos que la app principal ya quedó montada.
  isAuthenticatedAppInitialized = true;

  // Utilidades mínimas para debug.
  window.cvAppDebug = {
    ...(window.cvAppDebug ?? {}),
    loadCV,
    saveCV,
    resetCV,
    getCVState: () => cvState,
    profileEditor,
    previewRenderer,
    githubIntegration,
    authScreen,
    bootstrapAuthenticatedApp,
    mergeGitHubProfileIntoCVState,
    mergeSelectedRepositoriesIntoCVState,
  };
}

// Inicializa la capa de acceso / identidad local.
function initAuthLayer() {
  const createdAuthScreen = createAuthScreen({
    onAuthSuccess: ({ action, session }) => {
      console.log("Auth OK:", action, session);

      // Cuando la auth local es válida:
      // - AuthScreen ya muestra la app principal
      // - aquí montamos el MVP real una sola vez
      bootstrapAuthenticatedApp();
    },

    onLogout: () => {
      console.log("Sesión cerrada.");

      // En este MVP no destruimos el estado del CV al cerrar sesión.
      // Solo dejamos trazabilidad mínima para depuración.
      window.cvAppDebug = {
        ...(window.cvAppDebug ?? {}),
        authScreen,
      };
    },
  });

  if (!createdAuthScreen) {
    console.error("No se pudo inicializar AuthScreen. Se hará fallback a la app principal.");
    showAuthenticatedAppFallback();
    bootstrapAuthenticatedApp();
    return;
  }

  authScreen = createdAuthScreen;
  authScreen.init();

  // Conectamos el botón visible de cerrar sesión de la app autenticada.
  bindLogoutButton();

  // Dejamos también auth disponible en debug desde el principio.
  window.cvAppDebug = {
    ...(window.cvAppDebug ?? {}),
    authScreen,
  };
}

// Arranque principal de la app.
function initApp() {
  initAuthLayer();
}

// Ejecutamos el arranque.
initApp();