// UI mínima para la integración con GitHub.
// Responsabilidades de este módulo:
// 1. renderizar el bloque GitHub cuando exista un root-template,
// 2. gestionar el formulario de búsqueda de GitHub,
// 3. consultar la API pública a través del servicio,
// 4. renderizar el perfil público encontrado,
// 5. renderizar repositorios candidatos,
// 6. permitir selección manual de repositorios destacados,
// 7. rehidratar el bloque GitHub al recargar si existe githubUsername persistido,
// 8. emitir callbacks para que la capa superior decida cómo integrar esos datos.
//
// Importante:
// - aquí no guardamos nada en localStorage,
// - aquí no tocamos directamente el formulario principal del perfil,
// - si la API falla, el flujo manual del CV sigue siendo la base segura,
// - mantiene compatibilidad con el HTML antiguo mientras hacemos la transición.

import { createPortfolioCV } from "../models/PortfolioCV.js";
import { fetchGitHubPublicData } from "../services/GitHubProfileService.js";
import { renderGitHubBlockTemplate } from "./GitHubBlockTemplate.js";

// Estado visual inicial del badge del bloque GitHub.
const GITHUB_BADGE_LABELS = {
  idle: "Sin conectar",
  loading: "Cargando...",
  connected: "Conectado",
  error: "Error",
};

// Prefijo usado por la capa superior para convertir repositorios GitHub en projects persistidos.
// Lo reutilizamos aquí para poder reconstruir la selección al recargar.
const GITHUB_PROJECT_ID_PREFIX = "github-repo-";

