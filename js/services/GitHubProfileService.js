// Servicio mínimo para consultar datos públicos de GitHub.
// Esta capa solo se encarga de:
// 1. pedir datos a la API pública,
// 2. normalizar la respuesta,
// 3. devolver errores controlados para que la UI pueda mantener
//    el flujo manual como fallback si GitHub falla.
//
// Importante:
// - no guarda nada en localStorage,
// - no toca el DOM,
// - no modifica el estado global de la app.

const GITHUB_API_BASE_URL = "https://api.github.com";

const DEFAULT_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

// Limita el número de repositorios candidatos que traeremos en el MVP.
// Así evitamos sobrecargar la UI en esta primera versión.
const DEFAULT_REPOSITORIES_LIMIT = 12;

// Limpia el username introducido por el usuario.
// Ejemplo: "@octocat" -> "octocat"
function normalizeGitHubUsername(username) {
  return String(username ?? "")
    .trim()
    .replace(/^@+/, "");
}

// Intenta extraer el mensaje de error que devuelve GitHub.
async function readGitHubErrorMessage(response) {
  try {
    const errorData = await response.json();
    return errorData?.message || "Error desconocido al consultar GitHub.";
  } catch {
    return "Error desconocido al consultar GitHub.";
  }
}

// Convierte errores HTTP en errores más útiles para la UI.
async function createGitHubRequestError(response, username) {
  if (response.status === 404) {
    return new Error(`No se ha encontrado el perfil público de GitHub "${username}".`);
  }

  if (response.status === 403) {
    return new Error(
      "GitHub ha rechazado temporalmente la petición. Puede haber límite de uso o restricción de acceso."
    );
  }

  const apiMessage = await readGitHubErrorMessage(response);

  return new Error(`No se pudo consultar GitHub: ${apiMessage}`);
}

// Pide JSON a GitHub con manejo de errores consistente.
async function requestGitHubJson(url, username) {
  const response = await fetch(url, {
    method: "GET",
    headers: DEFAULT_HEADERS,
  });

  if (!response.ok) {
    throw await createGitHubRequestError(response, username);
  }

  return response.json();
}

// Normaliza el perfil público de GitHub para que la UI trabaje
// con una estructura estable y pequeña.
function normalizeGitHubProfile(profileData) {
  return {
    id: profileData.id,
    login: profileData.login ?? "",
    name: profileData.name ?? "",
    avatarUrl: profileData.avatar_url ?? "",
    bio: profileData.bio ?? "",
    profileUrl: profileData.html_url ?? "",
    company: profileData.company ?? "",
    blog: profileData.blog ?? "",
    location: profileData.location ?? "",
    publicRepos: profileData.public_repos ?? 0,
    followers: profileData.followers ?? 0,
    following: profileData.following ?? 0,
  };
}

// Normaliza un repositorio público para que luego la UI pueda
// renderizarlo y permitir selección manual.
function normalizeGitHubRepository(repositoryData) {
  return {
    id: repositoryData.id,
    name: repositoryData.name ?? "",
    description: repositoryData.description ?? "",
    repositoryUrl: repositoryData.html_url ?? "",
    homepageUrl: repositoryData.homepage ?? "",
    language: repositoryData.language ?? "",
    stars: repositoryData.stargazers_count ?? 0,
    forks: repositoryData.forks_count ?? 0,
    updatedAt: repositoryData.updated_at ?? "",
    isFork: Boolean(repositoryData.fork),
    isArchived: Boolean(repositoryData.archived),
    isPrivate: Boolean(repositoryData.private),
  };
}

// Consulta el perfil público básico de un usuario.
export async function fetchGitHubProfile(username) {
  const normalizedUsername = normalizeGitHubUsername(username);

  if (!normalizedUsername) {
    throw new Error("Debes indicar un usuario de GitHub válido.");
  }

  const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(normalizedUsername)}`;
  const profileData = await requestGitHubJson(url, normalizedUsername);

  return normalizeGitHubProfile(profileData);
}

// Consulta los repositorios públicos del usuario.
// En este MVP:
// - solo traemos repos públicos del owner,
// - ordenados por actualización,
// - con límite razonable,
// - sin decidir todavía cuáles se mostrarán en el CV.
export async function fetchGitHubRepositories(
  username,
  { limit = DEFAULT_REPOSITORIES_LIMIT } = {}
) {
  const normalizedUsername = normalizeGitHubUsername(username);

  if (!normalizedUsername) {
    throw new Error("Debes indicar un usuario de GitHub válido.");
  }

  const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : DEFAULT_REPOSITORIES_LIMIT;

  const url =
    `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(normalizedUsername)}/repos` +
    `?sort=updated&per_page=${safeLimit}&type=owner`;

  const repositoriesData = await requestGitHubJson(url, normalizedUsername);

  if (!Array.isArray(repositoriesData)) {
    return [];
  }

  return repositoriesData.map(normalizeGitHubRepository);
}

// Consulta perfil + repositorios públicos en paralelo.
// Esta será la función más útil para la UI del bloque GitHub.
export async function fetchGitHubPublicData(
  username,
  { repositoriesLimit = DEFAULT_REPOSITORIES_LIMIT } = {}
) {
  const normalizedUsername = normalizeGitHubUsername(username);

  if (!normalizedUsername) {
    throw new Error("Debes indicar un usuario de GitHub válido.");
  }

  const [profile, repositories] = await Promise.all([
    fetchGitHubProfile(normalizedUsername),
    fetchGitHubRepositories(normalizedUsername, { limit: repositoriesLimit }),
  ]);

  return {
    username: normalizedUsername,
    profile,
    repositories,
  };
}