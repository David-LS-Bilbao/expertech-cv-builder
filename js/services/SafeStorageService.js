// Wrapper seguro de Storage API del navegador.
// Responsabilidad: proporcionar un objeto compatible con Storage
// que funcione en entornos restrictivos (Safari privado, iframes, etc).
//
// Estrategia de fallback:
// 1. localStorage (persistente)
// 2. sessionStorage (sesión)
// 3. memoria con Map (runtime)
//
// No modifica claves, no serializa JSON, no añade namespace.
// Compatible con la Storage API: getItem(key), setItem(key, value), removeItem(key).

let inMemoryStore = new Map();

/**
 * Intenta obtener localStorage con validación.
 * Devuelve null si no está disponible o bloqueado.
 */
function tryGetLocalStorage() {
  try {
    if (!globalThis.localStorage) {
      return null;
    }
    // Prueba de lectura/escritura
    const testKey = "__expertech_test__";
    globalThis.localStorage.setItem(testKey, "1");
    globalThis.localStorage.removeItem(testKey);
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

/**
 * Intenta obtener sessionStorage con validación.
 * Devuelve null si no está disponible o bloqueado.
 */
function tryGetSessionStorage() {
  try {
    if (!globalThis.sessionStorage) {
      return null;
    }
    // Prueba de lectura/escritura
    const testKey = "__expertech_test__";
    globalThis.sessionStorage.setItem(testKey, "1");
    globalThis.sessionStorage.removeItem(testKey);
    return globalThis.sessionStorage;
  } catch {
    return null;
  }
}

/**
 * Envuelve un Map para implementar la interfaz Storage.
 */
function createMemoryStorage(store = new Map()) {
  return {
    getItem(key) {
      const value = store.get(key);
      return value === undefined ? null : String(value);
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    get length() {
      return store.size;
    },
    key(index) {
      let i = 0;
      for (const k of store.keys()) {
        if (i === index) return k;
        i++;
      }
      return null;
    }
  };
}

/**
 * Obtiene un objeto compatible con Storage API.
 * Fallback automático: localStorage → sessionStorage → memoria.
 *
 * @returns {Object} Objeto con getItem, setItem, removeItem compatible con Storage API.
 */
export function getSafeStorage() {
  // Intenta localStorage
  const localStorage = tryGetLocalStorage();
  if (localStorage) {
    return {
      type: "localStorage",
      getItem: (key) => localStorage.getItem(key),
      setItem: (key, value) => localStorage.setItem(key, value),
      removeItem: (key) => localStorage.removeItem(key),
      clear: () => localStorage.clear(),
      length: localStorage.length,
      key: (index) => localStorage.key(index),
    };
  }

  // Intenta sessionStorage
  const sessionStorage = tryGetSessionStorage();
  if (sessionStorage) {
    console.warn(
      "[SafeStorage] localStorage no disponible, usando sessionStorage. Los datos se perderán al cerrar la pestaña."
    );
    return {
      type: "sessionStorage",
      getItem: (key) => sessionStorage.getItem(key),
      setItem: (key, value) => sessionStorage.setItem(key, value),
      removeItem: (key) => sessionStorage.removeItem(key),
      clear: () => sessionStorage.clear(),
      length: sessionStorage.length,
      key: (index) => sessionStorage.key(index),
    };
  }

  // Fallback a memoria
  console.warn(
    "[SafeStorage] localStorage y sessionStorage no disponibles, usando memoria. Los datos se perderán al recargar."
  );
  const memoryStorage = createMemoryStorage(inMemoryStore);
  return {
    type: "memory",
    getItem: (key) => memoryStorage.getItem(key),
    setItem: (key, value) => memoryStorage.setItem(key, value),
    removeItem: (key) => memoryStorage.removeItem(key),
    clear: () => memoryStorage.clear(),
    length: memoryStorage.length,
    key: (index) => memoryStorage.key(index),
  };
}
