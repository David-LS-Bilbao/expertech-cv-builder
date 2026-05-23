import type { GitHubRepository } from '../../lib/github/types'
import { GitHubRepositoryCard } from './GitHubRepositoryCard'

interface Props {
  repositories: GitHubRepository[]
  selectedIds: Set<number>
  importedFullNames: Set<string>
  onToggle: (repository: GitHubRepository) => void
}

export function GitHubRepositoryList({ repositories, selectedIds, importedFullNames, onToggle }: Props) {
  if (repositories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-outline-variant bg-surface p-8 text-center">
        <p className="text-body-md font-semibold text-on-surface">No hay repositorios candidatos.</p>
        <p className="mt-2 text-label-md text-on-surface-variant">
          Puede que el usuario no tenga repos públicos recientes o que solo aparezcan forks excluidos por defecto.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
      {repositories.map((repository) => (
        <GitHubRepositoryCard
          key={repository.id}
          repository={repository}
          selected={selectedIds.has(repository.id)}
          alreadyImported={importedFullNames.has(repository.fullName)}
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
