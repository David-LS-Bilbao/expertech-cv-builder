import { CheckCircle2, Code2, ExternalLink, GitFork, Star } from 'lucide-react'
import type { GitHubRepository } from '../../lib/github/types'

interface Props {
  repository: GitHubRepository
  selected: boolean
  alreadyImported: boolean
  onToggle: (repository: GitHubRepository) => void
}

function formatDate(value: string): string {
  if (!value) return 'Sin fecha'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'

  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(date)
}

export function GitHubRepositoryCard({ repository, selected, alreadyImported, onToggle }: Props) {
  return (
    <article
      className={[
        'rounded-lg border bg-surface-container-lowest p-4 shadow-card transition',
        selected ? 'border-primary ring-2 ring-primary-container/30' : 'border-outline-variant/60',
        alreadyImported ? 'opacity-75' : '',
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-body-md font-semibold text-on-surface">{repository.name}</h3>
          <p className="mt-1 truncate text-label-sm text-on-surface-variant">{repository.fullName}</p>
        </div>
        {alreadyImported && (
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary-fixed/50 px-2 py-1 text-label-sm font-semibold text-secondary">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Importado
          </span>
        )}
      </div>

      <p className="mt-3 min-h-12 text-label-md text-on-surface-variant">
        {repository.description || 'Sin descripción pública.'}
      </p>

      <div className="mt-4 flex flex-wrap gap-2 text-label-sm text-on-surface-variant">
        {repository.language && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-2 py-1 font-semibold text-on-primary-fixed-variant">
            <Code2 className="h-3.5 w-3.5" aria-hidden="true" />
            {repository.language}
          </span>
        )}
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-1">
          <Star className="h-3.5 w-3.5" aria-hidden="true" />
          {repository.stars}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-1">
          <GitFork className="h-3.5 w-3.5" aria-hidden="true" />
          {repository.forks}
        </span>
        {repository.isArchived && (
          <span className="rounded-full bg-tertiary-fixed px-2 py-1 font-semibold text-tertiary">
            Archivado
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a
          href={repository.repositoryUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 text-label-md font-semibold text-primary"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Abrir repo
        </a>
        <button
          type="button"
          disabled={alreadyImported}
          onClick={() => onToggle(repository)}
          className={[
            'inline-flex min-h-10 items-center justify-center rounded-lg px-4 text-label-md font-semibold transition',
            selected
              ? 'border border-primary bg-surface text-primary'
              : 'bg-primary text-on-primary shadow-primary-glow hover:bg-on-primary-container',
            alreadyImported ? 'cursor-not-allowed border border-outline-variant bg-surface-container text-on-surface-variant shadow-none' : '',
          ].join(' ')}
        >
          {alreadyImported ? 'Ya importado' : selected ? 'Quitar' : 'Seleccionar'}
        </button>
      </div>

      <p className="mt-3 text-label-sm text-outline">Actualizado: {formatDate(repository.updatedAt)}</p>
    </article>
  )
}
