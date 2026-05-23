import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Code2,
  Database,
  Download,
  ExternalLink,
  FileText,
  QrCode,
  ShieldCheck,
  Sparkles,
  Terminal,
} from 'lucide-react'

interface LandingPageProps {
  onStart: () => void
  onSignIn: () => void
}

const features = [
  {
    title: 'CV editable',
    description: 'Construye un perfil técnico vivo con resumen, stack, skills y proyectos destacados.',
    icon: FileText,
  },
  {
    title: 'GitHub Sync público',
    description: 'Busca tu usuario de GitHub, selecciona repos y conviértelos en proyectos del CV.',
    icon: Code2,
  },
  {
    title: 'Jobs Search',
    description: 'Consulta ofertas tech desde el backend V2 con fallback controlado cuando Jooble no está configurado.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'PDF con QR',
    description: 'Exporta mediante impresión nativa y enlaza el CV publicado con un QR generado localmente.',
    icon: QrCode,
  },
  {
    title: 'Perfil público',
    description: 'Publica un CV read-only en una ruta compartible `/p/:slug` cuando esté listo.',
    icon: ExternalLink,
  },
  {
    title: 'Persistencia real',
    description: 'React, Express, PostgreSQL y Prisma sostienen una experiencia multiusuario trazable.',
    icon: Database,
  },
]

const steps = [
  'Crea tu cuenta',
  'Completa tu CV',
  'Importa proyectos GitHub',
  'Publica o exporta tu perfil',
]