// Crea la integración UI del bloque GitHub.
export function createGitHubIntegration({
  githubBlockRootSelector = "#github-block-root",
  formSelector = "#github-form",
  usernameInputSelector = "#github-username-search",
  feedbackSelector = "#github-form-feedback",
  statusBadgeSelector = "#github-status-badge",
  emptyStateSelector = "#github-empty-state",
  profileResultSelector = "#github-profile-result",
  profileAvatarSelector = "#github-profile-avatar",
  profileNameSelector = "#github-profile-name",
  profileLoginSelector = "#github-profile-login",
  profileBioSelector = "#github-profile-bio",
  profileLinkSelector = "#github-profile-link",
  repositoriesSectionSelector = "#github-repositories-section",
  repositoriesCountSelector = "#github-repositories-count",
  repositoriesListSelector = "#github-repositories-list",
  selectedRepositoriesSectionSelector = "#github-selected-repositories-section",
  selectedRepositoriesCountSelector = "#github-selected-repositories-count",
  selectedRepositoriesListSelector = "#github-selected-repositories-list",
  initialCVState,
  onProfileLoaded = () => {},
  onRepositoriesSelectionChange = () => {},
} = {}) {
  // Estado CV normalizado para poder leer datos iniciales del perfil.
  let currentCVState = createPortfolioCV(initialCVState);

  // Último resultado exitoso traído desde GitHub.
  let currentGitHubData = null;

  // Repositorios seleccionados manualmente por el usuario.
  let selectedRepositories = [];

  // Referencia al request de rehidratación.
  // Sirve para evitar estados visuales incoherentes si hubiera varias cargas seguidas.
  let currentLoadRequestId = 0;

  // Si existe el root nuevo del template, lo renderizamos.
  // Si todavía no existe, mantenemos compatibilidad con el HTML anterior.
  const githubBlockRootElement = document.querySelector(githubBlockRootSelector);

  if (githubBlockRootElement) {
    renderGitHubBlockTemplate(githubBlockRootElement);
  }

  // Referencias DOM principales del bloque GitHub.
  const formElement = document.querySelector(formSelector);
  const usernameInputElement = document.querySelector(usernameInputSelector);
  const feedbackElement = document.querySelector(feedbackSelector);
  const statusBadgeElement = document.querySelector(statusBadgeSelector);
  const emptyStateElement = document.querySelector(emptyStateSelector);

  const profileResultElement = document.querySelector(profileResultSelector);
  const profileAvatarElement = document.querySelector(profileAvatarSelector);
  const profileNameElement = document.querySelector(profileNameSelector);
  const profileLoginElement = document.querySelector(profileLoginSelector);
  const profileBioElement = document.querySelector(profileBioSelector);
  const profileLinkElement = document.querySelector(profileLinkSelector);

  const repositoriesSectionElement = document.querySelector(
    repositoriesSectionSelector
  );
  const repositoriesCountElement = document.querySelector(
    repositoriesCountSelector
  );
  const repositoriesListElement = document.querySelector(
    repositoriesListSelector
  );

  const selectedRepositoriesSectionElement = document.querySelector(
    selectedRepositoriesSectionSelector
  );
  const selectedRepositoriesCountElement = document.querySelector(
    selectedRepositoriesCountSelector
  );
  const selectedRepositoriesListElement = document.querySelector(
    selectedRepositoriesListSelector
  );

  // Validación mínima: el formulario y el input sí son obligatorios para esta feature.
  if (!formElement || !usernameInputElement) {
    console.error(
      "No se pudo inicializar GitHubIntegration: faltan elementos básicos del bloque GitHub."
    );
    return null;
  }

  // Limpia el username escrito por el usuario.
  function normalizeUsername(value) {
    return String(value ?? "")
      .trim()
      .replace(/^@+/, "");
  }

  // Devuelve el username persistido en el perfil del CV.
  function getPersistedGitHubUsername() {
    return normalizeUsername(currentCVState.profile?.githubUsername);
  }

  // Extrae de currentCVState los IDs de proyectos que provienen de GitHub.
  // Ejemplo persistido: "github-repo-12345" -> "12345"
  function getPersistedGitHubRepositoryIds() {
    return new Set(
      currentCVState.projects
        .map((project) => String(project.id ?? ""))
        .filter((projectId) => projectId.startsWith(GITHUB_PROJECT_ID_PREFIX))
        .map((projectId) => projectId.replace(GITHUB_PROJECT_ID_PREFIX, ""))
    );
  }

  // Reconstruye la selección manual a partir de los projects persistidos del CV.
  function buildSelectedRepositoriesFromCVState(repositories = []) {
    const persistedIds = getPersistedGitHubRepositoryIds();

    return repositories.filter((repository) =>
      persistedIds.has(String(repository.id))
    );
  }

  // Busca si un repositorio ya está seleccionado.
  function isRepositorySelected(repositoryId) {
    return selectedRepositories.some(
      (repository) => String(repository.id) === String(repositoryId)
    );
  }

  // Estado visual del badge superior del bloque GitHub.
  function setStatusBadge(mode = "idle") {
    if (!statusBadgeElement) {
      return;
    }

    statusBadgeElement.textContent =
      GITHUB_BADGE_LABELS[mode] ?? GITHUB_BADGE_LABELS.idle;

    if (mode === "connected") {
      statusBadgeElement.classList.remove("status-badge-muted");
    } else {
      statusBadgeElement.classList.add("status-badge-muted");
    }
  }

  // Limpia clases visuales del feedback.
  function resetFeedbackState() {
    if (!feedbackElement) {
      return;
    }

    feedbackElement.classList.remove("is-error", "is-info");
  }

  // Muestra feedback textual dentro del bloque GitHub.
  function showFeedback(message, type = "info") {
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

  // Limpia el feedback del bloque.
  function clearFeedback() {
    if (!feedbackElement) {
      return;
    }

    resetFeedbackState();
    feedbackElement.textContent = "";
  }

  // Renderiza el estado vacío del bloque.
  function renderEmptyState(shouldShow) {
    if (!emptyStateElement) {
      return;
    }

    emptyStateElement.hidden = !shouldShow;
  }

  // Renderiza el perfil público encontrado.
  function renderProfileResult(profile) {
    if (!profileResultElement) {
      return;
    }

    profileResultElement.hidden = false;

    if (profileAvatarElement) {
      profileAvatarElement.src = profile.avatarUrl || "";
      profileAvatarElement.alt = profile.login
        ? `Avatar de GitHub de ${profile.login}`
        : "Avatar de GitHub";
    }

    if (profileNameElement) {
      profileNameElement.textContent =
        profile.name || profile.login || "Perfil GitHub";
    }

    if (profileLoginElement) {
      profileLoginElement.textContent = profile.login
        ? `@${profile.login}`
        : "@usuario";
    }

    if (profileBioElement) {
      profileBioElement.textContent =
        profile.bio || "Este perfil público de GitHub no tiene biografía disponible.";
    }

    if (profileLinkElement) {
      profileLinkElement.href = profile.profileUrl || "#";
      profileLinkElement.textContent = "Ver perfil en GitHub";
    }
  }

  // Oculta el bloque de perfil GitHub.
  function hideProfileResult() {
    if (profileResultElement) {
      profileResultElement.hidden = true;
    }
  }

  // Construye la card mínima de un repositorio candidato.
  function createRepositoryItem(repository) {
    const article = document.createElement("article");
    article.className = "github-repository-item";

    const title = document.createElement("p");
    title.className = "empty-state-title";
    title.textContent = repository.name || "Repositorio sin nombre";

    const description = document.createElement("p");
    description.className = "empty-state-text";
    description.textContent =
      repository.description || "Este repositorio público no tiene descripción.";

    const meta = document.createElement("p");
    meta.className = "empty-state-text";

    const language = repository.language || "Sin lenguaje especificado";
    const stars = repository.stars ?? 0;
    meta.textContent = `${language} · ★ ${stars}`;

    const actions = document.createElement("div");
    actions.className = "profile-form-actions";

    const openLink = document.createElement("a");
    openLink.className = "btn btn-secondary";
    openLink.href = repository.repositoryUrl || "#";
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Ver repo";

    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.className = isRepositorySelected(repository.id)
      ? "btn btn-primary"
      : "btn btn-secondary";
    toggleButton.textContent = isRepositorySelected(repository.id)
      ? "Quitar selección"
      : "Seleccionar";

    toggleButton.addEventListener("click", () => {
      toggleRepositorySelection(repository);
    });

    actions.append(openLink, toggleButton);
    article.append(title, description, meta, actions);

    return article;
  }

  // Renderiza la lista de repositorios candidatos.
  function renderRepositories(repositories = []) {
    if (!repositoriesSectionElement || !repositoriesListElement) {
      return;
    }

    repositoriesListElement.innerHTML = "";

    if (!Array.isArray(repositories) || repositories.length === 0) {
      repositoriesSectionElement.hidden = true;

      if (repositoriesCountElement) {
        repositoriesCountElement.textContent = "0 encontrados";
      }

      return;
    }

    repositories.forEach((repository) => {
      repositoriesListElement.appendChild(createRepositoryItem(repository));
    });

    repositoriesSectionElement.hidden = false;

    if (repositoriesCountElement) {
      repositoriesCountElement.textContent = `${repositories.length} encontrados`;
    }
  }

  // Crea una card mínima para un repositorio seleccionado.
  function createSelectedRepositoryItem(repository) {
    const article = document.createElement("article");
    article.className = "github-selected-repository-item";

    const title = document.createElement("p");
    title.className = "empty-state-title";
    title.textContent = repository.name || "Repositorio sin nombre";

    const description = document.createElement("p");
    description.className = "empty-state-text";
    description.textContent =
      repository.description || "Repositorio seleccionado sin descripción pública.";

    const actions = document.createElement("div");
    actions.className = "profile-form-actions";

    const openLink = document.createElement("a");
    openLink.className = "btn btn-secondary";
    openLink.href = repository.repositoryUrl || "#";
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Ver repo";

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "btn btn-primary";
    removeButton.textContent = "Quitar";
    removeButton.addEventListener("click", () => {
      toggleRepositorySelection(repository);
    });

    actions.append(openLink, removeButton);
    article.append(title, description, actions);

    return article;
  }

  // Renderiza la lista de repositorios seleccionados.
  function renderSelectedRepositories() {
    if (!selectedRepositoriesSectionElement || !selectedRepositoriesListElement) {
      return;
    }

    selectedRepositoriesListElement.innerHTML = "";

    if (selectedRepositories.length === 0) {
      selectedRepositoriesSectionElement.hidden = true;

      if (selectedRepositoriesCountElement) {
        selectedRepositoriesCountElement.textContent = "0 seleccionados";
      }

      return;
    }

    selectedRepositories.forEach((repository) => {
      selectedRepositoriesListElement.appendChild(
        createSelectedRepositoryItem(repository)
      );
    });

    selectedRepositoriesSectionElement.hidden = false;

    if (selectedRepositoriesCountElement) {
      selectedRepositoriesCountElement.textContent = `${selectedRepositories.length} seleccionados`;
    }
  }

  // Alterna selección manual de repositorios.
  function toggleRepositorySelection(repository) {
    const alreadySelected = isRepositorySelected(repository.id);

    if (alreadySelected) {
      selectedRepositories = selectedRepositories.filter(
        (selectedRepository) =>
          String(selectedRepository.id) !== String(repository.id)
      );
    } else {
      selectedRepositories = [...selectedRepositories, repository];
    }

    renderRepositories(currentGitHubData?.repositories ?? []);
    renderSelectedRepositories();

    onRepositoriesSelectionChange([...selectedRepositories]);
  }

  // Deja el bloque GitHub en estado de carga.
  function renderLoadingState(username, { isRehydration = false } = {}) {
    setStatusBadge("loading");

    if (isRehydration) {
      showFeedback(
        `Recuperando perfil público de GitHub para "${username}"...`,
        "info"
      );
      return;
    }

    showFeedback(
      `Consultando perfil público de GitHub para "${username}"...`,
      "info"
    );
  }

  // Renderiza todos los datos traídos de GitHub tras una consulta exitosa.
  function renderGitHubData(githubData) {
    currentGitHubData = githubData;

    renderEmptyState(false);
    renderProfileResult(githubData.profile);
    renderRepositories(githubData.repositories);
    renderSelectedRepositories();
    setStatusBadge("connected");
  }

  // Si no hay datos todavía, deja visible solo la ayuda inicial.
  function renderInitialState() {
    clearFeedback();
    setStatusBadge("idle");
    renderEmptyState(true);
    hideProfileResult();
    renderRepositories([]);
    renderSelectedRepositories();
  }

  // Devuelve el username actual del input.
  function getSearchUsername() {
    return normalizeUsername(usernameInputElement.value);
  }

  // Ejecuta una carga real contra GitHub.
  // Esta misma función sirve tanto para:
  // - búsqueda manual
  // - rehidratación automática al recargar
  async function loadGitHubData(
    username,
    { isRehydration = false, notifyCallbacks = true } = {}
  ) {
    const normalizedUsername = normalizeUsername(username);

    if (!normalizedUsername) {
      throw new Error("Debes indicar un usuario de GitHub válido.");
    }

    const requestId = ++currentLoadRequestId;

    renderLoadingState(normalizedUsername, { isRehydration });

    const githubData = await fetchGitHubPublicData(normalizedUsername);

    // Si llegó una respuesta vieja después de otra más reciente, la ignoramos.
    if (requestId !== currentLoadRequestId) {
      return;
    }

    // Reconstruimos la selección a partir de projects persistidos del CV.
    selectedRepositories = buildSelectedRepositoriesFromCVState(
      githubData.repositories
    );

    renderGitHubData(githubData);

    if (isRehydration) {
      // En rehidratación no dejamos feedback "pegado" si todo ha ido bien.
      clearFeedback();
    } else {
      showFeedback("Perfil de GitHub cargado correctamente.");
    }

    if (notifyCallbacks) {
      onProfileLoaded(githubData);
      onRepositoriesSelectionChange([...selectedRepositories]);
    }
  }

  // Intenta reconstruir el bloque GitHub a partir del estado persistido del CV.
  // Regla MVP:
  // - si hay githubUsername persistido, reconsultamos GitHub
  // - si además hay projects GitHub persistidos, reconstruimos seleccionados
  async function rehydrateFromCVState() {
    const persistedUsername = getPersistedGitHubUsername();

    if (!persistedUsername) {
      renderInitialState();
      return;
    }

    usernameInputElement.value = persistedUsername;

    try {
      await loadGitHubData(persistedUsername, {
        isRehydration: true,
        notifyCallbacks: false,
      });
    } catch (error) {
      console.error("No se pudo rehidratar el bloque GitHub al recargar:", error);

      setStatusBadge("error");
      showFeedback(
        "No se pudo recuperar el perfil de GitHub al recargar. Puedes seguir usando el flujo manual.",
        "error"
      );

      // Aunque falle la API, mantenemos el input sincronizado
      // y dejamos visible la ayuda del bloque.
      currentGitHubData = null;
      selectedRepositories = [];
      hideProfileResult();
      renderRepositories([]);
      renderSelectedRepositories();
      renderEmptyState(true);
    }
  }

  // Sincroniza el input de búsqueda con el username del perfil,
  // pero solo si el usuario aún no ha escrito nada en este bloque
  // o si el valor persistido es distinto del mostrado.
  function syncSearchInputWithCVState() {
    const profileUsername = getPersistedGitHubUsername();
    const currentSearchValue = normalizeUsername(usernameInputElement.value);

    if (!currentSearchValue && profileUsername) {
      usernameInputElement.value = profileUsername;
      return;
    }

    if (profileUsername && currentSearchValue !== profileUsername) {
      usernameInputElement.value = profileUsername;
    }
  }

  // Reconciliación ligera cuando la capa superior actualiza el estado global.
  // Si ya tenemos datos GitHub cargados y siguen correspondiendo
  // al mismo username persistido, reconstruimos la selección visual.
  function reconcileLoadedGitHubStateWithCVState() {
    if (!currentGitHubData) {
      return;
    }

    const persistedUsername = getPersistedGitHubUsername();
    const loadedUsername = normalizeUsername(currentGitHubData.profile?.login);

    if (!persistedUsername || persistedUsername !== loadedUsername) {
      return;
    }

    selectedRepositories = buildSelectedRepositoriesFromCVState(
      currentGitHubData.repositories
    );

    renderGitHubData(currentGitHubData);
  }

  // Maneja la búsqueda manual del perfil GitHub.
  async function handleSubmit(event) {
    event.preventDefault();

    const username = getSearchUsername();

    if (!username) {
      setStatusBadge("error");
      showFeedback("Debes indicar un usuario de GitHub válido.", "error");
      return;
    }

    try {
      await loadGitHubData(username, {
        isRehydration: false,
        notifyCallbacks: true,
      });
    } catch (error) {
      console.error("No se pudo cargar la información pública de GitHub:", error);

      // Importante:
      // si falla GitHub, no rompemos el flujo manual del CV.
      setStatusBadge("error");
      showFeedback(
        error?.message ||
          "No se pudo consultar GitHub en este momento. Puedes seguir con el flujo manual.",
        "error"
      );

      if (!currentGitHubData) {
        renderEmptyState(true);
        hideProfileResult();
        renderRepositories([]);
        renderSelectedRepositories();
      }
    }
  }

  // Inicializa el bloque GitHub.
  function init() {
    syncSearchInputWithCVState();
    renderInitialState();
    formElement.addEventListener("submit", handleSubmit);

    // Rehidratación automática al arrancar.
    rehydrateFromCVState();
  }

  // Permite desmontar listeners si en el futuro hiciera falta.
  function destroy() {
    formElement.removeEventListener("submit", handleSubmit);
  }

  // Permite actualizar el estado base desde la capa superior.
  function updateCVState(nextCVState) {
    currentCVState = createPortfolioCV(nextCVState);
    syncSearchInputWithCVState();
    reconcileLoadedGitHubStateWithCVState();
  }

  // API pública mínima del módulo.
  return {
    init,
    destroy,
    updateCVState,
    getGitHubData: () => currentGitHubData,
    getSelectedRepositories: () => [...selectedRepositories],
    getSearchUsername,
    getElements: () => ({
      githubBlockRootElement,
      formElement,
      usernameInputElement,
      feedbackElement,
      statusBadgeElement,
      emptyStateElement,
      profileResultElement,
      repositoriesSectionElement,
      repositoriesListElement,
      selectedRepositoriesSectionElement,
      selectedRepositoriesListElement,
    }),
  };
}