import { BriefcaseBusiness, Loader2, MapPin, Search } from 'lucide-react'

interface Props {
  keywords: string
  location: string
  isLoading: boolean
  onKeywordsChange: (value: string) => void
  onLocationChange: (value: string) => void
  onSubmit: () => void
}

const quickKeywords = ['Frontend', 'Backend', 'Full Stack', 'React', 'Junior', 'Senior']

export function JobSearchForm({
  keywords,
  location,
  isLoading,
  onKeywordsChange,
  onLocationChange,
  onSubmit,
}: Props) {
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="rounded-lg border border-outline-variant/60 bg-surface-container-lowest p-4 shadow-card">
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)_auto]">
          <label className="relative block">
            <span className="sr-only">Keywords</span>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" aria-hidden="true" />
            <input
              value={keywords}
              onChange={(event) => onKeywordsChange(event.target.value)}
              placeholder="Puesto, tecnología o empresa"
              className="w-full rounded-lg border border-outline-variant bg-surface py-3 pl-12 pr-4 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
          </label>

          <label className="relative block">
            <span className="sr-only">Location</span>
            <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" aria-hidden="true" />
            <input
              value={location}
              onChange={(event) => onLocationChange(event.target.value)}
              placeholder="Ubicación"
              className="w-full rounded-lg border border-outline-variant bg-surface py-3 pl-12 pr-4 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary-container/40"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-label-md font-semibold text-on-primary shadow-primary-glow transition hover:bg-on-primary-container disabled:cursor-wait disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />}
            Buscar ofertas
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {quickKeywords.map((keyword) => {
          const selected = keywords.toLowerCase().includes(keyword.toLowerCase())
          return (
            <button
              key={keyword}
              type="button"
              onClick={() => onKeywordsChange(keyword)}
              className={[
                'rounded-full border px-4 py-2 text-label-md font-medium transition',
                selected
                  ? 'border-primary bg-primary-fixed text-primary shadow-card'
                  : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary',
              ].join(' ')}
            >
              {keyword}
            </button>
          )
        })}
      </div>
    </form>
  )
}
