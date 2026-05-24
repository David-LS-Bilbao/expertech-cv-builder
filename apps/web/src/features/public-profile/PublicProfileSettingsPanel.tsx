import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Copy, ExternalLink, RefreshCw, Save, ShieldCheck, ToggleLeft, ToggleRight } from 'lucide-react'
import type { PortfolioCV } from '../../lib/domain/types'
import type { PublicProfileSettings, PublicUser } from '../../lib/api/client'
import { api } from '../../lib/api/client'
import { buildAbsolutePublicUrl, getFallbackPublicSlug, normalizePublicSlug } from '../../lib/qr/publicCvUrl'

interface Props {
  user: PublicUser
  cv: PortfolioCV
}

type PanelStatus = 'loading' | 'ready' | 'saving' | 'error'

const inputClassName = 'w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/40'

function getInitialSlug(settings: PublicProfileSettings | null, cv: PortfolioCV): string {
  return settings?.slug || settings?.suggestedSlug || getFallbackPublicSlug(cv)
}

export function PublicProfileSettingsPanel({ user, cv }: Props) {
  const [settings, setSettings] = useState<PublicProfileSettings | null>(null)
  const [slug, setSlug] = useState(getFallbackPublicSlug(cv))
  const [isPublic, setIsPublic] = useState(false)
  const [status, setStatus] = useState<PanelStatus>('loading')
  const [message, setMessage] = useState('')

  const publicPath = slug ? `/p/${normalizePublicSlug(slug)}` : ''
  const publicUrl = publicPath ? buildAbsolutePublicUrl(publicPath) : ''
  const slugError = useMemo(() => {
    const normalized = normalizePublicSlug(slug)
    if (normalized.length < 3) return 'El slug debe tener al menos 3 caracteres.'
    if (normalized.length > 60) return 'El slug no puede superar 60 caracteres.'
    return ''
  }, [slug])

  useEffect(() => {
    let cancelled = false
    api.publicProfiles.me()
      .then(({ publicProfile }) => {
        if (cancelled) return
        setSettings(publicProfile)
        setSlug(getInitialSlug(publicProfile, cv))
        setIsPublic(publicProfile.isPublic)
        setStatus('ready')
      })
      .catch((err) => {
        if (cancelled) return
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'No se pudo cargar el perfil público.')
      })

    return () => {
      cancelled = true
    }
  }, [cv])

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setMessage('')
    setSlug(normalizePublicSlug(e.target.value))
  }

  function handleRegenerateSlug() {
    const seed = cv.profile.githubUsername || cv.profile.fullName || user.displayName || user.email
    const suffix = Math.random().toString(36).slice(2, 6)
    setSlug(normalizePublicSlug(`${seed}-${suffix}`))
    setMessage('')
  }

  async function handleSave(nextIsPublic = isPublic) {
    const normalizedSlug = normalizePublicSlug(slug)
    if (normalizedSlug.length < 3) {
      setMessage('El slug debe tener al menos 3 caracteres.')
      return
    }

    setStatus('saving')
    setMessage('')
    try {
      const { publicProfile } = await api.publicProfiles.save({ slug: normalizedSlug, isPublic: nextIsPublic })
      setSettings(publicProfile)
      setSlug(getInitialSlug(publicProfile, cv))
      setIsPublic(publicProfile.isPublic)
      setMessage(publicProfile.isPublic ? 'Perfil publicado correctamente.' : 'Perfil guardado en privado.')
      setStatus('ready')
    } catch (err) {
      setStatus('ready')
      setMessage(err instanceof Error ? err.message : 'No se pudo guardar el perfil público.')
    }
  }

  async function handleCopy() {
    if (!publicUrl) return
    try {
      await navigator.clipboard.writeText(publicUrl)
      setMessage('URL copiada al portapapeles.')
    } catch {
      setMessage(publicUrl)
    }
  }

  if (status === 'loading') {
    return (
      <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card">
        <p className="text-label-md text-on-surface-variant">Cargando perfil público…</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="rounded-lg border border-error-container bg-error-container/50 p-6 text-error shadow-card">
        <p className="text-label-md font-semibold">{message}</p>
      </div>
    )
  }

  const isSaving = status === 'saving'
  const normalizedSlug = normalizePublicSlug(slug)
  const hasPublishedUrl = Boolean(settings?.isPublic && settings.slug)

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <section className="relative overflow-hidden rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card xl:col-span-8">
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" aria-hidden="true" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">Perfil público</p>
            <h2 className="mt-2 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
              Publica una versión portfolio
            </h2>
            <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
              Elige tu slug, controla la visibilidad y comparte un CV read-only con aspecto profesional.
            </p>
          </div>
          <span
            className={[
              'inline-flex w-fit items-center gap-2 rounded-full border px-3 py-2 text-label-sm font-semibold',
              isPublic
                ? 'border-secondary-fixed-dim bg-secondary-fixed/40 text-secondary'
                : 'border-outline-variant bg-surface-container text-on-surface-variant',
            ].join(' ')}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {isPublic ? 'Publicado' : 'Privado'}
          </span>
        </div>

        <div className="mt-7 space-y-5">
          <div className="space-y-2">
            <label htmlFor="public-slug" className="block text-label-md font-medium text-on-surface">
              Slug público
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="public-slug"
                className={inputClassName}
                type="text"
                value={slug}
                onChange={handleSlugChange}
                minLength={3}
                maxLength={60}
                placeholder="tu-nombre-tech"
              />
              <button
                type="button"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-label-md font-semibold text-primary transition hover:bg-surface-container"
                onClick={handleRegenerateSlug}
              >
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Regenerar
              </button>
            </div>
            {slugError ? (
              <p className="text-label-sm font-semibold text-error">{slugError}</p>
            ) : (
              <p className="text-label-sm text-on-surface-variant">URL: {publicUrl}</p>
            )}
          </div>

          <div className="flex flex-col gap-3 rounded-lg border border-outline-variant/60 bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-label-md font-semibold text-on-surface">Visibilidad pública</p>
              <p className="mt-1 text-label-sm text-on-surface-variant">
                Si despublicas, `/p/{settings?.slug || normalizedSlug}` dejará de mostrar el CV.
              </p>
            </div>
            <button
              type="button"
              className={[
                'inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-label-md font-semibold transition',
                isPublic
                  ? 'bg-secondary text-on-secondary hover:bg-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-container',
              ].join(' ')}
              onClick={() => setIsPublic((value) => !value)}
            >
              {isPublic ? <ToggleRight className="h-5 w-5" aria-hidden="true" /> : <ToggleLeft className="h-5 w-5" aria-hidden="true" />}
              {isPublic ? 'Publicado' : 'Privado'}
            </button>
          </div>

          {message && (
            <p className={[
              'rounded-lg border px-4 py-3 text-label-md font-semibold',
              message.includes('correctamente') || message.includes('copiada') || message.includes('privado')
                ? 'border-secondary-fixed-dim bg-secondary-fixed/30 text-secondary'
                : 'border-error-container bg-error-container/50 text-error',
            ].join(' ')}
            >
              {message}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void handleSave()}
              disabled={isSaving || Boolean(slugError)}
            >
              <Save className="h-5 w-5" aria-hidden="true" />
              {isSaving ? 'Guardando…' : 'Guardar configuración'}
            </button>
            <button
              type="button"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-secondary-fixed-dim bg-secondary-fixed/30 px-5 text-label-md font-semibold text-secondary transition hover:bg-secondary-fixed/50 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={() => void handleSave(!isPublic)}
              disabled={isSaving || Boolean(slugError)}
            >
              <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              {isPublic ? 'Despublicar' : 'Publicar'}
            </button>
          </div>
        </div>
      </section>

      <aside className="space-y-5 xl:col-span-4">
        <section className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card">
          <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">URL pública</p>
          <p className="mt-3 break-all text-label-md text-on-surface-variant">{publicUrl}</p>
          <div className="mt-5 flex flex-col gap-3">
            <button
              type="button"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 text-label-md font-semibold text-primary transition hover:bg-surface-container"
              onClick={() => void handleCopy()}
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copiar URL
            </button>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className={[
                'inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-label-md font-semibold transition',
                hasPublishedUrl
                  ? 'bg-inverse-surface text-inverse-on-surface hover:opacity-90'
                  : 'pointer-events-none bg-surface-container-high text-on-surface-variant opacity-70',
              ].join(' ')}
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Abrir perfil
            </a>
          </div>
        </section>

        <section className="rounded-lg border border-primary/20 bg-primary-fixed/40 p-5 text-on-primary-fixed-variant shadow-card">
          <p className="text-label-sm font-semibold uppercase tracking-[0.05em]">QR PDF</p>
          <p className="mt-2 text-label-md">
            Al publicar, Exportar PDF usa esta URL real para el QR. Si está privado, mantiene una URL prevista.
          </p>
        </section>
      </aside>
    </div>
  )
}
