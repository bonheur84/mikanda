import { Link, useNavigate } from 'react-router-dom'
import { registerUser } from '../services/auth.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'
import { AuthPanel } from './Login.jsx'

export function Signup() {
  useDocumentTitle('Inscription')
  const navigate = useNavigate()
  const notify = useNotification()

  return (
    <main className="grid min-h-dvh lg:grid-cols-2">
      <AuthPanel quote="« La littérature est une manière de rendre le monde habitable. »" cite="MIKANDA, carnet éditorial" />
      <section className="flex items-center justify-center px-7 py-12">
        <div className="w-full max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c17248]">Inscription</p>
          <h1 className="mt-4 font-serif text-4xl">Rejoignez <em className="text-[#133a28]">la bibliothèque</em></h1>
          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              const data = new FormData(event.target)
              if (data.get('password') !== data.get('password_confirmation')) {
                notify.error('Les mots de passe ne correspondent pas')
                return
              }
              registerUser({
                firstName: data.get('first_name'),
                lastName: data.get('last_name'),
                email: data.get('email'),
              })
              notify.success('Compte créé')
              navigate('/')
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">Prénom<input required name="first_name" className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm" /></label>
              <label className="text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">Nom<input required name="last_name" className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm" /></label>
            </div>
            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">Email<input required type="email" name="email" className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm" /></label>
            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">Mot de passe<input required type="password" name="password" className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm" /></label>
            <label className="block text-xs font-semibold uppercase tracking-[0.23em] text-[#705f57]">Confirmer le mot de passe<input required type="password" name="password_confirmation" className="mt-2 h-12 w-full rounded-lg border border-[#d9d1c6] px-4 text-sm" /></label>
            <label className="flex items-start gap-3 text-sm text-[#705f57]">
              <input type="checkbox" required className="mt-1 accent-[#133a28]" />
              <span>J'accepte les <Link to="/apropos" className="text-[#c17248]">conditions d'utilisation</Link>.</span>
            </label>
            <button type="submit" className="h-12 w-full rounded-lg bg-[#c17248] text-sm font-semibold text-white">Créer mon compte</button>
          </form>
          <p className="mt-8 text-center text-sm text-[#705f57]">
            Déjà inscrit ? <Link to="/connexion" className="font-medium text-[#c17248]">Se connecter</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
