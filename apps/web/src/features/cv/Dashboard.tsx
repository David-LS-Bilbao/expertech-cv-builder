import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  Code,
  Code2,
  Download,
  ExternalLink,
  FileText,
  Gauge,
  Layers3,
  Lock,
  Server,
  Sparkles,
} from 'lucide-react'
import type { PortfolioCV } from '../../lib/domain/types'
import type { PublicUser } from '../../lib/api/client'
import { getVisibleProjects } from '../../lib/utils/projects'
import { CVPreview } from './CVPreview'

type BackendStatus = 'checking' | 'ok' | 'offline'

interface Props {
  user: PublicUser
  cv: PortfolioCV
  backendStatus: BackendStatus
  onEditCV: () => void
  onSyncGitHub: () => void
  onSearchJobs: () => void
  onExportPDF: () => void
}

function getProfileCompletion(cv: PortfolioCV): number {
  const { profile } = cv
  const visibleProjects = getVisibleProjects(cv.projects)
  const checks = [
    profile.fullName,
    profile.headline,
    profile.summary,
    profile.email,
    profile.phone,
    profile.location,
    profile.linkedinUrl || profile.githubUsername,
    profile.skills.length > 0,
    visibleProjects.length > 0,
    cv.meta.lastUpdated,
  ]

  const completed = checks.filter(Boolean).length
  return Math.round((completed / checks.length) * 100)
}

function formatLastUpdated(value: string): string {
  if (!value) return 'Sin guardado todavía'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible'

  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function backendLabel(status: BackendStatus): string {
  if (status === 'ok') return 'Backend operativo'
  if (status === 'checking') return 'Comprobando backend'
  return 'Backend sin respuesta'
}

export function Dashboard({ user, cv, backendStatus, onEditCV, onSyncGitHub, onSearchJobs, onExportPDF }: Props) {
  const visibleProjects = getVisibleProjects(cv.projects)
  const completion = getProfileCompletion(cv)
  const displayName = user.displayName || user.email
  const firstName = displayName.split(' ')[0] || displayName

  const metrics = [
    {
      label: 'Completitud',
      value: `${completion}%`,
      detail: completion >= 80 ? 'Perfil sólido' : 'Perfil en progreso',
      icon: Gauge,
      tone: 'text-primary',
    },
    {
      label: 'Skills',
      value: String(cv.profile.skills.length),
      detail: cv.profile.skills.length > 0 ? 'Tecnologías declaradas' : 'Pendiente',
      icon: Code2,
      tone: 'text-secondary',
    },
    {
      label: 'Proyectos visibles',
      value: String(visibleProjects.length),
      detail: visibleProjects.length > 0 ? 'Listos para preview' : 'Sin proyectos aún',
      icon: Layers3,
      tone: 'text-tertiary',
    },
    {
      label: 'Última actualización',
      value: cv.meta.lastUpdated ? 'Guardado' : 'Pendiente',
      detail: formatLastUpdated(cv.meta.lastUpdated),
      icon: Clock3,
      tone: 'text-on-surface',
    },
  ]

  const quickActions = [
    {
      label: 'Editar CV',
      description: 'Abrir editor',
      icon: FileText,
      active: true,
      onClick: onEditCV,
    },
    {
      label: 'Sincronizar GitHub',
      description: 'Importar repos',
      icon: Code,
      active: true,
      onClick: onSyncGitHub,
    },
    {
      label: 'Buscar empleo',
      description: 'Buscar ofertas',
      icon: BriefcaseBusiness,
      active: true,
      onClick: onSearchJobs,
    },
    {
      label: 'Exportar PDF',
      description: 'Imprimir CV',
      icon: Download,
      active: true,
      onClick: onExportPDF,
    },
    {
      label: 'Perfil público',
      description: 'Próximamente',
      icon: ExternalLink,
      active: false,
    },
  ]

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card xl:col-span-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
                Dashboard V2
              </p>
              <h1 className="mt-2 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
                Hola, {firstName}
              </h1>
              <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                Centro de trabajo para mantener tu CV técnico listo antes de conectar integraciones.
              </p>
            </div>

            <div
              className={[
                'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-label-sm font-semibold',
                backendStatus === 'ok'
                  ? 'border-secondary-fixed-dim bg-secondary-fixed/40 text-secondary'
                  : backendStatus === 'checking'
                    ? 'border-outline-variant bg-surface-container text-on-surface-variant'
                    : 'border-error-container bg-error-container/70 text-error',
              ].join(' ')}
              title={`Backend: ${backendStatus}`}
            >
              <Server className="h-4 w-4" aria-hidden="true" />
              {backendLabel(backendStatus)}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-label-md">
              <span className="font-medium text-on-surface-variant">Completitud del perfil</span>
              <span className="font-semibold text-primary">{completion}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant/60 bg-inverse-surface p-6 text-inverse-on-surface shadow-card xl:col-span-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-fixed text-on-primary-fixed">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary-fixed-dim">
                Sprint actual
              </p>
              <p className="text-body-md font-semibold">Dashboard + Editor CV</p>
            </div>
          </div>
          <p className="mt-5 text-label-md text-inverse-on-surface/80">
            GitHub, búsqueda de empleo y exportación PDF ya están activos. Perfil público sigue como placeholder.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <article
              key={metric.label}
              className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container ${metric.tone}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                {metric.label === 'Completitud' && (
                  <BadgeCheck className="h-5 w-5 text-secondary" aria-hidden="true" />
                )}
              </div>
              <p className="mt-5 text-label-md text-on-surface-variant">{metric.label}</p>
              <p className="mt-1 text-headline-md font-semibold text-on-surface">{metric.value}</p>
              <p className="mt-2 text-label-sm text-on-surface-variant">{metric.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card xl:col-span-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Acciones rápidas</h2>
              <p className="mt-1 text-label-md text-on-surface-variant">Accesos del flujo autenticado V2.</p>
            </div>
            <Lock className="h-5 w-5 text-outline" aria-hidden="true" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  disabled={!action.active}
                  className={[
                    'flex min-h-28 items-center justify-between rounded-lg border p-4 text-left transition',
                    action.active
                      ? 'border-primary/40 bg-surface-container-low hover:border-primary hover:bg-surface-container'
                      : 'cursor-not-allowed border-outline-variant/60 bg-surface opacity-75',
                  ].join(' ')}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={[
                        'flex h-10 w-10 items-center justify-center rounded-lg',
                        action.active ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant',
                      ].join(' ')}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-label-md font-semibold text-on-surface">{action.label}</span>
                      <span className="mt-1 block text-label-sm text-on-surface-variant">{action.description}</span>
                    </span>
                  </span>
                  {action.active && <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />}
                </button>
              )
            })}
          </div>
        </div>

        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card xl:col-span-5">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-headline-md font-semibold text-on-surface">Preview activa</h2>
              <p className="mt-1 text-label-md text-on-surface-variant">Se sincroniza después de guardar el editor.</p>
            </div>
            <button type="button" className="text-label-md font-semibold text-primary" onClick={onEditCV}>
              Editor
            </button>
          </div>
          <div className="max-h-[620px] overflow-auto rounded-lg bg-surface p-3">
            <CVPreview cv={cv} compact />
          </div>
        </div>
      </section>
    </div>
  )
}
