// Capa de aplicación para la zona autenticada del MVP.
// Responsabilidades de este módulo:
// 1. cargar o sembrar el estado inicial del CV,
// 2. persistir el estado global del CV,
// 3. inicializar editor, preview e integración GitHub,
// 4. coordinar callbacks entre esos módulos,
// 5. transformar datos de GitHub en proyectos del CV,
// 6. rehidratar la UI cuando cambia el estado.
//
// Importante:
// - aquí NO hay lógica de auth,
// - aquí NO se decide si se muestra login o app,
// - esta capa solo coordina la app autenticada una vez que la sesión ya es válida.

import { createInitialCVState } from "../models/createInitialCVState.js";
import { createPortfolioCV } from "../models/PortfolioCV.js";
import { createProfileEditor } from "../ui/ProfileEditor.js";
import { createPreviewRenderer } from "../ui/PreviewRenderer.js";
import { createPrintCVRenderer } from "../ui/PrintCVRenderer.js";
import { createGitHubIntegration } from "../ui/GitHubIntegration.js";
import { createJobSearchIntegration } from "../ui/JobSearchIntegration.js";
import { saveCV, loadCV, hasStoredCV } from "../services/CVStorageService.js";

// Prefijo para identificar proyectos creados desde repositorios GitHub.
// Esto nos permite reemplazar solo esos proyectos sin tocar los manuales.
const GITHUB_PROJECT_ID_PREFIX = "github-repo-";

