import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function Login() {
  useDocumentTitle('Connexion')
  const navigate = useNavigate()
  const location = useLocation()
  const notify = useNotification()
  const { login, loading, isAuthenticated } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')

  const redirectTo = location.state?.from?.pathname || '/'

  // Déjà connecté → rediriger
  if (isAuthenticated) return <Navigate to={redirectTo} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    const data = new FormData(event.target)
    const email = data.get('email')
    const password = data.get('password')

    try {
      await login({ email, password })
      notify.success('Connexion réussie !')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <AuthPanel
        quote="« Un peuple sans littérature est un peuple sans mémoire. »"
        cite="V. Y. Mudimbe"
      />
      <section className="flex items-center justify-center px-7 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c17248]">
            Connexion
          </p>
          <h1 className="mt-4 font-serif text-4xl">
            Bienvenue dans <em className="text-[#133a28]">votre bibliothèque</em>
          </h1>

          {formError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
              Email
              <input
                required
                name="email"
                type="email"
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm focus:border-[#133a28] focus:outline-none"
              />
            </label>

            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
              Mot de passe
              <div className="relative mt-2">
                <input
                  required
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="h-12 w-full rounded-lg border border-[#d9d1c6] px-4 pr-12 text-sm focus:border-[#133a28] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#705f57] hover:text-[#133a28]"
                  aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-[#705f57]">
                <input type="checkbox" className="accent-[#133a28]" /> Se souvenir de moi
              </label>
              <a
                href="mailto:contact@mikanda.cd?subject=Réinitialisation%20du%20mot%20de%20passe"
                className="text-[#c17248] hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#133a28] text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Se connecter
            </button>

            <div className="relative flex items-center gap-3 py-2">
              <div className="h-px flex-1 bg-[#d9d1c6]" />
              <span className="text-xs text-[#8f7770]">ou</span>
              <div className="h-px flex-1 bg-[#d9d1c6]" />
            </div>

            {/* Google OAuth — Préparé pour intégration future backend */}
            <button
              type="button"
              disabled
              title="Bientôt disponible — nécessite une intégration backend"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-lg border border-[#d9d1c6] bg-white text-sm text-[#705f57] opacity-50 cursor-not-allowed"
            >
              <img src="/assets/icons/google.svg" alt="" className="h-5 w-5" aria-hidden />
              Continuer avec Google
              <span className="ml-auto rounded bg-[#f4ece2] px-1.5 py-0.5 text-[10px] font-semibold uppercase text-[#c17248]">
                Bientôt
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#705f57]">
            Pas encore de compte ?{' '}
            <Link to="/inscription" className="font-medium text-[#c17248] hover:underline">
              Créer un compte
            </Link>
          </p>

          {/* Indication compte démo */}
          <p className="mt-4 rounded-lg border border-[#d9d1c6] bg-[#f8f3e9] px-4 py-3 text-center text-xs text-[#8f7770]">
            Compte admin démo :{' '}
            <span className="font-mono font-semibold text-[#133a28]">admin@mikanda.cd</span>
            {' / '}
            <span className="font-mono font-semibold text-[#133a28]">Admin2024!</span>
          </p>
        </div>
      </section>
    </main>
  )
}

export function AuthPanel({ quote, cite }) {
  return (
    <section
      className="relative flex min-h-115 flex-col justify-between overflow-hidden bg-cover bg-center px-8 py-10 text-[#fff8fa] lg:min-h-dvh lg:px-16"
      style={{
        backgroundImage:
          "linear-gradient(rgba(19, 58, 40, 0.85), rgba(19, 58, 40, 0.92)), url('/assets/images/mikanda-reading.jpg')",
      }}
    >
      <Link
        to="/"
        className="relative z-10 inline-flex w-fit items-center gap-3"
        aria-label="Retour à l'accueil de Mikanda"
      >
        <img src="/assets/branding/logo_e9e0d1.svg" alt="" className="h-12 w-12" />
        <span>
          <span className="block font-serif text-[21px] uppercase tracking-wide">Mikanda</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c17248]">
            Bibliothèque numérique
          </span>
        </span>
      </Link>
      <div className="relative z-10 max-w-xl py-16">
        <blockquote className="font-serif text-3xl italic sm:text-4xl">{quote}</blockquote>
        <cite className="mt-6 block text-sm not-italic text-[#eae0d1]">{cite}</cite>
      </div>
      <p className="relative z-10 text-sm">+480 œuvres · 126 auteurs</p>
    </section>
  )
}
