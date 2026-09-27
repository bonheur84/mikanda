import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { AuthPanel } from './Login.jsx'

export function Signup() {
  useDocumentTitle('Inscription')
  const navigate = useNavigate()
  const notify = useNotification()
  const { register, loading, isAuthenticated } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')

  if (isAuthenticated) return <Navigate to="/" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')
    const data = new FormData(event.target)
    const password = data.get('password')
    const confirmation = data.get('password_confirmation')

    if (password.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }

    if (password !== confirmation) {
      setFormError('Les mots de passe ne correspondent pas.')
      return
    }

    try {
      await register({
        firstName: data.get('first_name'),
        lastName: data.get('last_name'),
        email: data.get('email'),
        password,
      })
      notify.success('Compte créé avec succès ! Bienvenue sur MIKANDA.')
      navigate('/')
    } catch (err) {
      setFormError(err.message)
    }
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <AuthPanel
        quote="« La littérature est une manière de rendre le monde habitable. »"
        cite="MIKANDA, carnet éditorial"
      />
      <section className="flex items-center justify-center px-7 py-12">
        <div className="w-full max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c17248]">
            Inscription
          </p>
          <h1 className="mt-4 font-serif text-4xl">
            Rejoignez <em className="text-[#133a28]">la bibliothèque</em>
          </h1>

          {formError && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {formError}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
                Prénom
                <input
                  required
                  name="first_name"
                  autoComplete="given-name"
                  className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm focus:border-[#133a28] focus:outline-none"
                />
              </label>
              <label className="text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
                Nom
                <input
                  required
                  name="last_name"
                  autoComplete="family-name"
                  className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm focus:border-[#133a28] focus:outline-none"
                />
              </label>
            </div>

            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm focus:border-[#133a28] focus:outline-none"
              />
            </label>

            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
              Mot de passe
              <div className="relative mt-2">
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  className="h-12 w-full rounded-lg border border-[#d9d1c6] px-4 pr-12 text-sm focus:border-[#133a28] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#705f57] hover:text-[#133a28]"
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[10px] normal-case tracking-normal text-[#8f7770]">
                Minimum 8 caractères
              </p>
            </label>

            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
              Confirmer le mot de passe
              <input
                required
                type="password"
                name="password_confirmation"
                autoComplete="new-password"
                className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm focus:border-[#133a28] focus:outline-none"
              />
            </label>

            <label className="flex items-start gap-3 text-sm text-[#705f57]">
              <input type="checkbox" required className="mt-1 accent-[#133a28]" />
              <span>
                J'accepte les{' '}
                <Link to="/apropos" className="text-[#c17248] hover:underline">
                  conditions d'utilisation
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#c17248] text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Créer mon compte
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-[#705f57]">
            Déjà inscrit ?{' '}
            <Link to="/connexion" className="font-medium text-[#c17248] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
