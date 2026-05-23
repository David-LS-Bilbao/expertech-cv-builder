import { useEffect, useState } from 'react'
import { Code, FileText, Gauge, LogOut, Server } from 'lucide-react'
import type { CandidateProfile, PortfolioCV } from '../../lib/domain/types'
import { createPortfolioCV } from '../../lib/domain/createPortfolioCV'
import type { PublicUser } from '../../lib/api/client'
import { api } from '../../lib/api/client'
import type { GitHubRepository } from '../../lib/github/types'
import { githubRepositoryToProject } from '../../lib/github/githubToProject'
import { ProfileForm } from './ProfileForm'
import { CVPreview } from './CVPreview'
import { Dashboard } from './Dashboard'
import { GitHubSyncPanel } from '../github/GitHubSyncPanel'

interface Props {
  user: PublicUser
  cv: PortfolioCV
  onLogout: () => void | Promise<void>
  onCVUpdate: (cv: PortfolioCV) => void | Promise<void>
}

type BackendStatus = 'checking' | 'ok' | 'offline'
type ActiveView = 'dashboard' | 'editor' | 'github'

export function AuthenticatedShell({ user, cv, onLogout, onCVUpdate }: Props) {
  const [backendStatus, setBackendStatus] = useState<BackendStatus>('checking')
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')

  useEffect(() => {
    let cancelled = false
    api.health()
      .then(() => { if (!cancelled) setBackendStatus('ok') })
      .catch(() => { if (!cancelled) setBackendStatus('offline') })
    return () => { cancelled = true }
  }, [])

  async function handleProfileSave(profile: CandidateProfile) {
    await onCVUpdate(createPortfolioCV({ ...cv, profile }))
  }

  async function handleGitHubImport(username: string, repositories: GitHubRepository[]) {
    const importedFullNames = new Set(
      cv.projects
        .filter((project) => project.sourceProvider === 'github' && project.sourceRepositoryFullName)
        .map((project) => project.sourceRepositoryFullName),
    )

    const nextProjects = repositories
      .filter((repository) => !importedFullNames.has(repository.fullName))
      .map(githubRepositoryToProject)

    if (nextProjects.length === 0) {
      throw new Error('Los repositorios seleccionados ya estaban importados en el CV.')
    }

    await onCVUpdate(createPortfolioCV({
      ...cv,
      profile: {
        ...cv.profile,
        githubUsername: username,
      },
      projects: [...cv.projects, ...nextProjects],
    }))
  }

  const userName = user.displayName || user.email
  const navigationItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: Gauge },
    { id: 'editor' as const, label: 'Editor CV', icon: FileText },
    { id: 'github' as const, label: 'GitHub', icon: Code },
  ]
  const activeViewLabel = activeView === 'dashboard' ? 'Dashboard' : activeView === 'editor' ? 'Editor CV' : 'GitHub Sync'

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="hidden h-screen w-64 flex-col border-r border-outline-variant/70 bg-surface-container-low p-6 lg:fixed lg:left-0 lg:top-0 lg:flex">
        <div>
          <p className="text-headline-md font-bold text-primary">EXPERTECH CV</p>
          <p className="mt-1 text-label-sm font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
            Plataforma V2
          </p>
        </div>

        <nav className="mt-10 flex-1 space-y-2" aria-label="Navegación autenticada">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeView === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveView(item.id)}
                className={[
                  'flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-label-md transition',
                  isActive
                    ? 'translate-x-1 bg-surface-container-high font-semibold text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container',
                ].join(' ')}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="rounded-lg border border-primary/20 bg-primary-container/20 p-4 text-on-primary-container">
          <p className="text-label-sm font-semibold uppercase tracking-[0.05em]">Sprint UI 2</p>
          <p className="mt-2 text-label-md">Dashboard y editor visual alineados con Stitch.</p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b border-outline-variant/50 bg-surface/95 px-5 py-4 shadow-card backdrop-blur md:px-8 lg:px-margin-desktop">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
                {activeViewLabel}
              </p>
              <h1 className="mt-1 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-md">
                {activeView === 'dashboard' ? `Hola, ${userName}` : activeViewLabel}
              </h1>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between xl:justify-end">
              <nav className="flex rounded-lg border border-outline-variant/70 bg-surface-container-low p-1 lg:hidden" aria-label="Navegación móvil">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeView === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveView(item.id)}
                      className={[
                        'inline-flex min-h-10 items-center gap-2 rounded-md px-3 text-label-md transition',
                        isActive ? 'bg-surface-container-lowest text-primary shadow-card' : 'text-on-surface-variant',
                      ].join(' ')}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {item.label}
                    </button>
                  )
                })}
              </nav>

              <div className="flex items-center gap-3">
                <span
                  className={[
                    'hidden items-center gap-2 rounded-full border px-3 py-2 text-label-sm font-semibold sm:inline-flex',
                    backendStatus === 'ok'
                      ? 'border-secondary-fixed-dim bg-secondary-fixed/40 text-secondary'
                      : backendStatus === 'checking'
                        ? 'border-outline-variant bg-surface-container text-on-surface-variant'
                        : 'border-error-container bg-error-container/70 text-error',
                  ].join(' ')}
                  title={`Backend: ${backendStatus}`}
                >
                  <Server className="h-4 w-4" aria-hidden="true" />
                  {backendStatus === 'ok' && 'Backend ok'}
                  {backendStatus === 'checking' && 'Backend...'}
                  {backendStatus === 'offline' && 'Backend offline'}
                </span>

                <div className="hidden text-right md:block">
                  <p className="text-label-md font-semibold text-on-surface">{userName}</p>
                  <p className="text-label-sm text-on-surface-variant">{user.email}</p>
                </div>

                <button
                  type="button"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-outline-variant/70 bg-surface-container-lowest text-on-surface-variant transition hover:border-error-container hover:text-error"
                  onClick={() => void onLogout()}
                  aria-label="Cerrar sesión"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 md:px-8 lg:px-margin-desktop">
          {activeView === 'dashboard' ? (
            <Dashboard
              user={user}
              cv={cv}
              backendStatus={backendStatus}
              onEditCV={() => setActiveView('editor')}
              onSyncGitHub={() => setActiveView('github')}
            />
          ) : activeView === 'editor' ? (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
              <section className="xl:col-span-7">
                <ProfileForm
                  profile={cv.profile}
                  projectCount={cv.projects.length}
                  onSave={handleProfileSave}
                />
              </section>

              <aside className="xl:col-span-5">
                <div className="sticky top-32 space-y-4">
                  <div>
                    <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
                      Live preview
                    </p>
                    <p className="mt-1 text-label-md text-on-surface-variant">
                      La preview se actualiza al guardar cambios.
                    </p>
                  </div>
                  <CVPreview cv={cv} />
                </div>
              </aside>
            </div>
          ) : (
            <GitHubSyncPanel
              cv={cv}
              onImportRepositories={handleGitHubImport}
            />
          )}
        </main>
      </div>
    </div>
  )
}