export function LandingPage({ onStart, onSignIn }: LandingPageProps) {
  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <header className="sticky top-0 z-40 border-b border-outline-variant/60 bg-surface/95 backdrop-blur">
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-margin-mobile md:px-margin-desktop">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded bg-primary text-on-primary">
              <Terminal className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-headline-md font-bold text-on-surface">EXPERTECH CV</span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a className="text-label-md text-primary" href="#features">Producto</a>
            <a className="text-label-md text-on-surface-variant hover:text-primary" href="#workflow">Flujo</a>
            <a className="text-label-md text-on-surface-variant hover:text-primary" href="#showcase">Demo</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onSignIn}
              className="rounded px-4 py-2 text-label-md font-medium text-on-surface-variant transition hover:bg-surface-container hover:text-primary"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container"
            >
              Crear mi CV
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </header>

      <section className="relative overflow-hidden bg-inverse-surface text-inverse-on-surface">
        <div className="absolute inset-0 opacity-25" aria-hidden="true">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100svh-8rem)] max-w-7xl grid-cols-1 items-center gap-10 px-margin-mobile py-14 md:px-margin-desktop lg:grid-cols-12">
          <div className="max-w-3xl lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-fixed-dim/40 bg-primary-fixed/20 px-4 py-2 text-label-sm font-semibold uppercase text-primary-fixed-dim">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              V2 lista para demo
            </span>
            <h1 className="mt-6 text-5xl font-bold leading-none text-white sm:text-6xl">
              EXPERTECH CV
            </h1>
            <p className="mt-5 max-w-xl text-body-lg text-inverse-on-surface/80">
              CV técnico vivo para candidatos tech: edita tu perfil, importa proyectos, busca oportunidades y comparte una versión pública profesional.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onStart}
                className="inline-flex items-center justify-center gap-2 rounded bg-primary-container px-6 py-4 text-label-md font-semibold text-white shadow-primary-glow transition hover:bg-primary"
              >
                Crear mi CV
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded border border-white/20 bg-white/10 px-6 py-4 text-label-md font-semibold text-white transition hover:bg-white/20"
              >
                Explorar features
                <ExternalLink className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative lg:col-span-6" aria-label="Showcase visual de EXPERTECH CV">
            <div className="rounded border border-white/10 bg-white/10 p-4 shadow-modal backdrop-blur">
              <div className="rounded border border-outline-variant/20 bg-surface-container-lowest p-5 text-on-surface shadow-card">
                <div className="flex items-start justify-between gap-4 border-b border-outline-variant/60 pb-5">
                  <div>
                    <p className="text-label-sm font-semibold uppercase text-primary">CV público</p>
                    <h2 className="mt-2 text-headline-md font-semibold">Verónica Software Engineer</h2>
                    <p className="mt-1 text-label-md text-on-surface-variant">Frontend · React · TypeScript · UX técnico</p>
                  </div>
                  <span className="rounded bg-secondary-fixed px-3 py-1 text-label-sm font-semibold text-on-secondary-fixed">
                    Publicado
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded bg-surface-container p-4">
                    <p className="text-label-sm text-on-surface-variant">Completitud</p>
                    <p className="mt-2 text-headline-md font-semibold text-primary">92%</p>
                  </div>
                  <div className="rounded bg-surface-container p-4">
                    <p className="text-label-sm text-on-surface-variant">Skills</p>
                    <p className="mt-2 text-headline-md font-semibold text-secondary">14</p>
                  </div>
                  <div className="rounded bg-surface-container p-4">
                    <p className="text-label-sm text-on-surface-variant">Repos</p>
                    <p className="mt-2 text-headline-md font-semibold text-tertiary">6</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {['Portfolio React', 'Job search proxy', 'Public profile API'].map((project) => (
                    <div key={project} className="flex items-center justify-between rounded border border-outline-variant/60 bg-white p-3">
                      <div className="flex items-center gap-3">
                        <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
                        <span className="text-label-md font-medium">{project}</span>
                      </div>
                      <BadgeCheck className="h-5 w-5 text-secondary" aria-hidden="true" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 left-6 hidden rounded border border-white/10 bg-inverse-surface p-4 text-inverse-on-surface shadow-modal sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded bg-secondary-fixed text-on-secondary-fixed">
                  <Code2 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-label-md font-semibold">GitHub sincronizado</p>
                  <p className="text-label-sm text-inverse-on-surface/70">Repos listos para importar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-surface py-section-gap">
        <div className="mx-auto max-w-7xl px-margin-mobile md:px-margin-desktop">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-label-sm font-semibold uppercase text-primary">Producto V2</p>
            <h2 className="mt-3 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
              Todo lo necesario para presentar un perfil tech moderno
            </h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              La landing reemplaza la entrada pública del legacy sin retirar todavía el código vanilla JS.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <article key={feature.title} className="rounded border border-outline-variant/70 bg-surface-container-lowest p-6 shadow-card transition hover:border-primary/60">
                  <span className="flex h-11 w-11 items-center justify-center rounded bg-surface-container text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-headline-md font-semibold text-on-surface">{feature.title}</h3>
                  <p className="mt-3 text-body-md text-on-surface-variant">{feature.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="workflow" className="bg-surface-container-low py-section-gap">
        <div className="mx-auto grid max-w-7xl gap-8 px-margin-mobile md:px-margin-desktop lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-label-sm font-semibold uppercase text-primary">Cómo funciona</p>
            <h2 className="mt-3 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
              Del borrador técnico al perfil compartible
            </h2>
            <p className="mt-4 text-body-md text-on-surface-variant">
              El flujo V2 mantiene una separación clara entre edición, integraciones, exportación y publicación.
            </p>
          </div>

          <div className="grid gap-4 lg:col-span-7">
            {steps.map((step, index) => (
              <article key={step} className="flex gap-4 rounded border border-outline-variant/60 bg-surface-container-lowest p-5 shadow-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary text-on-primary text-label-md font-semibold">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-body-lg font-semibold text-on-surface">{step}</h3>
                  <p className="mt-1 text-label-md text-on-surface-variant">
                    {index === 0 && 'Registra una sesión y entra en tu dashboard autenticado.'}
                    {index === 1 && 'Edita perfil, contacto, skills y proyectos sin depender del legacy.'}
                    {index === 2 && 'Importa repos públicos seleccionados y evita duplicados por origen.'}
                    {index === 3 && 'Genera PDF con QR o activa tu perfil público en `/p/:slug`.'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="showcase" className="bg-surface py-section-gap">
        <div className="mx-auto grid max-w-7xl gap-6 px-margin-mobile md:px-margin-desktop lg:grid-cols-12">
          <article className="rounded border border-outline-variant/70 bg-surface-container-lowest p-8 shadow-card lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded bg-primary text-on-primary">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-label-sm font-semibold uppercase text-primary">Backend real</p>
                <h2 className="text-headline-md font-semibold text-on-surface">Una demo pública con base de producto</h2>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-body-md text-on-surface-variant">
              EXPERTECH CV V2 no es solo una maqueta: usa autenticación backend, CV persistido, perfiles públicos y Docker local para mostrar una arquitectura de producto completa.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {['React + TypeScript', 'Express API', 'PostgreSQL + Prisma'].map((item) => (
                <div key={item} className="rounded bg-surface-container p-4">
                  <CheckCircle2 className="h-5 w-5 text-secondary" aria-hidden="true" />
                  <p className="mt-3 text-label-md font-semibold text-on-surface">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded border border-outline-variant/70 bg-inverse-surface p-8 text-inverse-on-surface shadow-card lg:col-span-5">
            <Download className="h-9 w-9 text-primary-fixed-dim" aria-hidden="true" />
            <h2 className="mt-5 text-headline-md font-semibold text-white">PDF, QR y perfil público conectados</h2>
            <p className="mt-4 text-body-md text-inverse-on-surface/80">
              El candidato puede guardar como PDF desde el navegador y apuntar el QR a su perfil publicado cuando lo active.
            </p>
            <div className="mt-6 rounded border border-white/10 bg-white/10 p-4">
              <p className="text-label-sm uppercase text-primary-fixed-dim">Ruta pública</p>
              <p className="mt-2 break-all text-body-md font-semibold text-white">/p/tu-slug-profesional</p>
            </div>
          </article>
        </div>
      </section>

      <section className="bg-surface-container-high py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-margin-mobile md:flex-row md:items-center md:justify-between md:px-margin-desktop">
          <div>
            <p className="text-label-sm font-semibold uppercase text-primary">Listo para empezar</p>
            <h2 className="mt-2 text-headline-lg-mobile font-semibold text-on-surface sm:text-headline-lg">
              Crea un CV técnico preparado para demo, recruiters y portfolio.
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 rounded bg-tertiary px-6 py-4 text-label-md font-semibold text-on-tertiary shadow-card transition hover:bg-on-tertiary-fixed-variant"
            >
              Empezar ahora
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onSignIn}
              className="inline-flex items-center justify-center gap-2 rounded border border-primary px-6 py-4 text-label-md font-semibold text-primary transition hover:bg-surface-container-lowest"
            >
              Entrar a mi cuenta
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
