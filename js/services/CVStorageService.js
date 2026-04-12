// Servicio de persistencia del CV en localStorage.
// Centraliza guardar, cargar y resetear el estado del CV
// sin mezclar esta lógica con los modelos ni con la UI.

import { createPortfolioCV } from "../models/PortfolioCV.js";
import { createInitialCVState } from "../models/createInitialCVState.js";
import { loadSession } from "./AuthStorageService.js";

// Prefijo base de almacenamiento para el CV.
// En versiones antiguas se usaba una única clave global.
const CV_STORAGE_KEY_PREFIX = "expertech-cv";
const LEGACY_CV_STORAGE_KEY = CV_STORAGE_KEY_PREFIX;

function getStorage() {
  if (!globalThis.localStorage) {
    throw new Error("localStorage no está disponible en este entorno.");
  }

  return globalThis.localStorage;
}

function normalizeText(value = "") {
  return String(value).trim();
}

function normalizeEmail(email = "") {
  return normalizeText(email).toLowerCase();
}

function hasText(value = "") {
  return normalizeText(value).length > 0;
}

function getScopedCVStorageKey() {
  const session = loadSession();

  if (hasText(session?.userId)) {
    return `${CV_STORAGE_KEY_PREFIX}:${normalizeText(session.userId)}`;
  }

  const normalizedEmail = normalizeEmail(session?.email);

  if (hasText(normalizedEmail)) {
    return `${CV_STORAGE_KEY_PREFIX}:email:${normalizedEmail}`;
  }

  return LEGACY_CV_STORAGE_KEY;
}

function shouldMigrateLegacyCVToCurrentSession(legacyCVState) {
  const session = loadSession();
  const normalizedSessionEmail = normalizeEmail(session?.email);
  const normalizedProfileEmail = normalizeEmail(legacyCVState?.profile?.email);

  if (!hasText(normalizedSessionEmail) || !hasText(normalizedProfileEmail)) {
    return false;
  }

  return normalizedSessionEmail === normalizedProfileEmail;
}

function getStoredCVSnapshot() {
  const storage = getStorage();
  const scopedStorageKey = getScopedCVStorageKey();
  const scopedStoredCV = storage.getItem(scopedStorageKey);

  if (scopedStoredCV !== null) {
    return {
      storageKey: scopedStorageKey,
      storedCV: scopedStoredCV,
      migratedFromLegacy: false,
    };
  }

  // Si ya estamos en modo legado, no intentamos una segunda lectura.
  if (scopedStorageKey === LEGACY_CV_STORAGE_KEY) {
    return {
      storageKey: scopedStorageKey,
      storedCV: null,
      migratedFromLegacy: false,
    };
  }

  const legacyStoredCV = storage.getItem(LEGACY_CV_STORAGE_KEY);

  if (!legacyStoredCV) {
    return {
      storageKey: scopedStorageKey,
      storedCV: null,
      migratedFromLegacy: false,
    };
  }

  try {
    const parsedLegacyCV = JSON.parse(legacyStoredCV);
    const normalizedLegacyCV = createPortfolioCV(parsedLegacyCV);

    if (!shouldMigrateLegacyCVToCurrentSession(normalizedLegacyCV)) {
      return {
        storageKey: scopedStorageKey,
        storedCV: null,
        migratedFromLegacy: false,
      };
    }

    return {
      storageKey: scopedStorageKey,
      storedCV: legacyStoredCV,
      migratedFromLegacy: true,
    };
  } catch (error) {
    console.error("Error al parsear CV legado para migración:", error);

    return {
      storageKey: scopedStorageKey,
      storedCV: null,
      migratedFromLegacy: false,
    };
  }
}

// Firma exacta del proyecto demo antiguo que se sembraba en versiones previas.
// La usamos para limpiar el dato legado sin tocar proyectos manuales reales.
function isLegacySeededDemoProject(project = {}) {
  const normalizedStack = Array.isArray(project.stack) ? project.stack : [];

  return (
    project.id === "project-1" &&
    project.name === "EXPERTECH CV" &&
    project.description ===
      "MVP de currículum web interactivo para perfiles tech." &&
    project.repoUrl ===
      "https://github.com/David-LS-Bilbao/expertech-cv-builder" &&
    project.demoUrl === "" &&
    Boolean(project.featured) === true &&
    normalizedStack.length === 3 &&
    normalizedStack[0] === "HTML" &&
    normalizedStack[1] === "CSS" &&
    normalizedStack[2] === "JavaScript" &&
    !String(project.sourceProvider ?? "").trim()
  );
}

