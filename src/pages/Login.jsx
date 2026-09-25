import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../services/auth.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function Login() {
  useDocumentTitle('Connexion')
  const navigate = useNavigate()
  const notify = useNotification()

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <AuthPanel quote="« Un peuple sans littérature est un peuple sans mémoire. »" cite="V. Y. Mudimbe" />
      <section className="flex items-center justify-center px-7 py-12 sm:px-12">
        <div className="w-full max-w-md">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c17248]">Connexion</p>
          <h1 className="mt-4 font-serif text-4xl">Bienvenue dans <em className="text-[#133a28]">votre bibliothèque</em></h1>
          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.target)
              loginUser({ email: data.get('email') })
              notify.success('Connexion réussie')
              navigate('/')
            }}
          >
            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
              Email
              <input required name="email" type="email" className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm" />
            </label>
            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">
              Mot de passe
              <input required name="password" type="password" className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm" />
            </label>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-[#705f57]"><input type="checkbox" className="accent-[#133a28]" /> Se souvenir</label>
              <a href="mailto:contact@mikanda.cd?subject=Réinitialisation%20du%20mot%20de%20passe" className="text-[#c17248]">Mot de passe oublié ?</a>
            </div>
            <button type="submit" className="h-12 w-full rounded-lg bg-[#133a28] text-sm font-semibold text-white">Se connecter</button>
          </form>
          <p className="mt-8 text-center text-sm text-[#705f57]">
            Pas encore de compte ? <Link to="/inscription" className="font-medium text-[#c17248]">Créer un compte</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export function AuthPanel({ quote, cite }) {
  return (
    <section className="relative flex min-h-115 flex-col justify-between overflow-hidden bg-cover bg-center px-8 py-10 text-[#fff8fa] lg:min-h-dvh lg:px-16" style={{ backgroundImage: "linear-gradient(rgba(19, 58, 40, 0.85), rgba(19, 58, 40, 0.92)), url('/assets/images/mikanda-reading.jpg')" }}>
      <Link to="/" className="relative z-10 inline-flex w-fit items-center gap-3" aria-label="Retour à l'accueil de Mikanda">
        <img src="/assets/branding/logo_e9e0d1.svg" alt="" className="h-12 w-12" />
        <span>
          <span className="block font-serif text-[21px] uppercase tracking-wide">Mikanda</span>
          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c17248]">Bibliothèque numérique</span>
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
