import { QrCode, TriangleAlert } from 'lucide-react'

interface Props {
  publicUrl: string
  qrDataUrl: string
  status: 'loading' | 'ready' | 'error'
  compact?: boolean
}

export function QRCodeBlock({ publicUrl, qrDataUrl, status, compact = false }: Props) {
  return (
    <div className={[
      'rounded-lg border border-outline-variant bg-white',
      compact ? 'p-3' : 'p-4',
    ].join(' ')}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-sm border border-outline-variant bg-surface-container-lowest">
          {status === 'ready' && qrDataUrl ? (
            <img src={qrDataUrl} alt="QR del perfil público planificado" className="h-20 w-20" />
          ) : status === 'loading' ? (
            <QrCode className="h-9 w-9 animate-pulse text-outline" aria-hidden="true" />
          ) : (
            <TriangleAlert className="h-8 w-8 text-error" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-label-sm font-bold uppercase tracking-[0.05em] text-on-surface">
            QR público
          </p>
          <p className="mt-1 break-all text-label-sm text-on-surface-variant">
            {publicUrl}
          </p>
          {status === 'error' && (
            <p className="mt-2 text-label-sm font-semibold text-error">
              No se pudo generar el QR. La URL queda visible como alternativa.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
