import { Briefcase, Check, GraduationCap, HeartHandshake, Send, Users, BookOpen } from 'lucide-react'
import { team } from '../data/team.js'
import { useNotification } from '../hooks/useNotification.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export function JoinTeam() {
  useDocumentTitle("Rejoindre l'équipe")
  const notify = useNotification()

  return (
    <main>
      <section className="border-b border-[#d9d1c6] bg-[#eae0d1]/45 px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.22em] text-[#c17248]">Carrières et contributions</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[1.04] sm:text-6xl">
            Rejoignez <em className="text-[#133a28]">l'équipe MIKANDA</em>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#705f57]">
            Contribuez à la préservation et à la diffusion du patrimoine littéraire congolais.
          </p>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">L'équipe actuelle</p>
          <h2 className="mt-3 font-serif text-4xl">Notre équipe complète</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <div key={member.name} className="rounded-xl border border-[#d9d1c6] bg-white p-6 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#133a28] to-[#245743] font-serif text-2xl text-white">{member.initials}</div>
              <h3 className="font-serif text-lg">{member.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-[#c17248]">{member.role}</p>
              <p className="mt-3 text-sm text-[#705f57]">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="border-y border-[#d9d1c6] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-[#c17248]">Opportunités</p>
            <h2 className="mt-3 font-serif text-4xl">Comment nous rejoindre</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card icon={Briefcase} n="01" title="Postes à pourvoir" items={['Archiviste littéraire', 'Responsable éditorial', 'Développeur web']} text="Consultez nos offres d'emploi pour des postes à temps plein ou partiel." />
            <Card icon={Users} n="02" title="Bénévolat" items={['Recherche et catalogage', 'Traduction et révision', 'Animation événements']} text="Rejoignez notre équipe de bénévoles selon votre disponibilité." />
            <Card icon={GraduationCap} n="03" title="Stages" items={['Stage de 3 à 6 mois', 'Convention universitaire', 'Encadrement personnalisé']} text="Découvrez le monde des archives numériques et de l'édition culturelle." />
            <Card icon={HeartHandshake} n="04" title="Partenariat" items={['Accès aux archives', 'Projets conjoints', 'Échanges scientifiques']} text="Établissez des partenariats institutionnels." />
            <Card icon={Send} n="05" title="Contribution spontanée" items={['Compétences variées', 'Projets innovants', 'Créativité bienvenue']} text="Proposez vos compétences même si aucune offre ne correspond." />
            <Card icon={BookOpen} n="06" title="Soumission d'œuvres" items={['Auteurs', 'Éditeurs', 'Ayants droit']} text="Soumettez vos œuvres pour enrichir le catalogue." />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="mb-6 font-serif text-3xl">Candidater</h2>
        <form
          className="space-y-4 rounded-xl border border-[#d9d1c6] bg-white p-8"
          onSubmit={(event) => {
            event.preventDefault()
            notify.success('Formulaire envoyé avec succès !')
            event.target.reset()
          }}
        >
          <input required placeholder="Nom complet" className="w-full rounded-lg border border-[#d9d1c6] px-4 py-3 text-sm" />
          <input required type="email" placeholder="Email" className="w-full rounded-lg border border-[#d9d1c6] px-4 py-3 text-sm" />
          <textarea required rows="5" placeholder="Votre message" className="w-full rounded-lg border border-[#d9d1c6] px-4 py-3 text-sm" />
          <button type="submit" className="rounded-lg bg-[#133a28] px-6 py-3 text-sm text-white">Envoyer ma candidature</button>
        </form>
      </section>
    </main>
  )
}

function Card({ icon: Icon, n, title, text, items }) {
  return (
    <article className="rounded-xl border border-[#d9d1c6] bg-white p-8">
      <div className="mb-6 flex items-center gap-4">
        <div className="rounded-lg bg-[#133a28]/10 p-3"><Icon className="h-6 w-6 text-[#133a28]" /></div>
        <span className="font-mono text-xs text-[#c17248]">{n}</span>
      </div>
      <h3 className="font-serif text-2xl">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-[#705f57]">{text}</p>
      <ul className="mt-4 space-y-2 text-sm text-[#705f57]">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-[#133a28]" />{item}</li>
        ))}
      </ul>
    </article>
  )
}