// Factory principal de la app autenticada.
export function createAuthenticatedCVApp({
  profileFormSelector = "#profile-form",
  profileFeedbackSelector = "#profile-form-feedback",
  exportPdfButtonSelector = "#export-pdf-button",
} = {}) {
  // Estado global del CV dentro de la app autenticada.
  let cvState = null;

  // Referencias a los módulos UI de la zona autenticada.
  let profileEditor = null;
  let previewRenderer = null;
  let printCVRenderer = null;
  let githubIntegration = null;
  let exportPdfButtonElement = null;

  // Evita inicializar dos veces la misma app autenticada.
  let isInitialized = false;

  // Crea un estado demo solo la primera vez si no existe nada en localStorage.
  // Esto mantiene el comportamiento actual del MVP.
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
      // Dejamos el perfil demo, pero no sembramos proyectos.
      // Así el bloque de proyectos refleja de forma honesta si todavía
      // no hay selección GitHub ni proyectos manuales reales.
      projects: [],
    };

    const savedCV = saveCV(demoCVState);

    console.log("Se ha creado un estado demo inicial:", savedCV);

    return savedCV;
  }

  // Carga el estado del CV.
  // Si no existe nada aún, siembra el demo inicial.
  function bootstrapCVState() {
    const hasExistingCV = hasStoredCV();

    console.log("¿Hay un CV ya guardado?", hasExistingCV);

    if (!hasExistingCV) {
      return seedInitialCVState();
    }

    return loadCV();
  }

  // Persiste el estado global del CV y devuelve la versión normalizada.
  function persistCVState(nextCVState) {
    cvState = createPortfolioCV(nextCVState);

    const savedCV = saveCV(cvState);

    console.log("CV guardado en localStorage:", savedCV);

    return savedCV;
  }

  // Enriquece el perfil con datos públicos de GitHub sin pisar trabajo manual.
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
      avatarUrl: githubProfile.avatarUrl || profile.avatarUrl || "",
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
      sourceProvider: "github",
      sourceRepositoryId: String(repository.id ?? ""),
      sourceRepositoryName: repository.name || "",
      sourceRepositoryFullName:
        repository.fullName ||
        [repository.ownerLogin, repository.name].filter(Boolean).join("/") ||
        repository.name ||
        "",
      sourceRepositoryUrl: repository.repositoryUrl || "",
      sourceOwnerLogin: repository.ownerLogin || "",
      sourceOwnerType: repository.ownerType || "",
      sourceImportedAt: new Date().toISOString(),
      sourceRelation: "owner",
    }));
  }

  // Mezcla la selección manual de GitHub con el estado del CV.
  // Regla importante:
  // - preserva proyectos manuales
  // - reemplaza solo proyectos previamente generados desde GitHub
  function mergeSelectedRepositoriesIntoCVState(
    currentState,
    selectedRepositories = []
  ) {
    const normalizedCVState = createPortfolioCV(currentState);

    const manualProjects = normalizedCVState.projects.filter(
      (project) =>
        !String(project.id ?? "").startsWith(GITHUB_PROJECT_ID_PREFIX)
    );

    const githubProjects = mapSelectedRepositoriesToProjects(
      selectedRepositories
    );

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

    if (printCVRenderer) {
      printCVRenderer.updateCVState(savedCV);
    }

    if (githubIntegration) {
      githubIntegration.updateCVState(savedCV);
    }
  }

  // Conecta el botón visible de exportación con la impresión del navegador.
  // Para este MVP:
  // - reutilizamos la preview actual,
  // - delegamos la salida PDF al navegador,
  // - la limpieza visual la resuelve CSS de impresión.
  function bindExportPdfButton() {
    const button = document.querySelector(exportPdfButtonSelector);

    if (!button || exportPdfButtonElement === button) {
      return;
    }

    exportPdfButtonElement = button;

    exportPdfButtonElement.addEventListener("click", () => {
      if (typeof window.print !== "function") {
        console.error("Este navegador no soporta impresión desde window.print().");
        return;
      }

      window.print();
    });

    // Botón Vista Pública
    const viewPublicButton = document.querySelector("#view-public-button");
    if (viewPublicButton) {
      viewPublicButton.addEventListener("click", () => {
        window.open("./public.html", "_blank");
      });
    }
  }

  // Inicializa la app autenticada una sola vez.
  function init() {
    if (isInitialized) {
      return getPublicApi();
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

    // 3. Creamos la vista exportable específica para impresión.
    const createdPrintCVRenderer = createPrintCVRenderer({
      initialCVState: cvState,
    });

    if (!createdPrintCVRenderer) {
      console.error("No se pudo inicializar PrintCVRenderer.");
    } else {
      printCVRenderer = createdPrintCVRenderer;
      printCVRenderer.init();
    }

    // 4. Creamos la integración GitHub.
    const createdGitHubIntegration = createGitHubIntegration({
      initialCVState: cvState,

      onProfileLoaded: (githubData) => {
        const enrichedCVState = mergeGitHubProfileIntoCVState(
          cvState,
          githubData
        );
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

    // 4.b Inicializamos el buscador de empleo (Mock honesto, sin afectar cvState por ahora)
    const jobSearchIntegration = createJobSearchIntegration();
    if (jobSearchIntegration) {
      jobSearchIntegration.init();
    }

    // 5. Creamos el editor del perfil.
    const createdProfileEditor = createProfileEditor({
      formSelector: profileFormSelector,
      feedbackSelector: profileFeedbackSelector,
      initialCVState: cvState,

      onChange: (draftCVState) => {
        if (previewRenderer) {
          previewRenderer.updateCVState(draftCVState);
        }

        if (printCVRenderer) {
          printCVRenderer.updateCVState(draftCVState);
        }
      },

      onSave: (nextCVState) => {
        const savedCV = persistCVState(nextCVState);
        syncUIWithCVState(savedCV);
      },
    });

    if (!createdProfileEditor) {
      console.error("No se pudo inicializar ProfileEditor.");
      return getPublicApi();
    }

    profileEditor = createdProfileEditor;
    profileEditor.init();
    bindExportPdfButton();

    isInitialized = true;

    return getPublicApi();
  }

  // Devuelve el estado del CV de forma segura y normalizada.
  function getCVState() {
    return cvState ? createPortfolioCV(cvState) : null;
  }

  // Devuelve referencias útiles para debug o wiring superior.
  function getModules() {
    return {
      profileEditor,
      previewRenderer,
      printCVRenderer,
      githubIntegration,
    };
  }

  // Helpers que hoy siguen siendo útiles para debug y transición.
  function getStateHelpers() {
    return {
      mergeGitHubProfileIntoCVState,
      mergeSelectedRepositoriesIntoCVState,
    };
  }

  function getPublicApi() {
    return {
      init,
      getCVState,
      getModules,
      getStateHelpers,
    };
  }

  return getPublicApi();
}
