import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const NotificationContext = createContext(null)

let nextId = 0

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++nextId
    setToasts((current) => [...current, { id, message, type }])
    window.setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  const api = useMemo(
    () => ({
      show,
      success: (message, duration) => show(message, 'success', duration),
      error: (message, duration) => show(message, 'error', duration),
      warning: (message, duration) => show(message, 'warning', duration),
      info: (message, duration) => show(message, 'info', duration),
    }),
    [show],
  )

  return (
    <NotificationContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed top-4 left-1/2 z-50 flex w-[min(100%-2rem,28rem)] -translate-x-1/2 flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`notification show pointer-events-auto flex min-w-0 items-start gap-3 rounded-lg border p-4 shadow-lg ${typeClasses(toast.type)}`}
            role="status"
          >
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              className="shrink-0 opacity-60 hover:opacity-100"
              onClick={() => dismiss(toast.id)}
              aria-label="Fermer la notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

function typeClasses(type) {
  const types = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }
  return types[type] || types.info
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
