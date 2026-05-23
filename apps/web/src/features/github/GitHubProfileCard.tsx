import { ExternalLink, MapPin, Users } from 'lucide-react'
import type { GitHubProfile } from '../../lib/github/types'

interface Props {
  profile: GitHubProfile
}

export function GitHubProfileCard({ profile }: Props) {
  const displayName = profile.name || profile.login

  return (
    <article className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {profile.avatarUrl && (
          <img
            src={profile.avatarUrl}
            alt={`Avatar público de GitHub de ${profile.login}`}
            className="h-24 w-24 rounded-lg border border-outline-variant/50 object-cover"
          />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h2 className="truncate text-headline-md font-semibold text-on-surface">{displayName}</h2>
              <p className="mt-1 text-body-md font-semibold text-primary">@{profile.login}</p>
            </div>
            {profile.profileUrl && (
              <a
                href={profile.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-lg border border-outline-variant/70 bg-surface px-3 py-2 text-label-md font-semibold text-primary transition hover:border-primary"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Ver perfil
              </a>
            )}
          </div>

          <p className="mt-4 text-body-md text-on-surface-variant">
            {profile.bio || 'Este perfil público de GitHub no tiene biografía disponible.'}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 text-label-md text-on-surface-variant sm:grid-cols-3">
            <span className="inline-flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" aria-hidden="true" />
              {profile.followers} seguidores
            </span>
            <span>{profile.publicRepos} repos públicos</span>
            {profile.location && (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                {profile.location}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
