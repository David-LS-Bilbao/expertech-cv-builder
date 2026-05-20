import type { SafeStorage, StorageType } from '../domain/types'

let inMemoryStore = new Map<string, string>()

function tryGetLocalStorage(): Storage | null {
  try {
    if (!globalThis.localStorage) return null
    const testKey = '__expertech_test__'
    globalThis.localStorage.setItem(testKey, '1')
    globalThis.localStorage.removeItem(testKey)
    return globalThis.localStorage
  } catch {
    return null
  }
}

function tryGetSessionStorage(): Storage | null {
  try {
    if (!globalThis.sessionStorage) return null
    const testKey = '__expertech_test__'
    globalThis.sessionStorage.setItem(testKey, '1')
    globalThis.sessionStorage.removeItem(testKey)
    return globalThis.sessionStorage
  } catch {
    return null
  }
}

function wrapStorage(storage: Storage, type: StorageType): SafeStorage {
  return {
    type,
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => storage.setItem(key, value),
    removeItem: (key) => storage.removeItem(key),
    clear: () => storage.clear(),
    get length() { return storage.length },
    key: (index) => storage.key(index),
  }
}

function createMemoryStorage(): SafeStorage {
  const store = inMemoryStore
  return {
    type: 'memory',
    getItem: (key) => { const v = store.get(key); return v === undefined ? null : v },
    setItem: (key, value) => { store.set(key, value) },
    removeItem: (key) => { store.delete(key) },
    clear: () => { store.clear() },
    get length() { return store.size },
    key: (index) => {
      let i = 0
      for (const k of store.keys()) { if (i === index) return k; i++ }
      return null
    },
  }
}

export function getSafeStorage(): SafeStorage {
  const ls = tryGetLocalStorage()
  if (ls) return wrapStorage(ls, 'localStorage')

  const ss = tryGetSessionStorage()
  if (ss) {
    console.warn('[SafeStorage] localStorage no disponible, usando sessionStorage.')
    return wrapStorage(ss, 'sessionStorage')
  }

  console.warn('[SafeStorage] localStorage y sessionStorage no disponibles, usando memoria.')
  return createMemoryStorage()
}

export function resetInMemoryStore(): void {
  inMemoryStore = new Map()
}
