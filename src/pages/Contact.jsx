import { Clock, Mail, MapPin } from 'lucide-react'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function Contact() {
  useDocumentTitle('Contact')
  const notify = useNotification()

  return (
    <main className="py-16">
      <section className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#c17248]">Contactez-nous</p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.04] sm:text-6xl">Restons en <em className="text-[#133a28]">contact</em></h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#705f57]">Une question, une suggestion ou envie de collaborer ? N'hésitez pas à nous contacter.</p>
            <div className="mt-10 space-y-6">
              <Info icon={Mail} title="Email" lines={['contact@mikanda.cd', 'recrutement@mikanda.cd']} />
              <Info icon={MapPin} title="Adresse" lines={['Kinshasa, République démocratique du Congo']} />
              <Info icon={Clock} title="Horaires" lines={['Lundi - Vendredi : 8h00 - 17h00', 'Samedi : 9h00 - 12h00']} />
            </div>
          </div>
          <div className="rounded-xl border border-[#d9d1c6] bg-white p-8 shadow-sm">
            <h2 className="mb-6 font-serif text-2xl">Formulaire de contact</h2>
            <form
              className="space-y-6"
              onSubmit={(event) => {
                event.preventDefault()
                notify.success('Formulaire envoyé avec succès !')
                event.target.reset()
              }}
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <Field id="nom" label="Nom *" />
                <Field id="prenom" label="Prénom *" />
              </div>
              <Field id="email" label="Email *" type="email" />
              <label className="block text-sm font-medium">
                Sujet *
                <select required id="sujet" className="mt-2 w-full rounded-lg border border-[#d9d1c6] bg-[#f8f3e9] px-4 py-3 text-sm">
                  <option value="">Sélectionnez un sujet</option>
                  <option value="general">Question générale</option>
                  <option value="candidature">Candidature / Rejoindre l'équipe</option>
                  <option value="partenariat">Partenariat</option>
                  <option value="soumission">Soumission d'œuvre</option>
                  <option value="technique">Problème technique</option>
                  <option value="autre">Autre</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Message *
                <textarea required id="message" rows="6" className="mt-2 w-full rounded-lg border border-[#d9d1c6] bg-[#f8f3e9] px-4 py-3 text-sm" />
              </label>
              <label className="flex items-start gap-3 text-sm text-[#705f57]">
                <input type="checkbox" required className="mt-1 accent-[#133a28]" />
                J'accepte que mes données soient utilisées pour traiter ma demande.
              </label>
              <button type="submit" className="rounded-lg bg-[#133a28] px-6 py-3 text-sm font-semibold text-white">Envoyer</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}

function Field({ id, label, type = 'text' }) {
  return (
    <label className="block text-sm font-medium" htmlFor={id}>
      {label}
      <input required id={id} type={type} className="mt-2 w-full rounded-lg border border-[#d9d1c6] bg-[#f8f3e9] px-4 py-3 text-sm" />
    </label>
  )
}

function Info({ icon: Icon, title, lines }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#133a28]/10">
        <Icon className="h-6 w-6 text-[#133a28]" />
      </div>
      <div>
        <h3 className="font-serif text-lg">{title}</h3>
        {lines.map((line) => <p key={line} className="mt-1 text-sm text-[#705f57]">{line}</p>)}
      </div>
    </div>
  )
}
