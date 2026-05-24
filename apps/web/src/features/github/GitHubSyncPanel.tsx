import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, Code2, Loader2, Search, Sparkles } from 'lucide-react'
import type { PortfolioCV } from '../../lib/domain/types'
import { GitHubRequestError, fetchGitHubPublicData, normalizeGitHubUsername } from '../../lib/github/githubClient'
import type { GitHubPublicData, GitHubRepository } from '../../lib/github/types'
import { GitHubProfileCard } from './GitHubProfileCard'
import { GitHubRepositoryList } from './GitHubRepositoryList'

type SyncStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error' | 'rate_limited'

interface Props {
  cv: PortfolioCV
  onImportRepositories: (username: string, repositories: GitHubRepository[]) => Promise<void>
}

const MAX_SELECTED_REPOSITORIES = 4

export function GitHubSyncPanel({ cv, onImportRepositories }: Props) {
  const [username, setUsername] = useState(cv.profile.githubUsername || '')
  const [status, setStatus] = useState<SyncStatus>('idle')
  const [githubData, setGitHubData] = useState<GitHubPublicData | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [feedback, setFeedback] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const importedFullNames = useMemo(() => {
    return new Set(
      cv.projects
        .filter((project) => project.sourceProvider === 'github' && project.sourceRepositoryFullName)
        .map((project) => project.sourceRepositoryFullName),
    )
  }, [cv.projects])

  const selectedRepositories = useMemo(() => {
    if (!githubData) return []
    return githubData.repositories.filter((repository) => selectedIds.has(repository.id))
  }, [githubData, selectedIds])

  async function handleSearch(event: React.FormEvent) {
    event.preventDefault()
    const normalizedUsername = normalizeGitHubUsername(username)

    if (!normalizedUsername) {
      setStatus('error')
      setFeedback('Debes indicar un usuario público de GitHub.')
      return
    }

    setStatus('loading')
    setFeedback('')
    setSelectedIds(new Set())

    try {
      const data = await fetchGitHubPublicData(normalizedUsername)
      setGitHubData(data)
      setStatus(data.repositories.length > 0 ? 'success' : 'empty')
      setFeedback(data.repositories.length > 0 ? 'Perfil de GitHub cargado correctamente.' : 'Perfil cargado, pero no hay repositorios candidatos.')
    } catch (error) {
      setGitHubData(null)
      setSelectedIds(new Set())

      if (error instanceof GitHubRequestError && error.isRateLimited) {
        setStatus('rate_limited')
        setFeedback(error.message)
        return
      }

      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'No se pudo consultar GitHub.')
    }
  }

  function toggleRepository(repository: GitHubRepository) {
    if (importedFullNames.has(repository.fullName)) return

    setSelectedIds((prev) => {
      const next = new Set(prev)

      if (next.has(repository.id)) {
        next.delete(repository.id)
        return next
      }

      if (next.size >= MAX_SELECTED_REPOSITORIES) {
        setFeedback(`Puedes seleccionar hasta ${MAX_SELECTED_REPOSITORIES} repositorios en esta importación.`)
        return next
      }

      next.add(repository.id)
      setFeedback('')
      return next
    })
  }

  async function handleImport() {
    if (!githubData || selectedRepositories.length === 0) {
      setFeedback('Selecciona al menos un repositorio para importarlo al CV.')
      return
    }

    setIsImporting(true)
    setFeedback('')

    try {
      await onImportRepositories(githubData.profile.login || githubData.username, selectedRepositories)
      setSelectedIds(new Set())
      setFeedback(`${selectedRepositories.length} repositorio(s) importado(s) y guardado(s) en el CV.`)
      setStatus('success')
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No se pudo importar la selección al CV.')
      setStatus('error')
    } finally {
      setIsImporting(false)
    }
  }

  const showResults = status === 'success' || status === 'empty'

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="space-y-6">
        <div className="relative overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
          <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
          <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">GitHub Sync</p>
          <h1 className="mt-2 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
            Convierte repos en proyectos
          </h1>
          <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
            Busca un perfil público, revisa sus repositorios recientes y selecciona solo lo que merece aparecer en tu CV.
          </p>

          <form onSubmit={handleSearch} className="mt-6">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="sr-only" htmlFor="github-username">Usuario de GitHub</label>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" aria-hidden="true" />
                <input
                  id="github-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Ej. octocat"
                  autoComplete="username"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest py-3 pl-12 pr-4 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/40"
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container disabled:cursor-wait disabled:opacity-70"
              >
                {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
                Buscar
              </button>
            </div>
          </form>

          {feedback && (
            <div
              className={[
                'mt-4 flex items-start gap-3 rounded-lg border p-3 text-label-md',
                status === 'error' || status === 'rate_limited'
                  ? 'border-error-container bg-error-container/60 text-error'
                  : 'border-secondary-fixed-dim bg-secondary-fixed/30 text-secondary',
              ].join(' ')}
              role="status"
            >
              {status === 'error' || status === 'rate_limited'
                ? <AlertTriangle className="mt-0.5 h-4 w-4" aria-hidden="true" />
                : <CheckCircle2 className="mt-0.5 h-4 w-4" aria-hidden="true" />}
              <p>{feedback}</p>
            </div>
          )}
        </div>

        {status === 'idle' && (
          <div className="rounded-lg border border-dashed border-outline-variant bg-surface-container-lowest p-10 text-center shadow-card">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed">
              <Code2 className="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-headline-md font-semibold text-on-surface">Listo para enseñar tu código</h2>
            <p className="mx-auto mt-2 max-w-xl text-body-md text-on-surface-variant">
              Introduce un username y crea una selección curada. Sin tokens, sin OAuth, solo datos públicos.
            </p>
          </div>
        )}

        {status === 'loading' && (
          <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-10 text-center shadow-card">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            <p className="mt-4 text-body-md font-semibold text-on-surface">Consultando GitHub...</p>
          </div>
        )}

        {(status === 'error' || status === 'rate_limited') && (
          <div className="rounded-lg border border-error-container bg-error-container/40 p-6 shadow-card">
            <h2 className="text-headline-md font-semibold text-error">
              {status === 'rate_limited' ? 'Límite público de GitHub alcanzado' : 'No se pudo cargar GitHub'}
            </h2>
            <p className="mt-2 text-body-md text-on-error-container">
              El CV sigue editable. Prueba otro usuario o repite la consulta más tarde.
            </p>
          </div>
        )}

        {showResults && githubData && (
          <>
            <GitHubProfileCard profile={githubData.profile} />

            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-headline-md font-semibold text-on-surface">Repositorios candidatos</h2>
                  <p className="mt-1 text-label-md text-on-surface-variant">
                    Orden reciente, sin forks por defecto. Excluidos: {githubData.excludedForks}.
                  </p>
                </div>
                <span className="w-fit rounded-full bg-surface-container-high px-3 py-1 text-label-sm font-semibold text-on-surface-variant">
                  {githubData.repositories.length} encontrados
                </span>
              </div>
              <GitHubRepositoryList
                repositories={githubData.repositories}
                selectedIds={selectedIds}
                importedFullNames={importedFullNames}
                onToggle={toggleRepository}
              />
            </div>
          </>
        )}
      </section>

      <aside className="xl:sticky xl:top-32 xl:self-start">
        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-headline-md font-semibold text-on-surface">Selección CV</h2>
            <span className="rounded-full bg-primary-container px-3 py-1 text-label-sm font-semibold text-on-primary-container">
              {selectedRepositories.length}/{MAX_SELECTED_REPOSITORIES}
            </span>
          </div>

          <div className="mt-6 min-h-56 space-y-3">
            {selectedRepositories.length === 0 ? (
              <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface p-6 text-center">
                <Sparkles className="h-8 w-8 text-outline" aria-hidden="true" />
                <p className="mt-3 text-label-md text-on-surface-variant">
                  Selecciona hasta {MAX_SELECTED_REPOSITORIES} repositorios para destacarlos en el CV.
                </p>
              </div>
            ) : (
              selectedRepositories.map((repository) => (
                <div key={repository.id} className="rounded-lg border border-outline-variant/60 bg-surface p-3">
                  <p className="truncate text-label-md font-semibold text-on-surface">{repository.name}</p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">
                    {repository.language || 'Sin lenguaje'} · {repository.stars} stars
                  </p>
                </div>
              ))
            )}
          </div>

          <button
            type="button"
            disabled={selectedRepositories.length === 0 || isImporting}
            onClick={() => void handleImport()}
            className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isImporting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Code2 className="h-4 w-4" aria-hidden="true" />}
            Importar al CV
          </button>
          <p className="mt-4 text-center text-label-sm text-on-surface-variant">
            La selección se añade al CV guardado y aparece en la preview.
          </p>
        </div>
      </aside>
    </div>
  )
}
