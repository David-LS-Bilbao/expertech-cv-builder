import { useEffect, useMemo, useState } from 'react'
import { Download, FileText, Info, Printer, QrCode } from 'lucide-react'
import type { PortfolioCV } from '../../lib/domain/types'
import type { PublicProfileSettings } from '../../lib/api/client'
import { api } from '../../lib/api/client'
import { createQrCodeDataUrl } from '../../lib/qr/createQrCodeDataUrl'
import { getPublicCvUrl } from '../../lib/qr/publicCvUrl'
import { ExportActions } from './ExportActions'
import { PrintableCV } from './PrintableCV'

interface Props {
  cv: PortfolioCV
}

type QrStatus = 'loading' | 'ready' | 'error'
interface QrState {
  url: string
  dataUrl: string
  status: QrStatus
}

export function ExportPdfPanel({ cv }: Props) {
  const [publicProfile, setPublicProfile] = useState<PublicProfileSettings | null>(null)
  const publicCvUrl = useMemo(() => getPublicCvUrl(cv, publicProfile), [cv, publicProfile])
  const [qrState, setQrState] = useState<QrState>({
    url: publicCvUrl.url,
    dataUrl: '',
    status: 'loading',
  })

  const qrDataUrl = qrState.url === publicCvUrl.url ? qrState.dataUrl : ''
  const qrStatus = qrState.url === publicCvUrl.url ? qrState.status : 'loading'

  useEffect(() => {
    let cancelled = false

    api.publicProfiles.me()
      .then(({ publicProfile: settings }) => {
        if (!cancelled) setPublicProfile(settings)
      })
      .catch(() => {
        if (!cancelled) setPublicProfile(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    createQrCodeDataUrl(publicCvUrl.url)
      .then((dataUrl) => {
        if (cancelled) return
        setQrState({
          url: publicCvUrl.url,
          dataUrl,
          status: dataUrl ? 'ready' : 'error',
        })
      })
      .catch(() => {
        if (!cancelled) {
          setQrState({
            url: publicCvUrl.url,
            dataUrl: '',
            status: 'error',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [publicCvUrl.url])

  function handlePrint() {
    window.print()
  }

  return (
    <div className="space-y-6">
      <section className="no-print grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-6 shadow-card xl:col-span-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">
                Exportar PDF
              </p>
              <h2 className="mt-2 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
                Preview imprimible del CV
              </h2>
              <p className="mt-2 max-w-2xl text-body-md text-on-surface-variant">
                Esta versión usa la impresión nativa del navegador. En el diálogo de impresión elige “Guardar como PDF”.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Download className="h-6 w-6" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ExportActions onPrint={handlePrint} />
            <span className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 text-label-sm font-semibold text-on-surface-variant">
              <Printer className="h-4 w-4 text-primary" aria-hidden="true" />
              Sin generación PDF binaria
            </span>
          </div>
        </div>

        <aside className="rounded-lg border border-primary/20 bg-primary-fixed/40 p-6 text-on-primary-fixed-variant shadow-card xl:col-span-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-surface-container-lowest text-primary">
              <Info className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-label-sm font-semibold uppercase tracking-[0.05em]">
                {publicCvUrl.isPublished ? 'Perfil público real' : 'Perfil público pendiente'}
              </p>
              <p className="mt-2 text-label-md">
                El QR apunta a <span className="font-semibold">{publicCvUrl.path}</span>.
                {publicCvUrl.isPublished
                  ? ' Este perfil ya está publicado.'
                  : ' Publica el perfil para convertir esta ruta en una URL pública real.'}
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section className="no-print grid grid-cols-1 gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-card">
          <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
          <p className="mt-3 text-label-md font-semibold text-on-surface">Formato imprimible</p>
          <p className="mt-1 text-label-sm text-on-surface-variant">Diseño blanco, contraste alto y secciones compactas.</p>
        </article>
        <article className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-card">
          <QrCode className="h-5 w-5 text-secondary" aria-hidden="true" />
          <p className="mt-3 text-label-md font-semibold text-on-surface">QR local</p>
          <p className="mt-1 text-label-sm text-on-surface-variant">
            Estado: {qrStatus === 'ready' ? 'generado' : qrStatus === 'loading' ? 'generando' : 'error controlado'}.
          </p>
        </article>
        <article className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-card">
          <Info className="h-5 w-5 text-tertiary" aria-hidden="true" />
          <p className="mt-3 text-label-md font-semibold text-on-surface">
            {publicCvUrl.isPublished ? 'Publicación activa' : 'Sin publicación real'}
          </p>
          <p className="mt-1 text-label-sm text-on-surface-variant">
            {publicCvUrl.isPublished ? 'QR conectado a /p/:slug.' : 'QR con URL planificada hasta publicar.'}
          </p>
        </article>
      </section>

      <section className="rounded-lg border border-outline-variant/60 bg-surface-dim p-4 shadow-card md:p-8">
        <div className="no-print mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-label-sm font-semibold uppercase tracking-[0.05em] text-primary">Documento</p>
            <h2 className="mt-1 text-headline-md font-semibold text-on-surface">Área imprimible</h2>
          </div>
          <p className="text-label-md text-on-surface-variant">A4 aproximado · 1 página flexible</p>
        </div>

        <div className="printable-area overflow-auto">
          <PrintableCV cv={cv} publicUrl={publicCvUrl.url} qrDataUrl={qrDataUrl} qrStatus={qrStatus} />
        </div>
      </section>
    </div>
  )
}