// Firma exacta del perfil demo antiguo.
// Si detectamos este estado legado, reiniciamos a perfil vacío.
function isLegacySeededDemoProfile(profile = {}) {
  const normalizedSkills = Array.isArray(profile.skills) ? profile.skills : [];

  return (
    profile.fullName === "David López Sotelo" &&
    profile.headline === "Frontend Developer" &&
    profile.summary ===
      "Perfil tech en construcción con foco en JavaScript y proyectos prácticos." &&
    profile.email === "david@example.com" &&
    profile.location === "Bilbao, España" &&
    profile.linkedinUrl === "https://www.linkedin.com/in/david-lopez-sotelo" &&
    profile.githubUsername === "David-LS-Bilbao" &&
    normalizedSkills.length === 3 &&
    normalizedSkills[0] === "HTML" &&
    normalizedSkills[1] === "CSS" &&
    normalizedSkills[2] === "JavaScript"
  );
}

function removeLegacySeededDemoData(cvState) {
  const normalizedCV = createPortfolioCV(cvState);
  const initialProfile = createInitialCVState().profile;

  const nextProjects = normalizedCV.projects.filter(
    (project) => !isLegacySeededDemoProject(project)
  );
  const hasLegacySeededProfile = isLegacySeededDemoProfile(normalizedCV.profile);
  const nextProfile = hasLegacySeededProfile
    ? {
        ...normalizedCV.profile,
        ...initialProfile,
      }
    : normalizedCV.profile;

  const hasRemovedLegacyDemo =
    nextProjects.length !== normalizedCV.projects.length ||
    hasLegacySeededProfile;

  return {
    hasRemovedLegacyDemo,
    cvState: hasRemovedLegacyDemo
      ? createPortfolioCV({
          ...normalizedCV,
          profile: nextProfile,
          projects: nextProjects,
        })
      : normalizedCV,
  };
}

// Indica si ya existe un CV persistido en el navegador.
export function hasStoredCV() {
  const { storedCV } = getStoredCVSnapshot();

  return storedCV !== null;
}

// Guarda el estado completo del CV en localStorage.
export function saveCV(cvState) {
  const storage = getStorage();
  const scopedStorageKey = getScopedCVStorageKey();

  // Normalizamos antes de guardar para asegurar una estructura estable.
  const normalizedCV = createPortfolioCV({
    ...cvState,
    meta: {
      ...cvState?.meta,
      lastUpdated: new Date().toISOString(),
    },
  });

  storage.setItem(scopedStorageKey, JSON.stringify(normalizedCV));

  return normalizedCV;
}

// Carga el estado del CV desde localStorage.
export function loadCV() {
  const storage = getStorage();
  const { storageKey, storedCV, migratedFromLegacy } = getStoredCVSnapshot();

  // Si no hay nada guardado, devolvemos el estado inicial del proyecto.
  if (!storedCV) {
    return createInitialCVState();
  }

  try {
    // Parseamos el contenido guardado.
    const parsedCV = JSON.parse(storedCV);

    // Normalizamos el resultado para evitar shapes rotas o incompletas.
    const { cvState, hasRemovedLegacyDemo } =
      removeLegacySeededDemoData(parsedCV);

    // Si limpiamos demo legado o migramos desde la clave global antigua,
    // persistimos el estado saneado en la clave del usuario actual.
    if (hasRemovedLegacyDemo || migratedFromLegacy) {
      storage.setItem(storageKey, JSON.stringify(cvState));
    }

    return cvState;
  } catch (error) {
    // Si el JSON está corrupto, evitamos romper la app.
    console.error("Error al cargar el CV desde localStorage:", error);

    return createInitialCVState();
  }
}

// Elimina el estado guardado del CV.
export function resetCV() {
  const storage = getStorage();
  const scopedStorageKey = getScopedCVStorageKey();

  storage.removeItem(scopedStorageKey);
}
