// Servicio de autenticación local para el MVP.
// Responsabilidades de este módulo:
// 1. guardar y cargar usuarios registrados desde localStorage,
// 2. registrar usuarios locales con email y contraseña,
// 3. iniciar sesión local con email y contraseña,
// 4. guardar y recuperar la sesión activa,
// 5. cerrar sesión sin borrar los usuarios registrados.
//
// Importante:
// - este MVP guarda la contraseña en texto plano por simplicidad,
// - no es una solución segura para producción,
// - se deja así solo como base rápida preparada para escalar más adelante
//   a backend + PostgreSQL + auth real.

const AUTH_USERS_STORAGE_KEY = "expertech-auth-users";
const AUTH_SESSION_STORAGE_KEY = "expertech-auth-session";

// Devuelve una referencia segura a localStorage.
// Si no existe, lanzamos un error claro.
function getStorage() {
  if (!globalThis.localStorage) {
    throw new Error("localStorage no está disponible en este entorno.");
  }

  return globalThis.localStorage;
}

// Genera un id simple para este MVP.
// Más adelante puede sustituirse por ids reales desde backend o DB.
function createId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Normaliza emails para evitar duplicados por mayúsculas/minúsculas.
function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

// Limpia texto simple para evitar guardar espacios vacíos.
function normalizeText(value = "") {
  return String(value).trim();
}

// Intenta parsear JSON de forma segura.
// Si algo falla, devuelve el fallback sin romper la app.
function safeParseJSON(value, fallback) {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("Error al parsear JSON de auth:", error);
    return fallback;
  }
}

// Devuelve true si el valor tiene contenido útil.
function hasText(value = "") {
  return normalizeText(value).length > 0;
}

// Crea el shape estable de un usuario local.
// Esta estructura queda preparada para crecer en futuras fases.
function createLocalUserRecord({
  id = createId("user"),
  displayName = "",
  email = "",
  password = "",
  provider = "local",
  createdAt = new Date().toISOString(),
} = {}) {
  return {
    id: String(id),
    displayName: normalizeText(displayName),
    email: normalizeEmail(email),
    password: String(password),
    provider: String(provider || "local"),
    createdAt: String(createdAt),
  };
}

// Crea el shape estable de sesión activa.
function createSessionRecord({
  userId = "",
  displayName = "",
  email = "",
  provider = "local",
  loggedAt = new Date().toISOString(),
} = {}) {
  return {
    userId: String(userId),
    displayName: normalizeText(displayName),
    email: normalizeEmail(email),
    provider: String(provider || "local"),
    loggedAt: String(loggedAt),
  };
}

// Carga todos los usuarios registrados.
// Si no hay nada guardado, devuelve un array vacío.
export function loadUsers() {
  const storage = getStorage();
  const rawUsers = storage.getItem(AUTH_USERS_STORAGE_KEY);

  if (!rawUsers) {
    return [];
  }

  const parsedUsers = safeParseJSON(rawUsers, []);

  if (!Array.isArray(parsedUsers)) {
    return [];
  }

  return parsedUsers.map((user) => createLocalUserRecord(user));
}

// Guarda la lista completa de usuarios.
// Siempre normalizamos antes de persistir.
export function saveUsers(users = []) {
  const storage = getStorage();

  const normalizedUsers = Array.isArray(users)
    ? users.map((user) => createLocalUserRecord(user))
    : [];

  storage.setItem(AUTH_USERS_STORAGE_KEY, JSON.stringify(normalizedUsers));

  return normalizedUsers;
}

// Busca un usuario por email normalizado.
// Si no existe, devuelve null.
export function findUserByEmail(email = "") {
  const normalizedEmail = normalizeEmail(email);

  if (!hasText(normalizedEmail)) {
    return null;
  }

  const users = loadUsers();

  return users.find((user) => user.email === normalizedEmail) ?? null;
}

