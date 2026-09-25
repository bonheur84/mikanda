import { useEffect } from 'react'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title
      ? `${title} —— MIKANDA`
      : 'MIKANDA —— Bibliothèque numérique de la littérature congolaise'
  }, [title])
}
