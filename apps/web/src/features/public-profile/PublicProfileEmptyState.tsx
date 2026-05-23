import { AlertCircle } from 'lucide-react'

interface Props {
  title: string
  message: string
}

export function PublicProfileEmptyState({ title, message }: Props) {
  return (
    <div className="min-h-screen bg-background px-5 py-10 text-on-surface">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-lg border border-outline-variant/70 bg-surface-container-lowest p-8 text-center shadow-card">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-error-container text-error">
            <AlertCircle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="mt-5 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
            {title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-body-md text-on-surface-variant">{message}</p>
          <a
            href="/"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container"
          >
            Ir a EXPERTECH CV
          </a>
        </section>
      </div>
    </div>
  )
}