// Guarda la sesión activa.
// Devuelve la sesión normalizada.
export function saveSession(sessionData = {}) {
  const storage = getStorage();
  const normalizedSession = createSessionRecord(sessionData);

  storage.setItem(AUTH_SESSION_STORAGE_KEY, JSON.stringify(normalizedSession));

  return normalizedSession;
}

// Carga la sesión activa.
// Si no existe o está rota, devuelve null.
export function loadSession() {
  const storage = getStorage();
  const rawSession = storage.getItem(AUTH_SESSION_STORAGE_KEY);

  if (!rawSession) {
    return null;
  }

  const parsedSession = safeParseJSON(rawSession, null);

  if (!parsedSession || typeof parsedSession !== "object") {
    return null;
  }

  const normalizedSession = createSessionRecord(parsedSession);

  // Validación mínima del shape de sesión.
  if (!hasText(normalizedSession.userId) || !hasText(normalizedSession.email)) {
    return null;
  }

  return normalizedSession;
}

// Indica si existe una sesión activa válida.
export function hasStoredSession() {
  return loadSession() !== null;
}

// Elimina la sesión activa sin borrar usuarios registrados.
export function clearSession() {
  const storage = getStorage();
  storage.removeItem(AUTH_SESSION_STORAGE_KEY);
}

// Alias semántico para logout.
// Devuelve un objeto consistente con el resto del servicio.
export function logoutUser() {
  clearSession();

  return {
    ok: true,
  };
}

// Registra un nuevo usuario local.
// Reglas MVP:
// - displayName obligatorio
// - email obligatorio
// - password obligatoria
// - no se permiten duplicados por email
// - si todo va bien, además crea sesión automáticamente
export function registerUser({ displayName = "", email = "", password = "" } = {}) {
  const normalizedDisplayName = normalizeText(displayName);
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password);

  if (!hasText(normalizedDisplayName)) {
    return {
      ok: false,
      error: "El nombre visible es obligatorio.",
    };
  }

  if (!hasText(normalizedEmail)) {
    return {
      ok: false,
      error: "El email es obligatorio.",
    };
  }

  if (!hasText(normalizedPassword)) {
    return {
      ok: false,
      error: "La contraseña es obligatoria.",
    };
  }

  const existingUser = findUserByEmail(normalizedEmail);

  if (existingUser) {
    return {
      ok: false,
      error: "Ya existe una cuenta registrada con ese email.",
    };
  }

  const users = loadUsers();

  const newUser = createLocalUserRecord({
    displayName: normalizedDisplayName,
    email: normalizedEmail,
    password: normalizedPassword,
    provider: "local",
  });

  const savedUsers = saveUsers([...users, newUser]);

  const session = saveSession({
    userId: newUser.id,
    displayName: newUser.displayName,
    email: newUser.email,
    provider: newUser.provider,
  });

  return {
    ok: true,
    user: newUser,
    session,
    users: savedUsers,
  };
}

// Inicia sesión con email + contraseña.
// Reglas MVP:
// - busca usuario por email normalizado
// - compara la contraseña exacta
// - si coincide, crea sesión
export function loginUser({ email = "", password = "" } = {}) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password);

  if (!hasText(normalizedEmail)) {
    return {
      ok: false,
      error: "El email es obligatorio.",
    };
  }

  if (!hasText(normalizedPassword)) {
    return {
      ok: false,
      error: "La contraseña es obligatoria.",
    };
  }

  const user = findUserByEmail(normalizedEmail);

  if (!user) {
    return {
      ok: false,
      error: "No existe una cuenta con ese email.",
    };
  }

  if (user.password !== normalizedPassword) {
    return {
      ok: false,
      error: "La contraseña no es correcta.",
    };
  }

  const session = saveSession({
    userId: user.id,
    displayName: user.displayName,
    email: user.email,
    provider: user.provider,
  });

  return {
    ok: true,
    user,
    session,
  };
}