import { useState } from 'react'
import {
  Terminal, ArrowRight, Eye, EyeOff,
  AlertCircle, CheckCircle2, Zap, ShieldCheck, Loader2,
} from 'lucide-react'
import type { PublicUser } from '../../lib/api/client'
import { ApiError, api } from '../../lib/api/client'

type Tab = 'login' | 'register'

interface Feedback {
  type: 'error' | 'success'
  message: string
}

interface Props {
  onAuthSuccess: (user: PublicUser, token: string) => void | Promise<void>
}

export function AuthScreen({ onAuthSuccess }: Props) {
  const [tab, setTab] = useState<Tab>('login')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [socialMsg, setSocialMsg] = useState<string | null>(null)

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')

  function switchTab(next: Tab) {
    setTab(next)
    setFeedback(null)
    setSocialMsg(null)
    setShowPassword(false)
  }

  function describeError(err: unknown): string {
    if (err instanceof ApiError) return err.message
    if (err instanceof Error) return `Error de conexión: ${err.message}`
    return 'Error desconocido.'
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)
    setSubmitting(true)
    try {
      const { user, session } = await api.auth.login(loginEmail, loginPassword)
      setFeedback({ type: 'success', message: 'Sesión iniciada. Redirigiendo…' })
      await onAuthSuccess(user, session.token)
    } catch (err) {
      setFeedback({ type: 'error', message: describeError(err) })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setFeedback(null)
    setSubmitting(true)
    try {
      const { user, session } = await api.auth.register(regName, regEmail, regPassword)
      setFeedback({ type: 'success', message: '¡Cuenta creada! Redirigiendo…' })
      await onAuthSuccess(user, session.token)
    } catch (err) {
      setFeedback({ type: 'error', message: describeError(err) })
    } finally {
      setSubmitting(false)
    }
  }

  const isLogin = tab === 'login'

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-sans bg-surface">

      {/* ── Left decorative panel (desktop only) ────────────────────────── */}
      <section
        className="hidden md:flex md:w-1/2 relative overflow-hidden items-center justify-center p-margin-desktop"
        style={{ background: '#0f1623' }}
      >
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Primary glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/25 via-transparent to-transparent" />

        {/* Content */}
        <div className="relative z-10 max-w-md text-white">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary-fixed-dim text-label-md font-medium mb-8 border border-primary/30">
            The Technical Edge
          </span>
          <h1 className="text-headline-xl font-bold tracking-tight mb-6 leading-tight">
            Eleva tu carrera al siguiente nivel técnico.
          </h1>
          <p className="text-body-lg text-outline-variant mb-12 leading-relaxed">
            Diseñado por y para expertos en tecnología. Crea currículums que superan algoritmos y captan la atención de los mejores reclutadores.
          </p>

          {/* Bento stats */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="p-6 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            >
              <Zap className="text-primary-fixed-dim mb-3" size={24} />
              <p className="text-headline-md font-semibold text-white">10x</p>
              <p className="text-label-sm text-outline-variant uppercase tracking-widest mt-1">Más rápido</p>
            </div>
            <div
              className="p-6 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)' }}
            >
              <ShieldCheck className="text-primary-fixed-dim mb-3" size={24} />
              <p className="text-headline-md font-semibold text-white">Top 1%</p>
              <p className="text-label-sm text-outline-variant uppercase tracking-widest mt-1">Plantillas Pro</p>
            </div>
          </div>
        </div>

        {/* Branding anchor */}
        <div className="absolute bottom-12 left-12 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="text-headline-md font-bold text-white tracking-wider">EXPERTECH CV</span>
        </div>
      </section>

      {/* ── Right auth panel ─────────────────────────────────────────────── */}
      <section className="flex-1 flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface">

        {/* Mobile branding */}
        <div className="flex items-center gap-2 mb-10 md:hidden self-start">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Terminal size={16} className="text-white" />
          </div>
          <span className="text-headline-lg-mobile font-bold text-on-surface">EXPERTECH CV</span>
        </div>

        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-auth p-8 border border-outline-variant/30">

            {/* Tabs */}
            <div className="flex border-b border-outline-variant/20 mb-8">
              <button
                type="button"
                onClick={() => switchTab('login')}
                className={`flex-1 pb-4 text-center text-label-md font-medium transition-all duration-200 border-b-2 ${
                  isLogin
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => switchTab('register')}
                className={`flex-1 pb-4 text-center text-label-md font-medium transition-all duration-200 border-b-2 ${
                  !isLogin
                    ? 'text-primary border-primary'
                    : 'text-on-surface-variant border-transparent hover:text-primary'
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {/* Dynamic heading */}
            <h2 className="text-headline-md font-semibold text-on-surface mb-2">
              {isLogin ? 'Bienvenido de nuevo' : 'Impulsa tu carrera'}
            </h2>
            <p className="text-body-md text-on-surface-variant mb-8">
              {isLogin
                ? 'Ingresa tus credenciales para acceder a tu panel.'
                : 'Regístrate y comienza a construir tu CV hoy mismo.'}
            </p>

            {/* Feedback alert */}
            {feedback && (
              <div
                className={`flex items-start gap-3 mb-6 p-4 rounded-lg text-label-md ${
                  feedback.type === 'error'
                    ? 'bg-error-container text-on-error-container'
                    : 'bg-secondary-container/30 text-on-secondary-container'
                }`}
              >
                {feedback.type === 'error'
                  ? <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
                <p>{feedback.message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-5">

              {/* Display name (register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-label-md text-on-surface mb-2" htmlFor="reg-name">
                    Nombre visible
                  </label>
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    placeholder="Tu nombre o alias profesional"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-label-md text-on-surface mb-2" htmlFor={isLogin ? 'login-email' : 'reg-email'}>
                  Correo electrónico
                </label>
                <input
                  id={isLogin ? 'login-email' : 'reg-email'}
                  type="email"
                  autoComplete="email"
                  placeholder="ejemplo@tech.com"
                  value={isLogin ? loginEmail : regEmail}
                  onChange={(e) => isLogin ? setLoginEmail(e.target.value) : setRegEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-label-md text-on-surface" htmlFor={isLogin ? 'login-pwd' : 'reg-pwd'}>
                    Contraseña
                  </label>
                  {isLogin && (
                    <span className="text-label-sm text-primary cursor-default">
                      ¿Olvidaste tu contraseña?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id={isLogin ? 'login-pwd' : 'reg-pwd'}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    placeholder="••••••••"
                    value={isLogin ? loginPassword : regPassword}
                    onChange={(e) => isLogin ? setLoginPassword(e.target.value) : setRegPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-11 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface text-body-md placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary text-on-primary rounded-lg text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-primary-glow disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{isLogin ? 'Iniciando sesión…' : 'Creando cuenta…'}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Iniciar sesión' : 'Crear mi cuenta'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant/30" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-container-lowest px-4 text-label-sm text-on-surface-variant uppercase tracking-widest">
                  O continuar con
                </span>
              </div>
            </div>

            {/* Social placeholders */}
            {socialMsg && (
              <p className="text-label-md text-on-surface-variant text-center mb-4 p-3 bg-surface-container-low rounded-lg">
                {socialMsg}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSocialMsg('El acceso con Google estará disponible en una fase posterior con OAuth real.')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors text-label-md text-on-surface"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => setSocialMsg('El acceso con GitHub estará disponible en una fase posterior con OAuth real.')}
                className="flex items-center justify-center gap-2 px-4 py-3 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors text-label-md text-on-surface"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>

            {/* MVP note */}
            <p className="text-label-sm text-on-surface-variant/60 text-center mt-6">
              Auth con bcrypt · Datos en PostgreSQL
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-label-sm text-on-surface-variant/70">
            <p>© 2025 EXPERTECH CV. Reservados todos los derechos.</p>
            <div className="flex gap-5">
              <span className="hover:text-primary transition-colors cursor-default">Privacidad</span>
              <span className="hover:text-primary transition-colors cursor-default">Términos</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
