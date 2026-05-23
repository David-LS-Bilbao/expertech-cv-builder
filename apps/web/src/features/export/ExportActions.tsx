import { Printer } from 'lucide-react'

interface Props {
  onPrint: () => void
}

export function ExportActions({ onPrint }: Props) {
  return (
    <button
      type="button"
      className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-primary px-5 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container sm:w-auto"
      onClick={onPrint}
    >
      <Printer className="h-5 w-5" aria-hidden="true" />
      Abrir impresión / Guardar como PDF
    </button>
  )
}
