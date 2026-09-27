import { useState, useEffect } from 'react'
import { Activity, BookOpen, UserPlus, LogIn, Trash2 } from 'lucide-react'
import { readJson, writeJson } from '../../services/storage.js'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

const ACTIVITY_KEY = 'mikanda-admin-activity'

// Activité de démonstration
const DEMO_ACTIVITY = [
  { id: 'a1', type: 'user_register', label: 'Nouvel utilisateur inscrit', detail: 'utilisateur@example.com', timestamp: Date.now() - 1800000 },
  { id: 'a2', type: 'book_read', label: 'Livre lu', detail: 'La Vie et demie — 100% terminé', timestamp: Date.now() - 3600000 },
  { id: 'a3', type: 'user_login', label: 'Connexion', detail: 'admin@mikanda.cd', timestamp: Date.now() - 7200000 },
  { id: 'a4', type: 'book_read', label: 'Livre commencé', detail: 'Le Pleurer-rire — 35%', timestamp: Date.now() - 86400000 },
  { id: 'a5', type: 'user_register', label: 'Nouvel utilisateur inscrit', detail: 'lecteur2@example.com', timestamp: Date.now() - 172800000 },
]

function formatTime(ts) {
  if (!ts) return '—'
  const diff = Date.now() - ts
  if (diff < 60000) return 'À l\'instant'
  if (diff < 3600000) return `Il y a ${Math.round(diff / 60000)} min`
  if (diff < 86400000) return `Il y a ${Math.round(diff / 3600000)} h`
  return new Date(ts).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ActivityIcon({ type }) {
  const map = {
    user_register: { icon: UserPlus, color: 'bg-blue-50 text-blue-600' },
    user_login: { icon: LogIn, color: 'bg-green-50 text-green-600' },
    book_read: { icon: BookOpen, color: 'bg-[#f4ece2] text-[#c17248]' },
  }
  const { icon: Icon, color } = map[type] || { icon: Activity, color: 'bg-gray-50 text-gray-500' }
  return (
    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
      <Icon className="h-4 w-4" />
    </div>
  )
}

export function AdminActivity() {
  useDocumentTitle('Activité — Admin MIKANDA')
  const [activities, setActivities] = useState(() => {
    const stored = readJson(ACTIVITY_KEY, [])
    return stored.length > 0 ? stored : DEMO_ACTIVITY
  })

  function clearAll() {
    if (!window.confirm('Effacer tout le journal d\'activité ?')) return
    writeJson(ACTIVITY_KEY, [])
    setActivities([])
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-[#1a1410]">Journal d'activité</h1>
          <p className="mt-1 text-sm text-[#705f57]">{activities.length} événement(s) enregistré(s)</p>
        </div>
        {activities.length > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5" /> Effacer tout
          </button>
        )}
      </div>

      {activities.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#e2ddd6] py-16 text-center text-sm text-[#8f7770]">
          Aucune activité enregistrée.
        </div>
      ) : (
        <div className="rounded-xl border border-[#e2ddd6] bg-white">
          <ul className="divide-y divide-[#f0ebe4]">
            {activities.map((a) => (
              <li key={a.id} className="flex items-center gap-4 px-6 py-4">
                <ActivityIcon type={a.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1a1410]">{a.label}</p>
                  {a.detail && <p className="mt-0.5 truncate text-xs text-[#705f57]">{a.detail}</p>}
                </div>
                <span className="shrink-0 text-xs text-[#8f7770]">{formatTime(a.timestamp)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-center text-xs text-[#8f7770]">
        Le journal complet sera disponible après intégration backend (logs serveur).
      </p>
    </div>
  )
}
