import type { PortfolioCV } from '../domain/types'
import { createPortfolioCV } from '../domain/createPortfolioCV'
import { createInitialCVState } from '../domain/createInitialCVState'
import { getSafeStorage } from './SafeStorageService'

// Clave fija para Fase 3. Pasará a ser session-scoped cuando
// se porte auth en Fase 4/5.
const CV_STORAGE_KEY = 'expertech-cv:v2'

export function hasStoredCV(): boolean {
  return getSafeStorage().getItem(CV_STORAGE_KEY) !== null
}

export function saveCV(cvState: PortfolioCV): PortfolioCV {
  const storage = getSafeStorage()
  const normalized = createPortfolioCV({
    ...cvState,
    meta: { ...cvState.meta, lastUpdated: new Date().toISOString() },
  })
  try {
    storage.setItem(CV_STORAGE_KEY, JSON.stringify(normalized))
  } catch (err) {
    const e = err as Error
    if (e.name === 'QuotaExceededError') {
      console.error('[CVStorage] Cuota de almacenamiento excedida:', e.message)
    } else {
      console.error('[CVStorage] Error al guardar CV:', e.message)
    }
  }
  return normalized
}

export function loadCV(): PortfolioCV {
  const stored = getSafeStorage().getItem(CV_STORAGE_KEY)
  if (!stored) return createInitialCVState()
  try {
    return createPortfolioCV(JSON.parse(stored) as Parameters<typeof createPortfolioCV>[0])
  } catch (err) {
    console.error('[CVStorage] Error al parsear CV desde storage:', err)
    return createInitialCVState()
  }
}

export function resetCV(): void {
  getSafeStorage().removeItem(CV_STORAGE_KEY)
}
