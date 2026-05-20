import { useState } from 'react'
import type { Session } from '../../lib/auth/types'
import { loginUser, registerUser } from '../../lib/auth/AuthStorageService'

type Tab = 'login' | 'register'
type Feedback = { message: string; type: 'error' | 'info' } | null

interface Props {
  onAuthSuccess: (session: Session) => void
}

export function AuthScreen({ onAuthSuccess }: Props) {
  const [tab, setTab] = useState<Tab>('login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginFeedback, setLoginFeedback] = useState<Feedback>(null)

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regFeedback, setRegFeedback] = useState<Feedback>(null)

  const [socialMsg, setSocialMsg] = useState<string | null>(null)

  function switchTab(next: Tab) {
    setTab(next)
    setLoginFeedback(null)
    setRegFeedback(null)
    setSocialMsg(null)
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginFeedback(null)
    const result = loginUser(loginEmail, loginPassword)
    if (!result.ok) {
      setLoginFeedback({ message: result.error, type: 'error' })
      return
    }
    setLoginFeedback({ message: 'Sesión iniciada correctamente.', type: 'info' })
    onAuthSuccess(result.session)
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegFeedback(null)
    const result = registerUser(regName, regEmail, regPassword)
    if (!result.ok) {
      setRegFeedback({ message: result.error, type: 'error' })
      return
    }
    setRegFeedback({ message: 'Cuenta creada correctamente.', type: 'info' })
    onAuthSuccess(result.session)
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <h1>EXPERTECH CV</h1>

        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={tab === 'login'}
            className={`auth-tab${tab === 'login' ? ' is-active' : ''}`}
            onClick={() => switchTab('login')}
          >
            Iniciar sesión
          </button>
          <button
            role="tab"
            aria-selected={tab === 'register'}
            className={`auth-tab${tab === 'register' ? ' is-active' : ''}`}
            onClick={() => switchTab('register')}
          >
            Registrarse
          </button>
        </div>

        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            {loginFeedback && (
              <p className={`feedback is-${loginFeedback.type}`}>{loginFeedback.message}</p>
            )}
            <div className="form-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="login-password">Contraseña</label>
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Entrar
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegister}>
            {regFeedback && (
              <p className={`feedback is-${regFeedback.type}`}>{regFeedback.message}</p>
            )}
            <div className="form-field">
              <label htmlFor="reg-name">Nombre visible</label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
              />
            </div>
            <div className="form-field">
              <label htmlFor="reg-password">Contraseña</label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Crear cuenta
            </button>
            <p className="auth-mvp-note">
              ⚠️ Auth local de demo. Contraseña guardada en texto plano. No usar datos reales.
            </p>
          </form>
        )}

        <div className="social-auth">
          {socialMsg && <p className="feedback is-info">{socialMsg}</p>}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setSocialMsg('El acceso con Google llegará en el siguiente MVP con autenticación real.')}
          >
            Continuar con Google
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setSocialMsg('El acceso con GitHub llegará en el siguiente MVP con autenticación real.')}
          >
            Continuar con GitHub
          </button>
        </div>
      </div>
    </div>
  )
}
