import { useState, useEffect } from 'react'
import { Mail, Check, Trash2, MessageSquare } from 'lucide-react'
import { readJson, writeJson } from '../../services/storage.js'
import { useNotification } from '../../hooks/useNotification.jsx'
import { useDocumentTitle } from '../../hooks/useDocumentTitle.js'

const MESSAGES_KEY = 'mikanda-contact-messages'

function formatDate(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Données de démonstration (si aucun message réel)
const DEMO_MESSAGES = [
  { id: 'm1', name: 'Marie Lukombo', email: 'marie@example.com', subject: 'Question sur un livre', message: 'Bonjour, je cherche un livre de Sony Labou Tansi qui n\'apparaît pas dans votre bibliothèque…', timestamp: Date.now() - 86400000, read: false },
  { id: 'm2', name: 'Jean Mbeki', email: 'jean@example.com', subject: 'Signalement d\'un problème', message: 'Le lecteur semble avoir un problème avec le thème sombre sur mobile.', timestamp: Date.now() - 172800000, read: true },
]

export function AdminMessages() {
  useDocumentTitle('Messages — Admin MIKANDA')
  const notify = useNotification()
  const [messages, setMessages] = useState(() => {
    const stored = readJson(MESSAGES_KEY, [])
    return stored.length > 0 ? stored : DEMO_MESSAGES
  })
  const [selected, setSelected] = useState(null)

  function markRead(id) {
    const updated = messages.map((m) => m.id === id ? { ...m, read: true } : m)
    writeJson(MESSAGES_KEY, updated)
    setMessages(updated)
  }

  function handleSelect(msg) {
    setSelected(msg)
    if (!msg.read) markRead(msg.id)
  }

  function handleDelete(id) {
    if (!window.confirm('Supprimer ce message ?')) return
    const updated = messages.filter((m) => m.id !== id)
    writeJson(MESSAGES_KEY, updated)
    setMessages(updated)
    if (selected?.id === id) setSelected(null)
    notify.success('Message supprimé.')
  }

  const unread = messages.filter((m) => !m.read).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1410]">Messages</h1>
        <p className="mt-1 text-sm text-[#705f57]">
          {messages.length} message(s) · {unread} non lu(s)
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Liste */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl border border-[#e2ddd6] bg-white">
          {messages.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#8f7770]">Aucun message.</div>
          ) : (
            <ul className="divide-y divide-[#f0ebe4]">
              {messages.map((msg) => (
                <li key={msg.id}>
                  <button onClick={() => handleSelect(msg)}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-[#f8f5f0] ${selected?.id === msg.id ? 'bg-[#f0ebe4]' : ''}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`truncate text-sm ${!msg.read ? 'font-semibold text-[#1a1410]' : 'text-[#705f57]'}`}>
                          {msg.name}
                        </p>
                        <p className="truncate text-xs text-[#8f7770]">{msg.subject}</p>
                      </div>
                      {!msg.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#c17248]" />}
                    </div>
                    <p className="mt-0.5 text-xs text-[#8f7770]">{formatDate(msg.timestamp)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Détail */}
        <div className="lg:col-span-3 rounded-xl border border-[#e2ddd6] bg-white">
          {selected ? (
            <div className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-[#1a1410]">{selected.subject}</h2>
                  <p className="mt-1 text-sm text-[#705f57]">De : {selected.name} &lt;{selected.email}&gt;</p>
                  <p className="text-xs text-[#8f7770]">{formatDate(selected.timestamp)}</p>
                </div>
                <div className="flex gap-2">
                  <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                    className="flex items-center gap-1.5 rounded-lg bg-[#133a28] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1d5a3e]">
                    <Mail className="h-3.5 w-3.5" /> Répondre
                  </a>
                  <button onClick={() => handleDelete(selected.id)}
                    className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="rounded-xl border border-[#e2ddd6] bg-[#faf8f4] p-4 text-sm text-[#705f57] whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-48 flex-col items-center justify-center gap-2 text-[#8f7770]">
              <MessageSquare className="h-8 w-8 opacity-40" />
              <p className="text-sm">Sélectionnez un message</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
